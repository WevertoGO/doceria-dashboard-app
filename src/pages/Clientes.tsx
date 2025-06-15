
import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NovoClienteForm } from '@/components/forms/NovoClienteForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Clientes = () => {
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calcular número de pedidos para cada cliente
      const clientesComPedidos = await Promise.all(
        (data || []).map(async (cliente) => {
          const { count } = await supabase
            .from('pedidos')
            .select('*', { count: 'exact', head: true })
            .eq('cliente_id', cliente.id);

          const { data: ultimoPedido } = await supabase
            .from('pedidos')
            .select('data_pedido')
            .eq('cliente_id', cliente.id)
            .order('data_pedido', { ascending: false })
            .limit(1)
            .single();

          return {
            ...cliente,
            numeroPedidos: count || 0,
            ultimoPedido: ultimoPedido?.data_pedido || null,
          };
        })
      );

      setClientes(clientesComPedidos);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os clientes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-8 bg-gray-200 rounded animate-pulse"></div></td>
                        </tr>
                      ))
                    ) : clientes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          Nenhum cliente encontrado
                        </td>
                      </tr>
                    ) : (
                      clientes.map((cliente) => (
                        <tr key={cliente.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{cliente.nome}</td>
                          <td className="py-3 px-4 text-gray-600">{cliente.telefone || '-'}</td>
                          <td className="py-3 px-4 text-gray-600">{cliente.numeroPedidos}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {cliente.ultimoPedido 
                              ? new Date(cliente.ultimoPedido).toLocaleDateString('pt-BR')
                              : '-'
                            }
                          </td>
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
                      ))
                    )}
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
