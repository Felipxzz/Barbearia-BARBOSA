CREATE TABLE public.barbosa_catalog (
 id text PRIMARY KEY DEFAULT 'principal',
 servicos jsonb NOT NULL DEFAULT '[]'::jsonb,
 barbeiros jsonb NOT NULL DEFAULT '[]'::jsonb,
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.barbosa_catalog TO anon, authenticated;
GRANT ALL ON public.barbosa_catalog TO service_role;
ALTER TABLE public.barbosa_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public catalog read" ON public.barbosa_catalog FOR SELECT TO anon, authenticated USING (true);