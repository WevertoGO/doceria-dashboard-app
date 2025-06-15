
import { useState, useMemo, useEffect } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CategorySelectList } from './CategorySelectList';
import { CategoryBadges } from './CategoryBadges';
import { NewCategoryDialog } from './NewCategoryDialog';
import { supabase } from '@/integrations/supabase/client';

import { cn } from '@/lib/utils';

interface CategorySelectProps {
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  onNewCategory?: () => void;
}

interface Categoria {
  id: string;
  nome: string;
  parent_id: string | null;
  nivel: number;
  caminho: string;
  subcategorias: Categoria[];
}

export function CategorySelect({ 
  value = [], 
  onChange, 
  placeholder = "Selecionar categorias...",
  multiple = true,
  onNewCategory 
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaPai, setCategoriaPai] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizedValue = Array.isArray(value) ? value : [];

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nome');

      if (error) throw error;

      const categoriasOrganizadas = organizarCategorias(data || []);
      setCategorias(categoriasOrganizadas);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const organizarCategorias = (categorias: any[]): Categoria[] => {
    const categoriaMap = new Map<string, Categoria>();
    const categoriasRaiz: Categoria[] = [];

    // Primeiro, criar todas as categorias no mapa
    categorias.forEach(cat => {
      categoriaMap.set(cat.id, {
        ...cat,
        nivel: 0,
        caminho: cat.nome,
        subcategorias: []
      });
    });

    // Depois, organizar a hierarquia
    categorias.forEach(cat => {
      const categoria = categoriaMap.get(cat.id)!;
      if (cat.parent_id) {
        const pai = categoriaMap.get(cat.parent_id);
        if (pai) {
          categoria.nivel = calcularNivel(categoria, categoriaMap);
          categoria.caminho = construirCaminho(categoria, categoriaMap);
          pai.subcategorias.push(categoria);
        }
      } else {
        categoriasRaiz.push(categoria);
      }
    });

    // Converter para lista plana para exibição
    const listaPlana: Categoria[] = [];
    const adicionarRecursivo = (cats: Categoria[]) => {
      cats.sort((a, b) => a.nome.localeCompare(b.nome));
      cats.forEach(cat => {
        listaPlana.push(cat);
        adicionarRecursivo(cat.subcategorias);
      });
    };

    adicionarRecursivo(categoriasRaiz);
    return listaPlana;
  };

  const calcularNivel = (categoria: Categoria, categoriaMap: Map<string, Categoria>): number => {
    if (!categoria.parent_id) return 0;
    const pai = categoriaMap.get(categoria.parent_id);
    return pai ? calcularNivel(pai, categoriaMap) + 1 : 0;
  };

  const construirCaminho = (categoria: Categoria, categoriaMap: Map<string, Categoria>): string => {
    if (!categoria.parent_id) return categoria.nome;
    const pai = categoriaMap.get(categoria.parent_id);
    return pai ? `${construirCaminho(pai, categoriaMap)} > ${categoria.nome}` : categoria.nome;
  };
  
  const selectedCategories = useMemo(() => 
    categorias.filter(cat => normalizedValue.includes(cat.id)), 
    [normalizedValue, categorias]
  );

  const handleSelect = (categoriaId: string) => {
    if (multiple) {
      const newValue = normalizedValue.includes(categoriaId)
        ? normalizedValue.filter(id => id !== categoriaId)
        : [...normalizedValue, categoriaId];
      onChange(newValue);
    } else {
      onChange([categoriaId]);
      setOpen(false);
    }
  };

  const removeCategory = (categoriaId: string) => {
    onChange(normalizedValue.filter(id => id !== categoriaId));
  };

  const handleNewCategory = (categoriaPai?: Categoria) => {
    setCategoriaPai(categoriaPai || null);
    setIsNewCategoryOpen(true);
    setOpen(false);
  };

  const handleCategorySuccess = () => {
    carregarCategorias();
    if (onNewCategory) onNewCategory();
    setIsNewCategoryOpen(false);
    setCategoriaPai(null);
  };

  const handleAddAnother = () => {
    setIsNewCategoryOpen(true);
  };

  const handleDialogClose = () => {
    setIsNewCategoryOpen(false);
    setCategoriaPai(null);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCategories.length === 0 ? placeholder : `${selectedCategories.length} categoria(s) selecionada(s)`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <CategorySelectList 
            categorias={categorias}
            normalizedValue={normalizedValue}
            loading={loading}
            handleSelect={handleSelect}
            handleNewCategory={handleNewCategory}
          />
        </PopoverContent>
      </Popover>

      <CategoryBadges selectedCategories={selectedCategories} removeCategory={removeCategory} />

      <NewCategoryDialog
        open={isNewCategoryOpen}
        onOpenChange={setIsNewCategoryOpen}
        categoriaPai={categoriaPai}
        keepCreatingSub={!!categoriaPai}
        onSuccess={handleCategorySuccess}
        onAddAnother={handleAddAnother}
        onClose={handleDialogClose}
      />
    </div>
  );
}
