
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Categoria {
  id: string;
  nome: string;
  parent_id: string | null;
  nivel: number;
  caminho: string;
  subcategorias: Categoria[];
}

interface CategorySelectListProps {
  categorias: Categoria[];
  normalizedValue: string[];
  loading: boolean;
  handleSelect: (categoriaId: string) => void;
  handleNewCategory: (categoriaPai?: Categoria) => void;
}

export function CategorySelectList({
  categorias, normalizedValue, loading, handleSelect, handleNewCategory
}: CategorySelectListProps) {
  return (
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
  );
}
