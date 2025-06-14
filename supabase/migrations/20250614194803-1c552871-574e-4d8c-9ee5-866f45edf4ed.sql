-- Create categorias table
CREATE TABLE public.categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create produtos table
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria_id UUID REFERENCES public.categorias(id),
  preco DECIMAL(10,2) NOT NULL,
  unidade TEXT NOT NULL DEFAULT 'unid',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clientes table
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pedidos table
CREATE TABLE public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) NOT NULL,
  data_pedido TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_entrega DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'recebido' CHECK (status IN ('recebido', 'producao', 'pronto', 'entregue', 'cancelado')),
  valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pedido_produtos table (junction table for many-to-many relationship)
CREATE TABLE public.pedido_produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE NOT NULL,
  produto_id UUID REFERENCES public.produtos(id) NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 1,
  preco_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_produtos ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to access all data
CREATE POLICY "Users can view all categorias" ON public.categorias FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert categorias" ON public.categorias FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update categorias" ON public.categorias FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete categorias" ON public.categorias FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view all produtos" ON public.produtos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert produtos" ON public.produtos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update produtos" ON public.produtos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete produtos" ON public.produtos FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view all clientes" ON public.clientes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert clientes" ON public.clientes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update clientes" ON public.clientes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete clientes" ON public.clientes FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view all pedidos" ON public.pedidos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert pedidos" ON public.pedidos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update pedidos" ON public.pedidos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete pedidos" ON public.pedidos FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view all pedido_produtos" ON public.pedido_produtos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert pedido_produtos" ON public.pedido_produtos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update pedido_produtos" ON public.pedido_produtos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete pedido_produtos" ON public.pedido_produtos FOR DELETE TO authenticated USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categorias_updated_at
  BEFORE UPDATE ON public.categorias
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_produtos_updated_at
  BEFORE UPDATE ON public.produtos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON public.pedidos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();