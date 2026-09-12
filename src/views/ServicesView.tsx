import React from 'react';
import { ServiceItem } from '../types';
import {
  CheckCircle,
  Clock,
  ShieldCheck,
  Building,
  Layers,
  FileText,
  Hammer,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface ServicesViewProps {
  services: ServiceItem[];
  onOpenContact: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ services, onOpenContact }) => {
  const phases = [
    {
      num: '01',
      title: 'Diagnóstico de Viabilidad & Programa',
      desc: 'Análisis urbanístico, compatibilidad normativa municipal, estudio geotécnico preliminar y definición del programa de necesidades espaciales y presupuestarias.',
    },
    {
      num: '02',
      title: 'Anteproyecto & Proyecto Ejecutivo',
      desc: 'Diseño arquitectónico, modelado BIM 3D, cálculos estructurales, instalaciones de eficiencia energética y redacción de la memoria técnica de calidades.',
    },
    {
      num: '03',
      title: 'Licitación & Presupuesto Cerrado',
      desc: 'Comparativo pormenorizado de proveedores y subcontratistas. Fijación de costes unitarios y contrato de obra con plazos y penalizaciones calendarizadas.',
    },
    {
      num: '04',
      title: 'Dirección de Obra & Certificaciones',
      desc: 'Presencia semanal de arquitectos directores en tajo, verificación de ensayos de materiales, resolución de encuentros técnicos y emisión de certificaciones.',
    },
    {
      num: '05',
      title: 'Recepción & Garantías',
      desc: 'Inspección de terminaciones, tramitación de licencia de primera ocupación o final de obra, entrega del Libro del Edificio y garantía post-construcción.',
    },
  ];

  const faqs = [
    {
      q: '¿Cómo garantizan que no habrá sobrecostes en la obra?',
      a: 'Trabajamos con un modelo de Presupuesto Cerrado por partidas. Antes de mover el primer ladrillo, el proyecto de ejecución define cada milímetro de material e instalación, eliminando imprevistos de obra.',
    },
    {
      q: '¿Se encargan de todos los trámites municipales y licencias?',
      a: 'Sí. Nuestro servicio de Gestión Integral incluye la redacción del proyecto visado por el colegio profesional, la tramitación ante el ayuntamiento o comuna y el seguimiento hasta la obtención de la licencia.',
    },
    {
      q: '¿Puedo contratar únicamente la Dirección Técnica si ya tengo planos?',
      a: 'Totalmente. Ofrecemos el servicio independiente de Dirección Técnica para auditar a tu constructora y garantizar que la ejecución respete estrictamente los estándares constructivos y el pliego de condiciones.',
    },
    {
      q: '¿Qué tipo de clientes suelen contratar a Romero Estudio?',
      a: 'Tanto particulares que buscan construir o reformar su vivienda con acabados de máxima calidad sin el estrés de lidiar con múltiples gremios, como inversores y empresas que exigen estricto cumplimiento de plazos y ROI.',
    },
  ];

  return (
    <div className="w-full bg-[#f9f9f9] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#5e5e5e] block mb-2">
            Servicios Profesionales
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111]">
            Arquitectura Integral & Gestión
          </h1>
          <p className="mt-2 text-sm text-[#444748] leading-relaxed">
            Ofrecemos un servicio transversal donde arquitectura, ingeniería y control de costes operan bajo un mismo estándar de máxima exigencia constructiva.
          </p>
        </div>

        {/* 3 Main Services Detailed Cards */}
        <div className="space-y-8 mb-24">
          {services.map((srv, idx) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e5e5e5] shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Column 1: Title & Overview */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-[#111111] opacity-25 block mb-2">
                      0{idx + 1}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111] mb-3">
                      {srv.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#444748] leading-relaxed mb-6">
                      {srv.fullDesc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[#5e5e5e] bg-[#f9f9f9] p-3 rounded-xl border border-[#e5e5e5] w-fit">
                    <Clock className="w-4 h-4 text-[#111111]" />
                    <span>Plazo estimado: {srv.timeline}</span>
                  </div>
                </div>

                {/* Column 2: Deliverables & Specs */}
                <div className="lg:col-span-7 bg-[#fcfcfc] p-6 sm:p-8 rounded-2xl border border-[#eeeeee] flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#111111] mb-4">
                      Entregables & Compromisos Contractuales:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {srv.deliverables.map((d, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2.5 text-xs text-[#1a1c1c]">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#eeeeee] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <span className="text-[11px] text-[#5e5e5e]">
                      Reunión técnica inicial de diagnóstico incluida sin costo.
                    </span>
                    <button
                      onClick={onOpenContact}
                      className="px-5 py-2.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                    >
                      <span>Consultar este servicio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chronological Phases */}
        <div className="mb-24">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#5e5e5e] block mb-2">
              Cronograma Constructivo
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#111111]">
              Las 5 Fases de Nuestro Método
            </h2>
            <p className="text-xs text-[#5e5e5e] mt-1">
              Un flujo de trabajo transparente diseñado para garantizar que tu proyecto se entregue a tiempo y dentro de presupuesto.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {phases.map((ph) => (
              <div
                key={ph.num}
                className="bg-white p-6 rounded-2xl border border-[#e5e5e5] flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-[#111111] opacity-20 block mb-3">
                    {ph.num}
                  </span>
                  <h3 className="text-sm font-bold text-[#111111] mb-2 leading-snug">
                    {ph.title}
                  </h3>
                  <p className="text-xs text-[#5e5e5e] leading-relaxed">
                    {ph.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantees Strip */}
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-12 mb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Presupuesto Cerrado</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Compromiso contractual sin desviaciones ni sobrecostes imprevistos de obra.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-white">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Plazos Calendarizados</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Cronograma de entregas e hitos vinculados por contrato de obra.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-white">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Garantía Estructural</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Aseguramiento de solidez constructiva y cobertura integral posventa.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#5e5e5e] block mb-2">
              Dudas Frecuentes
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#111111]">
              Preguntas sobre Nuestro Trabajo
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#e5e5e5]"
              >
                <h4 className="text-sm font-bold text-[#111111] mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#5e5e5e]" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-[#444748] leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
