import React from 'react';
import { Logo } from '../components/Logo';
import { ScreenView } from '../types';
import { Sparkles, Check, X, Copy, CheckCheck, ArrowLeft, LayoutDashboard, Home } from 'lucide-react';

interface BrandGuidelinesViewProps {
  onNavigate?: (view: ScreenView) => void;
}

export const BrandGuidelinesView: React.FC<BrandGuidelinesViewProps> = ({ onNavigate }) => {
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  const colors = [
    { name: 'Negro Carbón (Primario)', hex: '#111111', role: 'Fondos hero, botones principales, titulares oscuros' },
    { name: 'Fondo Lienzo (Surface)', hex: '#F9F9F9', role: 'Fondo base de la aplicación y páginas' },
    { name: 'Blanco Puro (Card Surface)', hex: '#FFFFFF', role: 'Contenedores de tarjetas, modales y hojas técnicas' },
    { name: 'Gris Neutro Claro', hex: '#EEEEEE', role: 'Contenedores secundarios e inputs desactivados' },
    { name: 'Borde / Línea Técnica', hex: '#E5E5E5', role: 'Separadores, filetes estructurales y bordes de tarjeta' },
    { name: 'Texto Principal (On Surface)', hex: '#1A1C1C', role: 'Párrafos de alta legibilidad y encabezados' },
    { name: 'Texto Atenuado (Muted)', hex: '#5E5E5E', role: 'Subtítulos, etiquetas métricas y notas al pie' },
    { name: 'Verde Acento / Estado Activo', hex: '#25D366', role: 'Canal de WhatsApp y estados de obra' },
  ];

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

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#5e5e5e] block mb-2">
            Identidad Visual
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111]">
            Manual de Marca
          </h1>
          <p className="mt-2 text-sm text-[#444748] leading-relaxed">
            Directrices de identidad, filosofía conceptual, jerarquía tipográfica y sistema de color de Romero Estudio.
          </p>
        </div>

        <div className="space-y-12">
          {/* 1. FILOSOFÍA DE DISEÑO */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e5e5e5] shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5e5e5e] block mb-2">
              01 • Filosofía de Diseño
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#111111] mb-4">
              Rigor Constructivo y Verdad Material
            </h2>
            <p className="text-sm text-[#444748] leading-relaxed max-w-3xl">
              La identidad de Romero Estudio responde a la misma ética que guía sus obras: pureza en la línea, honestidad en los materiales y eliminación de cualquier artificio innecesario. Diseñamos con precisión geométrica para que el espacio hable por sí mismo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="p-5 bg-[#f9f9f9] rounded-2xl border border-[#e5e5e5]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-1">
                  Sobriedad
                </h4>
                <p className="text-xs text-[#5e5e5e]">
                  Paletas neutras que ceden el protagonismo a la arquitectura, la textura y la luz.
                </p>
              </div>
              <div className="p-5 bg-[#f9f9f9] rounded-2xl border border-[#e5e5e5]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-1">
                  Precisión
                </h4>
                <p className="text-xs text-[#5e5e5e]">
                  Retícula geométrica estricta de 8pt y alineaciones milimétricas.
                </p>
              </div>
              <div className="p-5 bg-[#f9f9f9] rounded-2xl border border-[#e5e5e5]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-1">
                  Transparencia
                </h4>
                <p className="text-xs text-[#5e5e5e]">
                  Claridad técnica en cada ficha de proyecto y comunicación sin falsas promesas.
                </p>
              </div>
            </div>
          </div>

          {/* 2. LOGOTIPO & APLICACIONES */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e5e5e5] shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5e5e5e] block mb-2">
              02 • Logotipo & Isotipo
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#111111] mb-6">
              Morfología y Usos Permitidos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dark variant */}
              <div className="p-8 bg-[#f9f9f9] rounded-2xl border border-[#e5e5e5] flex flex-col items-center justify-center text-center space-y-4">
                <Logo variant="dark" size="lg" />
                <span className="text-xs font-semibold text-[#5e5e5e]">
                  Versión Positiva (Uso general en fondos claros)
                </span>
              </div>

              {/* Light variant */}
              <div className="p-8 bg-[#111111] rounded-2xl border border-black flex flex-col items-center justify-center text-center space-y-4">
                <Logo variant="hero" size="lg" />
                <span className="text-xs font-semibold text-white/70">
                  Versión Negativa (Sobre fondos fotográficos u oscuros)
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#f9f9f9] rounded-xl border border-[#e5e5e5] text-xs text-[#5e5e5e]">
              <strong>Regla de área de resguardo:</strong> Mantener siempre un espacio mínimo equivalente a la altura de la 'R' alrededor del logotipo antes de colocar cualquier otro elemento gráfico.
            </div>
          </div>

          {/* 3. TIPOGRAFÍA */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e5e5e5] shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5e5e5e] block mb-2">
              03 • Sistema Tipográfico
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#111111] mb-2">
              Plus Jakarta Sans
            </h2>
            <p className="text-xs text-[#5e5e5e] mb-8">
              Tipografía geométrica contemporánea de gran legibilidad y equilibrio proporcionales.
            </p>

            <div className="space-y-6">
              <div className="pb-4 border-b border-[#f3f3f3]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] block mb-1">
                  Display / Titulares Principales (800 ExtraBold)
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
                  Arquitectura Integral & Obras de Alta Gama
                </p>
              </div>

              <div className="pb-4 border-b border-[#f3f3f3]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] block mb-1">
                  Encabezados H2 / H3 (700 Bold)
                </span>
                <p className="text-xl sm:text-2xl font-bold text-[#111111]">
                  Casa del Olmo • Estudio Norte • Residencial
                </p>
              </div>

              <div className="pb-4 border-b border-[#f3f3f3]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] block mb-1">
                  Cuerpo de Texto (400 Regular)
                </span>
                <p className="text-sm text-[#444748] max-w-2xl leading-relaxed">
                  Reforma integral de vivienda unifamiliar, priorizando la apertura espacial y la integración de materiales nobles locales como el roble natural y el microcemento pulido.
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] block mb-1">
                  Etiquetas & Microcopy (700 Bold • Tracking +0.15em)
                </span>
                <p className="font-label-caps text-xs text-[#111111]">
                  ESTUDIO DE ARQUITECTURA TÉCNICA • FICHA TÉCNICA
                </p>
              </div>
            </div>
          </div>

          {/* 4. PALETA DE COLOR */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e5e5e5] shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5e5e5e] block mb-2">
              04 • Paleta Cromática
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#111111] mb-6">
              Tokens de Color Arquitectónicos
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {colors.map((c) => (
                <div
                  key={c.hex}
                  onClick={() => copyToClipboard(c.hex)}
                  className="p-4 rounded-2xl border border-[#e5e5e5] hover:border-black/40 transition-all cursor-pointer group bg-[#fdfdfd]"
                >
                  <div
                    className="w-full h-16 rounded-xl border border-black/10 shadow-xs mb-3 flex items-end justify-end p-2"
                    style={{ backgroundColor: c.hex }}
                  >
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.hex === '#FFFFFF' || c.hex === '#F9F9F9' || c.hex === '#EEEEEE' || c.hex === '#E5E5E5'
                          ? 'bg-black/80 text-white'
                          : 'bg-white/80 text-black'
                      }`}
                    >
                      {c.hex}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#111111]">{c.name}</h4>
                  <p className="text-[11px] text-[#5e5e5e] mt-1">{c.role}</p>

                  <div className="mt-2 text-[10px] text-neutral-400 flex items-center gap-1">
                    {copiedColor === c.hex ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCheck className="w-3 h-3" /> ¡Copiado!
                      </span>
                    ) : (
                      <span className="group-hover:text-black transition-colors flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Clic para copiar
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
