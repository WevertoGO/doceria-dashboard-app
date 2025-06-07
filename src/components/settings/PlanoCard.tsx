
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Plano {
  id: string;
  nome: string;
  badge: string;
  badgeColor: string;
  preco: number;
  periodo: string;
  precoAnual?: number;
  precoRiscado?: number;
  economia?: number;
  recursos: string[];
  destaque: boolean;
}

interface PlanoCardProps {
  plano: Plano;
  onSelect: () => void;
}

export function PlanoCard({ plano, onSelect }: PlanoCardProps) {
  const isAnual = plano.id === 'anual';
  
  return (
    <Card className={cn(
      "relative transition-all duration-200 hover:shadow-lg",
      plano.destaque ? "border-2 border-blue-200 shadow-md" : "border border-gray-200"
    )}>
      {plano.badge && (
        <div className="absolute -top-3 left-4 z-10">
          <Badge className={cn("text-white font-semibold px-3 py-1", plano.badgeColor)}>
            {plano.id === 'anual' && <Star className="w-3 h-3 mr-1" />}
            {plano.badge}
          </Badge>
        </div>
      )}
      
      <CardContent className="p-6 pt-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Plano {plano.nome}</h3>
          
          <div className="mb-4">
            {isAnual && plano.precoRiscado && (
              <p className="text-sm text-gray-500 line-through">
                R$ {plano.precoRiscado.toFixed(2).replace('.', ',')}/ano
              </p>
            )}
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold text-gray-900">
                R$ {plano.preco.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-gray-600">/{plano.periodo}</span>
            </div>
            {isAnual && plano.precoAnual && (
              <p className="text-sm text-gray-600 mt-1">
                R$ {plano.precoAnual.toFixed(2).replace('.', ',')}/ano
              </p>
            )}
            {isAnual && plano.economia && (
              <p className="text-sm text-green-600 font-semibold mt-2">
                Economize R$ {plano.economia.toFixed(2).replace('.', ',')} por ano
              </p>
            )}
          </div>
        </div>

        <ul className="space-y-3 mb-6">
          {plano.recursos.map((recurso, index) => (
            <li key={index} className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">{recurso}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={onSelect}
          className={cn(
            "w-full font-semibold py-2",
            plano.destaque 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-green-600 hover:bg-green-700 text-white"
          )}
        >
          Escolher {plano.nome}
        </Button>
      </CardContent>
    </Card>
  );
}
