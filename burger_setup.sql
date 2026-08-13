-- Tabela de Resultados do Jogo do Hambúrguer
CREATE TABLE IF NOT EXISTS public.burger_game_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
    won BOOLEAN NOT NULL DEFAULT false,
    time_taken_seconds INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.burger_game_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for anon" ON public.burger_game_results FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON public.burger_game_results FOR ALL TO authenticated USING (true);
