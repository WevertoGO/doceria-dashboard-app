
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface EditarCategoriaFormProps {
  categoria: any;
  onSuccess: () => void;
}

export function EditarCategoriaForm({ categoria, onSuccess }: EditarCategoriaFormProps) {
  const [nome, setNome] = useState(categoria.nome);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast.error('Nome da categoria é obrigatório');
      return;
    }

    toast.success(`Categoria atualizada com sucesso!`);
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

      <div>
        <Label>Produtos Vinculados</Label>
        <div className="p-3 bg-yellow-50 rounded-md text-sm text-yellow-700">
          Esta categoria possui {categoria.produtosCount} produtos vinculados
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
}
