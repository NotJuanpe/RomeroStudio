import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light' | 'outline' | 'hero';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  className = '',
  onClick,
}) => {
  const isLight = variant === 'light' || variant === 'hero';

  // Size styling configurations matching the brand geometry
  const sizeStyles = {
    sm: {
      container: 'px-2.5 py-1 rounded-[10px] border-[1.5px]',
      romero: 'text-[10px] tracking-[0.16em] font-extrabold',
      estudio: 'text-[7.5px] tracking-[0.24em] font-light -mt-0.5',
    },
    md: {
      container: 'px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-[13px] border-[2px]',
      romero: 'text-[12px] sm:text-[13px] tracking-[0.16em] font-extrabold',
      estudio: 'text-[9px] sm:text-[10px] tracking-[0.26em] font-light -mt-0.5',
    },
    lg: {
      container: 'px-6 py-3 rounded-[18px] border-[2.5px]',
      romero: 'text-[20px] sm:text-[22px] tracking-[0.18em] font-extrabold',
      estudio: 'text-[15px] sm:text-[17px] tracking-[0.28em] font-light -mt-0.5',
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      id="brand-logo-button"
      onClick={onClick}
      className={`inline-flex items-center select-none group text-center cursor-pointer transition-transform duration-200 active:scale-95 bg-transparent ${className}`}
      aria-label="Romero Estudio - Ir al inicio"
    >
      <div
        className={`flex flex-col items-center justify-center transition-all duration-300 bg-transparent ${currentSize.container} ${
          isLight
            ? 'border-white text-white hover:bg-white/10'
            : variant === 'outline'
            ? 'border-current text-current hover:bg-black/5'
            : 'border-[#111111] text-[#111111] hover:bg-black/5'
        }`}
      >
        <span
          className={`font-sans uppercase leading-none block select-none ${currentSize.romero}`}
        >
          ROMERO
        </span>
        <span
          className={`font-sans uppercase leading-none block select-none ${currentSize.estudio}`}
        >
          ESTUDIO
        </span>
      </div>
    </button>
  );
};
