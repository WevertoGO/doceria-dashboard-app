
import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const statusColors = {
  'recebido': 'bg-blue-100 text-blue-800',
  'producao': 'bg-yellow-100 text-yellow-800',
  'pronto': 'bg-green-100 text-green-800',
  'retirado': 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  'recebido': 'Recebido',
  'producao': 'Em Produção',
  'pronto': 'Pronto',
  'retirado': 'Retirado',
};

export function UpcomingDeliveries() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarProximasEntregas();
  }, []);

  const carregarProximasEntregas = async () => {
    try {
      setLoading(true);
      const hoje = new Date();
      const proximosSete = new Date();
      proximosSete.setDate(hoje.getDate() + 7);

      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          clientes (
            nome
          ),
          pedido_produtos (
            quantidade,
            produtos (
              nome
            )
          )
        `)
        .gte('data_entrega', hoje.toISOString().split('T')[0])
        .lte('data_entrega', proximosSete.toISOString().split('T')[0])
        .neq('status', 'retirado')
        .order('data_entrega', { ascending: true })
        .limit(5);

      if (error) throw error;

      const entregasFormatadas = (data || []).map(pedido => ({
        ...pedido,
        client: pedido.clientes?.nome || 'Cliente não encontrado',
        product: pedido.pedido_produtos
          ?.map((pp: any) => `${pp.produtos?.nome} (${pp.quantidade}un)`)
          .join(', ') || 'Sem produtos',
        date: pedido.data_entrega,
        time: '14:00', // Default time since we don't have specific time in database
        status: statusLabels[pedido.status as keyof typeof statusLabels] || pedido.status,
      }));

      setDeliveries(entregasFormatadas);
    } catch (error) {
      console.error('Erro ao carregar próximas entregas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Próximas Entregas</h3>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : deliveries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma entrega programada</p>
          </div>
        ) : (
          deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{delivery.client}</h4>
              <p className="text-sm text-gray-600">{delivery.product}</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {new Date(delivery.date).toLocaleDateString('pt-BR')} às {delivery.time}
                </span>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[delivery.status as keyof typeof statusColors]
              }`}
            >
              {delivery.status}
            </span>
          </div>
          ))
        )}
      </div>
      
      <button className="w-full mt-4 text-sm text-rose-600 hover:text-rose-800 font-medium">
        Ver todos os pedidos →
      </button>
    </div>
  );
}
