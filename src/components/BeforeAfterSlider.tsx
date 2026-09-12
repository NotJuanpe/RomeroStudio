import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeftRight, Check, Eye } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  title?: string;
  subtitle?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto';
  className?: string;
  heightClass?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  title = 'Transformación Arquitectónica',
  subtitle = 'Arrastra el control para comparar el estado previo con el resultado final',
  className = '',
  heightClass = 'h-[360px] sm:h-[480px]',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    },
    [isDragging, handleMove]
  );

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Slider Visual Container */}
      <div
        ref={containerRef}
        id="before-after-interactive-container"
        className={`relative w-full ${heightClass} rounded-2xl overflow-hidden select-none cursor-ew-resize bg-[#1a1c1c] shadow-lg border border-[#e5e5e5]`}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={(e) => handleMove(e.clientX)}
      >
        {/* After Image (Background - Full Width) */}
        <img
          src={afterImage}
          alt="Post-Intervención"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          referrerPolicy="no-referrer"
        />

        {/* Before Image (Foreground - Clipped with inline style) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Pre-Intervención"
            className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none filter brightness-90 contrast-105"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw',
            }}
            referrerPolicy="no-referrer"
          />
          {/* Subtle darken overlay on before state */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Split Divider Bar */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Draggable Circle Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-white text-[#111111] rounded-full shadow-xl flex items-center justify-center border-2 border-[#111111] transition-transform active:scale-110">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>

        {/* Badges: Pre vs Post */}
        <div className="absolute top-4 left-4 z-30 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
            Pre-Intervención
          </span>
        </div>
        <div className="absolute top-4 right-4 z-30 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#111111] border border-black/10 shadow-sm">
            Post-Intervención
          </span>
        </div>
      </div>

      {/* Preset Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#5e5e5e]">
        <span className="flex items-center gap-1.5 font-medium">
          <Eye className="w-3.5 h-3.5" />
          <span>{subtitle}</span>
        </span>
        <div className="flex items-center gap-1 bg-[#eeeeee] p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setSliderPosition(100)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              sliderPosition >= 90 ? 'bg-white text-[#111111] shadow-xs' : 'hover:text-[#111111]'
            }`}
          >
            Ver Solo Antes
          </button>
          <button
            type="button"
            onClick={() => setSliderPosition(50)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              sliderPosition > 20 && sliderPosition < 80
                ? 'bg-white text-[#111111] shadow-xs'
                : 'hover:text-[#111111]'
            }`}
          >
            50 / 50
          </button>
          <button
            type="button"
            onClick={() => setSliderPosition(0)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              sliderPosition <= 10 ? 'bg-white text-[#111111] shadow-xs' : 'hover:text-[#111111]'
            }`}
          >
            Ver Solo Después
          </button>
        </div>
      </div>
    </div>
  );
};
