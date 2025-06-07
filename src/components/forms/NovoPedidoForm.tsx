
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CalendarIcon, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface NovoPedidoFormProps {
  onSuccess: () => void;
}

export function NovoPedidoForm({ onSuccess }: NovoPedidoFormProps) {
  const [step, setStep] = useState('cliente');
  const [cliente, setCliente] = useState({ nome: '', telefone: '' });
  const [produtos, setProdutos] = useState([{ nome: '', quantidade: 1, valor: 0 }]);
  const [entrega, setEntrega] = useState({ data: '', periodo: 'manha' });

  const adicionarProduto = () => {
    setProdutos([...produtos, { nome: '', quantidade: 1, valor: 0 }]);
  };

  const removerProduto = (index: number) => {
    setProdutos(produtos.filter((_, i) => i !== index));
  };

  const valorTotal = produtos.reduce((total, produto) => total + (produto.valor * produto.quantidade), 0);

  const handleSubmit = () => {
    toast.success('Pedido criado com sucesso!');
    onSuccess();
  };

  return (
    <div className="space-y-6">
      <Tabs value={step} onValueChange={setStep} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cliente">Cliente</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="entrega">Entrega</TabsTrigger>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
        </TabsList>

        <TabsContent value="cliente" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome do Cliente</Label>
              <Input
                id="nome"
                value={cliente.nome}
                onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
                placeholder="Digite o nome"
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={cliente.telefone}
                onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          <Button onClick={() => setStep('produtos')} className="w-full">
            Próximo: Produtos
          </Button>
        </TabsContent>

        <TabsContent value="produtos" className="space-y-4">
          <div className="space-y-3">
            {produtos.map((produto, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <Label>Produto</Label>
                  <Input
                    value={produto.nome}
                    onChange={(e) => {
                      const newProdutos = [...produtos];
                      newProdutos[index].nome = e.target.value;
                      setProdutos(newProdutos);
                    }}
                    placeholder="Nome do produto"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Qtd</Label>
                  <Input
                    type="number"
                    value={produto.quantidade}
                    onChange={(e) => {
                      const newProdutos = [...produtos];
                      newProdutos[index].quantidade = parseInt(e.target.value) || 1;
                      setProdutos(newProdutos);
                    }}
                  />
                </div>
                <div className="col-span-3">
                  <Label>Valor Unit.</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={produto.valor}
                    onChange={(e) => {
                      const newProdutos = [...produtos];
                      newProdutos[index].valor = parseFloat(e.target.value) || 0;
                      setProdutos(newProdutos);
                    }}
                    placeholder="0.00"
                  />
                </div>
                <div className="col-span-2 flex gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={adicionarProduto}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  {produtos.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removerProduto(index)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep('cliente')}>
              Voltar
            </Button>
            <Button onClick={() => setStep('entrega')}>
              Próximo: Entrega
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="entrega" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data">Data da Entrega</Label>
              <Input
                id="data"
                type="date"
                value={entrega.data}
                onChange={(e) => setEntrega({ ...entrega, data: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="periodo">Período</Label>
              <select
                id="periodo"
                value={entrega.periodo}
                onChange={(e) => setEntrega({ ...entrega, periodo: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="manha">Manhã</option>
                <option value="tarde">Tarde</option>
                <option value="noite">Noite</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep('produtos')}>
              Voltar
            </Button>
            <Button onClick={() => setStep('resumo')}>
              Próximo: Resumo
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="resumo" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Cliente</h4>
              <p>{cliente.nome} - {cliente.telefone}</p>
            </div>
            <div>
              <h4 className="font-semibold">Produtos</h4>
              {produtos.map((produto, index) => (
                <p key={index}>
                  {produto.quantidade}x {produto.nome} - R$ {(produto.valor * produto.quantidade).toFixed(2)}
                </p>
              ))}
            </div>
            <div>
              <h4 className="font-semibold">Entrega</h4>
              <p>{new Date(entrega.data).toLocaleDateString()} - {entrega.periodo}</p>
            </div>
            <div className="border-t pt-4">
              <h4 className="text-lg font-bold">Total: R$ {valorTotal.toFixed(2)}</h4>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep('entrega')}>
              Voltar
            </Button>
            <Button onClick={handleSubmit} className="bg-rose-500 hover:bg-rose-600">
              Criar Pedido
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
