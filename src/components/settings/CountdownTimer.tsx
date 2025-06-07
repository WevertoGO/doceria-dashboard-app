
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  diasRestantes: number;
}

export function CountdownTimer({ diasRestantes }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    dias: diasRestantes,
    horas: 0,
    minutos: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(now.getDate() + diasRestantes);
      
      const difference = endDate.getTime() - now.getTime();
      
      const dias = Math.floor(difference / (1000 * 60 * 60 * 24));
      const horas = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft({ dias, horas, minutos });
    }, 60000); // Atualiza a cada minuto

    return () => clearInterval(timer);
  }, [diasRestantes]);

  const getColorClass = () => {
    if (timeLeft.dias <= 3) return 'text-red-600';
    if (timeLeft.dias <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={cn("flex items-center gap-2 font-medium", getColorClass())}>
      <Clock className="w-4 h-4" />
      <span className="text-sm">
        {timeLeft.dias} dias, {timeLeft.horas}h restantes
      </span>
    </div>
  );
}
