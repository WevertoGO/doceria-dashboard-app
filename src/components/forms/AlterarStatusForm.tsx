
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AlterarStatusFormProps {
  pedido: any;
  onSuccess: () => void;
}

const statusOptions = [
  { value: 'recebido', label: 'Recebido', color: 'bg-blue-500' },
  { value: 'producao', label: 'Em Produção', color: 'bg-yellow-500' },
  { value: 'pronto', label: 'Pronto', color: 'bg-green-500' },
  { value: 'retirado', label: 'Retirado', color: 'bg-gray-500' },
  { value: 'finalizado', label: 'Finalizado', color: 'bg-purple-500' },
];

export function AlterarStatusForm({ pedido, onSuccess }: AlterarStatusFormProps) {
  const [novoStatus, setNovoStatus] = useState(pedido.status);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pedido.status === 'finalizado') {
      toast({
        title: 'Erro',
        description: 'Pedidos finalizados não podem ter seu status alterado',
        variant: 'destructive',
      });
      return;
    }

    // Confirmar se quer finalizar antes da data de entrega
    if (novoStatus === 'finalizado' && pedido.data_entrega) {
      const hoje = new Date().toISOString().split('T')[0];
      const dataEntrega = pedido.data_entrega;
      
      if (dataEntrega > hoje) {
        const confirmar = window.confirm(
          `A data de entrega é ${new Date(dataEntrega).toLocaleDateString('pt-BR')}, que é posterior a hoje. Tem certeza que deseja finalizar o pedido agora?`
        );
        
        if (!confirmar) {
          return;
        }
      }
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('pedidos')
        .update({ status: novoStatus })
        .eq('id', pedido.id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `Status do pedido alterado para "${statusOptions.find(s => s.value === novoStatus)?.label}"!`,
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao alterar status:', error);
      
      if (error.message?.includes('finalizados não podem ser alterados')) {
        toast({
          title: 'Erro',
          description: 'Pedidos finalizados não podem ter seu status alterado.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível alterar o status do pedido.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Status Atual: <span className="font-semibold">{statusOptions.find(s => s.value === pedido.status)?.label}</span></Label>
      </div>

      <div>
        <Label htmlFor="status">Novo Status</Label>
        <div className="grid grid-cols-1 gap-2 mt-2">
          {statusOptions.map((status) => (
            <Button
              key={status.value}
              type="button"
              variant={novoStatus === status.value ? "default" : "outline"}
              className={novoStatus === status.value ? `${status.color} text-white` : ''}
              onClick={() => setNovoStatus(status.value)}
              disabled={pedido.status === 'finalizado'}
            >
              {status.label}
              {status.value === 'finalizado' && (
                <span className="ml-2 text-xs">(pode ser feito antes da data de entrega)</span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {novoStatus === 'finalizado' && pedido.data_entrega && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Atenção:</strong> Você está finalizando o pedido antes da data de entrega programada 
            ({new Date(pedido.data_entrega).toLocaleDateString('pt-BR')}). 
            Após finalizar, o pedido não poderá mais ser alterado.
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={loading || novoStatus === pedido.status || pedido.status === 'finalizado'}
        >
          {loading ? 'Salvando...' : 'Alterar Status'}
        </Button>
      </div>
    </form>
  );
}
