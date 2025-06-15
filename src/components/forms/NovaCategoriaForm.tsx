
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NovaCategoriaFormProps {
  categoriaPai?: any;
  onSuccess: () => void;
}

export function NovaCategoriaForm({ categoriaPai, onSuccess }: NovaCategoriaFormProps) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getCaminhoCompleto = () => {
    if (!categoriaPai) return nome;
    return `${categoriaPai.nome} > ${nome}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome da categoria é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      console.log('Criando categoria com dados:', {
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        parent_id: categoriaPai?.id || null
      });

      const { error } = await supabase
        .from('categorias')
        .insert({
          nome: nome.trim(),
          descricao: descricao.trim() || null,
          parent_id: categoriaPai?.id || null
        });

      if (error) throw error;

      const tipoCategoria = categoriaPai ? 'subcategoria' : 'categoria';
      toast({
        title: 'Sucesso',
        description: `${tipoCategoria.charAt(0).toUpperCase() + tipoCategoria.slice(1)} "${nome}" criada com sucesso!`,
      });
      
      // Limpar o formulário
      setNome('');
      setDescricao('');
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a categoria.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição da categoria (opcional)"
          rows={3}
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
        <Button type="button" variant="outline" onClick={onSuccess} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled={loading}>
          {loading ? 'Criando...' : categoriaPai ? 'Criar Subcategoria' : 'Criar Categoria'}
        </Button>
      </div>
    </form>
  );
}
