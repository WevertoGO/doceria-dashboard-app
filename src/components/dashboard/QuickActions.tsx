
import { useState } from 'react';
import { Plus, UserPlus, Package, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NovoPedidoForm } from '@/components/forms/NovoPedidoForm';
import { NovoClienteForm } from '@/components/forms/NovoClienteForm';
import { NovoProdutoForm } from '@/components/forms/NovoProdutoForm';

export function QuickActions() {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const actions = [
    {
      title: 'Novo Pedido',
      description: 'Criar pedido',
      icon: Plus,
      color: 'bg-rose-500 hover:bg-rose-600',
      dialog: 'pedido',
    },
    {
      title: 'Cadastrar Cliente',
      description: 'Adicionar cliente',
      icon: UserPlus,
      color: 'bg-blue-500 hover:bg-blue-600',
      dialog: 'cliente',
    },
    {
      title: 'Adicionar Produto',
      description: 'Novo produto',
      icon: Package,
      color: 'bg-green-500 hover:bg-green-600',
      dialog: 'produto',
    },
    {
      title: 'Exportar Relatório',
      description: 'Gerar relatório',
      icon: Download,
      color: 'bg-purple-500 hover:bg-purple-600',
      dialog: null,
    },
  ];

  const handleActionClick = (action: typeof actions[0]) => {
    if (action.dialog) {
      setOpenDialog(action.dialog);
    } else {
      // Handle export or other actions
      console.log(`Executando ação: ${action.title}`);
    }
  };

  return (
    <>
      <div className="section-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className={`h-auto p-4 flex flex-col items-center gap-2 hover-scale ${action.color} border-0 text-white`}
              onClick={() => handleActionClick(action)}
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs opacity-90">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={openDialog === 'pedido'} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
          </DialogHeader>
          <NovoPedidoForm onSuccess={() => setOpenDialog(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'cliente'} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Cliente</DialogTitle>
          </DialogHeader>
          <NovoClienteForm onSuccess={() => setOpenDialog(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'produto'} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Produto</DialogTitle>
          </DialogHeader>
          <NovoProdutoForm onSuccess={() => setOpenDialog(null)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
