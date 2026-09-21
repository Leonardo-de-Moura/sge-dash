import React from 'react';
import { CalendarDays } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div  className="inline-flex items-center gap-3 group focus:outline-none" title="SGE-IFCE">
      <div className="rounded-xl bg-[#006A38] text-white flex items-center justify-center p-2 shadow-sm">
        <CalendarDays className={iconSizes[size]} />
      </div>
      <div className="flex flex-col text-left">
        <span className={`font-bold tracking-tight text-[#006A38] ${titleSizes[size]}`}>
          SGE<span className="text-[#A62B26]">-</span>IFCE
        </span>
        {showSubtitle && (
          <span className="text-[10px] sm:text-xs text-gray-500 font-medium tracking-wide">
            Sistema de Gestão de Eventos IFCE
          </span>
        )}
      </div>
    </div>
  );
};
