import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, User, Plus, Minus, CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NovoClienteForm } from '@/components/forms/NovoClienteForm';
import { NovoProdutoForm } from '@/components/forms/NovoProdutoForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface NovoPedidoFormProps {
  onSuccess: () => void;
}

export function NovoPedidoForm({ onSuccess }: NovoPedidoFormProps) {
  const [step, setStep] = useState('cliente');
  const [cliente, setCliente] = useState<any>(null);
  const [buscaCliente, setBuscaCliente] = useState('');
  const [produtos, setProdutos] = useState<any[]>([]);
  const [buscaProduto, setBuscaProduto] = useState('');
  const [entrega, setEntrega] = useState({ 
    data: null as Date | null, 
    periodo: 'manha', 
    observacoes: '' 
  });
  const [isNovoClienteOpen, setIsNovoClienteOpen] = useState(false);
  const [isNovoProdutoOpen, setIsNovoProdutoOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Estado para dados do banco
  const [clientesDisponiveis, setClientesDisponiveis] = useState<any[]>([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<any[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    carregarClientes();
    carregarProdutos();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoadingClientes(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome');

      if (error) throw error;
      setClientesDisponiveis(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar clientes',
        variant: 'destructive',
      });
    } finally {
      setLoadingClientes(false);
    }
  };

  const carregarProdutos = async () => {
    try {
      setLoadingProdutos(true);
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          *,
          categorias (
            nome
          )
        `)
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      
      const produtosFormatados = (data || []).map(produto => ({
        ...produto,
        valor: Number(produto.preco),
        categoria: produto.categorias?.nome || 'Sem categoria',
        imagem: '🍰'
      }));
      
      setProdutosDisponiveis(produtosFormatados);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar produtos',
        variant: 'destructive',
      });
    } finally {
      setLoadingProdutos(false);
    }
  };

  const clientesFiltrados = clientesDisponiveis.filter(c => 
    c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) ||
    (c.telefone && c.telefone.includes(buscaCliente))
  );

  const produtosFiltrados = produtosDisponiveis.filter(p => 
    p.nome.toLowerCase().includes(buscaProduto.toLowerCase()) ||
    p.categoria.toLowerCase().includes(buscaProduto.toLowerCase())
  );

  const adicionarProduto = (produto: any) => {
    const produtoExistente = produtos.find(p => p.id === produto.id);
    if (produtoExistente) {
      setProdutos(produtos.map(p => 
        p.id === produto.id 
          ? { ...p, quantidade: p.quantidade + 1 }
          : p
      ));
    } else {
      setProdutos([...produtos, { ...produto, quantidade: 1 }]);
    }
  };

  const removerProduto = (produtoId: string) => {
    setProdutos(produtos.filter(p => p.id !== produtoId));
  };

  const atualizarQuantidade = (produtoId: string, quantidade: number | string) => {
    const qtd = typeof quantidade === 'string' ? parseFloat(quantidade) || 0 : quantidade;
    if (qtd <= 0) {
      removerProduto(produtoId);
    } else {
      setProdutos(produtos.map(p => 
        p.id === produtoId ? { ...p, quantidade: qtd } : p
      ));
    }
  };

  const valorTotal = produtos.reduce((total, produto) => total + (produto.valor * produto.quantidade), 0);

  const handleSubmit = async () => {
    if (!cliente) {
      toast({
        title: 'Erro',
        description: 'Selecione um cliente',
        variant: 'destructive',
      });
      return;
    }
    if (produtos.length === 0) {
      toast({
        title: 'Erro',
        description: 'Adicione pelo menos um produto',
        variant: 'destructive',
      });
      return;
    }
    if (!entrega.data) {
      toast({
        title: 'Erro',
        description: 'Selecione a data de entrega',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      console.log('Iniciando criação do pedido...');
      console.log('Cliente:', cliente);
      console.log('Produtos:', produtos);
      console.log('Entrega:', entrega);

      // Criar o pedido
      const { data: pedidoData, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          cliente_id: cliente.id,
          data_entrega: format(entrega.data, 'yyyy-MM-dd'),
          valor_total: valorTotal,
          observacoes: entrega.observacoes.trim() || null,
          status: 'recebido',
        })
        .select()
        .single();

      if (pedidoError) {
        console.error('Erro ao criar pedido:', pedidoError);
        throw pedidoError;
      }

      console.log('Pedido criado:', pedidoData);

      // Criar os itens do pedido
      const itensPedido = produtos.map(produto => ({
        pedido_id: pedidoData.id,
        produto_id: produto.id,
        quantidade: Math.round(produto.quantidade), // Arredondar para inteiro
        preco_unitario: produto.valor,
        subtotal: produto.valor * produto.quantidade,
      }));

      console.log('Itens do pedido a serem inseridos:', itensPedido);

      const { error: itensError } = await supabase
        .from('pedido_produtos')
        .insert(itensPedido);

      if (itensError) {
        console.error('Erro ao criar itens do pedido:', itensError);
        throw itensError;
      }

      console.log('Itens do pedido inseridos com sucesso');

      toast({
        title: 'Sucesso',
        description: 'Pedido criado com sucesso!',
      });
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o pedido.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={step} onValueChange={setStep} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cliente">Cliente</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="entrega">Entrega</TabsTrigger>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
        </TabsList>

        <TabsContent value="cliente" className="space-y-4">
          <div>
            <Label htmlFor="busca-cliente">Buscar Cliente</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="busca-cliente"
                value={buscaCliente}
                onChange={(e) => setBuscaCliente(e.target.value)}
                placeholder="Digite o nome ou telefone do cliente..."
                className="pl-10"
              />
            </div>
          </div>

          {cliente && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">{cliente.nome}</p>
                    <p className="text-sm text-green-600">{cliente.telefone}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCliente(null)}
                >
                  Alterar
                </Button>
              </div>
            </div>
          )}

          {!cliente && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {clientesFiltrados.map((c) => (
                <div 
                  key={c.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setCliente(c)}
                >
                  <div className="font-medium">{c.nome}</div>
                  <div className="text-sm text-gray-600">{c.telefone}</div>
                </div>
              ))}
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsNovoClienteOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Cliente não encontrado? Cadastrar novo
              </Button>
            </div>
          )}

          <Button 
            onClick={() => setStep('produtos')} 
            className="w-full"
            disabled={!cliente}
          >
            Próximo: Produtos
          </Button>
        </TabsContent>

        <TabsContent value="produtos" className="space-y-4">
          <div>
            <Label htmlFor="busca-produto">Buscar Produto</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="busca-produto"
                value={buscaProduto}
                onChange={(e) => setBuscaProduto(e.target.value)}
                placeholder="Digite o nome do produto ou categoria..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Carrinho lateral com quantidades editáveis */}
          {produtos.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">Produtos Selecionados</h4>
              <div className="space-y-2">
                {produtos.map((produto) => (
                  <div key={produto.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-sm font-medium">{produto.nome}</span>
                      <span className="text-xs text-gray-500 block">R$ {produto.valor.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => atualizarQuantidade(produto.id, produto.quantidade - 0.5)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        value={produto.quantidade}
                        onChange={(e) => atualizarQuantidade(produto.id, e.target.value)}
                        className="w-20 text-center text-sm h-8"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => atualizarQuantidade(produto.id, produto.quantidade + 0.5)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex justify-between font-medium text-blue-900">
                  <span>Total:</span>
                  <span>R$ {valorTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Grid de produtos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
            {produtosFiltrados.map((produto) => (
              <div key={produto.id} className="p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{produto.imagem}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{produto.nome}</h4>
                    <p className="text-xs text-gray-500">{produto.categoria}</p>
                    <p className="text-sm font-medium text-green-600">R$ {produto.valor.toFixed(2)}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => adicionarProduto(produto)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg">
              <Button
                variant="ghost"
                className="w-full h-full"
                onClick={() => setIsNovoProdutoOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Produto não encontrado?<br />Cadastrar novo
              </Button>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep('cliente')}>
              Voltar
            </Button>
            <Button 
              onClick={() => setStep('entrega')}
              disabled={produtos.length === 0}
            >
              Próximo: Entrega
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="entrega" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data da Entrega</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !entrega.data && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {entrega.data ? format(entrega.data, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={entrega.data}
                    onSelect={(date) => {
                      setEntrega({ ...entrega, data: date });
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Período</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { value: 'manha', label: 'Manhã' },
                  { value: 'tarde', label: 'Tarde' },
                  { value: 'noite', label: 'Noite' },
                  { value: 'especifico', label: 'Horário específico' }
                ].map((periodo) => (
                  <Button
                    key={periodo.value}
                    variant={entrega.periodo === periodo.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEntrega({ ...entrega, periodo: periodo.value })}
                  >
                    {periodo.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações Especiais</Label>
            <Input
              id="observacoes"
              value={entrega.observacoes}
              onChange={(e) => setEntrega({ ...entrega, observacoes: e.target.value })}
              placeholder="Ex: Sem açúcar, entrega na portaria..."
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep('produtos')}>
              Voltar
            </Button>
            <Button onClick={() => setStep('resumo')}>
              Próximo: Resumo
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="resumo" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Cliente</h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{cliente?.nome}</p>
                <p className="text-sm text-gray-600">{cliente?.telefone}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Produtos</h4>
              <div className="space-y-2">
                {produtos.map((produto) => (
                  <div key={produto.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{produto.quantidade}x {produto.nome}</span>
                      <p className="text-sm text-gray-600">{produto.categoria}</p>
                    </div>
                    <span className="font-medium">R$ {(produto.valor * produto.quantidade).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Entrega</h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p><strong>Data:</strong> {entrega.data ? format(entrega.data, "dd/MM/yyyy", { locale: ptBR }) : 'Não selecionada'}</p>
                <p><strong>Período:</strong> {entrega.periodo}</p>
                {entrega.observacoes && (
                  <p><strong>Observações:</strong> {entrega.observacoes}</p>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">R$ {valorTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep('entrega')}>
              Voltar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-rose-500 hover:bg-rose-600"
              disabled={loading}
            >
              {loading ? 'Criando Pedido...' : 'Confirmar Pedido'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals inline */}
      <Dialog open={isNovoClienteOpen} onOpenChange={setIsNovoClienteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
          </DialogHeader>
          <NovoClienteForm onSuccess={() => {
            setIsNovoClienteOpen(false);
            carregarClientes();
          }} />
        </DialogContent>
      </Dialog>

      <Dialog open={isNovoProdutoOpen} onOpenChange={setIsNovoProdutoOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Produto</DialogTitle>
          </DialogHeader>
          <NovoProdutoForm onSuccess={() => {
            setIsNovoProdutoOpen(false);
            carregarProdutos();
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
