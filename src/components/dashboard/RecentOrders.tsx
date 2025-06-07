
import { Clock } from 'lucide-react';

const orders = [
  {
    id: 1,
    client: 'Sofia Mendes',
    value: 'R$ 85,00',
    time: 'há 15 min',
  },
  {
    id: 2,
    client: 'Roberto Silva',
    value: 'R$ 120,00',
    time: 'há 32 min',
  },
  {
    id: 3,
    client: 'Luciana Rocha',
    value: 'R$ 67,00',
    time: 'há 1h',
  },
  {
    id: 4,
    client: 'Fernando Costa',
    value: 'R$ 95,00',
    time: 'há 2h',
  },
  {
    id: 5,
    client: 'Beatriz Santos',
    value: 'R$ 110,00',
    time: 'há 3h',
  },
];

export function RecentOrders() {
  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h3>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div>
              <h4 className="font-medium text-gray-900">{order.client}</h4>
              <p className="text-sm font-semibold text-green-600">{order.value}</p>
            </div>
            <span className="text-xs text-gray-500">{order.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
