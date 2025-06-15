
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, User } from "lucide-react";
import { ChangePasswordModal } from "@/components/settings/ChangePasswordModal";

interface UserDataCardProps {
  userData: any;
  loading: boolean;
  saving: boolean;
  openChangePassword: boolean;
  setUserData: (fn: (prev: any) => any) => void;
  handleSaveUserData: () => void;
  setOpenChangePassword: (open: boolean) => void;
}

export function UserDataCard({
  userData,
  loading,
  saving,
  openChangePassword,
  setUserData,
  handleSaveUserData,
  setOpenChangePassword,
}: UserDataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Dados do Usuário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            <div className="animate-pulse bg-gray-200 h-4 w-48 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Informações Pessoais</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    value={userData.nome}
                    onChange={e => setUserData((prev: any) => ({ ...prev, nome: e.target.value }))}
                    disabled={saving}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={userData.telefone}
                    onChange={e => setUserData((prev: any) => ({ ...prev, telefone: e.target.value }))}
                    disabled={saving}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                  <Input
                    id="cpfCnpj"
                    value={userData.cpfCnpj}
                    onChange={e => setUserData((prev: any) => ({ ...prev, cpfCnpj: e.target.value }))}
                    disabled={saving}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSaveUserData}
                className="flex-1"
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setOpenChangePassword(true)}
                disabled={saving}
              >
                Alterar Senha
              </Button>
              <Button variant="destructive" size="icon" disabled={saving}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <ChangePasswordModal
              open={openChangePassword}
              onOpenChange={setOpenChangePassword}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
