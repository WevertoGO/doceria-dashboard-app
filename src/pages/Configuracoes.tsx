
import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ConfiguracoesHeader } from '@/components/settings/ConfiguracoesHeader';
import { UserDataCard } from '@/components/settings/UserDataCard';

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
            <ConfiguracoesHeader />
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserDataCard
                  userData={userData}
                  loading={loading}
                  saving={saving}
                  openChangePassword={openChangePassword}
                  setUserData={setUserData}
                  handleSaveUserData={handleSaveUserData}
                  setOpenChangePassword={setOpenChangePassword}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Configuracoes;
