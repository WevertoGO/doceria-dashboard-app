
import { Award } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Bolo de Chocolate',
    price: 'R$ 45,00',
    quantity: 28,
  },
  {
    id: 2,
    name: 'Cupcakes (12 unid)',
    price: 'R$ 36,00',
    quantity: 15,
  },
  {
    id: 3,
    name: 'Torta de Morango',
    price: 'R$ 65,00',
    quantity: 12,
  },
  {
    id: 4,
    name: 'Docinhos (25 unid)',
    price: 'R$ 40,00',
    quantity: 18,
  },
  {
    id: 5,
    name: 'Bolo de Cenoura',
    price: 'R$ 38,00',
    quantity: 10,
  },
];

export function TopProducts() {
  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Produtos Top</h3>
        <Award className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index === 0 ? 'bg-yellow-200 text-yellow-800' :
                index === 1 ? 'bg-gray-200 text-gray-700' :
                index === 2 ? 'bg-orange-200 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <p className="text-sm font-semibold text-green-600">{product.price}</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-medium">
              {product.quantity} vendas
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
