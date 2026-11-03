CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

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
  INTO _codigo FROM (SELECT extensions.gen_random_bytes(3) AS b) s;

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