
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NovoClienteForm } from '@/components/forms/NovoClienteForm';

const clientes = [
  {
    id: 1,
    nome: 'Sofia Mendes',
    telefone: '(11) 99999-9999',
    numeroPedidos: 15,
    ultimoPedido: '2024-01-10',
  },
  {
    id: 2,
    nome: 'Roberto Silva',
    telefone: '(11) 88888-8888',
    numeroPedidos: 8,
    ultimoPedido: '2024-01-12',
  },
  {
    id: 3,
    nome: 'Luciana Rocha',
    telefone: '(11) 77777-7777',
    numeroPedidos: 23,
    ultimoPedido: '2024-01-14',
  },
];

const Clientes = () => {
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);

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
                <h1 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
                <p className="text-gray-600 mt-1">Gerencie a base de clientes da confeitaria</p>
              </div>
              <Dialog open={isNewClientOpen} onOpenChange={setIsNewClientOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar Cliente</DialogTitle>
                  </DialogHeader>
                  <NovoClienteForm onSuccess={() => setIsNewClientOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Busca */}
            <div className="section-card mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou telefone..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Lista de Clientes */}
            <div className="section-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Telefone</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Nº Pedidos</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Último Pedido</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((cliente) => (
                      <tr key={cliente.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{cliente.nome}</td>
                        <td className="py-3 px-4 text-gray-600">{cliente.telefone}</td>
                        <td className="py-3 px-4 text-gray-600">{cliente.numeroPedidos}</td>
                        <td className="py-3 px-4 text-gray-600">{new Date(cliente.ultimoPedido).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Clientes;
