
-- Corrigir todas as funções para incluir search_path seguro

-- 1. Função cliente_tem_pedidos
CREATE OR REPLACE FUNCTION public.cliente_tem_pedidos(cliente_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.pedidos WHERE cliente_id = cliente_uuid
  );
END;
$$;

-- 2. Função produto_tem_pedidos
CREATE OR REPLACE FUNCTION public.produto_tem_pedidos(produto_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.pedido_produtos WHERE produto_id = produto_uuid
  );
END;
$$;

-- 3. Função categoria_tem_pedidos
CREATE OR REPLACE FUNCTION public.categoria_tem_pedidos(categoria_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.produtos p
    INNER JOIN public.pedido_produtos pp ON p.id = pp.produto_id
    WHERE p.categoria_id = categoria_uuid
  );
END;
$$;

-- 4. Função validar_data_entrega
CREATE OR REPLACE FUNCTION public.validar_data_entrega()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.data_entrega < CURRENT_DATE THEN
    RAISE EXCEPTION 'Data de entrega não pode ser no passado';
  END IF;
  RETURN NEW;
END;
$$;

-- 5. Função impedir_alteracao_pedido_finalizado
CREATE OR REPLACE FUNCTION public.impedir_alteracao_pedido_finalizado()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status = 'finalizado' THEN
    RAISE EXCEPTION 'Pedidos finalizados não podem ser alterados';
  END IF;
  RETURN NEW;
END;
$$;

-- 6. Função impedir_exclusao_pedido_finalizado
CREATE OR REPLACE FUNCTION public.impedir_exclusao_pedido_finalizado()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status = 'finalizado' THEN
    RAISE EXCEPTION 'Pedidos finalizados não podem ser excluídos';
  END IF;
  RETURN OLD;
END;
$$;

-- 7. Função validar_categoria_pai
CREATE OR REPLACE FUNCTION public.validar_categoria_pai()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  temp_count integer;
BEGIN
  -- Verificar se não está criando um loop
  IF NEW.parent_id IS NOT NULL THEN
    WITH RECURSIVE categoria_path AS (
      SELECT id, parent_id, 1 as nivel
      FROM categorias 
      WHERE id = NEW.parent_id
      
      UNION ALL
      
      SELECT c.id, c.parent_id, cp.nivel + 1
      FROM categorias c
      INNER JOIN categoria_path cp ON c.id = cp.parent_id
      WHERE cp.nivel < 10 -- Limitar profundidade para evitar loops infinitos
    )
    SELECT COUNT(*) INTO temp_count
    FROM categoria_path
    WHERE id = NEW.id;
    
    IF temp_count > 0 THEN
      RAISE EXCEPTION 'Não é possível criar uma categoria pai que resulte em loop circular';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 8. Função categoria_tem_produtos_hierarquica
CREATE OR REPLACE FUNCTION public.categoria_tem_produtos_hierarquica(categoria_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se a categoria ou suas subcategorias têm produtos
  RETURN EXISTS (
    WITH RECURSIVE categoria_tree AS (
      -- Categoria base
      SELECT id FROM categorias WHERE id = categoria_uuid
      UNION ALL
      -- Subcategorias recursivamente
      SELECT c.id 
      FROM categorias c
      INNER JOIN categoria_tree ct ON c.parent_id = ct.id
    )
    SELECT 1 FROM produtos p
    INNER JOIN categoria_tree ct ON p.categoria_id = ct.id
    WHERE p.ativo = true
  );
END;
$$;

-- 9. Função soft_delete_produto
CREATE OR REPLACE FUNCTION public.soft_delete_produto(produto_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se o produto tem pedidos
  IF produto_tem_pedidos(produto_uuid) THEN
    -- Se tem pedidos, apenas marcar como inativo
    UPDATE produtos SET ativo = false WHERE id = produto_uuid;
    RETURN false; -- Indica que foi soft delete
  ELSE
    -- Se não tem pedidos, pode deletar fisicamente
    DELETE FROM produtos WHERE id = produto_uuid;
    RETURN true; -- Indica que foi hard delete
  END IF;
END;
$$;

-- 10. Função soft_delete_categoria
CREATE OR REPLACE FUNCTION public.soft_delete_categoria(categoria_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  produtos_count integer;
  subcategorias_count integer;
BEGIN
  -- Contar produtos ativos na categoria e subcategorias
  SELECT COUNT(*) INTO produtos_count
  FROM produtos p
  WHERE p.categoria_id = categoria_uuid AND p.ativo = true;
  
  -- Contar subcategorias
  SELECT COUNT(*) INTO subcategorias_count
  FROM categorias c
  WHERE c.parent_id = categoria_uuid;
  
  -- Se tem produtos ativos, não pode deletar
  IF produtos_count > 0 THEN
    RETURN 'PRODUTOS_VINCULADOS';
  END IF;
  
  -- Se tem subcategorias, não pode deletar
  IF subcategorias_count > 0 THEN
    RETURN 'SUBCATEGORIAS_VINCULADAS';
  END IF;
  
  -- Verificar se a categoria tem pedidos através de produtos
  IF categoria_tem_pedidos(categoria_uuid) THEN
    RETURN 'PEDIDOS_VINCULADOS';
  END IF;
  
  -- Pode deletar fisicamente
  DELETE FROM categorias WHERE id = categoria_uuid;
  RETURN 'DELETADO';
END;
$$;

-- 11. Função soft_delete_cliente
CREATE OR REPLACE FUNCTION public.soft_delete_cliente(cliente_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se o cliente tem pedidos
  IF cliente_tem_pedidos(cliente_uuid) THEN
    -- Se tem pedidos, não pode deletar (manter para histórico)
    RETURN false;
  ELSE
    -- Se não tem pedidos, pode deletar fisicamente
    DELETE FROM clientes WHERE id = cliente_uuid;
    RETURN true;
  END IF;
END;
$$;

-- 12. Função get_categoria_path
CREATE OR REPLACE FUNCTION public.get_categoria_path(categoria_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  resultado text := '';
BEGIN
  WITH RECURSIVE categoria_path AS (
    SELECT id, nome, parent_id, 0 as nivel
    FROM categorias 
    WHERE id = categoria_uuid
    
    UNION ALL
    
    SELECT c.id, c.nome, c.parent_id, cp.nivel + 1
    FROM categorias c
    INNER JOIN categoria_path cp ON c.id = cp.parent_id
  )
  SELECT string_agg(nome, ' > ' ORDER BY nivel DESC)
  INTO resultado
  FROM categoria_path;
  
  RETURN COALESCE(resultado, '');
END;
$$;
