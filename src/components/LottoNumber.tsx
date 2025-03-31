
import React from 'react';
import { cn } from '@/lib/utils';

interface LottoNumberProps {
  number: number;
  selected: boolean;
  drawn?: boolean;
  matched?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  karmaAffected?: boolean;
}

const LottoNumber: React.FC<LottoNumberProps> = ({
  number,
  selected,
  drawn = false,
  matched = false,
  onClick,
  disabled = false,
  karmaAffected = false
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        "lotto-number w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium cursor-pointer transition-all duration-200",
        {
          "bg-primary text-white": selected && !drawn && !matched && !karmaAffected,
          "bg-primary-dark text-white": selected && !drawn && !matched && karmaAffected,
          "bg-green-500 text-white": matched,
          "bg-amber-400 text-black": drawn && !matched,
          "bg-gray-100": !selected && !drawn && !matched,
          "opacity-50 cursor-not-allowed": disabled,
          "border-2 border-red-500": karmaAffected && selected,
          "animate-pulse": karmaAffected && !selected,
        }
      )}
      onClick={handleClick}
    >
      {number}
    </div>
  );
};

export default LottoNumber;
