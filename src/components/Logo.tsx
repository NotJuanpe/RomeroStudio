import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light' | 'outline' | 'hero';
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', className = '', onClick }) => {
  const isLight = variant === 'light' || variant === 'hero';

  return (
    <button
      id="brand-logo-button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none group text-left cursor-pointer transition-transform duration-200 active:scale-95 ${className}`}
      aria-label="Romero Estudio - Ir al inicio"
    >
      <div
        className={`px-3.5 py-1.5 rounded-full border transition-all duration-300 flex items-center gap-2 ${
          isLight
            ? 'bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20'
            : variant === 'outline'
            ? 'bg-transparent border-[#1a1c1c] text-[#1a1c1c] hover:bg-[#1a1c1c] hover:text-white'
            : 'bg-[#111111] border-[#111111] text-white hover:bg-black shadow-xs'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-label-caps text-[11px] tracking-[0.14em] font-extrabold whitespace-nowrap">
          ROMERO ESTUDIO
        </span>
      </div>
    </button>
  );
};
