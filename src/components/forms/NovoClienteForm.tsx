
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NovoClienteFormProps {
  onSuccess: () => void;
}

export function NovoClienteForm({ onSuccess }: NovoClienteFormProps) {
  const [nome, setNome] = useState('');
  const [telefones, setTelefones] = useState(['']);
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const adicionarTelefone = () => {
    setTelefones([...telefones, '']);
  };

  const removerTelefone = (index: number) => {
    setTelefones(telefones.filter((_, i) => i !== index));
  };

  const atualizarTelefone = (index: number, valor: string) => {
    // Remove todos os caracteres não numéricos
    const apenasNumeros = valor.replace(/\D/g, '');
    
    let telefoneFormatado = '';
    
    if (apenasNumeros.length <= 2) {
      telefoneFormatado = apenasNumeros;
    } else if (apenasNumeros.length <= 3) {
      telefoneFormatado = `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
    } else if (apenasNumeros.length <= 7) {
      telefoneFormatado = `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
    } else if (apenasNumeros.length <= 10) {
      telefoneFormatado = `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 6)}-${apenasNumeros.slice(6)}`;
    } else {
      telefoneFormatado = `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
    }

    const novosTelefones = [...telefones];
    novosTelefones[index] = telefoneFormatado;
    setTelefones(novosTelefones);
  };

  const validarTelefone = (telefone: string) => {
    // Valida formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    const regexTelefone = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return regexTelefone.test(telefone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (!telefones[0].trim()) {
      toast({
        title: 'Erro',
        description: 'Pelo menos um telefone é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    if (!validarTelefone(telefones[0])) {
      toast({
        title: 'Erro',
        description: 'Formato de telefone inválido. Use: (11) 99999-9999',
        variant: 'destructive',
      });
      return;
    }

    // Validar telefones adicionais se preenchidos
    for (let i = 1; i < telefones.length; i++) {
      if (telefones[i].trim() && !validarTelefone(telefones[i])) {
        toast({
          title: 'Erro',
          description: `Telefone ${i + 1} com formato inválido. Use: (11) 99999-9999`,
          variant: 'destructive',
        });
        return;
      }
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('clientes')
        .insert({
          nome: nome.trim(),
          telefone: telefones[0].trim(),
          email: email.trim() || null,
          endereco: endereco.trim() || null,
          observacoes: observacoes.trim() || null,
        });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Cliente cadastrado com sucesso!',
      });
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o cliente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome do Cliente *</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome completo"
          required
        />
      </div>

      <div className="space-y-3">
        <Label>Telefones</Label>
        {telefones.map((telefone, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={telefone}
              onChange={(e) => atualizarTelefone(index, e.target.value)}
              placeholder="(11) 99999-9999"
              className="flex-1"
              required={index === 0}
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={adicionarTelefone}
            >
              <Plus className="h-3 w-3" />
            </Button>
            {telefones.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => removerTelefone(index)}
              >
                <Minus className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="cliente@email.com"
        />
      </div>

      <div>
        <Label htmlFor="endereco">Endereço</Label>
        <Input
          id="endereco"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Endereço completo"
        />
      </div>

      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Observações sobre o cliente..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Cliente'}
        </Button>
      </div>
    </form>
  );
}
