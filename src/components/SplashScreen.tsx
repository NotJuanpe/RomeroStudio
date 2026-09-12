import React, { useState } from 'react';
import { Logo } from './Logo';

interface LandingIntroProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<LandingIntroProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    if (isExiting) return;
    setIsExiting(true);
    // Allow smooth fade-out transition before unmounting
    setTimeout(() => {
      onEnter();
    }, 450);
  };

  return (
    <div
      id="landing-cover-screen"
      onClick={handleEnter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleEnter();
        }
      }}
      className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center select-none cursor-pointer transition-all duration-500 ease-out ${
        isExiting
          ? 'opacity-0 scale-[1.02] pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      aria-label="Romero Estudio - Hacer clic para ingresar al sitio web"
    >
      {/* Centered Brand Unit */}
      <div className="flex flex-col items-center justify-center text-center px-6 transition-transform duration-300 hover:scale-[1.015]">
        {/* Custom Logo in prominent presentation */}
        <div className="p-3">
          <Logo variant="dark" size="xl" />
        </div>

        {/* Action Callout */}
        <p
          id="landing-cta-text"
          className="mt-10 sm:mt-12 text-[11px] sm:text-[12px] font-semibold tracking-[0.24em] sm:tracking-[0.28em] text-neutral-500 uppercase transition-all duration-300 hover:text-[#111111] hover:tracking-[0.3em]"
        >
          Hacer Clic Para Ingresar
        </p>
      </div>
    </div>
  );
};
