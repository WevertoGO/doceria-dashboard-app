
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface NovoClienteFormProps {
  onSuccess: () => void;
}

export function NovoClienteForm({ onSuccess }: NovoClienteFormProps) {
  const [nome, setNome] = useState('');
  const [telefones, setTelefones] = useState(['']);

  const adicionarTelefone = () => {
    setTelefones([...telefones, '']);
  };

  const removerTelefone = (index: number) => {
    setTelefones(telefones.filter((_, i) => i !== index));
  };

  const atualizarTelefone = (index: number, valor: string) => {
    const novosTelefones = [...telefones];
    novosTelefones[index] = valor;
    setTelefones(novosTelefones);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (!telefones[0].trim()) {
      toast.error('Pelo menos um telefone é obrigatório');
      return;
    }

    toast.success('Cliente cadastrado com sucesso!');
    onSuccess();
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

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          Salvar Cliente
        </Button>
      </div>
    </form>
  );
}
