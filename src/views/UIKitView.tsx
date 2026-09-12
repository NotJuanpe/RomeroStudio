import React, { useState } from 'react';
import { ScreenView } from '../types';
import {
  ArrowUpRight,
  ArrowRight,
  Send,
  Plus,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  Copy,
  CheckCheck,
  LayoutDashboard,
  Home,
} from 'lucide-react';

interface UIKitViewProps {
  onNavigate?: (view: ScreenView) => void;
}

export const UIKitView: React.FC<UIKitViewProps> = ({ onNavigate }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="w-full bg-[#f9f9f9] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation buttons for internal views */}
        {onNavigate && (
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('panel')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e5e5e5] text-xs font-bold text-[#111111] hover:bg-neutral-100 transition-all cursor-pointer shadow-xs"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>← Volver al Panel de Gestión</span>
            </button>
            <button
              onClick={() => onNavigate('inicio')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-transparent text-xs font-semibold text-[#5e5e5e] hover:text-[#111111] transition-all cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Ir a Web Pública</span>
            </button>
          </div>
        )}

        {/* Toast Notification Container */}
        {toastMessage && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white px-5 py-3 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#5e5e5e] block mb-2">
            Sistema de Diseño
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111]">
            UI Kit & Componentes
          </h1>
          <p className="mt-2 text-sm text-[#444748] leading-relaxed">
            Biblioteca de componentes interactivos estandarizados según la retícula técnica de 8pt de Romero Estudio.
          </p>
        </div>

        <div className="space-y-12">
          {/* 1. BOTONES */}
          <div className="bg-white rounded-3xl p-8 border border-[#e5e5e5] shadow-xs">
            <h3 className="text-xl font-bold text-[#111111] mb-6">
              01 • Botones & Acciones
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => triggerToast('Botón Primario clickeado')}
                className="px-6 py-3 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Primario Negro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => triggerToast('Botón Delineado clickeado')}
                className="px-6 py-3 border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Secundario Outline</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => triggerToast('Botón Sutil clickeado')}
                className="px-6 py-3 bg-[#f3f3f3] hover:bg-[#e8e8e8] text-[#111111] text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer active:scale-95 transition-all"
              >
                Sutil / Neutral
              </button>

              <button
                disabled
                className="px-6 py-3 bg-[#e5e5e5] text-[#888888] text-xs font-bold uppercase tracking-wider rounded-full cursor-not-allowed opacity-60"
              >
                Desactivado
              </button>
            </div>
          </div>

          {/* 2. FORMULARIOS E INPUTS */}
          <div className="bg-white rounded-3xl p-8 border border-[#e5e5e5] shadow-xs">
            <h3 className="text-xl font-bold text-[#111111] mb-6">
              02 • Entradas de Texto & Controles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1.5">
                  Input Estándar
                </label>
                <input
                  type="text"
                  defaultValue="Vivienda Unifamiliar"
                  className="w-full px-3.5 py-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs text-[#1a1c1c] focus:border-[#111111] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1.5">
                  Selector Desplegable
                </label>
                <select className="w-full px-3.5 py-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs text-[#1a1c1c] focus:border-[#111111] focus:bg-white focus:outline-none transition-all">
                  <option>Reforma Integral</option>
                  <option>Obra Nueva</option>
                  <option>Dirección Técnica</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1.5">
                  Input con Validación
                </label>
                <div className="relative">
                  <input
                    type="email"
                    defaultValue="arquitectura@romero.com"
                    className="w-full px-3.5 py-2.5 bg-emerald-50/40 border border-emerald-400 rounded-xl text-xs text-[#1a1c1c] focus:outline-none"
                  />
                  <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. BADGES & CHIPS */}
          <div className="bg-white rounded-3xl p-8 border border-[#e5e5e5] shadow-xs">
            <h3 className="text-xl font-bold text-[#111111] mb-6">
              03 • Badges & Etiquetas de Estado
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#111111] text-white">
                Residencial
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#f3f3f3] text-[#111111] border border-[#e5e5e5]">
                Comercial
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                ● Completado
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                ● En Curso
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                ● Pendiente
              </span>
            </div>
          </div>

          {/* 4. RETÍCULA Y ESPACIADO 8PT */}
          <div className="bg-white rounded-3xl p-8 border border-[#e5e5e5] shadow-xs">
            <h3 className="text-xl font-bold text-[#111111] mb-6">
              04 • Escala de Radios y Espaciado (8pt Grid)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-[#f9f9f9] rounded-lg border border-[#e5e5e5]">
                <div className="w-12 h-12 bg-[#111111] rounded-lg mx-auto mb-2"></div>
                <span className="font-bold text-xs">8px (rounded-lg)</span>
                <span className="block text-[10px] text-[#5e5e5e]">Inputs, chips</span>
              </div>
              <div className="p-4 bg-[#f9f9f9] rounded-xl border border-[#e5e5e5]">
                <div className="w-12 h-12 bg-[#111111] rounded-xl mx-auto mb-2"></div>
                <span className="font-bold text-xs">12px (rounded-xl)</span>
                <span className="block text-[10px] text-[#5e5e5e]">Botones, bento</span>
              </div>
              <div className="p-4 bg-[#f9f9f9] rounded-2xl border border-[#e5e5e5]">
                <div className="w-12 h-12 bg-[#111111] rounded-2xl mx-auto mb-2"></div>
                <span className="font-bold text-xs">16px (rounded-2xl)</span>
                <span className="block text-[10px] text-[#5e5e5e]">Tarjetas de proyecto</span>
              </div>
              <div className="p-4 bg-[#f9f9f9] rounded-3xl border border-[#e5e5e5]">
                <div className="w-12 h-12 bg-[#111111] rounded-3xl mx-auto mb-2"></div>
                <span className="font-bold text-xs">24px (rounded-3xl)</span>
                <span className="block text-[10px] text-[#5e5e5e]">Contenedores macro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
