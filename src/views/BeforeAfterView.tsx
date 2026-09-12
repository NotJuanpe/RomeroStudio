import React, { useState } from 'react';
import { Project } from '../types';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { ArrowLeftRight, CheckCircle2, AlertTriangle, Sparkles, Layers, ArrowUpRight } from 'lucide-react';

interface BeforeAfterViewProps {
  projects: Project[];
  onOpenContact: () => void;
  onSelectProject: (project: Project) => void;
}

export const BeforeAfterView: React.FC<BeforeAfterViewProps> = ({
  projects,
  onOpenContact,
  onSelectProject,
}) => {
  const comparisonProjects = projects.filter((p) => p.beforeImage);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    comparisonProjects[0]?.id || projects[0]?.id
  );
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  const currentProject =
    comparisonProjects.find((p) => p.id === selectedProjectId) || comparisonProjects[0];

  return (
    <div className="w-full bg-[#f9f9f9] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#5e5e5e] block mb-2">
            Laboratorio de Transformación
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111]">
            Antes y Después
          </h1>
          <p className="mt-2 text-sm text-[#444748] leading-relaxed">
            Explorá el impacto tangible de nuestra arquitectura integral. Deslizá para comparar el estado original antes de la intervención frente a la obra concluida.
          </p>
        </div>

        {/* Project Selector Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-3 rounded-2xl border border-[#e5e5e5]">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {comparisonProjects.map((p) => {
              const isActive = p.id === currentProject?.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'bg-[#f3f3f3] text-[#5e5e5e] hover:text-[#111111] hover:bg-[#e8e8e8]'
                  }`}
                >
                  {p.title}
                </button>
              );
            })}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-[#eeeeee] p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'slider' ? 'bg-white text-[#111111] shadow-xs' : 'text-[#5e5e5e]'
              }`}
            >
              Deslizador Split
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'side-by-side' ? 'bg-white text-[#111111] shadow-xs' : 'text-[#5e5e5e]'
              }`}
            >
              Lado a Lado
            </button>
          </div>
        </div>

        {/* Comparison Showcase */}
        {currentProject && currentProject.beforeImage && (
          <div className="space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e5e5] shadow-xs">
              {viewMode === 'slider' ? (
                <BeforeAfterSlider
                  beforeImage={currentProject.beforeImage}
                  afterImage={currentProject.afterImage || currentProject.heroImage}
                  title={currentProject.title}
                  subtitle="Arrastrá la barra central o hacé clic para comparar los estados"
                  heightClass="h-[400px] sm:h-[540px]"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before */}
                  <div className="flex flex-col gap-2">
                    <div className="relative h-80 rounded-2xl overflow-hidden bg-neutral-900 border border-[#e5e5e5]">
                      <img
                        src={currentProject.beforeImage}
                        alt="Pre-Intervención"
                        className="w-full h-full object-cover filter brightness-90 contrast-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-white text-[11px] font-extrabold uppercase tracking-wider">
                        Pre-Intervención (Estado Inicial)
                      </div>
                    </div>
                    <p className="text-xs text-[#5e5e5e] px-1">
                      Compartimentación excesiva, acabados deteriorados y déficit lumínico severo.
                    </p>
                  </div>

                  {/* After */}
                  <div className="flex flex-col gap-2">
                    <div className="relative h-80 rounded-2xl overflow-hidden bg-neutral-900 border border-[#e5e5e5]">
                      <img
                        src={currentProject.afterImage || currentProject.heroImage}
                        alt="Post-Intervención"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-[#111111] text-[11px] font-extrabold uppercase tracking-wider">
                        Post-Intervención (Obra Terminada)
                      </div>
                    </div>
                    <p className="text-xs text-[#5e5e5e] px-1">
                      Continuidad espacial diáfana, integración con el exterior y acabados nobles.
                    </p>
                  </div>
                </div>
              )}

              {/* Technical Analysis Cards */}
              <div className="mt-8 pt-8 border-t border-[#f3f3f3] grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Diagnóstico previo */}
                <div className="p-5 bg-[#f9f9f9] rounded-2xl border border-[#e5e5e5]">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Diagnóstico Inicial</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#444748]">
                    <li>• Tabiques ciegos que obstaculizaban la iluminación cenital.</li>
                    <li>• Instalaciones eléctricas y de fontanería obsoletas.</li>
                    <li>• Aislamiento térmico deficiente en carpinterías.</li>
                  </ul>
                </div>

                {/* 2. Intervención Técnica */}
                <div className="p-5 bg-[#f9f9f9] rounded-2xl border border-[#e5e5e5]">
                  <div className="flex items-center gap-2 text-[#111111] font-bold text-xs uppercase tracking-wider mb-2">
                    <Layers className="w-4 h-4" />
                    <span>Intervención Realizada</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#444748]">
                    <li>• Apeos estructurales con vigas de acero laminado vistas.</li>
                    <li>• Sustitución integral por carpinterías con rotura de puente térmico.</li>
                    <li>• Suelos continuos de microcemento y revestimientos de roble.</li>
                  </ul>
                </div>

                {/* 3. Resultados Obtenidos */}
                <div className="p-5 bg-[#f9f9f9] rounded-2xl border border-[#e5e5e5]">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resultados & Confort</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#444748]">
                    <li>• +80% de ganancia en luz natural diurna directa.</li>
                    <li>• Reducción del 45% en consumo energético de climatización.</li>
                    <li>• Revalorización patrimonial inmediata del inmueble.</li>
                  </ul>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-8 pt-6 border-t border-[#f3f3f3] flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => onSelectProject(currentProject)}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline cursor-pointer"
                >
                  <span>Ver Ficha Técnica Completa de {currentProject.title}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenContact}
                  className="px-6 py-3 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-2"
                >
                  <span>Consultar por mi Reforma</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
