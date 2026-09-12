import React, { useState, useMemo } from 'react';
import { Project, ProjectCategory } from '../types';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import {
  Search,
  Filter,
  ArrowUpRight,
  Layers,
  Calendar,
  Sparkles,
  Maximize2,
  SlidersHorizontal,
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenBeforeAfter: (project: Project) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelectProject,
  onOpenBeforeAfter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Todos', 'Residencial', 'Comercial', 'Reforma', 'Corporativo'];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCategory =
        selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.materials.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  // Specific projects for featured bento presentation (Casa del Olmo & Estudio Norte)
  const casaDelOlmo = projects.find((p) => p.id === 'casa-del-olmo') || projects[0];
  const estudioNorte = projects.find((p) => p.id === 'estudio-norte') || projects[1];

  return (
    <div className="w-full bg-[#f9f9f9] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#5e5e5e] block mb-2">
                Portfolio & Obras Ejecutadas
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111]">
                Obras y Proyectos
              </h1>
              <p className="mt-2 text-sm text-[#444748] max-w-2xl leading-relaxed">
                Selección de intervenciones residenciales y comerciales donde la precisión en el detalle y la fidelidad constructiva definen cada espacio.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5e5e5e]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por material, nombre..."
                  className="pl-9 pr-4 py-2 bg-white border border-[#e5e5e5] rounded-full text-xs text-[#1a1c1c] focus:outline-none focus:border-[#111111] transition-all w-full sm:w-60 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white text-[#5e5e5e] hover:text-[#111111] border border-[#e5e5e5] hover:bg-[#f3f3f3]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 1. HERO BENTO SECTION: CASA DEL OLMO (Matches Screen 1 Mockup) */}
        {selectedCategory === 'Todos' && !searchQuery && casaDelOlmo && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#5e5e5e]">
                Proyecto Destacado 01
              </span>
              <span className="text-xs font-bold text-[#111111]">
                {casaDelOlmo.category} • {casaDelOlmo.year}
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5e5] shadow-xs hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Info & Technical Specs */}
                <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#f3f3f3] text-[#111111] inline-block mb-3">
                      {casaDelOlmo.scope}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
                      {casaDelOlmo.title}
                    </h2>
                    <p className="text-xs text-[#444748] mt-3 leading-relaxed">
                      {casaDelOlmo.description}
                    </p>

                    {/* Ficha Técnica Table */}
                    <div className="mt-8 space-y-3 pt-6 border-t border-[#f3f3f3]">
                      <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#111111]">
                        Ficha Técnica
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1.5 border-b border-[#f3f3f3]">
                          <span className="text-[#5e5e5e]">Superficie:</span>
                          <span className="font-bold text-[#111111]">{casaDelOlmo.area}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-[#f3f3f3]">
                          <span className="text-[#5e5e5e]">Año de Finalización:</span>
                          <span className="font-bold text-[#111111]">{casaDelOlmo.year}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-[#f3f3f3]">
                          <span className="text-[#5e5e5e]">Alcance de Obra:</span>
                          <span className="font-bold text-[#111111]">{casaDelOlmo.scope}</span>
                        </div>
                        <div className="flex flex-col py-1.5 border-b border-[#f3f3f3]">
                          <span className="text-[#5e5e5e] mb-1">Materiales:</span>
                          <span className="font-semibold text-[#111111] leading-tight">
                            {casaDelOlmo.materials}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-2.5">
                    <button
                      onClick={() => onSelectProject(casaDelOlmo)}
                      className="w-full py-3 bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-98"
                    >
                      <span>Ver Ficha Técnica Completa</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right Column: Visual Layout (Hero Image + Detail + Before/After preview) */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  {/* Large Hero */}
                  <div
                    onClick={() => onSelectProject(casaDelOlmo)}
                    className="relative h-72 sm:h-96 rounded-2xl overflow-hidden cursor-pointer group bg-neutral-900 border border-[#e5e5e5]"
                  >
                    <img
                      src={casaDelOlmo.heroImage}
                      alt={casaDelOlmo.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
                      Vista Principal Interior
                    </div>
                  </div>

                  {/* Sub-grid: Detail photo + Before & After Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Detail image */}
                    {casaDelOlmo.detailImage && (
                      <div
                        onClick={() => onSelectProject(casaDelOlmo)}
                        className="relative h-56 rounded-2xl overflow-hidden cursor-pointer group bg-neutral-100 border border-[#e5e5e5]"
                      >
                        <img
                          src={casaDelOlmo.detailImage}
                          alt="Detalle escalera y ladrillo"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-extrabold text-[#111111]">
                          Detalle Constructivo • Ladrillo & Madera
                        </div>
                      </div>
                    )}

                    {/* Interactive Before & After Card */}
                    {casaDelOlmo.beforeImage && (
                      <div
                        onClick={() => onOpenBeforeAfter(casaDelOlmo)}
                        className="h-56 bg-[#111111] text-white rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer border border-[#e5e5e5]"
                      >
                        {/* Background split preview */}
                        <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity">
                          <img
                            src={casaDelOlmo.afterImage || casaDelOlmo.heroImage}
                            alt="Comparativa"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="relative z-10">
                          <span className="px-2.5 py-1 rounded-md bg-white text-[#111111] text-[10px] font-extrabold uppercase tracking-wider inline-block">
                            Antes y Después
                          </span>
                          <h4 className="text-lg font-bold text-white mt-2">
                            Comparativa Espacial
                          </h4>
                          <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                            Ver estado pre-existente tabicado frente al nuevo espacio integrado.
                          </p>
                        </div>

                        <div className="relative z-10 pt-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-400">
                          <span>Deslizar Comparador</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. SECOND FEATURED BENTO: ESTUDIO NORTE (Matches Screen 1 Mockup) */}
        {selectedCategory === 'Todos' && !searchQuery && estudioNorte && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#5e5e5e]">
                Proyecto Destacado 02
              </span>
              <span className="text-xs font-bold text-[#111111]">
                {estudioNorte.category} • {estudioNorte.year}
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e5e5] shadow-xs hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visuals on Left (Reversed layout for dynamic visual rhythm) */}
                <div className="lg:col-span-8 order-2 lg:order-1 flex flex-col gap-4">
                  <div
                    onClick={() => onSelectProject(estudioNorte)}
                    className="relative h-72 sm:h-96 rounded-2xl overflow-hidden cursor-pointer group bg-neutral-900 border border-[#e5e5e5]"
                  >
                    <img
                      src={estudioNorte.heroImage}
                      alt={estudioNorte.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
                      Espacio Corporativo Diáfano
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {estudioNorte.detailImage && (
                      <div
                        onClick={() => onSelectProject(estudioNorte)}
                        className="relative h-56 rounded-2xl overflow-hidden cursor-pointer group bg-neutral-100 border border-[#e5e5e5]"
                      >
                        <img
                          src={estudioNorte.detailImage}
                          alt="Detalle mobiliario y diseño"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-extrabold text-[#111111]">
                          Mobiliario Integrado a Medida
                        </div>
                      </div>
                    )}

                    {estudioNorte.beforeImage && (
                      <div
                        onClick={() => onOpenBeforeAfter(estudioNorte)}
                        className="h-56 bg-[#1a1c1c] text-white rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer border border-[#e5e5e5]"
                      >
                        <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity">
                          <img
                            src={estudioNorte.heroImage}
                            alt="Comparativa"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="relative z-10">
                          <span className="px-2.5 py-1 rounded-md bg-white text-[#111111] text-[10px] font-extrabold uppercase tracking-wider inline-block">
                            Evolución de Obra
                          </span>
                          <h4 className="text-lg font-bold text-white mt-2">
                            Antes y Después
                          </h4>
                          <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                            De estructura de hormigón en bruto a oficinas corporativas operativas.
                          </p>
                        </div>
                        <div className="relative z-10 pt-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-400">
                          <span>Comparar Estados</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Specs */}
                <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#f3f3f3] text-[#111111] inline-block mb-3">
                      {estudioNorte.scope}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
                      {estudioNorte.title}
                    </h2>
                    <p className="text-xs text-[#444748] mt-3 leading-relaxed">
                      {estudioNorte.description}
                    </p>

                    <div className="mt-8 space-y-3 pt-6 border-t border-[#f3f3f3]">
                      <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#111111]">
                        Ficha Técnica
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1.5 border-b border-[#f3f3f3]">
                          <span className="text-[#5e5e5e]">Superficie:</span>
                          <span className="font-bold text-[#111111]">{estudioNorte.area}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-[#f3f3f3]">
                          <span className="text-[#5e5e5e]">Año de Finalización:</span>
                          <span className="font-bold text-[#111111]">{estudioNorte.year}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-[#f3f3f3]">
                          <span className="text-[#5e5e5e]">Alcance:</span>
                          <span className="font-bold text-[#111111]">{estudioNorte.scope}</span>
                        </div>
                        <div className="flex flex-col py-1.5 border-b border-[#f3f3f3]">
                          <span className="text-[#5e5e5e] mb-1">Materiales:</span>
                          <span className="font-semibold text-[#111111] leading-tight">
                            {estudioNorte.materials}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-2.5">
                    <button
                      onClick={() => onSelectProject(estudioNorte)}
                      className="w-full py-3 bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-98"
                    >
                      <span>Ver Ficha Técnica Completa</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. ALL PROJECTS GRID */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
              {selectedCategory === 'Todos' ? 'Colección Completa de Obras' : `Proyectos: ${selectedCategory}`}
            </h3>
            <span className="text-xs text-[#5e5e5e]">
              Mostrando {filteredProjects.length} proyectos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                onClick={() => onSelectProject(project)}
                className="group bg-white rounded-2xl overflow-hidden border border-[#e5e5e5] hover:border-black/30 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden bg-neutral-900">
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#111111] shadow-xs">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-md text-white">
                      {project.year}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#5e5e5e] mb-2 font-medium">
                      <span>{project.scope}</span>
                      <span>{project.area}</span>
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-[#111111] group-hover:text-neutral-700 transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#444748] line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#f3f3f3] flex items-center justify-between text-xs font-bold text-[#111111]">
                    <span>Explorar Proyecto</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#e5e5e5]">
              <p className="text-sm font-bold text-[#111111]">
                No se encontraron proyectos con esos criterios.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('Todos');
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Restablecer Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
