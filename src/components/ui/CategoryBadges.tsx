
import { Badge } from "@/components/ui/badge";
import React from "react";

interface Categoria {
  id: string;
  caminho: string;
}

interface CategoryBadgesProps {
  selectedCategories: Categoria[];
  removeCategory: (categoriaId: string) => void;
}

export function CategoryBadges({ selectedCategories, removeCategory }: CategoryBadgesProps) {
  if (!selectedCategories.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {selectedCategories.map((categoria) => (
        <Badge key={categoria.id} variant="secondary" className="flex items-center gap-1">
          {categoria.caminho}
          <button
            onClick={() => removeCategory(categoria.id)}
            className="ml-1 text-gray-500 hover:text-gray-700"
            aria-label={`Remover ${categoria.caminho}`}
          >
            ×
          </button>
        </Badge>
      ))}
    </div>
  );
}
