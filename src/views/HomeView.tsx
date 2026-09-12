import React, { useState } from 'react';
import { Project, ServiceItem, ContactMessage, ScreenView, SiteSettings } from '../types';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  Building2,
  Compass,
  Hammer,
  ShieldCheck,
  Ruler,
  Clock,
  Sparkles,
  Send,
  CalendarCheck,
} from 'lucide-react';

interface HomeViewProps {
  projects: Project[];
  services: ServiceItem[];
  settings?: SiteSettings;
  onSelectProject: (project: Project) => void;
  onNavigate: (view: ScreenView) => void;
  onOpenContact: () => void;
  onSubmitContact: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  projects,
  services,
  settings,
  onSelectProject,
  onNavigate,
  onOpenContact,
  onSubmitContact,
}) => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formType, setFormType] = useState('Obra Nueva');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const beforeAfterProject = projects.find((p) => p.beforeImage) || projects[0];

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    onSubmitContact({
      name: formName,
      email: formEmail,
      projectType: formType,
      message: formMessage || 'Consulta inicial desde el formulario de inicio.',
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormName('');
      setFormEmail('');
      setFormMessage('');
    }, 3000);
  };

  return (
    <div className="w-full bg-[#f9f9f9]">
      {/* 1. HERO SECTION */}
      <section
        id="hero-section"
        className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center bg-[#111111] text-white overflow-hidden pt-24 pb-16"
      >
        {/* Background photo with high fidelity architectural villa */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGg8GnC8XletxD8rXxutbF6VqTsDhgY1KHKMSEAhr4iojfxi6ohMQbR2sqWMY3d4SdSM7jZvBBNyLoHRchaIPQaTmzsPVyC9fjwBfdsEZ3SHI8unQPiEcICokB8l9rsfLifHX_g-kDWrUQLCHPHPm-z9_oVMCz9VEZ7AFYh0wFMkPaPmLeA9iaJ7OMvhy3aR2NgvUDOlrlklhWXZLB_H8WHsVDYNI5Ko7ifnuIryiVZ0tXYxa8Wzb6CA"
          alt="Romero Estudio Arquitectura Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Sophisticated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-[#111111]/70"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white max-w-4xl">
            {settings?.heroTitle || 'Arquitectura Integral.'}
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl font-normal leading-relaxed">
            {settings?.heroSubtitle ||
              'Diseñamos y materializamos espacios singulares aunando rigor técnico, nobleza en los materiales y un control riguroso de cada etapa de obra.'}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              id="hero-explore-projects-btn"
              onClick={() => onNavigate('proyectos')}
              className="px-7 py-3.5 bg-white hover:bg-neutral-100 text-[#111111] font-bold text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-2"
            >
              <span>Ver Obras Destacadas</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-quote-btn"
              onClick={onOpenContact}
              className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-bold text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer active:scale-95"
            >
              Solicitar Cotización
            </button>
          </div>

          {/* Quick Stats Strip */}
          <div className="mt-16 pt-10 border-t border-white/15 w-full grid grid-cols-2 sm:grid-cols-3 gap-6 text-left">
            <div>
              <span className="block text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                15+
              </span>
              <span className="block text-xs uppercase tracking-wider text-neutral-400 mt-0.5">
                Años de Trayectoria
              </span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                40+
              </span>
              <span className="block text-xs uppercase tracking-wider text-neutral-400 mt-0.5">
                Obras Ejecutadas
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="block text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                100%
              </span>
              <span className="block text-xs uppercase tracking-wider text-neutral-400 mt-0.5">
                Compromiso de Plazos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OBRAS DESTACADAS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#5e5e5e] block mb-2">
              Portfolio Seleccionado
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
              Obras Destacadas
            </h2>
          </div>
          <button
            id="view-all-projects-btn"
            onClick={() => onNavigate('proyectos')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-neutral-600 transition-colors cursor-pointer group"
          >
            <span>Ver Todos los Proyectos ({projects.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Featured Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              id={`featured-card-${project.id}`}
              onClick={() => onSelectProject(project)}
              className="group bg-white rounded-2xl overflow-hidden border border-[#e5e5e5] hover:border-black/30 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Image box */}
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

              {/* Info Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#5e5e5e] mb-2 font-medium">
                    <span>{project.scope}</span>
                    <span>{project.area}</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-[#111111] group-hover:text-neutral-700 transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#444748] line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#f3f3f3] flex items-center justify-between text-xs font-bold text-[#111111]">
                  <span>Ver Ficha Técnica</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE BEFORE & AFTER SHOWCASE */}
      <section className="py-20 bg-white border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#5e5e5e] block mb-2">
              Transformación Espacial
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
              Antes y Después: El Poder de la Reforma Integral
            </h2>
            <p className="text-sm text-[#444748] mt-2">
              Descubrí cómo convertimos distribuciones obsoletas y oscuras en viviendas contemporáneas bañadas de luz natural y resueltas con materiales nobles.
            </p>
          </div>

          {beforeAfterProject.beforeImage && (
            <div className="bg-[#f9f9f9] p-6 sm:p-8 rounded-3xl border border-[#e5e5e5]">
              <BeforeAfterSlider
                beforeImage={beforeAfterProject.beforeImage}
                afterImage={beforeAfterProject.afterImage || beforeAfterProject.heroImage}
                title={beforeAfterProject.title}
                subtitle="Arrastrá el separador para contrastar la pre-intervención con la obra terminada"
                heightClass="h-[380px] sm:h-[500px]"
              />

              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#e5e5e5]">
                <div>
                  <h4 className="font-bold text-sm text-[#111111]">
                    {beforeAfterProject.title} — {beforeAfterProject.scope}
                  </h4>
                  <p className="text-xs text-[#5e5e5e] mt-0.5">
                    {beforeAfterProject.materials}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('antes-despues')}
                  className="px-5 py-2.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-2"
                >
                  <span>Ver Más Comparativas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. NUESTROS SERVICIOS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#5e5e5e] block mb-2">
            Metodología & Alcance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
            Nuestros Servicios
          </h2>
          <p className="text-sm text-[#444748] mt-2">
            Cubrimos el ciclo de vida completo de la arquitectura, desde el croquis inicial hasta la entrega final de llaves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <div
              key={srv.id}
              className="bg-white p-8 rounded-2xl border border-[#e5e5e5] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f3f3f3] text-[#111111] flex items-center justify-center mb-6 font-extrabold text-lg">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#111111] mb-3">
                  {srv.title}
                </h3>
                <p className="text-xs text-[#444748] leading-relaxed mb-6">
                  {srv.shortDesc}
                </p>

                <div className="space-y-2 pt-4 border-t border-[#f3f3f3]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5e5e5e] block mb-2">
                    Entregables Principales:
                  </span>
                  {srv.deliverables.slice(0, 3).map((item, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 text-xs text-[#444748]">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#f3f3f3]">
                <button
                  onClick={() => onNavigate('servicios')}
                  className="w-full py-2.5 bg-[#f3f3f3] hover:bg-[#111111] text-[#111111] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center"
                >
                  Conocer Metodología
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. UN PROCESO SIN ESTRÉS (4 STEPS) */}
      <section id="proceso-section" className="py-20 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#5e5e5e] block mb-2">
              Flujo Constructivo
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
              Un Proceso Sin Estrés
            </h2>
            <p className="text-sm text-[#444748] mt-2">
              Transformamos la complejidad de una obra en un cronograma claro, transparente y predecible.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Diagnóstico & Relevamiento',
                desc: 'Estudio de normativa, mediciones in situ y definición del programa de necesidades con el cliente.',
              },
              {
                step: '02',
                title: 'Anteproyecto & Presupuesto',
                desc: 'Modelado 3D, definición exhaustiva de materiales y presupuesto cerrado sin costes ocultos.',
              },
              {
                step: '03',
                title: 'Ejecución & Dirección',
                desc: 'Supervisión técnica continua en obra, gestión de gremios y reportes semanales fotográficos.',
              },
              {
                step: '04',
                title: 'Entrega Llave en Mano',
                desc: 'Revisión minuciosa de terminaciones, entrega de llaves y documentación técnica para su uso.',
              },
            ].map((st) => (
              <div
                key={st.step}
                className="bg-[#f9f9f9] p-6 rounded-2xl border border-[#e5e5e5] relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-extrabold text-[#111111] opacity-20 block mb-4">
                    {st.step}
                  </span>
                  <h3 className="text-base font-bold text-[#111111] mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[#5e5e5e] leading-relaxed">
                    {st.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#e5e5e5] flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Control de calidad garantizado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTANOS TU IDEA (INLINE CONTACT CARD) */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-neutral-400 block mb-2">
              Contacto Directo
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Contanos tu idea
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-8">
              Dejanos tus datos y nos pondremos en contacto para coordinar una reunión técnica inicial sin compromiso.
            </p>

            {formSubmitted ? (
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center animate-in zoom-in-95">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-lg font-bold">¡Mensaje enviado con éxito!</h4>
                <p className="text-xs text-neutral-300 mt-1">
                  Tu consulta fue registrada en nuestro panel. Nos contactaremos en menos de 24 horas hábiles.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInlineSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Tu nombre y apellido *"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white focus:bg-white/15 transition-all"
                  />
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="Tu email de contacto *"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white focus:bg-white/15 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-white transition-all cursor-pointer"
                  >
                    <option value="Obra Nueva" className="text-black">Obra Nueva</option>
                    <option value="Reforma Integral" className="text-black">Reforma Integral</option>
                    <option value="Espacio Comercial" className="text-black">Espacio Comercial</option>
                    <option value="Dirección Técnica" className="text-black">Dirección Técnica</option>
                  </select>
                  <input
                    type="text"
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Breve detalle (ej: casa de 300m² en Nordelta)"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white focus:bg-white/15 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#111111] hover:bg-neutral-100 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Enviar Consulta</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
