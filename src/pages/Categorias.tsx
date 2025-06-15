
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

      // Contar produtos por categoria
      const categoriasComContador = await Promise.all(
        (data || []).map(async (categoria) => {
          const { count } = await supabase
            .from('produtos')
            .select('*', { count: 'exact', head: true })
            .eq('categoria_id', categoria.id)
            .eq('ativo', true);

          return {
            ...categoria,
            produtosCount: count || 0,
            nivel: 0,
            subcategorias: [],
          };
        })
      );

      setCategorias(categoriasComContador);
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

  const handleEdit = (categoria: any) => {
    setCategoriaParaEditar(categoria);
    setIsEditarCategoriaOpen(true);
  };

  const handleDelete = async (categoria: any) => {
    const confirm = window.confirm(
      `Deseja realmente excluir a categoria "${categoria.nome}"?\n\nATENÇÃO: Todas as subcategorias desse nível e inferiores serão excluídas também! Esta ação não pode ser desfeita.`
    );

    if (!confirm) return;

    try {
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', categoria.id);

      if (error) throw error;

      toast({
        title: "Categoria excluída",
        description: "A categoria e todas as suas subcategorias foram excluídas com sucesso.",
        variant: "default",
      });

      carregarCategorias();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a categoria. Verifique se não há produtos vinculados.",
        variant: "destructive",
      });
      console.error("Erro ao excluir categoria:", error);
    }
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
              <CategoriaTree
                categorias={categorias}
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
