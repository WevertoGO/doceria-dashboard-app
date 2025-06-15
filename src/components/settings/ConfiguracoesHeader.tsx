
import { SidebarTrigger } from '@/components/ui/sidebar';

export function ConfiguracoesHeader() {
  return (
    <div className="flex items-center gap-4 mb-8">
      <SidebarTrigger className="lg:hidden" />
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie seu plano e dados pessoais</p>
      </div>
    </div>
  );
}
