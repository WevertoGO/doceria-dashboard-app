
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditarPedidoFormProps {
  pedido: any;
  onSuccess: () => void;
}

export function EditarPedidoForm({ pedido, onSuccess }: EditarPedidoFormProps) {
  const [formData, setFormData] = useState({
    data_entrega: '',
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (pedido) {
      setFormData({
        data_entrega: pedido.data_entrega || '',
        observacoes: pedido.observacoes || ''
      });
    }
  }, [pedido]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pedido.status === 'finalizado') {
      toast({
        title: 'Erro',
        description: 'Pedidos finalizados não podem ser editados',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.data_entrega) {
      toast({
        title: 'Erro',
        description: 'Data de entrega é obrigatória',
        variant: 'destructive',
      });
      return;
    }

    // Validar se a data não é no passado
    const hoje = new Date().toISOString().split('T')[0];
    if (formData.data_entrega < hoje) {
      toast({
        title: 'Erro',
        description: 'Data de entrega não pode ser no passado',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('pedidos')
        .update({
          data_entrega: formData.data_entrega,
          observacoes: formData.observacoes.trim() || null
        })
        .eq('id', pedido.id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Pedido atualizado com sucesso!',
      });
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao editar pedido:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o pedido.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const hoje = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cliente">Cliente</Label>
        <Input
          value={pedido.cliente || 'Cliente não encontrado'}
          disabled
          className="bg-gray-100"
        />
      </div>

      <div>
        <Label htmlFor="valor_total">Valor Total</Label>
        <Input
          value={`R$ ${Number(pedido.valor_total).toFixed(2)}`}
          disabled
          className="bg-gray-100"
        />
      </div>

      <div>
        <Label htmlFor="data_entrega">Data de Entrega *</Label>
        <Input
          id="data_entrega"
          type="date"
          value={formData.data_entrega}
          onChange={(e) => setFormData({ ...formData, data_entrega: e.target.value })}
          min={hoje}
          required
          disabled={pedido.status === 'finalizado'}
        />
      </div>

      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
          placeholder="Observações sobre o pedido..."
          rows={3}
          disabled={pedido.status === 'finalizado'}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={loading || pedido.status === 'finalizado'}
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}
