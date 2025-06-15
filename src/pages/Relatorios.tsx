import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { PeriodFilter } from '@/components/dashboard/PeriodFilter';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RelatoriosHeader } from '@/components/relatorios/RelatoriosHeader';
import { RelatoriosSummaryCard } from '@/components/relatorios/RelatoriosSummaryCard';
import { RelatoriosTopProdutos } from '@/components/relatorios/RelatoriosTopProdutos';
import { RelatoriosTopClientes } from '@/components/relatorios/RelatoriosTopClientes';
import { ReportDialog } from '@/components/relatorios/ReportDialog';
import { FileText } from 'lucide-react';

const periodLabels: Record<string, string> = {
  today: 'de Hoje',
  week: 'da Semana',
  month: 'do Mês',
  semester: 'do Semestre',
  year: 'do Ano',
  all: 'de Todo Período'
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
            <div className="flex items-center gap-4 mb-8">
              <RelatoriosHeader />
              <Button
                className="bg-confeitaria-primary hover:bg-confeitaria-primary/90"
                onClick={() => setOpenReportDialog(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>
            <div className="mb-8">
              <PeriodFilter onPeriodChange={setSelectedPeriod} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <RelatoriosSummaryCard
                type="vendas"
                title={`Vendas ${periodLabels[selectedPeriod]}`}
                value={`R$ ${reportData.vendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                description={`${((reportData.vendas - reportData.vendasPeriodoAnterior) / (reportData.vendasPeriodoAnterior || 1) * 100).toFixed(1)}% em relação ao período anterior`}
                loading={loading}
              />
              <RelatoriosSummaryCard
                type="clientes"
                title="Novos Clientes"
                value={reportData.novosClientes}
                description={`${((reportData.novosClientes - reportData.clientesPeriodoAnterior) / (reportData.clientesPeriodoAnterior || 1) * 100).toFixed(1)}% em relação ao período anterior`}
                loading={loading}
              />
              <RelatoriosSummaryCard
                type="ticket"
                title="Ticket Médio"
                value={`R$ ${reportData.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                description="Ticket médio do período"
                loading={loading}
              />
              <RelatoriosSummaryCard
                type="produtos"
                title="Produtos Vendidos"
                value={reportData.produtosVendidos}
                description="Produtos vendidos no período"
                loading={loading}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RelatoriosTopProdutos
                loading={loading}
                topProdutos={reportData.topProdutos}
                periodLabel={periodLabels[selectedPeriod]}
              />
              <RelatoriosTopClientes
                loading={loading}
                topClientes={reportData.topClientes}
                periodLabel={periodLabels[selectedPeriod]}
              />
            </div>
          </div>
        </main>
      </div>
      <ReportDialog open={openReportDialog} onOpenChange={setOpenReportDialog} />
    </SidebarProvider>
  );
};

export default Relatorios;
