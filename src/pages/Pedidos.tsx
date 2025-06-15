
import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NovoPedidoForm } from '@/components/forms/NovoPedidoForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const statusColors = {
  recebido: 'bg-blue-50 text-blue-700 border-blue-200',
  producao: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  pronto: 'bg-green-50 text-green-700 border-green-200',
  retirado: 'bg-gray-50 text-gray-700 border-gray-200',
};

const statusLabels = {
  recebido: 'Recebido',
  producao: 'Em Produção',
  pronto: 'Pronto',
  retirado: 'Retirado',
};

const Pedidos = () => {
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState({
    recebidos: 0,
    producao: 0,
    prontos: 0,
    retirados: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    carregarPedidos();
    carregarMetricas();
  }, []);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          clientes (
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

      if (error) throw error;

      // Formatear los datos para mostrar los productos
      const pedidosFormatados = (data || []).map(pedido => ({
        ...pedido,
        cliente: pedido.clientes?.nome || 'Cliente não encontrado',
        produtos: pedido.pedido_produtos
          ?.map((pp: any) => `${pp.produtos?.nome} (${pp.quantidade}un)`)
          .join(', ') || 'Sem produtos',
      }));

      setPedidos(pedidosFormatados);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os pedidos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const carregarMetricas = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('status');

      if (error) throw error;

      const contadores = (data || []).reduce((acc, pedido) => {
        acc[pedido.status] = (acc[pedido.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setMetricas({
        recebidos: contadores.recebido || 0,
        producao: contadores.producao || 0,
        prontos: contadores.pronto || 0,
        retirados: contadores.retirado || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    }
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
                  <NovoPedidoForm onSuccess={() => {
                    setIsNewOrderOpen(false);
                    carregarPedidos();
                    carregarMetricas();
                  }} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="metric-card text-center">
                <h3 className="text-2xl font-bold text-blue-600">{metricas.recebidos}</h3>
                <p className="text-sm text-gray-600">Recebidos</p>
              </div>
              <div className="metric-card text-center">
                <h3 className="text-2xl font-bold text-yellow-600">{metricas.producao}</h3>
                <p className="text-sm text-gray-600">Em Produção</p>
              </div>
              <div className="metric-card text-center">
                <h3 className="text-2xl font-bold text-green-600">{metricas.prontos}</h3>
                <p className="text-sm text-gray-600">Prontos</p>
              </div>
              <div className="metric-card text-center">
                <h3 className="text-2xl font-bold text-gray-600">{metricas.retirados}</h3>
                <p className="text-sm text-gray-600">Retirados</p>
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
                ) : pedidos.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Nenhum pedido encontrado</p>
                  </div>
                ) : (
                  pedidos.map((pedido) => (
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
                          <Button size="sm" variant="outline">Editar</Button>
                          <Button size="sm" variant="outline">Alterar Status</Button>
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
    </SidebarProvider>
  );
};

export default Pedidos;
