
interface TopClientesProps {
  loading: boolean;
  topClientes: { nome: string; pedidos: number; valor: number }[];
  periodLabel: string;
}
export function RelatoriosTopClientes({ loading, topClientes, periodLabel }: TopClientesProps) {
  return (
    <div className="section-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {`Clientes Top ${periodLabel}`}
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
        ) : topClientes.length > 0 ? (
          topClientes.map((cliente, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{cliente.nome}</h4>
                <p className="text-sm text-gray-600">{cliente.pedidos} pedidos</p>
              </div>
              <span className="font-semibold text-green-600">
                R$ {cliente.valor.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhum cliente no período</p>
        )}
      </div>
    </div>
  );
}
