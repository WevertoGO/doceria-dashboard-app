
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export function SalesChart() {
  const [selectedChart, setSelectedChart] = useState('week');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const chartOptions = [
    { key: 'week', label: 'Vendas por Dia da Semana' },
    { key: 'month', label: 'Vendas por Semana do Mês' },
    { key: 'year', label: 'Vendas por Mês do Ano' },
  ];

  useEffect(() => {
    carregarDadosGrafico();
  }, [selectedChart]);

  const carregarDadosGrafico = async () => {
    try {
      setLoading(true);
      let dados: any[] = [];

      if (selectedChart === 'week') {
        // Últimos 7 dias
        const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const hoje = new Date();
        dados = [];

        for (let i = 6; i >= 0; i--) {
          const data = new Date(hoje);
          data.setDate(data.getDate() - i);
          const dataStr = data.toISOString().split('T')[0];

          const { data: pedidos } = await supabase
            .from('pedidos')
            .select('valor_total')
            .gte('created_at', dataStr + 'T00:00:00')
            .lt('created_at', dataStr + 'T23:59:59');

          const vendas = (pedidos || []).reduce((total, p) => total + Number(p.valor_total), 0);
          
          dados.push({
            name: diasSemana[data.getDay()],
            vendas: vendas
          });
        }
      } else if (selectedChart === 'month') {
        // Últimas 4 semanas
        const hoje = new Date();
        dados = [];

        for (let i = 3; i >= 0; i--) {
          const inicioSemana = new Date(hoje);
          inicioSemana.setDate(hoje.getDate() - (i * 7) - 6);
          const fimSemana = new Date(hoje);
          fimSemana.setDate(hoje.getDate() - (i * 7));

          const { data: pedidos } = await supabase
            .from('pedidos')
            .select('valor_total')
            .gte('created_at', inicioSemana.toISOString().split('T')[0])
            .lte('created_at', fimSemana.toISOString().split('T')[0]);

          const vendas = (pedidos || []).reduce((total, p) => total + Number(p.valor_total), 0);
          
          dados.push({
            name: `Sem ${4 - i}`,
            vendas: vendas
          });
        }
      } else if (selectedChart === 'year') {
        // Últimos 6 meses
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const hoje = new Date();
        dados = [];

        for (let i = 5; i >= 0; i--) {
          const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
          const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() - i + 1, 0);

          const { data: pedidos } = await supabase
            .from('pedidos')
            .select('valor_total')
            .gte('created_at', mes.toISOString().split('T')[0])
            .lte('created_at', proximoMes.toISOString().split('T')[0]);

          const vendas = (pedidos || []).reduce((total, p) => total + Number(p.valor_total), 0);
          
          dados.push({
            name: meses[mes.getMonth()],
            vendas: vendas
          });
        }
      }

      setChartData(dados);
    } catch (error) {
      console.error('Erro ao carregar dados do gráfico:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentChart = chartOptions.find(chart => chart.key === selectedChart) || chartOptions[0];

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-6">
        <select
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none cursor-pointer"
        >
          {chartOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="h-80">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-500">Carregando dados...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, 'Vendas']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="vendas" 
              fill="#f43f5e"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
