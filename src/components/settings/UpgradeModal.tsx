
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, FileText, Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Plano {
  id: string;
  nome: string;
  badge: string;
  badgeColor: string;
  preco: number;
  periodo: string;
  precoAnual?: number;
  precoRiscado?: number;
  economia?: number;
  recursos: string[];
  destaque: boolean;
}

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planos: Plano[];
}

export function UpgradeModal({ open, onOpenChange, planos }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState('mensal');
  const [paymentMethod, setPaymentMethod] = useState('cartao');
  const [cardData, setCardData] = useState({
    numero: '',
    nome: '',
    validade: '',
    cvv: '',
    cpf: ''
  });

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePayment = () => {
    console.log('Processando pagamento:', { selectedPlan, paymentMethod, cardData });
    // Implementar integração de pagamento
    onOpenChange(false);
  };

  const selectedPlanData = planos.find(p => p.id === selectedPlan);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Escolha seu Plano Premium
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Comparação de Planos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Comparação de Planos</h3>
            
            <RadioGroup value={selectedPlan} onValueChange={handlePlanChange}>
              {planos.map((plano) => (
                <div key={plano.id} className="relative">
                  <Label 
                    htmlFor={plano.id}
                    className={cn(
                      "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all",
                      selectedPlan === plano.id 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <RadioGroupItem value={plano.id} id={plano.id} />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Plano {plano.nome}</span>
                        <Badge className={cn("text-white text-xs", plano.badgeColor)}>
                          {plano.id === 'anual' && <Star className="w-3 h-3 mr-1" />}
                          {plano.badge}
                        </Badge>
                      </div>
                      
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-xl font-bold">
                          R$ {plano.preco.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-gray-600">/{plano.periodo}</span>
                      </div>
                      
                      {plano.id === 'anual' && plano.economia && (
                        <p className="text-sm text-green-600 font-medium">
                          Economize R$ {plano.economia.toFixed(2).replace('.', ',')} por ano
                        </p>
                      )}
                      
                      <ul className="mt-3 space-y-1">
                        {plano.recursos.slice(0, 3).map((recurso, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-3 h-3 text-green-600" />
                            {recurso}
                          </li>
                        ))}
                        {plano.recursos.length > 3 && (
                          <li className="text-sm text-gray-500">
                            +{plano.recursos.length - 3} recursos adicionais
                          </li>
                        )}
                      </ul>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Formulário de Pagamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados de Pagamento</h3>
            
            {/* Método de Pagamento */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Método de Pagamento</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-2">
                  <Label htmlFor="cartao" className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="cartao" id="cartao" />
                    <CreditCard className="w-4 h-4" />
                    <span>Cartão de Crédito</span>
                  </Label>
                  
                  <Label htmlFor="pix" className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="pix" id="pix" />
                    <Smartphone className="w-4 h-4" />
                    <span>PIX</span>
                  </Label>
                  
                  <Label htmlFor="boleto" className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="boleto" id="boleto" />
                    <FileText className="w-4 h-4" />
                    <span>Boleto Bancário</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Dados do Cartão */}
            {paymentMethod === 'cartao' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="numero">Número do Cartão</Label>
                  <Input 
                    id="numero"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.numero}
                    onChange={(e) => setCardData(prev => ({ ...prev, numero: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="nome">Nome no Cartão</Label>
                  <Input 
                    id="nome"
                    placeholder="MARIA SILVA"
                    value={cardData.nome}
                    onChange={(e) => setCardData(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="validade">Validade</Label>
                    <Input 
                      id="validade"
                      placeholder="MM/AA"
                      value={cardData.validade}
                      onChange={(e) => setCardData(prev => ({ ...prev, validade: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input 
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={cardData.cpf}
                    onChange={(e) => setCardData(prev => ({ ...prev, cpf: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Resumo do Pedido */}
            {selectedPlanData && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Resumo do Pedido</h4>
                <div className="flex justify-between text-sm">
                  <span>Plano {selectedPlanData.nome}</span>
                  <span>R$ {selectedPlanData.preco.toFixed(2).replace('.', ',')}/{selectedPlanData.periodo}</span>
                </div>
                {selectedPlanData.id === 'anual' && selectedPlanData.economia && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Economia</span>
                    <span>-R$ {selectedPlanData.economia.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>R$ {selectedPlanData.preco.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handlePayment} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                Confirmar Pagamento
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
