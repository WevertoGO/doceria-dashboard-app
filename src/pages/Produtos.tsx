
import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { NovoProdutoForm } from '@/components/forms/NovoProdutoForm';
import { EditarProdutoForm } from '@/components/forms/EditarProdutoForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Produtos = () => {
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      console.log('Carregando produtos...');
      
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          *,
          categorias (
            nome
          )
        `);

      console.log('Resposta da query produtos:', { data, error });

      if (error) {
        console.error('Erro na query:', error);
        throw error;
      }

      console.log('Produtos carregados:', data?.length || 0);
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os produtos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (produtoId: string) => {
    setEditingProductId(produtoId);
    setIsEditProductOpen(true);
  };

  const handleDeleteProduct = async (produtoId: string) => {
    try {
      const { data: foiDeletado, error } = await supabase
        .rpc('soft_delete_produto', { produto_uuid: produtoId });

      if (error) throw error;

      if (foiDeletado) {
        toast({
          title: 'Sucesso',
          description: 'Produto removido definitivamente com sucesso!',
        });
      } else {
        toast({
          title: 'Produto desativado',
          description: 'O produto foi desativado pois está vinculado a pedidos existentes.',
        });
      }

      carregarProdutos();
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o produto.',
        variant: 'destructive',
      });
    }
  };

  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categorias?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Produtos filtrados para exibição:', produtosFiltrados.length);

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
                <h1 className="text-3xl font-bold text-gray-900">Gestão de Produtos</h1>
                <p className="text-gray-600 mt-1">Gerencie o catálogo de produtos da confeitaria</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Categorias
                </Button>
                <Dialog open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-500 hover:bg-green-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Produto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Adicionar Produto</DialogTitle>
                    </DialogHeader>
                    <NovoProdutoForm onSuccess={() => {
                      setIsNewProductOpen(false);
                      carregarProdutos();
                    }} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Filtros */}
            <div className="section-card mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar produtos..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="outline">Filtrar por Categoria</Button>
              </div>
            </div>

            {/* Debug Info */}
            {!loading && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Debug: {produtos.length} produtos carregados, {produtosFiltrados.length} após filtro
                </p>
              </div>
            )}

            {/* Grid de Produtos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="section-card animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 rounded flex-1"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))
              ) : produtos.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">Nenhum produto encontrado no banco de dados</p>
                  <p className="text-sm text-gray-400 mt-2">Verifique se existem produtos cadastrados</p>
                </div>
              ) : produtosFiltrados.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">Nenhum produto encontrado com o filtro aplicado</p>
                  <p className="text-sm text-gray-400 mt-2">Existem {produtos.length} produtos no total</p>
                </div>
              ) : (
                produtosFiltrados.map((produto) => (
                  <div key={produto.id} className="section-card hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-4xl">🍰</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{produto.nome}</h3>
                    <p className="text-sm text-gray-600 mb-3">{produto.categorias?.nome || 'Sem categoria'}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-green-600">
                        R$ {Number(produto.preco).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">/{produto.unidade}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      Status: {produto.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEditProduct(produto.id)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover o produto "{produto.nome}"? 
                              Se este produto estiver vinculado a pedidos, ele será apenas desativado.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteProduct(produto.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Dialog para editar produto */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          {editingProductId && (
            <EditarProdutoForm 
              produtoId={editingProductId}
              onSuccess={() => {
                setIsEditProductOpen(false);
                setEditingProductId(null);
                carregarProdutos();
              }}
              onCancel={() => {
                setIsEditProductOpen(false);
                setEditingProductId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Produtos;
