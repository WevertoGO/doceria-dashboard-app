
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecentOrder {
  id: string;
  valor_total: number;
  created_at: string;
  clientes: {
    nome: string;
  };
}

export function RecentOrders() {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPedidosRecentes();
  }, []);

  const carregarPedidosRecentes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          id,
          valor_total,
          created_at,
          clientes (
            nome
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Erro ao carregar pedidos recentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarTempo = (created_at: string) => {
    const agora = new Date();
    const pedido = new Date(created_at);
    const diffMs = agora.getTime() - pedido.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 60) {
      return `há ${diffMins} min`;
    } else if (diffHoras < 24) {
      return `há ${diffHoras}h`;
    } else {
      return format(pedido, 'dd/MM', { locale: ptBR });
    }
  };

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h3>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
              <div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          ))
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum pedido encontrado</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div>
                <h4 className="font-medium text-gray-900">{order.clientes?.nome || 'Cliente não encontrado'}</h4>
                <p className="text-sm font-semibold text-green-600">R$ {Number(order.valor_total).toFixed(2)}</p>
              </div>
              <span className="text-xs text-gray-500">{formatarTempo(order.created_at)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
