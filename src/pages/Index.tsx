
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { PeriodFilter } from '@/components/dashboard/PeriodFilter';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { UpcomingDeliveries } from '@/components/dashboard/UpcomingDeliveries';
import { TopProducts } from '@/components/dashboard/TopProducts';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { TrendingUp, Users, DollarSign, ShoppingBag, Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-confeitaria-neutral">
        <AppSidebar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header Global */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-confeitaria-primary to-confeitaria-primary-light rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🧁</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-confeitaria-text">Doce Encanto</h1>
                    <p className="text-gray-600 mt-1">Confeitaria Artesanal</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Busca Global */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar pedidos, clientes ou produtos..."
                    className="pl-10 w-80 bg-white"
                  />
                </div>

                {/* Notificações */}
                <div className="relative">
                  <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-confeitaria-primary transition-colors" />
                  <Badge className="notification-badge">3</Badge>
                </div>

                {/* Avatar do usuário */}
                <div className="w-8 h-8 bg-confeitaria-primary rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-white font-medium text-sm">MA</span>
                </div>
              </div>
            </div>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <span className="font-medium text-confeitaria-primary">Dashboard</span>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="md:col-span-2 lg:col-span-1">
                <MetricCard
                  title="Faturamento Mensal"
                  value="R$ 18.750"
                  change={23.5}
                  icon={<DollarSign className="h-8 w-8 text-confeitaria-success" />}
                  className="metric-card-primary"
                  isPrimary={true}
                />
              </div>
              <MetricCard
                title="Pedidos do Mês"
                value="156"
                change={12.5}
                icon={<ShoppingBag className="h-6 w-6 text-purple-600" />}
              />
              <MetricCard
                title="Clientes Ativos"
                value="89"
                change={8.2}
                icon={<Users className="h-6 w-6 text-blue-600" />}
              />
              <MetricCard
                title="Crescimento"
                value="15.8%"
                change={2.1}
                icon={<TrendingUp className="h-6 w-6 text-confeitaria-success" />}
              />
            </div>

            {/* Period Filter */}
            <div className="mb-8">
              <PeriodFilter />
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
