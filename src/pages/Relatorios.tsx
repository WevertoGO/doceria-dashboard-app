import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, Users, DollarSign, Package } from 'lucide-react';
import { PeriodFilter } from '@/components/dashboard/PeriodFilter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReportPeriodForm } from '@/components/forms/ReportPeriodForm';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const periodLabels: Record<string, string> = {
  "today": "de Hoje",
  "week": "da Semana",
  "month": "do Mês",
  "semester": "do Semestre",
  "year": "do Ano",
  "all": "de Todo Período"
};

const Relatorios = () => {
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    vendas: 0,
    novosClientes: 0,
    ticketMedio: 0,
    produtosVendidos: 0,
    topProdutos: [],
    topClientes: [],
    vendasPeriodoAnterior: 0,
    clientesPeriodoAnterior: 0
  });

  const getDateRange = (period: string) => {
    const now = new Date();
    let startDate = new Date();
    let previousStartDate = new Date();
    let previousEndDate = new Date();
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
        break;
      case 'week':
        const weekStart = now.getDate() - now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), weekStart);
        previousStartDate = new Date(now.getFullYear(), now.getMonth(), weekStart - 7);
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), weekStart - 1, 23, 59, 59);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        break;
      case 'semester':
        const semesterStart = now.getMonth() < 6 ? 0 : 6;
        startDate = new Date(now.getFullYear(), semesterStart, 1);
        previousStartDate = new Date(now.getFullYear(), semesterStart - 6, 1);
        previousEndDate = new Date(now.getFullYear(), semesterStart, 0, 23, 59, 59);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
        previousEndDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
        break;
      case 'all':
        startDate = new Date('2020-01-01');
        previousStartDate = new Date('2019-01-01');
        previousEndDate = new Date('2019-12-31');
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    }
    
    return { startDate, endDate: now, previousStartDate, previousEndDate };
  };

  const loadReportData = async () => {
    try {
      setLoading(true);
      const { startDate, endDate, previousStartDate, previousEndDate } = getDateRange(selectedPeriod);

      // Vendas do período atual
      const { data: pedidosAtual } = await supabase
        .from('pedidos')
        .select('valor_total, created_at, cliente_id')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Vendas do período anterior
      const { data: pedidosAnterior } = await supabase
        .from('pedidos')
        .select('valor_total')
        .gte('created_at', previousStartDate.toISOString())
        .lte('created_at', previousEndDate.toISOString());

      // Novos clientes do período atual
      const { data: clientesAtual } = await supabase
        .from('clientes')
        .select('id')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Novos clientes do período anterior
      const { data: clientesAnterior } = await supabase
        .from('clientes')
        .select('id')
        .gte('created_at', previousStartDate.toISOString())
        .lte('created_at', previousEndDate.toISOString());

      // Top produtos
      const { data: topProdutos } = await supabase
        .from('pedido_produtos')
        .select(`
          quantidade,
          subtotal,
          produtos!inner(nome)
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Top clientes
      const { data: topClientesData } = await supabase
        .from('pedidos')
        .select(`
          valor_total,
          cliente_id,
          clientes!inner(nome)
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Processar dados
      const vendas = (pedidosAtual || []).reduce((sum, p) => sum + Number(p.valor_total), 0);
      const vendasPeriodoAnterior = (pedidosAnterior || []).reduce((sum, p) => sum + Number(p.valor_total), 0);
      const novosClientes = clientesAtual?.length || 0;
      const clientesPeriodoAnterior = clientesAnterior?.length || 0;
      const totalPedidos = pedidosAtual?.length || 0;
      const ticketMedio = totalPedidos > 0 ? vendas / totalPedidos : 0;

      // Processar produtos vendidos
      const produtosMap = new Map();
      (topProdutos || []).forEach(item => {
        const nome = item.produtos.nome;
        if (produtosMap.has(nome)) {
          const existing = produtosMap.get(nome);
          produtosMap.set(nome, {
            nome,
            vendas: existing.vendas + item.quantidade,
            receita: existing.receita + item.subtotal
          });
        } else {
          produtosMap.set(nome, {
            nome,
            vendas: item.quantidade,
            receita: item.subtotal
          });
        }
      });
      
      const topProdutosList = Array.from(produtosMap.values())
        .sort((a, b) => b.vendas - a.vendas)
        .slice(0, 5);

      // Processar clientes
      const clientesMap = new Map();
      (topClientesData || []).forEach(pedido => {
        const clienteId = pedido.cliente_id;
        const nome = pedido.clientes.nome;
        if (clientesMap.has(clienteId)) {
          const existing = clientesMap.get(clienteId);
          clientesMap.set(clienteId, {
            nome,
            pedidos: existing.pedidos + 1,
            valor: existing.valor + Number(pedido.valor_total)
          });
        } else {
          clientesMap.set(clienteId, {
            nome,
            pedidos: 1,
            valor: Number(pedido.valor_total)
          });
        }
      });

      const topClientesList = Array.from(clientesMap.values())
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5);

      const produtosVendidos = (topProdutos || []).reduce((sum, item) => sum + item.quantidade, 0);

      setReportData({
        vendas,
        novosClientes,
        ticketMedio,
        produtosVendidos,
        topProdutos: topProdutosList,
        topClientes: topClientesList,
        vendasPeriodoAnterior,
        clientesPeriodoAnterior
      });
    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

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
                <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
                <p className="text-gray-600 mt-1">Análises e relatórios do desempenho da confeitaria</p>
              </div>
              <Button 
                className="bg-confeitaria-primary hover:bg-confeitaria-primary/90"
                onClick={() => setOpenReportDialog(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>

            {/* Period Filter */}
            <div className="mb-8">
              <PeriodFilter onPeriodChange={setSelectedPeriod} />
            </div>

            {/* Cards de Relatórios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{`Vendas ${periodLabels[selectedPeriod]}`}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
                    ) : (
                      `R$ ${reportData.vendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                    ) : (
                      `${((reportData.vendas - reportData.vendasPeriodoAnterior) / (reportData.vendasPeriodoAnterior || 1) * 100).toFixed(1)}% em relação ao período anterior`
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      reportData.novosClientes
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                    ) : (
                      `${((reportData.novosClientes - reportData.clientesPeriodoAnterior) / (reportData.clientesPeriodoAnterior || 1) * 100).toFixed(1)}% em relação ao período anterior`
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                    ) : (
                      `R$ ${reportData.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                    ) : (
                      'Ticket médio do período'
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      reportData.produtosVendidos
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                    ) : (
                      'Produtos vendidos no período'
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Seções de Relatórios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="section-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {`Top 5 Produtos Mais Vendidos ${periodLabels[selectedPeriod]}`}
                </h3>
                <div className="space-y-3">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="space-y-2">
                          <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                          <div className="animate-pulse bg-gray-200 h-3 w-24 rounded"></div>
                        </div>
                        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                      </div>
                    ))
                  ) : reportData.topProdutos.length > 0 ? (
                    reportData.topProdutos.map((produto: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{produto.nome}</h4>
                          <p className="text-sm text-gray-600">{produto.vendas} unidades vendidas</p>
                        </div>
                        <span className="font-semibold text-green-600">R$ {produto.receita.toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Nenhum produto vendido no período</p>
                  )}
                </div>
              </div>

              <div className="section-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {`Clientes Top ${periodLabels[selectedPeriod]}`}
                </h3>
                <div className="space-y-3">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="space-y-2">
                          <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                          <div className="animate-pulse bg-gray-200 h-3 w-24 rounded"></div>
                        </div>
                        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                      </div>
                    ))
                  ) : reportData.topClientes.length > 0 ? (
                    reportData.topClientes.map((cliente: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{cliente.nome}</h4>
                          <p className="text-sm text-gray-600">{cliente.pedidos} pedidos</p>
                        </div>
                        <span className="font-semibold text-green-600">R$ {cliente.valor.toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Nenhum cliente no período</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Dialog para gerar relatório */}
      <Dialog open={openReportDialog} onOpenChange={setOpenReportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gerar Relatório</DialogTitle>
          </DialogHeader>
          <ReportPeriodForm onSuccess={() => setOpenReportDialog(false)} />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Relatorios;
