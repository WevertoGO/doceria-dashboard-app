
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface NovoProdutoFormProps {
  onSuccess: () => void;
}

export function NovoProdutoForm({ onSuccess }: NovoProdutoFormProps) {
  const [produto, setProduto] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    valor: '',
    unidade: 'unid'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!produto.nome.trim()) {
      toast.error('Nome do produto é obrigatório');
      return;
    }

    if (!produto.valor || parseFloat(produto.valor) <= 0) {
      toast.error('Valor deve ser maior que zero');
      return;
    }

    toast.success('Produto adicionado com sucesso!');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome do Produto *</Label>
          <Input
            id="nome"
            value={produto.nome}
            onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
            placeholder="Ex: Bolo de Chocolate"
            required
          />
        </div>
        <div>
          <Label htmlFor="categoria">Categoria</Label>
          <Input
            id="categoria"
            value={produto.categoria}
            onChange={(e) => setProduto({ ...produto, categoria: e.target.value })}
            placeholder="Ex: Bolos"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={produto.descricao}
          onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
          placeholder="Descreva o produto..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="valor">Valor *</Label>
          <Input
            id="valor"
            type="number"
            step="0.01"
            value={produto.valor}
            onChange={(e) => setProduto({ ...produto, valor: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <Label htmlFor="unidade">Unidade de Venda</Label>
          <select
            id="unidade"
            value={produto.unidade}
            onChange={(e) => setProduto({ ...produto, unidade: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="unid">Unidade</option>
            <option value="kg">Quilograma</option>
            <option value="g">Grama</option>
            <option value="cento">Cento</option>
            <option value="dz">Dúzia</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="imagem">Imagem do Produto</Label>
        <Input
          id="imagem"
          type="file"
          accept="image/*"
          className="cursor-pointer"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-green-500 hover:bg-green-600">
          Salvar Produto
        </Button>
      </div>
    </form>
  );
}
