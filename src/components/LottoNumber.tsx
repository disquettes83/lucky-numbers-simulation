
import React from 'react';
import { cn } from '@/lib/utils';

interface LottoNumberProps {
  number: number;
  selected: boolean;
  drawn?: boolean;
  matched?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const LottoNumber: React.FC<LottoNumberProps> = ({
  number,
  selected,
  drawn = false,
  matched = false,
  onClick,
  disabled = false
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        "lotto-number", 
        {
          "selected": selected,
          "drawn": drawn,
          "matched": matched,
          "bg-gray-100": !selected && !drawn && !matched,
          "opacity-50 cursor-not-allowed": disabled,
        }
      )}
      onClick={handleClick}
    >
      {number}
    </div>
  );
};

export default LottoNumber;
