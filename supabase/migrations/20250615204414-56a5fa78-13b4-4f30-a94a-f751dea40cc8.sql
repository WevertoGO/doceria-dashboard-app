
-- Adicionar coluna parent_id na tabela de categorias
ALTER TABLE public.categorias
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categorias(id) ON DELETE CASCADE;

-- Atualizar funções/triggers/policies se necessário para tratar subcategorias (opcional, mas boa prática).

-- Com isso, ao remover uma categoria, todas as suas subcategorias (e suas subcategorias, recursivamente) também serão removidas, desde que estejam vinculadas via parent_id.
