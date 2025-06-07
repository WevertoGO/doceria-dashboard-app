
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NovoPedidoForm } from '@/components/forms/NovoPedidoForm';

const pedidos = [
  {
    id: 1,
    cliente: 'Sofia Mendes',
    produtos: 'Bolo de Chocolate, Brigadeiros (20un)',
    valor: 85.00,
    dataEntrega: '2024-01-15',
    status: 'recebido',
  },
  {
    id: 2,
    cliente: 'Roberto Silva',
    produtos: 'Torta de Limão',
    valor: 120.00,
    dataEntrega: '2024-01-16',
    status: 'producao',
  },
  {
    id: 3,
    cliente: 'Luciana Rocha',
    produtos: 'Cupcakes (12un)',
    valor: 67.00,
    dataEntrega: '2024-01-17',
    status: 'pronto',
  },
];

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
                  <NovoPedidoForm onSuccess={() => setIsNewOrderOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="metric-card text-center">
                <h3 className="text-2xl font-bold text-blue-600">12</h3>
                <p className="text-sm text-gray-600">Recebidos</p>
              </div>
              <div className="metric-card text-center">
                <h3 className="text-2xl font-bold text-yellow-600">8</h3>
                <p className="text-sm text-gray-600">Em Produção</p>
              </div>
              <div className="metric-card text-center">
                <h3 className="text-2xl font-bold text-green-600">5</h3>
                <p className="text-sm text-gray-600">Prontos</p>
              </div>
              <div className="metric-card text-center">
                <h3 className="text-2xl font-bold text-gray-600">23</h3>
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
                {pedidos.map((pedido) => (
                  <div key={pedido.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="font-semibold text-gray-900">{pedido.cliente}</h4>
                        <Badge className={statusColors[pedido.status as keyof typeof statusColors]}>
                          {statusLabels[pedido.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{pedido.produtos}</p>
                      <p className="text-sm text-gray-500">Entrega: {new Date(pedido.dataEntrega).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">R$ {pedido.valor.toFixed(2)}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">Editar</Button>
                        <Button size="sm" variant="outline">Alterar Status</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Pedidos;
