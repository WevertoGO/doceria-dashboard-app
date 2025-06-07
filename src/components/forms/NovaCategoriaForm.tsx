
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface NovaCategoriaFormProps {
  categoriaPai?: any;
  onSuccess: () => void;
}

export function NovaCategoriaForm({ categoriaPai, onSuccess }: NovaCategoriaFormProps) {
  const [nome, setNome] = useState('');

  const getCaminhoCompleto = () => {
    if (!categoriaPai) return nome;
    // Aqui você construiria o caminho completo baseado na hierarquia
    return `${categoriaPai.nome} > ${nome}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast.error('Nome da categoria é obrigatório');
      return;
    }

    // TODO: Implementar validação de nomes duplicados no mesmo nível
    
    toast.success(`Categoria "${nome}" criada com sucesso!`);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome da Categoria *</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome da categoria"
          required
        />
      </div>

      {categoriaPai && (
        <div>
          <Label>Categoria Pai</Label>
          <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
            {categoriaPai.nome}
          </div>
        </div>
      )}

      {nome && (
        <div>
          <Label>Preview do Caminho</Label>
          <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700">
            {getCaminhoCompleto()}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-green-500 hover:bg-green-600">
          Criar Categoria
        </Button>
      </div>
    </form>
  );
}
