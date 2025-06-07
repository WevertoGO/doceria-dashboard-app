
import { Clock, Calendar } from 'lucide-react';

const deliveries = [
  {
    id: 1,
    client: 'Maria Silva',
    product: 'Bolo de Chocolate - 2kg',
    date: '2024-06-08',
    time: '14:00',
    status: 'Em Produção',
  },
  {
    id: 2,
    client: 'João Santos',
    product: 'Cupcakes (24 unid)',
    date: '2024-06-08',
    time: '16:30',
    status: 'Pronto',
  },
  {
    id: 3,
    client: 'Ana Costa',
    product: 'Torta de Morango',
    date: '2024-06-09',
    time: '10:00',
    status: 'Recebido',
  },
  {
    id: 4,
    client: 'Pedro Lima',
    product: 'Bolo de Aniversário',
    date: '2024-06-09',
    time: '15:00',
    status: 'Em Produção',
  },
  {
    id: 5,
    client: 'Carla Oliveira',
    product: 'Docinhos (50 unid)',
    date: '2024-06-10',
    time: '09:00',
    status: 'Recebido',
  },
];

const statusColors = {
  'Recebido': 'bg-blue-100 text-blue-800',
  'Em Produção': 'bg-yellow-100 text-yellow-800',
  'Pronto': 'bg-green-100 text-green-800',
};

export function UpcomingDeliveries() {
  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Próximas Entregas</h3>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {deliveries.map((delivery) => (
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
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-rose-600 hover:text-rose-800 font-medium">
        Ver todos os pedidos →
      </button>
    </div>
  );
}
