ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'confirmado';
ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS codigo text;
ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS cancelado_em timestamptz;
DROP INDEX IF EXISTS public.idx_agendamento_unico;
CREATE UNIQUE INDEX idx_agendamento_unico ON public.agendamentos (barbeiro, dia, horario) WHERE status <> 'cancelado';
DROP POLICY IF EXISTS "Anyone can view agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Anyone can insert agendamentos" ON public.agendamentos;
REVOKE ALL ON public.agendamentos FROM anon, authenticated;
GRANT ALL ON public.agendamentos TO service_role;

CREATE OR REPLACE FUNCTION public.horarios_ocupados(_barbeiro text, _dia date)
RETURNS SETOF text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT horario FROM public.agendamentos WHERE barbeiro = _barbeiro AND dia = _dia AND status <> 'cancelado'
$$;

CREATE OR REPLACE FUNCTION public.criar_agendamentos(_itens jsonb)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _codigo text := lpad((floor(random()*1000000))::int::text, 6, '0'); _i jsonb;
BEGIN
  IF jsonb_typeof(_itens) <> 'array' OR jsonb_array_length(_itens) < 1 OR jsonb_array_length(_itens) > 6 THEN
    RAISE EXCEPTION 'Agendamento inválido';
  END IF;
  FOR _i IN SELECT * FROM jsonb_array_elements(_itens) LOOP
    IF length(coalesce(_i->>'nome','')) NOT BETWEEN 2 AND 80
       OR length(regexp_replace(coalesce(_i->>'telefone',''), '\D', '', 'g')) NOT BETWEEN 10 AND 13
       OR length(coalesce(_i->>'servico','')) NOT BETWEEN 1 AND 300
       OR length(coalesce(_i->>'barbeiro','')) NOT BETWEEN 1 AND 60
       OR coalesce(_i->>'horario','') !~ '^\d{2}:\d{2}$'
       OR (_i->>'dia')::date < current_date
       OR length(coalesce(_i->>'obs','')) > 500 THEN
      RAISE EXCEPTION 'Dados inválidos';
    END IF;
    INSERT INTO public.agendamentos (nome, telefone, servico, barbeiro, dia, horario, obs, codigo)
    VALUES (_i->>'nome', regexp_replace(_i->>'telefone', '\D', '', 'g'), _i->>'servico', _i->>'barbeiro', (_i->>'dia')::date, _i->>'horario', coalesce(_i->>'obs',''), _codigo);
  END LOOP;
  RETURN _codigo;
END $$;

CREATE OR REPLACE FUNCTION public.consultar_agendamentos(_telefone text, _codigo text)
RETURNS TABLE(id uuid, servico text, barbeiro text, dia date, horario text, status text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT a.id, a.servico, a.barbeiro, a.dia, a.horario, a.status FROM public.agendamentos a
  WHERE regexp_replace(a.telefone, '\D', '', 'g') = regexp_replace(_telefone, '\D', '', 'g')
    AND a.codigo IS NOT NULL AND a.codigo = _codigo
  ORDER BY a.dia, a.horario
$$;

CREATE OR REPLACE FUNCTION public.cancelar_agendamento(_id uuid, _telefone text, _codigo text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _n int;
BEGIN
  UPDATE public.agendamentos SET status = 'cancelado', cancelado_em = now()
  WHERE id = _id AND codigo = _codigo AND status <> 'cancelado' AND dia >= current_date
    AND regexp_replace(telefone, '\D', '', 'g') = regexp_replace(_telefone, '\D', '', 'g');
  GET DIAGNOSTICS _n = ROW_COUNT;
  RETURN _n > 0;
END $$;

REVOKE ALL ON FUNCTION public.horarios_ocupados(text, date), public.criar_agendamentos(jsonb), public.consultar_agendamentos(text, text), public.cancelar_agendamento(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.horarios_ocupados(text, date), public.criar_agendamentos(jsonb), public.consultar_agendamentos(text, text), public.cancelar_agendamento(uuid, text, text) TO anon, authenticated;