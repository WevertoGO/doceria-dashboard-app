import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NovoProdutoForm } from '@/components/forms/NovoProdutoForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus } from 'lucide-react';

// Helper to get all products (ID + nome + unidade for listing)
async function fetchProdutos() {
  const { data, error } = await supabase
    .from('produtos')
    .select('id, nome, unidade, preco, ativo')
    .eq('ativo', true)
    .order('nome');
  if (error) throw error;
  return data || [];
}

async function fetchPedidoProdutos(pedidoId: string) {
  const { data, error } = await supabase
    .from('pedido_produtos')
    .select('produto_id, quantidade')
    .eq('pedido_id', pedidoId);
  if (error) throw error;
  return data || [];
}

interface EditarPedidoFormProps {
  pedido: any;
  onSuccess: () => void;
}

export function EditarPedidoForm({ pedido, onSuccess }: EditarPedidoFormProps) {
  const [formData, setFormData] = useState({
    data_entrega: '',
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<any[]>([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState<{ produto_id: string, quantidade: number }[]>([]);
  const [isNovoProdutoOpen, setIsNovoProdutoOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (pedido) {
      setFormData({
        data_entrega: pedido.data_entrega || '',
        observacoes: pedido.observacoes || ''
      });
    }
  }, [pedido]);

  useEffect(() => {
    // Load all products and current product selections for the order
    (async () => {
      try {
        const produtos = await fetchProdutos();
        setProdutosDisponiveis(produtos);

        const produtosPedido = await fetchPedidoProdutos(pedido.id);
        setProdutosSelecionados(
          produtosPedido.map((pp: any) => ({
            produto_id: pp.produto_id,
            quantidade: pp.quantidade
          }))
        );
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    })();
    // eslint-disable-next-line
  }, [pedido.id]);

  // Função para recarregar produtos após adicionar novo
  const recarregarProdutos = async () => {
    try {
      const produtos = await fetchProdutos();
      setProdutosDisponiveis(produtos);
    } catch (error) {
      console.error('Erro ao recarregar produtos:', error);
    }
  };

  // Calcular valor total dos produtos selecionados
  const valorTotal = produtosSelecionados.reduce((total, item) => {
    const produto = produtosDisponiveis.find(p => p.id === item.produto_id);
    return total + ((produto?.preco || 0) * item.quantidade);
  }, 0);

  const handleProdutoQtdChange = (produto_id: string, qtd: number | string) => {
    const quantidade = typeof qtd === 'string' ? parseFloat(qtd) || 0 : qtd;
    
    if (quantidade <= 0) {
      setProdutosSelecionados((prev) => prev.filter((p) => p.produto_id !== produto_id));
    } else {
      setProdutosSelecionados((prev) => {
        const exists = prev.find((p) => p.produto_id === produto_id);
        if (exists) {
          return prev.map((p) => (p.produto_id === produto_id ? { ...p, quantidade } : p));
        }
        return [...prev, { produto_id, quantidade }];
      });
    }
  };

  const handleAddProduto = (produto_id: string) => {
    setProdutosSelecionados((prev) => {
      if (prev.some((p) => p.produto_id === produto_id)) return prev;
      return [...prev, { produto_id, quantidade: 1 }];
    });
  };

  const handleRemoveProduto = (produto_id: string) => {
    setProdutosSelecionados((prev) => prev.filter((p) => p.produto_id !== produto_id));
  };

  const hoje = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pedido.status === 'finalizado') {
      toast({
        title: 'Erro',
        description: 'Pedidos finalizados não podem ser editados',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.data_entrega) {
      toast({
        title: 'Erro',
        description: 'Data de entrega é obrigatória',
        variant: 'destructive',
      });
      return;
    }

    if (formData.data_entrega < hoje) {
      toast({
        title: 'Erro',
        description: 'Data de entrega não pode ser no passado. Selecione a data de hoje ou uma data futura.',
        variant: 'destructive',
      });
      return;
    }

    if (produtosSelecionados.length === 0) {
      toast({
        title: 'Erro',
        description: 'Inclua pelo menos um produto ao pedido.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      console.log('Atualizando pedido:', { formData, produtosSelecionados, valorTotal });

      // Atualiza o pedido (data_entrega, observações e valor_total)
      const { error: pedidoError } = await supabase
        .from('pedidos')
        .update({
          data_entrega: formData.data_entrega,
          observacoes: formData.observacoes.trim() || null,
          valor_total: valorTotal
        })
        .eq('id', pedido.id);

      if (pedidoError) throw pedidoError;

      // Remove produtos antigos desse pedido
      await supabase.from('pedido_produtos').delete().eq('pedido_id', pedido.id);

      // Adiciona os produtos atuais
      for (const item of produtosSelecionados) {
        // Busca info do produto para preço
        const produto = produtosDisponiveis.find((p) => p.id === item.produto_id);
        const { error: itemError } = await supabase.from('pedido_produtos').insert({
          pedido_id: pedido.id,
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          preco_unitario: produto?.preco || 0,
          subtotal: (produto?.preco || 0) * item.quantidade,
        });
        
        if (itemError) throw itemError;
      }

      console.log('Pedido atualizado com sucesso');
      toast({ title: 'Sucesso', description: 'Pedido atualizado com sucesso!' });
      onSuccess();

    } catch (error: any) {
      console.error('Erro ao editar pedido:', error);

      if (error.message?.includes('Data de entrega não pode ser no passado')) {
        toast({
          title: 'Erro',
          description: 'Data de entrega não pode ser no passado. Selecione a data de hoje ou uma data futura.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível atualizar o pedido.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cliente">Cliente</Label>
          <Input
            value={pedido.cliente || 'Cliente não encontrado'}
            disabled
            className="bg-gray-100"
          />
        </div>

        <div>
          <Label htmlFor="valor_total">Valor Total</Label>
          <Input
            value={`R$ ${valorTotal.toFixed(2)}`}
            disabled
            className="bg-gray-100"
          />
        </div>

        <div>
          <Label htmlFor="data_entrega">Data de Entrega *</Label>
          <Input
            id="data_entrega"
            type="date"
            value={formData.data_entrega}
            onChange={(e) => setFormData({ ...formData, data_entrega: e.target.value })}
            min={hoje}
            required
            disabled={pedido.status === 'finalizado'}
          />
          <p className="text-sm text-gray-500 mt-1">
            * A data de entrega deve ser hoje ({new Date().toLocaleDateString('pt-BR')}) ou uma data futura
          </p>
          {formData.data_entrega && formData.data_entrega < hoje && (
            <p className="text-sm text-red-500 mt-1">
              ⚠️ Data selecionada está no passado. Selecione uma data válida.
            </p>
          )}
        </div>

        <div>
          <Label>Produtos do Pedido *</Label>
          <div className="space-y-2">
            {produtosSelecionados.map((item) => {
              const produto = produtosDisponiveis.find(p => p.id === item.produto_id);
              return (
                <div key={item.produto_id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium">{produto?.nome} ({produto?.unidade})</span>
                    <div className="text-sm text-gray-600">R$ {produto?.preco?.toFixed(2) || '0,00'} cada</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleProdutoQtdChange(item.produto_id, Math.max(0, item.quantidade - 0.5))}
                      disabled={pedido.status === 'finalizado'}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={item.quantidade}
                      className="w-20 text-center"
                      onChange={e => handleProdutoQtdChange(item.produto_id, e.target.value)}
                      disabled={pedido.status === 'finalizado'}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleProdutoQtdChange(item.produto_id, item.quantidade + 0.5)}
                      disabled={pedido.status === 'finalizado'}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveProduto(item.produto_id)}
                      disabled={pedido.status === 'finalizado'}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                  <div className="text-sm font-medium min-w-[80px] text-right">
                    R$ {((produto?.preco || 0) * item.quantidade).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Selector para adicionar mais produtos ao pedido */}
          <div className="mt-3 space-y-2">
            <Label>Adicionar Produto</Label>
            <div className="flex gap-2">
              <select
                className="flex-1 rounded border px-3 py-2 h-10"
                disabled={pedido.status === 'finalizado'}
                onChange={e => {
                  const produto_id = e.target.value;
                  if (produto_id) {
                    handleAddProduto(produto_id);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
              >
                <option value="">Selecionar produto para adicionar...</option>
                {produtosDisponiveis
                  .filter(p => !produtosSelecionados.find(sel => sel.produto_id === p.id))
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.unidade}) - R$ {p.preco?.toFixed(2) || '0,00'}
                    </option>
                  ))}
              </select>
            </div>
            
            {/* Botão para adicionar novo produto */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNovoProdutoOpen(true)}
              disabled={pedido.status === 'finalizado'}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Produto não encontrado? Cadastrar novo
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            value={formData.observacoes}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            placeholder="Observações sobre o pedido..."
            rows={3}
            disabled={pedido.status === 'finalizado'}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading || pedido.status === 'finalizado' || (formData.data_entrega && formData.data_entrega < hoje)}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>

      {/* Modal para cadastrar novo produto */}
      <Dialog open={isNovoProdutoOpen} onOpenChange={setIsNovoProdutoOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Produto</DialogTitle>
          </DialogHeader>
          <NovoProdutoForm onSuccess={() => {
            setIsNovoProdutoOpen(false);
            recarregarProdutos();
          }} />
        </DialogContent>
      </Dialog>
    </>
  );
}
