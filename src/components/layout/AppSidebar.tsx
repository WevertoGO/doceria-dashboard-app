
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

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'Pedidos',
    url: '/pedidos',
    icon: ShoppingCart,
  },
  {
    title: 'Clientes',
    url: '/clientes',
    icon: Users,
  },
  {
    title: 'Produtos',
    url: '/produtos',
    icon: Package,
  },
  {
    title: 'Categorias',
    url: '/categorias',
    icon: FolderTree,
  },
  {
    title: 'Relatórios',
    url: '/relatorios',
    icon: BarChart3,
  },
  {
    title: 'Configurações',
    url: '/configuracoes',
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🧁</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Confeitaria Pro</h2>
            <p className="text-xs text-gray-500">Sistema de Gestão</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`w-full justify-start gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      location.pathname === item.url
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className={`h-4 w-4 ${
                        location.pathname === item.url ? 'text-rose-600' : 'text-gray-500'
                      }`} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
