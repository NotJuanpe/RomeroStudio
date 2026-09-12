import React, { useState, useEffect } from 'react';
import { ScreenView } from '../types';
import { Logo } from './Logo';
import { Menu, X, ArrowUpRight, Sparkles, SlidersHorizontal, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentView: ScreenView;
  onNavigate: (view: ScreenView) => void;
  onOpenContact: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenContact,
  unreadCount = 3,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomeHero = currentView === 'inicio' && !isScrolled;

  const navItems: { id: ScreenView; label: string; badge?: string | number; isNew?: boolean }[] = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'proyectos', label: 'Obras y Proyectos' },
    { id: 'antes-despues', label: 'Antes y Después' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'panel', label: 'Panel', badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'marca', label: 'Marca' },
    { id: 'ui-kit', label: 'UI Kit' },
  ];

  const handleNavClick = (view: ScreenView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isHomeHero
          ? 'bg-transparent py-5 text-white'
          : 'bg-white/90 backdrop-blur-md py-3.5 border-b border-[#e5e5e5] shadow-xs text-[#1a1c1c]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo
          variant={isHomeHero ? 'hero' : 'dark'}
          onClick={() => handleNavClick('inicio')}
        />

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-full transition-all duration-150 flex items-center gap-1.5 cursor-pointer text-xs font-semibold tracking-wider uppercase ${
                  isActive
                    ? isHomeHero
                      ? 'bg-white text-[#111111] shadow-xs'
                      : 'bg-[#111111] text-white shadow-xs'
                    : isHomeHero
                    ? 'text-white/85 hover:text-white hover:bg-white/10'
                    : 'text-[#5e5e5e] hover:text-[#111111] hover:bg-[#f3f3f3]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`inline-flex items-center justify-center text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? isHomeHero
                          ? 'bg-[#111111] text-white'
                          : 'bg-white text-[#111111]'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            id="header-contact-btn"
            onClick={onOpenContact}
            className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 ${
              isHomeHero
                ? 'bg-white text-[#111111] hover:bg-white/90 shadow-sm'
                : 'bg-[#111111] text-white hover:bg-black shadow-xs'
            }`}
          >
            <span>Contactar</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile menu trigger */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className={`lg:hidden p-2 rounded-lg transition-colors cursor-pointer ${
              isHomeHero
                ? 'text-white hover:bg-white/10'
                : 'text-[#1a1c1c] hover:bg-[#f3f3f3]'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden bg-white text-[#1a1c1c] border-b border-[#e5e5e5] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#111111] text-white'
                      : 'text-[#444748] hover:bg-[#f3f3f3]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-[#111111]' : 'bg-amber-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-[#e5e5e5] flex flex-col gap-2">
              <button
                id="mobile-nav-contact-cta"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-3 bg-[#111111] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Solicitar Presupuesto</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
