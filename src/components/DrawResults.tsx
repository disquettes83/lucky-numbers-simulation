
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { confetti } from '@/lib/confetti';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';

interface DrawResultsProps {
  playerNumbers: number[];
  drawnNumbers: number[] | null;
  winAmount: number;
  onNewGame: () => void;
}

const DrawResults: React.FC<DrawResultsProps> = ({
  playerNumbers,
  drawnNumbers,
  winAmount,
  onNewGame,
}) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    if (drawnNumbers && winAmount > 0) {
      confetti();
    }
    
    // Set a timer to consider animation complete
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [drawnNumbers, winAmount]);
  
  if (!drawnNumbers) return null;
  
  const matchedNumbers = playerNumbers.filter(num => drawnNumbers.includes(num));
  const matchCount = matchedNumbers.length;
  
  let resultMessage = '';
  let resultClass = '';
  
  if (matchCount === 6) {
    resultMessage = 'JACKPOT! Hai fatto 6!';
    resultClass = 'text-4xl text-secondary animate-pulse font-extrabold';
  } else if (matchCount === 5) {
    resultMessage = 'Incredibile! Hai fatto 5!';
    resultClass = 'text-3xl text-secondary font-bold';
  } else if (matchCount === 4) {
    resultMessage = 'Ottimo! Hai fatto 4!';
    resultClass = 'text-2xl text-primary font-bold';
  } else if (matchCount === 3) {
    resultMessage = 'Bene! Hai fatto 3!';
    resultClass = 'text-xl text-primary font-semibold';
  } else if (matchCount === 2) {
    resultMessage = 'Hai fatto 2. Non è abbastanza per vincere.';
    resultClass = 'text-lg font-medium text-muted-foreground';
  } else {
    resultMessage = 'Nessuna vincita. Ritenta!';
    resultClass = 'text-lg font-medium text-muted-foreground';
  }
  
  return (
    <div className="ticket-paper">
      <h2 className="text-xl font-bold mb-4">Risultati dell'estrazione</h2>
      
      <div className="grid grid-cols-6 gap-2 mb-6">
        {drawnNumbers.map((num, idx) => (
          <div
            key={idx}
            className={cn(
              "lotto-number drawn",
              playerNumbers.includes(num) && "matched"
            )}
          >
            {num}
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">I tuoi numeri:</h3>
        <div className="grid grid-cols-6 gap-2">
          {playerNumbers.map((num, idx) => (
            <div
              key={idx}
              className={cn(
                "lotto-number selected",
                drawnNumbers.includes(num) && "matched"
              )}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
      
      <div className={cn("text-center py-4", resultClass)}>
        {resultMessage}
      </div>
      
      {matchCount > 2 && (
        <div className="bg-accent/20 p-4 rounded-md text-center mb-6 animate-pulse">
          <p className="font-bold text-lg mb-1">Hai vinto:</p>
          <p className="text-3xl font-extrabold">{winAmount.toFixed(2)} €</p>
        </div>
      )}
      
      {animationComplete && (
        <Button onClick={onNewGame} className="w-full">
          <Award className="mr-2 h-5 w-5" />
          Gioca ancora
        </Button>
      )}
    </div>
  );
};

export default DrawResults;
