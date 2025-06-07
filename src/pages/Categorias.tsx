
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, ChevronRight, ChevronDown, FolderOpen, Folder } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NovaCategoriaForm } from '@/components/forms/NovaCategoriaForm';
import { EditarCategoriaForm } from '@/components/forms/EditarCategoriaForm';

// Mock data - estrutura hierárquica de categorias
const categorias = [
  {
    id: 1,
    nome: 'Bolos',
    nivel: 0,
    categoriaPaiId: null,
    ativo: true,
    produtosCount: 15,
    subcategorias: [
      {
        id: 2,
        nome: 'Tradicionais',
        nivel: 1,
        categoriaPaiId: 1,
        ativo: true,
        produtosCount: 8,
        subcategorias: [
          {
            id: 3,
            nome: 'Chocolate',
            nivel: 2,
            categoriaPaiId: 2,
            ativo: true,
            produtosCount: 3,
            subcategorias: []
          },
          {
            id: 4,
            nome: 'Baunilha',
            nivel: 2,
            categoriaPaiId: 2,
            ativo: true,
            produtosCount: 2,
            subcategorias: []
          }
        ]
      },
      {
        id: 5,
        nome: 'Especiais',
        nivel: 1,
        categoriaPaiId: 1,
        ativo: true,
        produtosCount: 7,
        subcategorias: []
      }
    ]
  },
  {
    id: 6,
    nome: 'Docinhos',
    nivel: 0,
    categoriaPaiId: null,
    ativo: true,
    produtosCount: 25,
    subcategorias: [
      {
        id: 7,
        nome: 'Brigadeiros',
        nivel: 1,
        categoriaPaiId: 6,
        ativo: true,
        produtosCount: 12,
        subcategorias: []
      },
      {
        id: 8,
        nome: 'Beijinhos',
        nivel: 1,
        categoriaPaiId: 6,
        ativo: true,
        produtosCount: 8,
        subcategorias: []
      }
    ]
  }
];

interface CategoriaTreeItemProps {
  categoria: any;
  nivel: number;
  onEdit: (categoria: any) => void;
  onDelete: (categoria: any) => void;
  onAddSubcategoria: (categoriaPai: any) => void;
}

function CategoriaTreeItem({ categoria, nivel, onEdit, onDelete, onAddSubcategoria }: CategoriaTreeItemProps) {
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
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(categoria)}
            className="h-7 w-7 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(categoria)}
            className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
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

const Categorias = () => {
  const [isNovaCategoriaOpen, setIsNovaCategoriaOpen] = useState(false);
  const [isEditarCategoriaOpen, setIsEditarCategoriaOpen] = useState(false);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState<any>(null);
  const [categoriaPai, setCategoriaPai] = useState<any>(null);

  const handleEdit = (categoria: any) => {
    setCategoriaParaEditar(categoria);
    setIsEditarCategoriaOpen(true);
  };

  const handleDelete = (categoria: any) => {
    // TODO: Implementar confirmação de exclusão
    console.log('Excluir categoria:', categoria);
  };

  const handleAddSubcategoria = (categoriaPai: any) => {
    setCategoriaPai(categoriaPai);
    setIsNovaCategoriaOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-bakery-soft">
        <AppSidebar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">Gestão de Categorias</h1>
                <p className="text-gray-600 mt-1">Organize os produtos em categorias hierárquicas</p>
              </div>
              <Dialog open={isNovaCategoriaOpen} onOpenChange={(open) => {
                setIsNovaCategoriaOpen(open);
                if (!open) setCategoriaPai(null);
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {categoriaPai ? `Adicionar Subcategoria em "${categoriaPai.nome}"` : 'Nova Categoria'}
                    </DialogTitle>
                  </DialogHeader>
                  <NovaCategoriaForm 
                    categoriaPai={categoriaPai}
                    onSuccess={() => {
                      setIsNovaCategoriaOpen(false);
                      setCategoriaPai(null);
                    }} 
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Filtros */}
            <div className="section-card mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar categorias..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline">Expandir Todas</Button>
                <Button variant="outline">Recolher Todas</Button>
              </div>
            </div>

            {/* Árvore de Categorias */}
            <div className="section-card">
              <div className="space-y-1">
                {categorias.map((categoria) => (
                  <CategoriaTreeItem
                    key={categoria.id}
                    categoria={categoria}
                    nivel={0}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddSubcategoria={handleAddSubcategoria}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Modal Editar Categoria */}
          <Dialog open={isEditarCategoriaOpen} onOpenChange={setIsEditarCategoriaOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Categoria</DialogTitle>
              </DialogHeader>
              {categoriaParaEditar && (
                <EditarCategoriaForm 
                  categoria={categoriaParaEditar}
                  onSuccess={() => {
                    setIsEditarCategoriaOpen(false);
                    setCategoriaParaEditar(null);
                  }} 
                />
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Categorias;
