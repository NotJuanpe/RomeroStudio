import React from 'react';
import { ScreenView } from '../types';
import { Logo } from './Logo';
import { ArrowUpRight, Mail, Phone, MapPin, Instagram, Linkedin, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ScreenView) => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenContact }) => {
  return (
    <footer id="app-main-footer" className="bg-[#111111] text-white pt-16 pb-12 border-t border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top CTA Row */}
        <div className="pb-12 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/50 block mb-2">
              Dirección & Proyecto
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              ¿Listo para dar forma a tu próximo espacio?
            </h2>
          </div>
          <button
            id="footer-start-project-btn"
            onClick={onOpenContact}
            className="px-6 py-3.5 bg-white hover:bg-neutral-100 text-[#111111] font-bold text-xs uppercase tracking-widest rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <span>Iniciar Conversación</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Links & Info Columns */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Logo variant="light" onClick={() => onNavigate('inicio')} />
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">
              Estudio de arquitectura técnica especializado en obra nueva, reformas integrales de alta gama y dirección técnica rigurosa.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="Instagram de Romero Estudio"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="LinkedIn de Romero Estudio"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li>
                <button
                  onClick={() => onNavigate('inicio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('proyectos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Obras y Proyectos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('antes-despues')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Antes y Después (Comparativas)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('servicios')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Nuestros Servicios
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('panel')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Panel de Gestión</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-white/20 text-white">CMS</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Architectural Specialties */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
              Especialidades
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li>
                <button
                  onClick={() => onNavigate('proyectos')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Obras Nuevas Residenciales
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('proyectos')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Reformas Integrales de Alta Gama
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('antes-despues')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Comparativas Antes y Después
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('servicios')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Dirección Técnica & Project Management
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
              Estudio
            </h4>
            <ul className="space-y-3 text-xs text-neutral-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>Buenos Aires, Argentina (Zona Norte & CABA)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>contacto@romeroestudio.com.ar</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>+54 9 11 4800-9200</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Romero Estudio. Arquitectura Integral. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-neutral-300 transition-colors">Privacidad</span>
            <span className="hover:text-neutral-300 transition-colors">Términos</span>
            <span className="text-neutral-700">|</span>
            {/* Subtle Studio Management Access */}
            <button
              id="footer-admin-access-btn"
              onClick={() => onNavigate('panel')}
              className="hover:text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5 text-neutral-500 hover:text-white"
              title="Acceso al Panel de Gestión"
            >
              <Lock className="w-3 h-3" />
              <span>Acceso Gestión</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
