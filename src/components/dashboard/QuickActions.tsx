
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Plus, UserPlus, Package, FileText, Clock, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NovoPedidoForm } from '@/components/forms/NovoPedidoForm';
import { NovoClienteForm } from '@/components/forms/NovoClienteForm';
import { NovoProdutoForm } from '@/components/forms/NovoProdutoForm';
import { Badge } from '@/components/ui/badge';

export function QuickActions() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [pedidosPendentes, setPedidosPendentes] = useState(0);
  const [entregasHoje, setEntregasHoje] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const hoje = new Date().toISOString().split('T')[0];

      // Executar ambas as consultas em paralelo para melhor performance
      const [pedidosPendentesResult, entregasHojeResult] = await Promise.all([
        supabase
          .from('pedidos')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'producao'),
        supabase
          .from('pedidos')
          .select('id', { count: 'exact', head: true })
          .eq('data_entrega', hoje)
          .neq('status', 'retirado')
      ]);

      setPedidosPendentes(pedidosPendentesResult.count || 0);
      setEntregasHoje(entregasHojeResult.count || 0);
    } catch (error) {
      console.error('Erro ao carregar dados das ações rápidas:', error);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      title: 'Novo Pedido',
      description: 'Criar pedido rapidamente',
      icon: Plus,
      color: 'bg-confeitaria-primary hover:bg-opacity-90',
      dialog: 'pedido',
      badge: null,
    },
    {
      title: 'Cadastrar Cliente',
      description: 'Adicionar novo cliente',
      icon: UserPlus,
      color: 'bg-blue-500 hover:bg-blue-600',
      dialog: 'cliente',
      badge: null,
    },
    {
      title: 'Adicionar Produto',
      description: 'Novo produto no catálogo',
      icon: Package,
      color: 'bg-confeitaria-success hover:bg-green-600',
      dialog: 'produto',
      badge: null,
    },
    {
      title: 'Pedidos Pendentes',
      description: 'Ver pedidos em produção',
      icon: Clock,
      color: 'bg-orange-500 hover:bg-orange-600',
      dialog: null,
      badge: loading ? '...' : pedidosPendentes.toString(),
    },
    {
      title: 'Entregas Hoje',
      description: 'Pedidos para entrega hoje',
      icon: FileText,
      color: 'bg-purple-500 hover:bg-purple-600',
      dialog: null,
      badge: loading ? '...' : entregasHoje.toString(),
    },
    {
      title: 'Relatórios',
      description: 'Gerar relatório no período...',
      icon: BarChart,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      dialog: null,
      badge: null,
    },
  ];

  const handleActionClick = (action: typeof actions[0]) => {
    if (action.dialog) {
      setOpenDialog(action.dialog);
    } else if (action.title === 'Relatórios') {
      navigate('/relatorios');
    } else if (action.title === 'Pedidos Pendentes') {
      navigate('/pedidos?status=producao');
    } else if (action.title === 'Entregas Hoje') {
      const hoje = new Date().toISOString().split('T')[0];
      navigate(`/pedidos?entrega=${hoje}`);
    }
  };

  return (
    <>
      <div className="section-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-confeitaria-text">Ações Rápidas</h3>
          <span className="text-sm text-gray-500">Acesso rápido às principais funcionalidades</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action) => (
            <div
              key={action.title}
              className="action-card relative"
              onClick={() => handleActionClick(action)}
            >
              {action.badge && (
                <Badge className="absolute -top-2 -right-2 bg-confeitaria-primary text-white">
                  {action.badge}
                </Badge>
              )}
              
              <div className={`p-4 rounded-xl ${action.color} text-white mb-4 inline-flex`}>
                <action.icon className="h-8 w-8" />
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-confeitaria-text text-sm mb-1">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-600">{action.description}</p>
              </div>
            </div>
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
