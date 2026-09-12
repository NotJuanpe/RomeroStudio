import React, { useState } from 'react';
import { Project } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { X, Calendar, Layers, MapPin, CheckCircle2, ArrowRight, Share2, Ruler } from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onInquireProject: (projectName: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onInquireProject,
}) => {
  const [activeTab, setActiveTab] = useState<'fotos' | 'ficha' | 'antes-despues'>('fotos');

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        id="project-detail-modal-container"
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-[#e5e5e5] overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#eeeeee] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#f3f3f3] text-[#111111] border border-[#e5e5e5]">
              {project.category}
            </span>
            <h3 className="text-xl font-bold tracking-tight text-[#111111]">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5e5e5e] hover:text-black hover:bg-[#f3f3f3] rounded-full transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#eeeeee] flex gap-4 bg-[#fcfcfc] shrink-0 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('fotos')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'fotos'
                ? 'border-[#111111] text-[#111111]'
                : 'border-transparent text-[#5e5e5e] hover:text-[#111111]'
            }`}
          >
            Galería & Vista
          </button>
          <button
            onClick={() => setActiveTab('ficha')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'ficha'
                ? 'border-[#111111] text-[#111111]'
                : 'border-transparent text-[#5e5e5e] hover:text-[#111111]'
            }`}
          >
            Ficha Técnica & Memoria
          </button>
          {project.beforeImage && (
            <button
              onClick={() => setActiveTab('antes-despues')}
              className={`py-3.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'antes-despues'
                  ? 'border-[#111111] text-[#111111]'
                  : 'border-transparent text-[#5e5e5e] hover:text-[#111111]'
              }`}
            >
              Antes y Después
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'fotos' && (
            <div className="space-y-6">
              {/* Hero Image */}
              <div className="relative rounded-2xl overflow-hidden h-[340px] sm:h-[440px] bg-[#111111]">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-bold tracking-widest uppercase opacity-80 block mb-1">
                    {project.scope} • {project.year}
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {project.title}
                  </h4>
                  <p className="text-sm opacity-90 mt-1 max-w-2xl font-normal">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Detail shots grid */}
              {project.detailImage && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl overflow-hidden h-64 bg-gray-100 border border-[#e5e5e5]">
                    <img
                      src={project.detailImage}
                      alt={`${project.title} detalle`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="bg-[#f9f9f9] border border-[#e5e5e5] rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#5e5e5e] block mb-2">
                        Materialidad & Singularidades
                      </span>
                      <p className="text-sm text-[#444748] leading-relaxed">
                        {project.materials}
                      </p>
                      {project.location && (
                        <p className="text-xs text-[#5e5e5e] mt-4 flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Ubicación: {project.location}</span>
                        </p>
                      )}
                    </div>
                    <div className="pt-4 border-t border-[#e5e5e5]">
                      <button
                        onClick={() => onInquireProject(project.title)}
                        className="w-full py-2.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95"
                      >
                        Consultar por un proyecto similar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ficha' && (
            <div className="space-y-6">
              {/* Technical Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] block">
                    Superficie
                  </span>
                  <span className="text-lg font-bold text-[#111111] block mt-1">
                    {project.area}
                  </span>
                </div>
                <div className="p-4 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] block">
                    Año de Ejecución
                  </span>
                  <span className="text-lg font-bold text-[#111111] block mt-1">
                    {project.year}
                  </span>
                </div>
                <div className="p-4 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] block">
                    Alcance
                  </span>
                  <span className="text-lg font-bold text-[#111111] block mt-1">
                    {project.scope}
                  </span>
                </div>
                <div className="p-4 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] block">
                    Estado
                  </span>
                  <span className="text-lg font-bold text-emerald-700 block mt-1">
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Memoria Descriptiva */}
              <div className="p-6 bg-[#f9f9f9] border border-[#e5e5e5] rounded-2xl">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#111111] mb-3">
                  Memoria Descriptiva del Proyecto
                </h4>
                <p className="text-sm text-[#444748] leading-relaxed">
                  {project.longDescription || project.description}
                </p>
              </div>

              {/* Materials & Specific Specs */}
              <div className="p-6 bg-[#f9f9f9] border border-[#e5e5e5] rounded-2xl">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#111111] mb-3">
                  Especificaciones Constructivas & Materialidad
                </h4>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                    <span className="text-[#5e5e5e] font-medium">Materiales Principales:</span>
                    <span className="font-semibold text-[#111111] text-right">{project.materials}</span>
                  </div>
                  {project.specs &&
                    Object.entries(project.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-[#e5e5e5]">
                        <span className="text-[#5e5e5e] font-medium">{key}:</span>
                        <span className="font-semibold text-[#111111] text-right">{val}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'antes-despues' && project.beforeImage && (
            <div className="space-y-4">
              <BeforeAfterSlider
                beforeImage={project.beforeImage}
                afterImage={project.afterImage || project.heroImage}
                title={`Transformación de ${project.title}`}
                subtitle="Deslizá el cursor o tocá para comparar el estado previo y la obra finalizada"
                heightClass="h-[380px] sm:h-[460px]"
              />
              <div className="p-4 bg-[#f9f9f9] rounded-xl border border-[#e5e5e5] text-xs text-[#5e5e5e]">
                <p className="leading-relaxed">
                  <strong>Intervención técnica:</strong> Consolidación estructural de forjados, apertura de vanos perimetrales para captación de luz natural, sustitución de carpinterías con rotura de puente térmico y nueva red de instalaciones de alta eficiencia.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#fcfcfc] border-t border-[#eeeeee] flex items-center justify-between shrink-0">
          <div className="text-xs text-[#5e5e5e]">
            Romero Estudio • Arquitectura Integral
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#e5e5e5] hover:bg-[#f3f3f3] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onClose();
                onInquireProject(project.title);
              }}
              className="px-5 py-2 bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <span>Solicitar Presupuesto</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
