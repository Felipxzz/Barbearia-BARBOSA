
-- Tabela de agendamentos
CREATE TABLE public.agendamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  servico TEXT NOT NULL,
  barbeiro TEXT NOT NULL,
  dia DATE NOT NULL,
  horario TEXT NOT NULL,
  obs TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Impedir duplicatas de barbeiro+dia+horario
CREATE UNIQUE INDEX idx_agendamento_unico ON public.agendamentos (barbeiro, dia, horario);

-- Habilitar RLS
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública (para verificar horários ocupados)
CREATE POLICY "Anyone can view agendamentos"
ON public.agendamentos
FOR SELECT
USING (true);

-- Permitir inserção pública (agendamento sem login)
CREATE POLICY "Anyone can insert agendamentos"
ON public.agendamentos
FOR INSERT
WITH CHECK (true);
