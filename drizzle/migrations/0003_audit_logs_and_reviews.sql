CREATE TABLE public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  acao text NOT NULL,
  tipo text NOT NULL,
  descricao text NOT NULL DEFAULT '',
  telefone text,
  antes jsonb,
  depois jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.admin_audit_logs TO service_role;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX admin_audit_logs_created_idx ON public.admin_audit_logs(created_at DESC);

CREATE TABLE public.avaliacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  nota int NOT NULL,
  texto text NOT NULL,
  status text NOT NULL DEFAULT 'pendente',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.avaliacoes TO service_role;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.enviar_avaliacao(_nome text, _nota int, _texto text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF coalesce(_nome,'') !~ '^[[:alpha:] ]{2,60}$' OR _nota NOT BETWEEN 1 AND 5
     OR length(trim(coalesce(_texto,''))) NOT BETWEEN 5 AND 400 THEN
    RAISE EXCEPTION 'Avaliação inválida';
  END IF;
  IF (SELECT count(*) FROM public.avaliacoes WHERE created_at > now() - interval '1 hour') > 30 THEN
    RAISE EXCEPTION 'Muitas avaliações. Tente mais tarde.';
  END IF;
  INSERT INTO public.avaliacoes(nome, nota, texto) VALUES (trim(_nome), _nota, trim(_texto));
  RETURN true;
END $$;

CREATE OR REPLACE FUNCTION public.avaliacoes_aprovadas()
RETURNS TABLE(id uuid, nome text, nota int, texto text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, nome, nota, texto, created_at FROM public.avaliacoes
  WHERE status = 'aprovada' ORDER BY created_at DESC LIMIT 30
$$;

GRANT EXECUTE ON FUNCTION public.enviar_avaliacao(text,int,text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.avaliacoes_aprovadas() TO anon, authenticated;