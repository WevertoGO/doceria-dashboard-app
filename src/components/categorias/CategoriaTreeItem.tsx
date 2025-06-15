
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, FolderOpen, Folder } from 'lucide-react';

interface CategoriaTreeItemProps {
  categoria: any;
  nivel: number;
  onEdit: (categoria: any) => void;
  onDelete: (categoria: any) => void;
  onAddSubcategoria: (categoriaPai: any) => void;
}

export function CategoriaTreeItem({
  categoria,
  nivel,
  onEdit,
  onDelete,
  onAddSubcategoria,
}: CategoriaTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasSubcategorias = categoria.subcategorias && categoria.subcategorias.length > 0;

  return (
    <div className="w-full">
      <div 
        className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg group"
        style={{ paddingLeft: `${12 + (nivel * 24)}px` }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-4 h-4 flex items-center justify-center text-gray-400"
        >
          {hasSubcategorias ? (
            isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
          ) : (
            <div className="w-3 h-3" />
          )}
        </button>
        <div className="text-gray-400">
          {hasSubcategorias ? (
            isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />
          ) : (
            <Folder className="h-4 w-4" />
          )}
        </div>
        <span className="flex-1 font-medium text-gray-900">{categoria.nome}</span>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {categoria.produtosCount} produtos
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAddSubcategoria(categoria)}
            className="h-7 w-7 p-0"
            title="Adicionar subcategoria"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(categoria)}
            className="h-7 w-7 p-0"
            title="Editar categoria"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(categoria)}
            className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
            title="Excluir categoria"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {hasSubcategorias && isExpanded && (
        <div>
          {categoria.subcategorias.map((subcategoria: any) => (
            <CategoriaTreeItem
              key={subcategoria.id}
              categoria={subcategoria}
              nivel={nivel + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubcategoria={onAddSubcategoria}
            />
          ))}
        </div>
      )}
    </div>
  );
}
