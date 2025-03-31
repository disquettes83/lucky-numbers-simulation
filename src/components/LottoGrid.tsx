
import React from 'react';
import LottoNumber from './LottoNumber';

interface LottoGridProps {
  selectedNumbers: number[];
  onNumberClick: (number: number) => void;
  maxSelections: number;
  drawnNumbers?: number[];
}

const LottoGrid: React.FC<LottoGridProps> = ({
  selectedNumbers,
  onNumberClick,
  maxSelections,
  drawnNumbers = []
}) => {
  // Generate numbers from 1 to 90 for SuperEnalotto
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);
  
  const isDisabled = selectedNumbers.length >= maxSelections;
  
  return (
    <div className="grid grid-cols-10 gap-2">
      {numbers.map(num => {
        const isSelected = selectedNumbers.includes(num);
        const isDrawn = drawnNumbers.includes(num);
        const isMatched = isSelected && isDrawn;
        
        return (
          <LottoNumber
            key={num}
            number={num}
            selected={isSelected}
            drawn={isDrawn}
            matched={isMatched}
            onClick={() => onNumberClick(num)}
            disabled={isDisabled && !isSelected}
          />
        );
      })}
    </div>
  );
};

export default LottoGrid;
