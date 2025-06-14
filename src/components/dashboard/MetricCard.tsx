
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  className?: string;
  isPrimary?: boolean;
  loading?: boolean;
}

export function MetricCard({ title, value, change, icon, className = '', isPrimary = false, loading = false }: MetricCardProps) {
  const changeColor = change && change > 0 ? 'text-confeitaria-success' : 'text-confeitaria-error';
  const ChangeIcon = change && change > 0 ? TrendingUp : TrendingDown;
  const changeSymbol = change && change > 0 ? '↗️' : '↘️';

  if (loading) {
    return (
      <div className={`metric-card ${isPrimary ? 'metric-card-primary' : ''} animate-pulse ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className={`h-8 bg-gray-200 rounded mb-3 ${isPrimary ? 'w-32' : 'w-24'}`}></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`metric-card ${isPrimary ? 'metric-card-primary' : ''} animate-fade-in ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="metric-label">{title}</p>
          <p className={`mt-2 ${isPrimary ? 'metric-value-large' : 'metric-value'}`}>{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-2 mt-3 ${changeColor}`}>
              <span className="text-lg">{changeSymbol}</span>
              <div className="flex items-center gap-1">
                <ChangeIcon className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  {Math.abs(change)}%
                </span>
              </div>
              <span className="text-xs text-gray-500">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${isPrimary ? 'bg-white bg-opacity-80' : 'bg-gray-50'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
