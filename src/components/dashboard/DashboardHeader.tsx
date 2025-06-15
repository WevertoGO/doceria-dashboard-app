
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  user: any;
  onLogout: () => void;
}

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const { results, loading: searching, searchGlobal } = useGlobalSearch();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-confeitaria-primary to-confeitaria-primary-light rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🧁</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-confeitaria-text">Doce Encanto</h1>
            <p className="text-gray-600 mt-1">Confeitaria Artesanal</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Busca Global */}
        <div className="relative hidden md:block min-w-[320px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar pedidos, clientes ou produtos..."
            className="pl-10 w-80 bg-white"
            value={searchValue}
            onChange={e => {
              setSearchValue(e.target.value);
              searchGlobal(e.target.value);
            }}
          />
          {searchValue && (
            <div className="absolute z-20 bg-white shadow-md w-full left-0 mt-1 max-h-60 rounded-lg overflow-auto border border-gray-100">
              {searching ? (
                <div className="px-4 py-2 text-gray-500 text-sm">Procurando...</div>
              ) : (
                results.length > 0 ? (
                  results.map((r, i) =>
                    <div key={r.id + i}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                      {r.type === 'pedido' && (
                        <>Pedido <span className="font-semibold">{r.id}</span> - R$ {Number(r.valor_total).toFixed(2)}</>
                      )}
                      {r.type === 'cliente' && (
                        <>Cliente <span className="font-semibold">{r.nome}</span> - {r.telefone}</>
                      )}
                      {r.type === 'produto' && (
                        <>Produto <span className="font-semibold">{r.nome}</span></>
                      )}
                    </div>
                  )
                ) : (
                  <div className="px-4 py-2 text-gray-400 text-sm">Nenhum resultado encontrado</div>
                )
              )}
            </div>
          )}
        </div>
        {/* Logout button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-gray-600 hover:text-confeitaria-primary"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
        {/* Avatar do usuário */}
        <div className="w-8 h-8 bg-confeitaria-primary rounded-full flex items-center justify-center cursor-pointer">
          <span className="text-white font-medium text-sm">
            {user?.email?.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
