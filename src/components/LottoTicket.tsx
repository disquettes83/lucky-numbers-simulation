
import React, { useState } from 'react';
import LottoGrid from './LottoGrid';
import { Button } from '@/components/ui/button';
import { Ticket, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface LottoTicketProps {
  onPlay: (numbers: number[]) => void;
  ticketCost: number;
}

const LottoTicket: React.FC<LottoTicketProps> = ({ onPlay, ticketCost }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const maxSelections = 6;
  
  const handleNumberClick = (number: number) => {
    setSelectedNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      } else if (prev.length < maxSelections) {
        return [...prev, number];
      }
      return prev;
    });
  };
  
  const handlePlay = () => {
    if (selectedNumbers.length !== maxSelections) {
      toast.error(`Devi selezionare ${maxSelections} numeri`);
      return;
    }
    
    onPlay(selectedNumbers);
    toast.success('Schedina giocata! Buona fortuna!');
  };
  
  const handleRandom = () => {
    const numbers = new Set<number>();
    while (numbers.size < maxSelections) {
      numbers.add(Math.floor(Math.random() * 90) + 1);
    }
    setSelectedNumbers(Array.from(numbers));
    toast.info('Numeri casuali selezionati');
  };
  
  const handleClear = () => {
    setSelectedNumbers([]);
  };

  return (
    <div className="ticket-paper">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">La tua schedina</h2>
        <span className="text-sm text-muted-foreground">
          Scegli {maxSelections} numeri da 1 a 90
        </span>
      </div>
      
      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <LottoGrid
            selectedNumbers={selectedNumbers}
            onNumberClick={handleNumberClick}
            maxSelections={maxSelections}
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRandom}>
              <RefreshCw className="mr-1 h-4 w-4" /> Casuale
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 className="mr-1 h-4 w-4" /> Cancella
            </Button>
          </div>
          <div className="text-sm font-bold">
            Selezionati: {selectedNumbers.length}/{maxSelections}
          </div>
        </div>
        
        <Button 
          disabled={selectedNumbers.length !== maxSelections} 
          onClick={handlePlay}
          className="mt-2"
        >
          <Ticket className="mr-2 h-5 w-5" /> 
          Gioca ({ticketCost.toFixed(2)} €)
        </Button>
      </div>
    </div>
  );
};

export default LottoTicket;
