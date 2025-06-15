
interface TopProdutosProps {
  loading: boolean;
  topProdutos: { nome: string; vendas: number; receita: number }[];
  periodLabel: string;
}
export function RelatoriosTopProdutos({ loading, topProdutos, periodLabel }: TopProdutosProps) {
  return (
    <div className="section-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {`Top 5 Produtos Mais Vendidos ${periodLabel}`}
      </h3>
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-3 w-24 rounded"></div>
              </div>
              <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
            </div>
          ))
        ) : topProdutos.length > 0 ? (
          topProdutos.map((produto, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{produto.nome}</h4>
                <p className="text-sm text-gray-600">{produto.vendas} unidades vendidas</p>
              </div>
              <span className="font-semibold text-green-600">
                R$ {produto.receita.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhum produto vendido no período</p>
        )}
      </div>
    </div>
  );
}
