
import { Plus, UserPlus, Package, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  {
    title: 'Novo Pedido',
    description: 'Criar pedido',
    icon: Plus,
    color: 'bg-rose-500 hover:bg-rose-600',
  },
  {
    title: 'Cadastrar Cliente',
    description: 'Adicionar cliente',
    icon: UserPlus,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    title: 'Adicionar Produto',
    description: 'Novo produto',
    icon: Package,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    title: 'Exportar Relatório',
    description: 'Gerar relatório',
    icon: Download,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
];

export function QuickActions() {
  return (
    <div className="section-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant="outline"
            className={`h-auto p-4 flex flex-col items-center gap-2 hover-scale ${action.color} border-0 text-white`}
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
  );
}
