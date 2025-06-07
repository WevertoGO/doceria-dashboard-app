
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NovoProdutoForm } from '@/components/forms/NovoProdutoForm';

const produtos = [
  {
    id: 1,
    nome: 'Bolo de Chocolate',
    categoria: 'Bolos',
    valor: 45.00,
    unidade: 'unid',
  },
  {
    id: 2,
    nome: 'Brigadeiros Gourmet',
    categoria: 'Docinhos',
    valor: 2.50,
    unidade: 'unid',
  },
  {
    id: 3,
    nome: 'Torta de Limão',
    categoria: 'Tortas',
    valor: 60.00,
    unidade: 'unid',
  },
];

const Produtos = () => {
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);

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
                    <NovoProdutoForm onSuccess={() => setIsNewProductOpen(false)} />
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
                    />
                  </div>
                </div>
                <Button variant="outline">Filtrar por Categoria</Button>
              </div>
            </div>

            {/* Grid de Produtos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produtos.map((produto) => (
                <div key={produto.id} className="section-card hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">🍰</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{produto.nome}</h3>
                  <p className="text-sm text-gray-600 mb-3">{produto.categoria}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-green-600">
                      R$ {produto.valor.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">/{produto.unidade}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Produtos;
