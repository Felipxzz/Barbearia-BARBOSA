-- Tabela interna de controle de tentativas (sem acesso público)
CREATE TABLE public.rpc_rate_limits (
  chave text PRIMARY KEY,
  contagem integer NOT NULL DEFAULT 1,
  janela_inicio timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.rpc_rate_limits TO service_role;
ALTER TABLE public.rpc_rate_limits ENABLE ROW LEVEL SECURITY;

-- Função auxiliar de limite (somente uso interno pelas funções SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.checar_limite(_chave text, _max integer, _janela interval)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE _c int;
BEGIN
  INSERT INTO public.rpc_rate_limits (chave, contagem, janela_inicio)
  VALUES (_chave, 1, now())
  ON CONFLICT (chave) DO UPDATE SET
    contagem = CASE WHEN rpc_rate_limits.janela_inicio < now() - _janela THEN 1 ELSE rpc_rate_limits.contagem + 1 END,
    janela_inicio = CASE WHEN rpc_rate_limits.janela_inicio < now() - _janela THEN now() ELSE rpc_rate_limits.janela_inicio END
  RETURNING contagem INTO _c;
  RETURN _c <= _max;
END $$;
REVOKE ALL ON FUNCTION public.checar_limite(text, integer, interval) FROM PUBLIC, anon, authenticated;

-- Consulta com limite de 10 tentativas por telefone por hora
CREATE OR REPLACE FUNCTION public.consultar_agendamentos(_telefone text, _codigo text)
RETURNS TABLE(id uuid, servico text, barbeiro text, dia date, horario text, status text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.checar_limite('consulta:' || regexp_replace(coalesce(_telefone, ''), '\D', '', 'g'), 10, interval '1 hour') THEN
    RAISE EXCEPTION 'Muitas tentativas. Tente mais tarde.';
  END IF;
  RETURN QUERY
    SELECT a.id, a.servico, a.barbeiro, a.dia, a.horario, a.status FROM public.agendamentos a
    WHERE regexp_replace(a.telefone, '\D', '', 'g') = regexp_replace(_telefone, '\D', '', 'g')
      AND a.codigo IS NOT NULL AND a.codigo = _codigo
    ORDER BY a.dia, a.horario;
END $$;

-- Cancelamento com limite de 10 tentativas por telefone por hora
CREATE OR REPLACE FUNCTION public.cancelar_agendamento(_id uuid, _telefone text, _codigo text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE _n int;
BEGIN
  IF NOT public.checar_limite('cancelar:' || regexp_replace(coalesce(_telefone, ''), '\D', '', 'g'), 10, interval '1 hour') THEN
    RAISE EXCEPTION 'Muitas tentativas. Tente mais tarde.';
  END IF;
  UPDATE public.agendamentos SET status = 'cancelado', cancelado_em = now()
  WHERE id = _id AND codigo = _codigo AND status <> 'cancelado' AND dia >= current_date
    AND regexp_replace(telefone, '\D', '', 'g') = regexp_replace(_telefone, '\D', '', 'g');
  GET DIAGNOSTICS _n = ROW_COUNT;
  RETURN _n > 0;
END $$;

-- Reagendamento com limite de 10 tentativas por telefone por hora
CREATE OR REPLACE FUNCTION public.reagendar_agendamento(_id uuid, _telefone text, _codigo text, _dia date, _horario text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _n int;
  _dow int;
BEGIN
  IF NOT public.checar_limite('reagendar:' || regexp_replace(coalesce(_telefone, ''), '\D', '', 'g'), 10, interval '1 hour') THEN
    RAISE EXCEPTION 'Muitas tentativas. Tente mais tarde.';
  END IF;
  IF _dia IS NULL
     OR _horario !~ '^(0[8-9]|1[0-9]):00$'
     OR _dia < current_date
     OR (_dia + _horario::time) <= (now() AT TIME ZONE 'America/Sao_Paulo') THEN
    RETURN false;
  END IF;
  _dow := extract(dow FROM _dia);
  IF _dow IN (0, 1) OR (_dow <> 6 AND _horario < '14:00') THEN
    RETURN false;
  END IF;
  UPDATE public.agendamentos
  SET dia = _dia, horario = _horario
  WHERE id = _id
    AND codigo = _codigo
    AND status = 'confirmado'
    AND dia >= current_date
    AND regexp_replace(telefone, '\D', '', 'g') = regexp_replace(_telefone, '\D', '', 'g');
  GET DIAGNOSTICS _n = ROW_COUNT;
  RETURN _n > 0;
EXCEPTION
  WHEN unique_violation THEN
    RETURN false;
END $$;

-- Criação com código criptográfico, limite de 5 chamadas/hora e máx. 6 reservas ativas por telefone
CREATE OR REPLACE FUNCTION public.criar_agendamentos(_itens jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _codigo text;
  _i jsonb;
  _dia date;
  _hora text;
  _dow int;
  _tel text;
BEGIN
  IF jsonb_typeof(_itens) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Agendamento inválido'; END IF;
  IF jsonb_array_length(_itens) NOT BETWEEN 1 AND 6 THEN RAISE EXCEPTION 'Agendamento inválido'; END IF;

  _tel := coalesce(_itens -> 0 ->> 'telefone', '');
  IF _tel !~ '^[0-9]{10,13}$' THEN RAISE EXCEPTION 'Dados inválidos'; END IF;

  IF NOT public.checar_limite('criar:' || _tel, 5, interval '1 hour') THEN
    RAISE EXCEPTION 'Muitas tentativas. Tente mais tarde.';
  END IF;

  IF (SELECT count(*) FROM public.agendamentos
      WHERE regexp_replace(telefone, '\D', '', 'g') = _tel
        AND status <> 'cancelado' AND dia >= current_date) >= 6 THEN
    RAISE EXCEPTION 'Limite de reservas ativas atingido. Cancele ou aguarde os horários marcados.';
  END IF;

  SELECT lpad(((get_byte(b, 0)::int << 16 | get_byte(b, 1)::int << 8 | get_byte(b, 2)::int) % 1000000)::text, 6, '0')
  INTO _codigo FROM (SELECT gen_random_bytes(3) AS b) s;

  FOR _i IN SELECT * FROM jsonb_array_elements(_itens) LOOP
    IF coalesce(_i->>'nome','') !~ '^[[:alpha:] ]{2,80}$' OR length(trim(coalesce(_i->>'nome',''))) < 2
     OR coalesce(_i->>'telefone','') !~ '^[0-9]{10,13}$'
     OR length(coalesce(_i->>'servico','')) NOT BETWEEN 1 AND 300
     OR length(coalesce(_i->>'barbeiro','')) NOT BETWEEN 1 AND 60
     OR coalesce(_i->>'dia','') !~ '^\d{4}-\d{2}-\d{2}$'
     OR coalesce(_i->>'horario','') !~ '^(0[8-9]|1[0-9]):00$'
     OR length(coalesce(_i->>'obs','')) > 500 THEN RAISE EXCEPTION 'Dados inválidos'; END IF;
    _dia := (_i->>'dia')::date; _hora := _i->>'horario'; _dow := extract(dow from _dia);
    IF _dow IN (0,1) OR (_dow <> 6 AND _hora < '14:00') OR (_dia + _hora::time) <= (now() AT TIME ZONE 'America/Sao_Paulo') THEN RAISE EXCEPTION 'Horário indisponível'; END IF;
    INSERT INTO public.agendamentos(nome,telefone,servico,barbeiro,dia,horario,obs,codigo)
     VALUES(trim(_i->>'nome'),_i->>'telefone',_i->>'servico',_i->>'barbeiro',_dia,_hora,coalesce(_i->>'obs',''),_codigo);
  END LOOP;
  RETURN _codigo;
END $$;