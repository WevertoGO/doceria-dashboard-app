import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditarClienteFormProps {
  clienteId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  observacoes: string;
}

export function EditarClienteForm({ clienteId, onSuccess, onCancel }: EditarClienteFormProps) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    carregarCliente();
  }, [clienteId]);

  const carregarCliente = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', clienteId)
        .single();

      if (error) throw error;
      setCliente(data);
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do cliente.',
        variant: 'destructive',
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('clientes')
        .update({
          nome: cliente.nome,
          telefone: cliente.telefone,
          email: cliente.email,
          endereco: cliente.endereco,
          observacoes: cliente.observacoes,
        })
        .eq('id', clienteId);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Cliente atualizado com sucesso!',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o cliente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (carregando) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!cliente) {
    return <div>Cliente não encontrado</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Completo *</Label>
        <Input
          id="nome"
          value={cliente.nome}
          onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
          placeholder="Nome do cliente"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            value={cliente.telefone || ''}
            onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={cliente.email || ''}
            onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
            placeholder="cliente@email.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="endereco">Endereço</Label>
        <Input
          id="endereco"
          value={cliente.endereco || ''}
          onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })}
          placeholder="Endereço completo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={cliente.observacoes || ''}
          onChange={(e) => setCliente({ ...cliente, observacoes: e.target.value })}
          placeholder="Observações sobre o cliente..."
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}