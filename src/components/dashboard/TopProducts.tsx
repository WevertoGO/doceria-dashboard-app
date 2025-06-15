
import { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TopProduct {
  produto_id: string;
  nome: string;
  preco: number;
  total_vendido: number;
}

export function TopProducts() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarProdutosTop();
  }, []);

  const carregarProdutosTop = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pedido_produtos')
        .select(`
          produto_id,
          quantidade,
          produtos (
            nome,
            preco
          )
        `);

      if (error) throw error;

      // Agrupar por produto e somar quantidades
      const produtosAgrupados = (data || []).reduce((acc: any, item: any) => {
        const produtoId = item.produto_id;
        if (!acc[produtoId]) {
          acc[produtoId] = {
            produto_id: produtoId,
            nome: item.produtos?.nome || 'Produto sem nome',
            preco: item.produtos?.preco || 0,
            total_vendido: 0,
          };
        }
        acc[produtoId].total_vendido += item.quantidade;
        return acc;
      }, {});

      // Converter para array e ordenar por total vendido
      const produtosOrdenados = Object.values(produtosAgrupados)
        .sort((a: any, b: any) => b.total_vendido - a.total_vendido)
        .slice(0, 5);

      setProducts(produtosOrdenados as TopProduct[]);
    } catch (error) {
      console.error('Erro ao carregar produtos top:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Produtos Top</h3>
        <Award className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
          ))
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum produto encontrado</p>
        ) : (
          products.map((product, index) => (
            <div
              key={product.produto_id}
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
                  <h4 className="font-medium text-gray-900">{product.nome}</h4>
                  <p className="text-sm font-semibold text-green-600">R$ {Number(product.preco).toFixed(2)}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-medium">
                {product.total_vendido} vendas
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
