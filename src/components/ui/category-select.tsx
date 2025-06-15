
import { useState, useMemo, useEffect } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NovaCategoriaForm } from '@/components/forms/NovaCategoriaForm';
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

  // Ensure value is always an array and handle undefined/null cases
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

      // Organizar categorias hierarquicamente
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

    // Primeiro, criar o mapa de todas as categorias
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

    // Retornar lista plana para o select (ordenada por caminho)
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
    setIsNewCategoryOpen(false);
    setCategoriaPai(null);
    carregarCategorias();
    if (onNewCategory) {
      onNewCategory();
    }
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
          <Command>
            <CommandInput placeholder="Buscar categoria..." />
            <CommandList>
              <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
              <CommandGroup>
                <CommandItem 
                  key="new-category"
                  onSelect={() => handleNewCategory()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Categoria Principal
                </CommandItem>
                {!loading && categorias.map((categoria) => (
                  <div key={categoria.id}>
                    <CommandItem
                      value={categoria.nome}
                      onSelect={() => handleSelect(categoria.id)}
                      className={cn("cursor-pointer", {
                        "pl-4": categoria.nivel === 1,
                        "pl-8": categoria.nivel === 2,
                        "pl-12": categoria.nivel >= 3,
                      })}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          normalizedValue.includes(categoria.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{categoria.nome}</div>
                        {categoria.nivel > 0 && (
                          <div className="text-xs text-gray-500">{categoria.caminho}</div>
                        )}
                      </div>
                    </CommandItem>
                    <CommandItem
                      key={`sub-${categoria.id}`}
                      onSelect={() => handleNewCategory(categoria)}
                      className={cn("cursor-pointer text-blue-600 hover:text-blue-700", {
                        "pl-6": categoria.nivel === 0,
                        "pl-10": categoria.nivel === 1,
                        "pl-14": categoria.nivel === 2,
                        "pl-18": categoria.nivel >= 3,
                      })}
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      <span className="text-xs">Adicionar subcategoria</span>
                    </CommandItem>
                  </div>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Badges das categorias selecionadas */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((categoria) => (
            <Badge key={categoria.id} variant="secondary" className="flex items-center gap-1">
              {categoria.caminho}
              <button
                onClick={() => removeCategory(categoria.id)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Modal para nova categoria */}
      <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {categoriaPai ? `Adicionar Subcategoria em "${categoriaPai.nome}"` : 'Nova Categoria'}
            </DialogTitle>
          </DialogHeader>
          <NovaCategoriaForm 
            categoriaPai={categoriaPai}
            onSuccess={handleCategorySuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
