
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

  const handlePeriodChange = (period: string) => {
    setActivePeriod(period);
    onPeriodChange?.(period);
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
        <div className="flex gap-1">
          {periods.map((period) => (
            <button
              key={period.key}
              onClick={() => handlePeriodChange(period.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activePeriod === period.key
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
