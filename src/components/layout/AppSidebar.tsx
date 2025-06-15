
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Users, Package, ShoppingCart, BarChart3, Settings, FolderTree } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const baseNavigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
    table: null as string | null,
  },
  {
    title: 'Pedidos',
    url: '/pedidos',
    icon: ShoppingCart,
    table: 'pedidos' as const,
  },
  {
    title: 'Clientes',
    url: '/clientes',
    icon: Users,
    table: 'clientes' as const,
  },
  {
    title: 'Produtos',
    url: '/produtos',
    icon: Package,
    table: 'produtos' as const,
  },
  {
    title: 'Categorias',
    url: '/categorias',
    icon: FolderTree,
    table: 'categorias' as const,
  },
  {
    title: 'Relatórios',
    url: '/relatorios',
    icon: BarChart3,
    table: null as string | null,
  },
  {
    title: 'Configurações',
    url: '/configuracoes',
    icon: Settings,
    table: null as string | null,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [navigationItems, setNavigationItems] = useState(baseNavigationItems.map(item => ({ ...item, count: null })));

  useEffect(() => {
    const loadCounts = async () => {
      const updatedItems = await Promise.all(
        baseNavigationItems.map(async (item) => {
          if (!item.table) {
            return { ...item, count: null };
          }

          try {
            let count = 0;
            
            if (item.table === 'pedidos') {
              const { count: pedidosCount } = await supabase.from('pedidos').select('*', { count: 'exact', head: true });
              count = pedidosCount || 0;
            } else if (item.table === 'clientes') {
              const { count: clientesCount } = await supabase.from('clientes').select('*', { count: 'exact', head: true });
              count = clientesCount || 0;
            } else if (item.table === 'produtos') {
              const { count: produtosCount } = await supabase.from('produtos').select('*', { count: 'exact', head: true });
              count = produtosCount || 0;
            } else if (item.table === 'categorias') {
              const { count: categoriasCount } = await supabase.from('categorias').select('*', { count: 'exact', head: true });
              count = categoriasCount || 0;
            }
            
            return { ...item, count };
          } catch (error) {
            console.error(`Erro ao carregar contagem de ${item.table}:`, error);
            return { ...item, count: null };
          }
        })
      );
      
      setNavigationItems(updatedItems);
    };

    loadCounts();
  }, []);

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-confeitaria-primary to-confeitaria-primary-light rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🧁</span>
          </div>
          <div>
            <h2 className="font-bold text-confeitaria-text">Doce Encanto</h2>
            <p className="text-xs text-gray-500">Confeitaria Pro</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`w-full justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-confeitaria-primary text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-confeitaria-primary'
                      }`}
                    >
                      <Link to={item.url} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <item.icon className={`h-5 w-5 ${
                            isActive ? 'text-white' : 'text-gray-500'
                          }`} />
                          <span className="font-medium">{item.title}</span>
                        </div>
                        {item.count !== null && (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              isActive 
                                ? 'bg-white bg-opacity-20 text-white' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {item.count}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
