
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, Users, DollarSign, Package } from 'lucide-react';
import { PeriodFilter } from '@/components/dashboard/PeriodFilter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReportPeriodForm } from '@/components/forms/ReportPeriodForm';
import { useState } from 'react';

const Relatorios = () => {
  const [openReportDialog, setOpenReportDialog] = useState(false);

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
              <PeriodFilter />
            </div>

            {/* Cards de Relatórios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 15.230</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">
                    +15% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 87,50</div>
                  <p className="text-xs text-muted-foreground">
                    +5.2% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">174</div>
                  <p className="text-xs text-muted-foreground">
                    +12% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Seções de Relatórios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="section-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Produtos Mais Vendidos</h3>
                <div className="space-y-3">
                  {[
                    { nome: 'Bolo de Chocolate', vendas: 45, receita: 2025 },
                    { nome: 'Brigadeiros Gourmet', vendas: 120, receita: 300 },
                    { nome: 'Torta de Limão', vendas: 25, receita: 1500 },
                    { nome: 'Cupcakes', vendas: 80, receita: 800 },
                    { nome: 'Bem-casados', vendas: 60, receita: 900 },
                  ].map((produto, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{produto.nome}</h4>
                        <p className="text-sm text-gray-600">{produto.vendas} unidades vendidas</p>
                      </div>
                      <span className="font-semibold text-green-600">R$ {produto.receita}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Clientes Top</h3>
                <div className="space-y-3">
                  {[
                    { nome: 'Sofia Mendes', pedidos: 15, valor: 1275 },
                    { nome: 'Roberto Silva', pedidos: 12, valor: 1080 },
                    { nome: 'Luciana Rocha', pedidos: 10, valor: 950 },
                    { nome: 'Ana Costa', pedidos: 8, valor: 720 },
                    { nome: 'Carlos Santos', pedidos: 7, valor: 630 },
                  ].map((cliente, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{cliente.nome}</h4>
                        <p className="text-sm text-gray-600">{cliente.pedidos} pedidos</p>
                      </div>
                      <span className="font-semibold text-green-600">R$ {cliente.valor}</span>
                    </div>
                  ))}
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
