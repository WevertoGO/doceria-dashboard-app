import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ReportPeriodFormProps {
  onSuccess: () => void;
}

export function ReportPeriodForm({ onSuccess }: ReportPeriodFormProps) {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataInicio || !dataFim) {
      toast.error('Selecione o período completo');
      return;
    }

    if (new Date(dataInicio) > new Date(dataFim)) {
      toast.error('Data de início deve ser anterior à data final');
      return;
    }

    // Redirecionar para página de relatório com parâmetros
    const params = new URLSearchParams({
      inicio: dataInicio,
      fim: dataFim
    });
    
    window.open(`/relatorio-web?${params.toString()}`, '_blank');
    toast.success('Relatório sendo gerado...');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="dataInicio">Data de Início *</Label>
        <Input
          id="dataInicio"
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="dataFim">Data Final *</Label>
        <Input
          id="dataFim"
          type="date"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-confeitaria-primary hover:bg-confeitaria-primary/90">
          Gerar Relatório
        </Button>
      </div>
    </form>
  );
}