
import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Star, Clock, CreditCard, User, Bell, Trash2 } from 'lucide-react';
import { PlanoCard } from '@/components/settings/PlanoCard';
import { CountdownTimer } from '@/components/settings/CountdownTimer';
import { UpgradeModal } from '@/components/settings/UpgradeModal';

const Configuracoes = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
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

  const planAtual = {
    nome: 'Free Trial',
    status: 'Ativo',
    diasRestantes: 15,
    totalDias: 30,
    recursos: [
      'Até 50 pedidos por mês',
      '1 usuário',
      'Suporte básico',
      'Backup semanal'
    ]
  };

  const planos = [
    {
      id: 'mensal',
      nome: 'Mensal',
      badge: 'MAIS POPULAR',
      badgeColor: 'bg-blue-600',
      preco: 29.90,
      periodo: 'mês',
      recursos: [
        'Pedidos ilimitados',
        'Até 3 usuários',
        'Relatórios avançados',
        'Suporte prioritário',
        'Backup diário',
        'Integração WhatsApp'
      ],
      destaque: true
    },
    {
      id: 'anual',
      nome: 'Anual',
      badge: 'MELHOR VALOR - 20% OFF',
      badgeColor: 'bg-green-600',
      preco: 23.92,
      precoAnual: 287.04,
      precoRiscado: 358.80,
      economia: 71.76,
      periodo: 'mês',
      recursos: [
        'Pedidos ilimitados',
        'Até 3 usuários',
        'Relatórios avançados',
        'Suporte prioritário',
        'Backup diário',
        'Integração WhatsApp'
      ],
      destaque: false
    }
  ];

  const progressPercentage = ((planAtual.totalDias - planAtual.diasRestantes) / planAtual.totalDias) * 100;

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
              {/* CARD 1: PLANO ATUAL */}
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      <Badge className="bg-green-600 text-white mb-2">
                        <Check className="w-3 h-3 mr-1" />
                        PLANO ATUAL
                      </Badge>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{planAtual.nome}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">{planAtual.status}</span>
                      </div>
                    </div>
                    <CountdownTimer diasRestantes={planAtual.diasRestantes} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tempo usado do trial</span>
                      <span>{planAtual.totalDias - planAtual.diasRestantes} de {planAtual.totalDias} dias</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Recursos incluídos:</h4>
                      <ul className="space-y-1">
                        {planAtual.recursos.map((recurso, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-3 h-3 text-green-600" />
                            {recurso}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={() => setShowUpgradeModal(true)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 w-full"
                        size="lg"
                      >
                        Fazer Upgrade
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CARD 2: PLANOS DISPONÍVEIS */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Planos Disponíveis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {planos.map((plano) => (
                      <PlanoCard 
                        key={plano.id} 
                        plano={plano} 
                        onSelect={() => setShowUpgradeModal(true)} 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

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

                {/* CARD 4: FATURAMENTO */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Faturamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhum histórico de pagamento</p>
                      <p className="text-sm">Você está no plano Free Trial</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Atualizar Cartão
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* CARD 5: NOTIFICAÇÕES */}
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

      <UpgradeModal 
        open={showUpgradeModal} 
        onOpenChange={setShowUpgradeModal}
        planos={planos}
      />
    </SidebarProvider>
  );
};

export default Configuracoes;
