
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NovaCategoriaForm } from '@/components/forms/NovaCategoriaForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NovoProdutoFormProps {
  onSuccess: () => void;
}

export function NovoProdutoForm({ onSuccess }: NovoProdutoFormProps) {
  const [produto, setProduto] = useState({
    nome: '',
    descricao: '',
    preco: '',
    unidade: 'unid',
    categoria_id: ''
  });
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNovaCategoriaOpen, setIsNovaCategoriaOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      setLoadingCategorias(true);
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
    } finally {
      setLoadingCategorias(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!produto.nome.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome do produto é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (!produto.preco || parseFloat(produto.preco) <= 0) {
      toast({
        title: 'Erro',
        description: 'Valor deve ser maior que zero',
        variant: 'destructive',
      });
      return;
    }

    if (!produto.categoria_id) {
      toast({
        title: 'Erro',
        description: 'Categoria é obrigatória',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('produtos')
        .insert({
          nome: produto.nome.trim(),
          descricao: produto.descricao.trim() || null,
          preco: parseFloat(produto.preco),
          unidade: produto.unidade,
          categoria_id: produto.categoria_id,
          ativo: true,
        });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Produto adicionado com sucesso!',
      });
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o produto.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nome">Nome do Produto *</Label>
            <Input
              id="nome"
              value={produto.nome}
              onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
              placeholder="Ex: Bolo de Chocolate"
              required
            />
          </div>
          <div>
            <Label htmlFor="preco">Preço *</Label>
            <Input
              id="preco"
              type="number"
              step="0.01"
              min="0"
              value={produto.preco}
              onChange={(e) => setProduto({ ...produto, preco: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="categoria">Categoria *</Label>
          <div className="flex gap-2">
            <select
              id="categoria"
              value={produto.categoria_id}
              onChange={(e) => setProduto({ ...produto, categoria_id: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Selecione uma categoria...</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNovaCategoriaOpen(true)}
            >
              Nova
            </Button>
          </div>
          {loadingCategorias && (
            <p className="text-sm text-gray-500 mt-1">Carregando categorias...</p>
          )}
        </div>

        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={produto.descricao}
            onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
            placeholder="Descreva o produto..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="unidade">Unidade de Venda</Label>
          <select
            id="unidade"
            value={produto.unidade}
            onChange={(e) => setProduto({ ...produto, unidade: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="unid">Unidade</option>
            <option value="kg">Quilograma</option>
            <option value="g">Grama</option>
            <option value="cento">Cento</option>
            <option value="dz">Dúzia</option>
            <option value="fatia">Fatia</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Produto'}
          </Button>
        </div>
      </form>

      <Dialog open={isNovaCategoriaOpen} onOpenChange={setIsNovaCategoriaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
          </DialogHeader>
          <NovaCategoriaForm onSuccess={() => {
            setIsNovaCategoriaOpen(false);
            carregarCategorias();
          }} />
        </DialogContent>
      </Dialog>
    </>
  );
}
