import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { MetricCard } from '@/components/dashboard/MetricCard';

import { QuickActions } from '@/components/dashboard/QuickActions';
import { UpcomingDeliveries } from '@/components/dashboard/UpcomingDeliveries';
import { TopProducts } from '@/components/dashboard/TopProducts';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { TrendingUp, Users, DollarSign, ShoppingBag, Search, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

interface DashboardMetrics {
  faturamentoMensal: number;
  pedidosDoMes: number;
  clientesAtivos: number;
  crescimento: number;
  crescimentoPedidos?: number;
  crescimentoClientes?: number;
}

const Index = () => {
  const { signOut, user } = useAuth();
  const { results, loading: searching, searchGlobal } = useGlobalSearch();
  const [searchValue, setSearchValue] = useState("");
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    faturamentoMensal: 0,
    pedidosDoMes: 0,
    clientesAtivos: 0,
    crescimento: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMetricas();
  }, []);

  const carregarMetricas = async () => {
    try {
      setLoading(true);
      
      // Pegar primeiro e último dia do mês atual
      const hoje = new Date();
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      
      // Mês anterior para comparação
      const primeiroDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
      const ultimoDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
      
      // Faturamento do mês atual
      const { data: pedidosMes } = await supabase
        .from('pedidos')
        .select('valor_total')
        .gte('created_at', primeiroDiaMes.toISOString())
        .lte('created_at', ultimoDiaMes.toISOString());

      const faturamentoMensal = (pedidosMes || []).reduce((total, pedido) => total + Number(pedido.valor_total), 0);
      const pedidosDoMes = pedidosMes?.length || 0;

      // Faturamento do mês anterior
      const { data: dadosMesAnterior } = await supabase
        .from('pedidos')
        .select('valor_total')
        .gte('created_at', primeiroDiaMesAnterior.toISOString())
        .lte('created_at', ultimoDiaMesAnterior.toISOString());

      const faturamentoMesAnterior = (dadosMesAnterior || []).reduce((total, pedido) => total + Number(pedido.valor_total), 0);
      const quantidadePedidosMesAnterior = dadosMesAnterior?.length || 0;

      // Clientes ativos (que fizeram pedidos nos últimos 30 dias)
      const trintaDiasAtras = new Date();
      trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
      
      const { data: clientesAtivos } = await supabase
        .from('pedidos')
        .select('cliente_id')
        .gte('created_at', trintaDiasAtras.toISOString());

      const clientesUnicos = new Set(clientesAtivos?.map(p => p.cliente_id)).size;

      // Calcular crescimento real baseado no faturamento
      let crescimentoFaturamento = 0;
      if (faturamentoMesAnterior > 0) {
        crescimentoFaturamento = ((faturamentoMensal - faturamentoMesAnterior) / faturamentoMesAnterior) * 100;
      }

      // Calcular crescimento dos pedidos
      let crescimentoPedidos = 0;
      if (quantidadePedidosMesAnterior > 0) {
        crescimentoPedidos = ((pedidosDoMes - quantidadePedidosMesAnterior) / quantidadePedidosMesAnterior) * 100;
      }

      setMetrics({
        faturamentoMensal,
        pedidosDoMes,
        clientesAtivos: clientesUnicos,
        crescimento: crescimentoFaturamento,
        crescimentoPedidos,
        crescimentoClientes: clientesUnicos > 0 ? Math.random() * 10 + 2 : 0, // Simulado ainda
      });
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-confeitaria-neutral">
        <AppSidebar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header Global */}
            <DashboardHeader user={user} onLogout={handleLogout} />

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <span className="font-medium text-confeitaria-primary">Dashboard</span>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="md:col-span-2 lg:col-span-1">
                <MetricCard
                  title="Faturamento Mensal"
                  value={`R$ ${metrics.faturamentoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  change={metrics.crescimento}
                  icon={<DollarSign className="h-8 w-8 text-confeitaria-success" />}
                  className="metric-card-primary"
                  isPrimary={true}
                  loading={loading}
                />
              </div>
              <MetricCard
                title="Pedidos do Mês"
                value={metrics.pedidosDoMes.toString()}
                change={metrics.crescimentoPedidos || 0}
                icon={<ShoppingBag className="h-6 w-6 text-purple-600" />}
                loading={loading}
              />
              <MetricCard
                title="Clientes Ativos"
                value={metrics.clientesAtivos.toString()}
                change={metrics.crescimentoClientes || 0}
                icon={<Users className="h-6 w-6 text-blue-600" />}
                loading={loading}
              />
              <MetricCard
                title="Crescimento Geral"
                value={`${metrics.crescimento.toFixed(1)}%`}
                change={metrics.crescimento}
                icon={<TrendingUp className="h-6 w-6 text-confeitaria-success" />}
                loading={loading}
              />
            </div>


            {/* Quick Actions */}
            <div className="mb-8">
              <QuickActions />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <UpcomingDeliveries />
              <TopProducts />
              <RecentOrders />
            </div>

            {/* Sales Chart */}
            <SalesChart />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
