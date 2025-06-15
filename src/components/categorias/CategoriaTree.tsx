
import { CategoriaTreeItem } from './CategoriaTreeItem';

interface CategoriaTreeProps {
  categorias: any[];
  onEdit: (categoria: any) => void;
  onDelete: (categoria: any) => void;
  onAddSubcategoria: (categoriaPai: any) => void;
  loading: boolean;
}

export function CategoriaTree({
  categorias,
  onEdit,
  onDelete,
  onAddSubcategoria,
  loading,
}: CategoriaTreeProps) {
  return (
    <div className="space-y-1">
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))
      ) : categorias.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma categoria encontrada</p>
        </div>
      ) : (
        categorias.map((categoria) => (
          <CategoriaTreeItem
            key={categoria.id}
            categoria={categoria}
            nivel={0}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddSubcategoria={onAddSubcategoria}
          />
        ))
      )}
    </div>
  );
}
