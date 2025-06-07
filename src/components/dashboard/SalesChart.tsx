
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weekData = [
  { name: 'Seg', vendas: 850 },
  { name: 'Ter', vendas: 1200 },
  { name: 'Qua', vendas: 980 },
  { name: 'Qui', vendas: 1400 },
  { name: 'Sex', vendas: 1800 },
  { name: 'Sáb', vendas: 2200 },
  { name: 'Dom', vendas: 1600 },
];

const monthData = [
  { name: 'Sem 1', vendas: 8500 },
  { name: 'Sem 2', vendas: 12000 },
  { name: 'Sem 3', vendas: 9800 },
  { name: 'Sem 4', vendas: 14000 },
];

const yearData = [
  { name: 'Jan', vendas: 35000 },
  { name: 'Fev', vendas: 42000 },
  { name: 'Mar', vendas: 38000 },
  { name: 'Abr', vendas: 45000 },
  { name: 'Mai', vendas: 48000 },
  { name: 'Jun', vendas: 52000 },
];

const chartOptions = [
  { key: 'week', label: 'Vendas por Dia da Semana', data: weekData },
  { key: 'month', label: 'Vendas por Semana do Mês', data: monthData },
  { key: 'year', label: 'Vendas por Mês do Ano', data: yearData },
];

export function SalesChart() {
  const [selectedChart, setSelectedChart] = useState('week');
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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentChart.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
      </div>
    </div>
  );
}
