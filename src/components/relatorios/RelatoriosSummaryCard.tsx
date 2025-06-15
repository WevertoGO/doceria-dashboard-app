
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Package } from 'lucide-react';

const iconsMap = {
  vendas: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
  clientes: <Users className="h-4 w-4 text-muted-foreground" />,
  ticket: <DollarSign className="h-4 w-4 text-muted-foreground" />,
  produtos: <Package className="h-4 w-4 text-muted-foreground" />,
};

interface SummaryCardProps {
  type: 'vendas' | 'clientes' | 'ticket' | 'produtos';
  title: string;
  value: React.ReactNode;
  description: React.ReactNode;
  loading: boolean;
}

export function RelatoriosSummaryCard({ type, title, value, description, loading }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {iconsMap[type]}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {loading
            ? (<div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>)
            : description}
        </p>
      </CardContent>
    </Card>
  );
}
