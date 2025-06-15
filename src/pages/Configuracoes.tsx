import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChangePasswordModal } from "@/components/settings/ChangePasswordModal";

const Configuracoes = () => {
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpfCnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    endereco: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserData({
          nome: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          email: user.email || '',
          telefone: user.user_metadata?.phone || '',
          cpfCnpj: user.user_metadata?.cpf_cnpj || '',
          razaoSocial: user.user_metadata?.razao_social || '',
          nomeFantasia: user.user_metadata?.nome_fantasia || '',
          endereco: user.user_metadata?.endereco || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      toast.error('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUserData = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Usuário não encontrado');
        return;
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: userData.nome,
          phone: userData.telefone,
          cpf_cnpj: userData.cpfCnpj,
          razao_social: userData.razaoSocial,
          nome_fantasia: userData.nomeFantasia,
          endereco: userData.endereco
        }
      });

      if (error) {
        throw error;
      }

      toast.success('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast.error('Erro ao salvar dados');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-bakery-soft">
        <AppSidebar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <SidebarTrigger className="lg:hidden" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
                <p className="text-gray-600 mt-1">Gerencie seu plano e dados pessoais</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CARD 3: DADOS DO USUÁRIO */}
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
                                onChange={(e) => setUserData(prev => ({ ...prev, nome: e.target.value }))}
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
                                onChange={(e) => setUserData(prev => ({ ...prev, telefone: e.target.value }))}
                                disabled={saving}
                                placeholder="(11) 99999-9999"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                              <Input 
                                id="cpfCnpj"
                                value={userData.cpfCnpj}
                                onChange={(e) => setUserData(prev => ({ ...prev, cpfCnpj: e.target.value }))}
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
                          <Button variant="outline" className="flex-1"
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

              </div>
            </div>
          </div>
        </main>
      </div>

    </SidebarProvider>
  );
};

export default Configuracoes;
