import React from 'react';
import { Logo } from './Logo';
import { ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  return (
    <div
      id="splash-intro-screen"
      onClick={onEnter}
      className="fixed inset-0 z-50 bg-[#111111] text-white flex flex-col items-center justify-between p-8 sm:p-12 cursor-pointer select-none animate-in fade-in duration-500"
    >
      <div className="w-full flex justify-between items-center text-xs opacity-50 font-bold uppercase tracking-widest">
        <span>Romero Estudio</span>
        <span>Buenos Aires • 2026</span>
      </div>

      {/* Centered Identity */}
      <div className="flex flex-col items-center text-center max-w-lg space-y-6">
        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
          <Logo variant="hero" size="lg" />
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Arquitectura Integral
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed">
            Obras de alta gama, reformas integrales y dirección técnica rigurosa.
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEnter();
          }}
          className="mt-6 px-8 py-3.5 bg-white text-[#111111] hover:bg-neutral-100 font-bold text-xs uppercase tracking-[0.2em] rounded-full transition-all cursor-pointer shadow-xl active:scale-95 flex items-center gap-2"
        >
          <span>Hacer Clic Para Ingresar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Footer hint */}
      <div className="text-[11px] text-neutral-500 uppercase tracking-widest">
        Toca cualquier parte de la pantalla para continuar
      </div>
    </div>
  );
};
