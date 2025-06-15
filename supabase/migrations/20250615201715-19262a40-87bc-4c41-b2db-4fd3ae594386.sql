
-- Adicionar status 'finalizado' se não existir
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_status_check;
ALTER TABLE public.pedidos ADD CONSTRAINT pedidos_status_check 
CHECK (status IN ('recebido', 'producao', 'pronto', 'retirado', 'finalizado'));

-- Criar função para verificar se cliente tem pedidos
CREATE OR REPLACE FUNCTION public.cliente_tem_pedidos(cliente_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.pedidos WHERE cliente_id = cliente_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Criar função para verificar se produto tem pedidos
CREATE OR REPLACE FUNCTION public.produto_tem_pedidos(produto_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.pedido_produtos WHERE produto_id = produto_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Criar função para verificar se categoria tem produtos vinculados a pedidos
CREATE OR REPLACE FUNCTION public.categoria_tem_pedidos(categoria_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.produtos p
    INNER JOIN public.pedido_produtos pp ON p.id = pp.produto_id
    WHERE p.categoria_id = categoria_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para validar data de entrega não pode ser no passado
CREATE OR REPLACE FUNCTION public.validar_data_entrega()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.data_entrega < CURRENT_DATE THEN
    RAISE EXCEPTION 'Data de entrega não pode ser no passado';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_data_entrega
  BEFORE INSERT OR UPDATE ON public.pedidos
  FOR EACH ROW
  EXECUTE FUNCTION public.validar_data_entrega();

-- Criar trigger para impedir alterações em pedidos finalizados
CREATE OR REPLACE FUNCTION public.impedir_alteracao_pedido_finalizado()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'finalizado' THEN
    RAISE EXCEPTION 'Pedidos finalizados não podem ser alterados';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_impedir_alteracao_finalizado
  BEFORE UPDATE ON public.pedidos
  FOR EACH ROW
  EXECUTE FUNCTION public.impedir_alteracao_pedido_finalizado();

-- Criar trigger para impedir exclusão de pedidos finalizados
CREATE OR REPLACE FUNCTION public.impedir_exclusao_pedido_finalizado()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'finalizado' THEN
    RAISE EXCEPTION 'Pedidos finalizados não podem ser excluídos';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_impedir_exclusao_finalizado
  BEFORE DELETE ON public.pedidos
  FOR EACH ROW
  EXECUTE FUNCTION public.impedir_exclusao_pedido_finalizado();
