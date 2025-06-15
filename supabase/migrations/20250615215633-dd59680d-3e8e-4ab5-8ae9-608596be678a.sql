
-- 1. Table for multiple phone numbers per client
CREATE TABLE IF NOT EXISTS public.cliente_telefones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  telefone text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_cliente_telefones_cliente_id ON public.cliente_telefones(cliente_id);

-- 2. For categories, ensure no changes are needed as the structure already exists (id, parent_id).
-- However, ensure the code uses parent_id on subcategory creation.

-- 3. No schema update needed for pedido_produtos unless you want to store extra info.

