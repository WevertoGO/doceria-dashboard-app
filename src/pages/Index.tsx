
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { PeriodFilter } from '@/components/dashboard/PeriodFilter';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { UpcomingDeliveries } from '@/components/dashboard/UpcomingDeliveries';
import { TopProducts } from '@/components/dashboard/TopProducts';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { TrendingUp, Users, DollarSign, TrendingDown } from 'lucide-react';

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-bakery-soft">
        <AppSidebar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <SidebarTrigger className="lg:hidden" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total de Pedidos"
                value="127"
                change={12.5}
                icon={<TrendingUp className="h-5 w-5 text-rose-600" />}
              />
              <MetricCard
                title="Total Clientes"
                value="89"
                change={8.2}
                icon={<Users className="h-5 w-5 text-rose-600" />}
              />
              <MetricCard
                title="Faturamento"
                value="R$ 14.250"
                change={15.8}
                icon={<DollarSign className="h-5 w-5 text-rose-600" />}
              />
              <MetricCard
                title="Crescimento"
                value="23.5%"
                change={-2.1}
                icon={<TrendingDown className="h-5 w-5 text-rose-600" />}
              />
            </div>

            {/* Period Filter */}
            <PeriodFilter />

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
