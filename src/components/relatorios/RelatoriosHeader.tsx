
import { SidebarTrigger } from '@/components/ui/sidebar';

export function RelatoriosHeader() {
  return (
    <div className="flex items-center gap-4 mb-8">
      <SidebarTrigger className="lg:hidden" />
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600 mt-1">Análises e relatórios do desempenho da confeitaria</p>
      </div>
    </div>
  );
}
