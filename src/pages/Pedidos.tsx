
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Edit, RefreshCw, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { NovoPedidoForm } from '@/components/forms/NovoPedidoForm';
import { EditarPedidoForm } from '@/components/forms/EditarPedidoForm';
import { AlterarStatusForm } from '@/components/forms/AlterarStatusForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const statusColors = {
  recebido: 'bg-blue-50 text-blue-700 border-blue-200',
  producao: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  pronto: 'bg-green-50 text-green-700 border-green-200',
  retirado: 'bg-gray-50 text-gray-700 border-gray-200',
  finalizado: 'bg-purple-50 text-purple-700 border-purple-200',
};

const statusLabels = {
  recebido: 'Recebido',
  producao: 'Em Produção',
  pronto: 'Pronto',
  retirado: 'Retirado',
  finalizado: 'Finalizado',
};

const Pedidos = () => {
  const [searchParams] = useSearchParams();
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [metricas, setMetricas] = useState({
    recebidos: 0,
    producao: 0,
    prontos: 0,
    retirados: 0,
    finalizados: 0,
  });
  const { toast } = useToast();

  // Filtros da URL
  const statusFilter = searchParams.get('status');
  const entregaFilter = searchParams.get('entrega');

  useEffect(() => {
    carregarDados();
  }, [statusFilter, entregaFilter]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Executar consultas em paralelo
      const [pedidosResult, metricasResult] = await Promise.all([
        carregarPedidos(),
        carregarMetricas()
      ]);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const carregarPedidos = async () => {
    let query = supabase
      .from('pedidos')
      .select(`
        *,
        clientes!inner (
          nome
        ),
        pedido_produtos (
          quantidade,
          produtos (
            nome
          )
        )
      `)
      .order('data_pedido', { ascending: false });

    // Aplicar filtros se especificados na URL
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }
    if (entregaFilter) {
      query = query.eq('data_entrega', entregaFilter);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Formatear os dados para mostrar os produtos
    const pedidosFormatados = (data || []).map(pedido => ({
      ...pedido,
      cliente: pedido.clientes?.nome || 'Cliente não encontrado',
      produtos: pedido.pedido_produtos
        ?.map((pp: any) => `${pp.produtos?.nome} (${pp.quantidade}un)`)
        .join(', ') || 'Sem produtos',
    }));

    setPedidos(pedidosFormatados);
    return pedidosFormatados;
  };

  const carregarMetricas = async () => {
    // Usar count em vez de buscar todos os dados
    const [recebidos, producao, prontos, retirados, finalizados] = await Promise.all([
      supabase.from('pedidos').select('*', { count: 'exact', head: true }).eq('status', 'recebido'),
      supabase.from('pedidos').select('*', { count: 'exact', head: true }).eq('status', 'producao'),
      supabase.from('pedidos').select('*', { count: 'exact', head: true }).eq('status', 'pronto'),
      supabase.from('pedidos').select('*', { count: 'exact', head: true }).eq('status', 'retirado'),
      supabase.from('pedidos').select('*', { count: 'exact', head: true }).eq('status', 'finalizado')
    ]);

    setMetricas({
      recebidos: recebidos.count || 0,
      producao: producao.count || 0,
      prontos: prontos.count || 0,
      retirados: retirados.count || 0,
      finalizados: finalizados.count || 0,
    });
  };

  // Filtrar pedidos localmente baseado na busca
  const pedidosFiltrados = useMemo(() => {
    if (!searchTerm) return pedidos;
    
    return pedidos.filter(pedido =>
      pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.produtos.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pedidos, searchTerm]);

  const excluirPedido = async (pedidoId: string) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', pedidoId);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Pedido excluído com sucesso!',
      });
      
      carregarDados();
    } catch (error: any) {
      console.error('Erro ao excluir pedido:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível excluir o pedido.',
        variant: 'destructive',
      });
    }
  };

  const abrirEditarPedido = (pedido: any) => {
    setPedidoSelecionado(pedido);
    setIsEditOrderOpen(true);
  };

  const abrirAlterarStatus = (pedido: any) => {
    setPedidoSelecionado(pedido);
    setIsStatusOpen(true);
  };

  const handleSuccess = () => {
    setIsNewOrderOpen(false);
    setIsEditOrderOpen(false);
    setIsStatusOpen(false);
    setPedidoSelecionado(null);
    carregarDados();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-bakery-soft">
        <AppSidebar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">Gestão de Pedidos</h1>
                <p className="text-gray-600 mt-1">Acompanhe todos os pedidos da confeitaria</p>
              </div>
              <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-rose-500 hover:bg-rose-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Pedido
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Novo Pedido</DialogTitle>
                  </DialogHeader>
                  <NovoPedidoForm onSuccess={handleSuccess} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="metric-card text-center">
                <h3 className="text-2xl font-bold text-blue-600">{loading ? '...' : metricas.recebidos}</h3>
                <p className="text-sm text-gray-600">Recebidos</p>
              </div>
              <div className="metric-card text-center">
                <h3 className="text-2xl font-bold text-yellow-600">{loading ? '...' : metricas.producao}</h3>
                <p className="text-sm text-gray-600">Em Produção</p>
              </div>
              <div className="metric-card text-center">
                <h3 className="text-2xl font-bold text-green-600">{loading ? '...' : metricas.prontos}</h3>
                <p className="text-sm text-gray-600">Prontos</p>
              </div>
              <div className="metric-card text-center">
                <h3 className="text-2xl font-bold text-gray-600">{loading ? '...' : metricas.retirados}</h3>
                <p className="text-sm text-gray-600">Retirados</p>
              </div>
              <div className="metric-card text-center">
                <h3 className="text-2xl font-bold text-purple-600">{loading ? '...' : metricas.finalizados}</h3>
                <p className="text-sm text-gray-600">Finalizados</p>
              </div>
            </div>

            {/* Filtros */}
            <div className="section-card mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por cliente ou produto..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>

            {/* Lista de Pedidos */}
            <div className="section-card">
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                  ))
                ) : pedidosFiltrados.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Nenhum pedido encontrado</p>
                  </div>
                ) : (
                  pedidosFiltrados.map((pedido) => (
                    <div key={pedido.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h4 className="font-semibold text-gray-900">{pedido.cliente}</h4>
                          <Badge className={statusColors[pedido.status as keyof typeof statusColors]}>
                            {statusLabels[pedido.status as keyof typeof statusLabels]}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{pedido.produtos}</p>
                        <p className="text-sm text-gray-500">Entrega: {new Date(pedido.data_entrega).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">R$ {Number(pedido.valor_total).toFixed(2)}</p>
                        <div className="flex gap-2 mt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => abrirEditarPedido(pedido)}
                            disabled={pedido.status === 'finalizado'}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => abrirAlterarStatus(pedido)}
                            disabled={pedido.status === 'finalizado'}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Status
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                disabled={pedido.status === 'finalizado'}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => excluirPedido(pedido.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <Dialog open={isEditOrderOpen} onOpenChange={setIsEditOrderOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Pedido</DialogTitle>
          </DialogHeader>
          {pedidoSelecionado && (
            <EditarPedidoForm pedido={pedidoSelecionado} onSuccess={handleSuccess} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Alterar Status do Pedido</DialogTitle>
          </DialogHeader>
          {pedidoSelecionado && (
            <AlterarStatusForm pedido={pedidoSelecionado} onSuccess={handleSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Pedidos;
