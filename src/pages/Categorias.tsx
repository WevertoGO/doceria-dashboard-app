import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NovaCategoriaForm } from '@/components/forms/NovaCategoriaForm';
import { EditarCategoriaForm } from '@/components/forms/EditarCategoriaForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CategoriaTree } from '@/components/categorias/CategoriaTree';

const Categorias = () => {
  const [isNovaCategoriaOpen, setIsNovaCategoriaOpen] = useState(false);
  const [isEditarCategoriaOpen, setIsEditarCategoriaOpen] = useState(false);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState<any>(null);
  const [categoriaPai, setCategoriaPai] = useState<any>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

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

      // Organizar categorias hierarquicamente corretamente!
      // 1 - criar um mapa de categorias
      const categoriaMap = new Map();
      (data || []).forEach(cat => {
        categoriaMap.set(cat.id, { ...cat, subcategorias: [] });
      });

      // 2 - montar árvore
      const categoriasRaiz: any[] = [];
      categoriaMap.forEach(cat => {
        if (cat.parent_id) {
          const pai = categoriaMap.get(cat.parent_id);
          if (pai) {
            cat.nivel = pai.nivel !== undefined ? pai.nivel + 1 : 1;
            pai.subcategorias.push(cat);
          }
        } else {
          cat.nivel = 0;
          categoriasRaiz.push(cat);
        }
      });

      setCategorias(categoriasRaiz);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as categorias.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularNivel = (categoria: any, categoriaMap: Map<string, any>): number => {
    if (!categoria.parent_id) return 0;
    const pai = categoriaMap.get(categoria.parent_id);
    return pai ? calcularNivel(pai, categoriaMap) + 1 : 0;
  };

  const handleEdit = (categoria: any) => {
    setCategoriaParaEditar(categoria);
    setIsEditarCategoriaOpen(true);
  };

  const handleDelete = async (categoria: any) => {
    try {
      const { data: resultado, error } = await supabase
        .rpc('soft_delete_categoria', { categoria_uuid: categoria.id });

      if (error) throw error;

      switch (resultado) {
        case 'PRODUTOS_VINCULADOS':
          toast({
            title: "Não é possível excluir",
            description: "Esta categoria possui produtos ativos vinculados.",
            variant: "destructive",
          });
          break;
        case 'SUBCATEGORIAS_VINCULADAS':
          toast({
            title: "Não é possível excluir",
            description: "Esta categoria possui subcategorias. Exclua primeiro as subcategorias.",
            variant: "destructive",
          });
          break;
        case 'PEDIDOS_VINCULADOS':
          toast({
            title: "Não é possível excluir",
            description: "Esta categoria está vinculada a pedidos existentes.",
            variant: "destructive",
          });
          break;
        case 'DELETADO':
          toast({
            title: "Categoria excluída",
            description: "A categoria foi excluída com sucesso.",
            variant: "default",
          });
          carregarCategorias();
          break;
        default:
          toast({
            title: "Erro inesperado",
            description: "Ocorreu um erro ao excluir a categoria.",
            variant: "destructive",
          });
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a categoria.",
        variant: "destructive",
      });
    }
  };

  const handleAddSubcategoria = (categoriaPai: any) => {
    setCategoriaPai(categoriaPai);
    setIsNovaCategoriaOpen(true);
  };

  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                      carregarCategorias();
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Árvore de Categorias */}
            <div className="section-card">
              <CategoriaTree
                categorias={categoriasFiltradas}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddSubcategoria={handleAddSubcategoria}
                loading={loading}
              />
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
                    carregarCategorias();
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
