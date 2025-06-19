
-- Enable Row Level Security for cliente_telefones
ALTER TABLE public.cliente_telefones ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to access all data in cliente_telefones
CREATE POLICY "Users can view all cliente_telefones" ON public.cliente_telefones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert cliente_telefones" ON public.cliente_telefones FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update cliente_telefones" ON public.cliente_telefones FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete cliente_telefones" ON public.cliente_telefones FOR DELETE TO authenticated USING (true);
