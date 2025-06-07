
import { useState } from 'react';
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

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
    count: null,
  },
  {
    title: 'Pedidos',
    url: '/pedidos',
    icon: ShoppingCart,
    count: 23,
  },
  {
    title: 'Clientes',
    url: '/clientes',
    icon: Users,
    count: 156,
  },
  {
    title: 'Produtos',
    url: '/produtos',
    icon: Package,
    count: 45,
  },
  {
    title: 'Categorias',
    url: '/categorias',
    icon: FolderTree,
    count: 12,
  },
  {
    title: 'Relatórios',
    url: '/relatorios',
    icon: BarChart3,
    count: null,
  },
  {
    title: 'Configurações',
    url: '/configuracoes',
    icon: Settings,
    count: null,
  },
];

export function AppSidebar() {
  const location = useLocation();

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
                        {item.count && (
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
