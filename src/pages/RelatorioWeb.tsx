import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Printer, TrendingUp, Users, DollarSign, Package } from 'lucide-react';

const RelatorioWeb = () => {
  const [periodo, setPeriodo] = useState({ inicio: '', fim: '' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPeriodo({
      inicio: params.get('inicio') || '',
      fim: params.get('fim') || ''
    });
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePDF = () => {
    // Aqui você implementaria a geração de PDF
    // Por exemplo, usando bibliotecas como jsPDF ou html2pdf
    alert('Funcionalidade de PDF será implementada');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header para impressão */}
      <div className="p-6 print:p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header do relatório */}
          <div className="flex items-center justify-between mb-8 print:mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-confeitaria-primary to-confeitaria-primary-light rounded-lg flex items-center justify-center print:w-8 print:h-8">
                <span className="text-white font-bold text-xl print:text-lg">🧁</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-confeitaria-text print:text-xl">Doce Encanto</h1>
                <p className="text-gray-600 print:text-sm">Relatório de Vendas</p>
              </div>
            </div>
            
            {/* Botões de ação - ocultos na impressão */}
            <div className="flex gap-2 print:hidden">
              <Button onClick={handlePrint} variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button onClick={handleGeneratePDF} className="bg-confeitaria-primary">
                <Download className="h-4 w-4 mr-2" />
                Gerar PDF
              </Button>
            </div>
          </div>

          {/* Período do relatório */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Período de Análise</h2>
            <p className="text-gray-600">
              {periodo.inicio && periodo.fim 
                ? `${formatDate(periodo.inicio)} até ${formatDate(periodo.fim)}`
                : 'Período não especificado'
              }
            </p>
          </div>

          {/* Cards de métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print:gap-2">
            <Card className="print:shadow-none print:border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold print:text-xl">R$ 18.750</div>
                <p className="text-xs text-muted-foreground">
                  +23.5% vs período anterior
                </p>
              </CardContent>
            </Card>

            <Card className="print:shadow-none print:border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold print:text-xl">156</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% vs período anterior
                </p>
              </CardContent>
            </Card>

            <Card className="print:shadow-none print:border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold print:text-xl">89</div>
                <p className="text-xs text-muted-foreground">
                  +8.2% vs período anterior
                </p>
              </CardContent>
            </Card>

            <Card className="print:shadow-none print:border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold print:text-xl">R$ 120</div>
                <p className="text-xs text-muted-foreground">
                  +15.8% vs período anterior
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Seções de relatórios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:gap-4">
            <Card className="print:shadow-none print:border">
              <CardHeader>
                <CardTitle>Top 5 Produtos Mais Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { nome: 'Bolo de Chocolate', vendas: 45, receita: 2025 },
                    { nome: 'Brigadeiros Gourmet', vendas: 120, receita: 300 },
                    { nome: 'Torta de Limão', vendas: 25, receita: 1500 },
                    { nome: 'Cupcakes', vendas: 80, receita: 800 },
                    { nome: 'Bem-casados', vendas: 60, receita: 900 },
                  ].map((produto, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg print:bg-gray-100">
                      <div>
                        <h4 className="font-medium text-gray-900">{produto.nome}</h4>
                        <p className="text-sm text-gray-600">{produto.vendas} unidades vendidas</p>
                      </div>
                      <span className="font-semibold text-green-600">R$ {produto.receita}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="print:shadow-none print:border">
              <CardHeader>
                <CardTitle>Top 5 Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { nome: 'Maria Silva', pedidos: 15, valor: 1275 },
                    { nome: 'Ana Oliveira', pedidos: 12, valor: 1080 },
                    { nome: 'João Santos', pedidos: 10, valor: 950 },
                    { nome: 'Carla Mendes', pedidos: 8, valor: 720 },
                    { nome: 'Pedro Costa', pedidos: 7, valor: 630 },
                  ].map((cliente, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg print:bg-gray-100">
                      <div>
                        <h4 className="font-medium text-gray-900">{cliente.nome}</h4>
                        <p className="text-sm text-gray-600">{cliente.pedidos} pedidos</p>
                      </div>
                      <span className="font-semibold text-green-600">R$ {cliente.valor}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer do relatório */}
          <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
            <p>Relatório gerado automaticamente em {new Date().toLocaleString('pt-BR')}</p>
            <p className="mt-1">Doce Encanto - Sistema de Gestão de Confeitaria</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatorioWeb;