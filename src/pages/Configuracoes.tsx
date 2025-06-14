
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Bell, Trash2 } from 'lucide-react';

const Configuracoes = () => {
  const [userData, setUserData] = useState({
    nome: 'Maria Silva',
    email: 'maria@confeitaria.com',
    telefone: '(11) 99999-9999',
    cpfCnpj: '123.456.789-00',
    razaoSocial: '',
    nomeFantasia: '',
    endereco: ''
  });

  const [notifications, setNotifications] = useState({
    emailNovosRecursos: true,
    smsUrgente: false,
    whatsappConfirmacoes: true,
    relatoriosSemanais: true
  });

  const handleSaveUserData = () => {
    console.log('Salvando dados do usuário:', userData);
    // Implementar salvamento
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: checked
    }));
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
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Informações Pessoais</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nome">Nome completo</Label>
                          <Input 
                            id="nome"
                            value={userData.nome}
                            onChange={(e) => setUserData(prev => ({ ...prev, nome: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">E-mail</Label>
                          <Input 
                            id="email"
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input 
                            id="telefone"
                            value={userData.telefone}
                            onChange={(e) => setUserData(prev => ({ ...prev, telefone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                          <Input 
                            id="cpfCnpj"
                            value={userData.cpfCnpj}
                            onChange={(e) => setUserData(prev => ({ ...prev, cpfCnpj: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={handleSaveUserData} className="flex-1">
                        Salvar Alterações
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Alterar Senha
                      </Button>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* CARD 2: NOTIFICAÇÕES */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notificações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="emailNovosRecursos" 
                          checked={notifications.emailNovosRecursos}
                          onCheckedChange={(checked) => handleNotificationChange('emailNovosRecursos', checked as boolean)}
                        />
                        <Label htmlFor="emailNovosRecursos">E-mail sobre novos recursos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="smsUrgente" 
                          checked={notifications.smsUrgente}
                          onCheckedChange={(checked) => handleNotificationChange('smsUrgente', checked as boolean)}
                        />
                        <Label htmlFor="smsUrgente">SMS para pedidos urgentes</Label>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="whatsappConfirmacoes" 
                          checked={notifications.whatsappConfirmacoes}
                          onCheckedChange={(checked) => handleNotificationChange('whatsappConfirmacoes', checked as boolean)}
                        />
                        <Label htmlFor="whatsappConfirmacoes">WhatsApp para confirmações</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="relatoriosSemanais" 
                          checked={notifications.relatoriosSemanais}
                          onCheckedChange={(checked) => handleNotificationChange('relatoriosSemanais', checked as boolean)}
                        />
                        <Label htmlFor="relatoriosSemanais">Relatórios semanais por e-mail</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

    </SidebarProvider>
  );
};

export default Configuracoes;
