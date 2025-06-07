
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  className?: string;
}

export function MetricCard({ title, value, change, icon, className = '' }: MetricCardProps) {
  const changeColor = change && change > 0 ? 'text-green-600' : 'text-red-600';
  const ChangeIcon = change && change > 0 ? TrendingUp : TrendingDown;

  return (
    <div className={`metric-card animate-fade-in ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="metric-label">{title}</p>
          <p className="metric-value mt-2">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 ${changeColor}`}>
              <ChangeIcon className="h-3 w-3" />
              <span className="metric-change">
                {Math.abs(change)}% vs período anterior
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-rose-50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}
