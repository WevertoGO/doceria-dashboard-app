
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
  value?: number[];
  onChange: (value: number[]) => void;
  placeholder?: string;
  multiple?: boolean;
  onNewCategory?: () => void;
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
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaPai, setCategoriaPai] = useState<any>(null);
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

  const organizarCategorias = (categorias: any[]) => {
    const categoriasComNivel = categorias.map(categoria => {
      const nivel = calcularNivel(categoria, categorias);
      const caminho = construirCaminho(categoria, categorias);
      return {
        ...categoria,
        nivel,
        caminho
      };
    });

    return categoriasComNivel.sort((a, b) => a.caminho.localeCompare(b.caminho));
  };

  const calcularNivel = (categoria: any, categorias: any[], nivel = 0): number => {
    if (!categoria.parent_id) return nivel;
    const pai = categorias.find(c => c.id === categoria.parent_id);
    return pai ? calcularNivel(pai, categorias, nivel + 1) : nivel;
  };

  const construirCaminho = (categoria: any, categorias: any[]): string => {
    if (!categoria.parent_id) return categoria.nome;
    const pai = categorias.find(c => c.id === categoria.parent_id);
    return pai ? `${construirCaminho(pai, categorias)} > ${categoria.nome}` : categoria.nome;
  };
  
  const selectedCategories = useMemo(() => 
    categorias.filter(cat => normalizedValue.includes(cat.id)), 
    [normalizedValue, categorias]
  );

  const handleSelect = (categoriaId: number) => {
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

  const removeCategory = (categoriaId: number) => {
    onChange(normalizedValue.filter(id => id !== categoriaId));
  };

  const handleNewCategory = (categoriaPai?: any) => {
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
                        <div className="text-xs text-gray-500">{categoria.caminho}</div>
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
