
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditarProdutoFormProps {
  produtoId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria_id: string;
  unidade: string;
}

export function EditarProdutoForm({ produtoId, onSuccess, onCancel }: EditarProdutoFormProps) {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    carregarProduto();
    carregarCategorias();
  }, [produtoId]);

  const carregarProduto = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', produtoId)
        .single();

      if (error) throw error;
      setProduto(data);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do produto.',
        variant: 'destructive',
      });
    } finally {
      setCarregando(false);
    }
  };

  const carregarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nome');

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar categorias',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produto) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('produtos')
        .update({
          nome: produto.nome,
          descricao: produto.descricao,
          preco: produto.preco,
          categoria_id: produto.categoria_id || null,
          unidade: produto.unidade,
        })
        .eq('id', produtoId);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Produto atualizado com sucesso!',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o produto.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (carregando) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!produto) {
    return <div>Produto não encontrado</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Produto *</Label>
        <Input
          id="nome"
          value={produto.nome}
          onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
          placeholder="Ex: Bolo de Chocolate"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={produto.descricao || ''}
          onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
          placeholder="Descrição do produto..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="preco">Preço *</Label>
          <Input
            id="preco"
            type="number"
            step="0.01"
            min="0"
            value={produto.preco}
            onChange={(e) => setProduto({ ...produto, preco: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unidade">Unidade *</Label>
          <select
            id="unidade"
            value={produto.unidade}
            onChange={(e) => setProduto({ ...produto, unidade: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="unid">Unidade</option>
            <option value="kg">Quilograma</option>
            <option value="g">Grama</option>
            <option value="cento">Cento</option>
            <option value="dz">Dúzia</option>
            <option value="fatia">Fatia</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoria">Categoria</Label>
        <select
          id="categoria"
          value={produto.categoria_id || ''}
          onChange={(e) => setProduto({ ...produto, categoria_id: e.target.value })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Selecione uma categoria</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
