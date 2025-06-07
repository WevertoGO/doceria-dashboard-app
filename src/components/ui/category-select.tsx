
import { useState } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mock data das categorias (mesmo do arquivo anterior)
const categorias = [
  { id: 1, nome: 'Bolos', caminho: 'Bolos', nivel: 0 },
  { id: 2, nome: 'Tradicionais', caminho: 'Bolos > Tradicionais', nivel: 1 },
  { id: 3, nome: 'Chocolate', caminho: 'Bolos > Tradicionais > Chocolate', nivel: 2 },
  { id: 4, nome: 'Baunilha', caminho: 'Bolos > Tradicionais > Baunilha', nivel: 2 },
  { id: 5, nome: 'Especiais', caminho: 'Bolos > Especiais', nivel: 1 },
  { id: 6, nome: 'Docinhos', caminho: 'Docinhos', nivel: 0 },
  { id: 7, nome: 'Brigadeiros', caminho: 'Docinhos > Brigadeiros', nivel: 1 },
  { id: 8, nome: 'Beijinhos', caminho: 'Docinhos > Beijinhos', nivel: 1 },
];

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

  // Ensure value is always an array
  const normalizedValue = Array.isArray(value) ? value : [];
  
  const selectedCategories = categorias.filter(cat => normalizedValue.includes(cat.id));

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
          {open && (
            <Command>
              <CommandInput placeholder="Buscar categoria..." />
              <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
              <CommandGroup>
                {onNewCategory && (
                  <CommandItem onSelect={onNewCategory}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Categoria
                  </CommandItem>
                )}
                {categorias.map((categoria) => (
                  <CommandItem
                    key={categoria.id}
                    onSelect={() => handleSelect(categoria.id)}
                    className={cn("cursor-pointer", {
                      "pl-4": categoria.nivel === 1,
                      "pl-8": categoria.nivel === 2,
                    })}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        normalizedValue.includes(categoria.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div>
                      <div className="font-medium">{categoria.nome}</div>
                      <div className="text-xs text-gray-500">{categoria.caminho}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          )}
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
    </div>
  );
}
