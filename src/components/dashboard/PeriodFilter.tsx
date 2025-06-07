
import { useState } from 'react';

const periods = [
  { key: 'today', label: 'Hoje' },
  { key: 'week', label: 'Semanal' },
  { key: 'month', label: 'Mensal' },
  { key: 'semester', label: 'Semestral' },
  { key: 'year', label: 'Anual' },
  { key: 'all', label: 'Todo Período' },
];

interface PeriodFilterProps {
  onPeriodChange?: (period: string) => void;
}

export function PeriodFilter({ onPeriodChange }: PeriodFilterProps) {
  const [activePeriod, setActivePeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(false);

  const handlePeriodChange = async (period: string) => {
    setIsLoading(true);
    setActivePeriod(period);
    onPeriodChange?.(period);
    
    // Simular loading
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-confeitaria-text">Período de Análise</h3>
        {isLoading && (
          <div className="w-4 h-4 border-2 border-confeitaria-primary border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {periods.map((period) => (
          <button
            key={period.key}
            onClick={() => handlePeriodChange(period.key)}
            disabled={isLoading}
            className={`period-pill ${
              activePeriod === period.key ? 'active' : 'inactive'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>
  );
}
