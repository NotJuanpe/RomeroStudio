/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenView, Project, ContactMessage, ServiceItem, SiteSettings, SiteStats } from './types';
import { INITIAL_PROJECTS, INITIAL_SERVICES, INITIAL_MESSAGES } from './mockData';
import { api } from './api';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ContactModal } from './components/ContactModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { SplashScreen } from './components/SplashScreen';
import { AdminLoginView } from './components/AdminLoginView';

// Views
import { HomeView } from './views/HomeView';
import { ProjectsView } from './views/ProjectsView';
import { BeforeAfterView } from './views/BeforeAfterView';
import { ServicesView } from './views/ServicesView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { BrandGuidelinesView } from './views/BrandGuidelinesView';
import { UIKitView } from './views/UIKitView';

const DEFAULT_SETTINGS: SiteSettings = {
  studioName: 'Romero Estudio - Arquitectura Integral',
  tagline: 'Obras de Alta Gama & Gestión de Proyectos',
  email: 'contacto@romeroestudio.com',
  phone: '+54 9 11 4800-9200',
  address: 'Vicente López & Recoleta, Buenos Aires',
  heroTitle: 'Arquitectura Integral.',
  heroSubtitle: 'Diseñamos y materializamos espacios singulares aunando rigor técnico, nobleza en los materiales y un control riguroso de cada etapa de obra.',
  whatsappNumber: '5491148009200',
};

const getInitialView = (): ScreenView => {
  if (typeof window === 'undefined') return 'inicio';
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const search = new URLSearchParams(window.location.search);
  const viewParam = search.get('view') || (search.has('admin') || search.has('panel') ? 'panel' : null);

  const target = viewParam || hash;
  if (target === 'panel' || target === 'admin') return 'panel';
  if (target === 'marca') return 'marca';
  if (target === 'ui-kit' || target === 'uikit') return 'ui-kit';
  if (target === 'proyectos') return 'proyectos';
  if (target === 'antes-despues') return 'antes-despues';
  if (target === 'servicios') return 'servicios';
  return 'inicio';
};

export default function App() {
  const [currentView, setCurrentView] = useState<ScreenView>(getInitialView);
  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const search = new URLSearchParams(window.location.search);
    // If arriving specifically with deep link to a subpage or admin, bypass landing
    if (hash && hash !== 'inicio' && hash !== 'landing') return true;
    if (search.has('admin') || search.has('panel') || search.has('view')) return true;
    return false;
  });
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<SiteStats | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Modals
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  // Authenticated Admin Session
  const [adminUser, setAdminUser] = useState<any>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('romero_admin_session') || sessionStorage.getItem('romero_admin_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const showToast = (text: string) => {
    setToastText(text);
    setTimeout(() => setToastText(null), 3500);
  };

  const handleLogout = () => {
    localStorage.removeItem('romero_admin_session');
    sessionStorage.removeItem('romero_admin_session');
    setAdminUser(null);
    showToast('Sesión de administración cerrada.');
    handleNavigate('inicio');
  };

  const handleNavigate = (view: ScreenView) => {
    setCurrentView(view);
    if (view === 'inicio') {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } else {
      window.location.hash = view;
    }
  };

  // Sync hash routing so URLs like #panel, #marca, #ui-kit work cleanly
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'landing') {
        setHasEntered(false);
        setCurrentView('inicio');
        return;
      }
      const view = getInitialView();
      setCurrentView(view);
      if (view !== 'inicio') {
        setHasEntered(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard shortcut for studio administrator: Alt + A or Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.altKey && (e.key === 'a' || e.key === 'A')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a'))
      ) {
        e.preventDefault();
        handleNavigate(currentView === 'panel' ? 'inicio' : 'panel');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  // Initial fetch from backend API
  const refreshBackendData = async () => {
    setIsLoading(true);
    try {
      const [fetchedProjects, fetchedMessages, fetchedServices, fetchedSettings, fetchedStats] = await Promise.all([
        api.getProjects(),
        api.getMessages(),
        api.getServices(),
        api.getSettings(),
        api.getStats(),
      ]);

      if (fetchedProjects && fetchedProjects.length > 0) setProjects(fetchedProjects);
      if (fetchedMessages) setMessages(fetchedMessages);
      if (fetchedServices && fetchedServices.length > 0) setServices(fetchedServices);
      if (fetchedSettings) setSettings(fetchedSettings);
      if (fetchedStats) setStats(fetchedStats);
    } catch (error) {
      console.warn('Backend loading completed with fallback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshBackendData();
    api.recordVisit();
  }, []);

  // Handlers connected to Express REST API
  const handleAddProject = async (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    showToast(`Guardando "${newProject.title}" en el backend...`);

    try {
      const created = await api.createProject(newProject);
      setProjects((prev) => [created, ...prev.filter((p) => p.id !== newProject.id && p.id !== created.id)]);
      showToast(`✓ Proyecto "${newProject.title}" persistido en el servidor.`);
      const updatedStats = await api.getStats();
      setStats(updatedStats);
    } catch (e) {
      console.error('Error creating project:', e);
      showToast('Proyecto añadido en memoria local.');
    }
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    try {
      await api.updateProject(id, updates);
      showToast('✓ Cambios del proyecto guardados en el servidor.');
    } catch (e) {
      console.error('Error updating project:', e);
      showToast('Proyecto actualizado localmente.');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    try {
      await api.deleteProject(projectId);
      showToast('✓ Proyecto eliminado de la base de datos.');
      const updatedStats = await api.getStats();
      setStats(updatedStats);
    } catch (e) {
      console.error('Error deleting project:', e);
      showToast('Proyecto removido localmente.');
    }
  };

  const handleCreateMessage = async (msgData: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const tempId = `msg-${Date.now()}`;
    const optimisticMsg: ContactMessage = {
      ...msgData,
      id: tempId,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pendiente',
    };
    setMessages((prev) => [optimisticMsg, ...prev]);
    showToast('Enviando consulta al servidor...');

    try {
      const savedMsg = await api.createMessage(msgData);
      setMessages((prev) => [savedMsg, ...prev.filter((m) => m.id !== tempId && m.id !== savedMsg.id)]);
      showToast('✓ ¡Consulta recibida y guardada en el Panel de Gestión!');
      const updatedStats = await api.getStats();
      setStats(updatedStats);
    } catch (e) {
      console.error('Error creating message:', e);
      showToast('Consulta registrada localmente.');
    }
  };

  const handleToggleMessageStatus = async (msgId: string) => {
    const targetMsg = messages.find((m) => m.id === msgId);
    if (!targetMsg) return;
    const newStatus = targetMsg.status === 'Pendiente' ? 'Respondido' : 'Pendiente';

    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, status: newStatus } : m))
    );

    try {
      await api.updateMessageStatus(msgId, newStatus);
      showToast(`✓ Estado del mensaje cambiado a "${newStatus}".`);
      const updatedStats = await api.getStats();
      setStats(updatedStats);
    } catch (e) {
      console.error('Error updating message status:', e);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    try {
      await api.deleteMessage(msgId);
      showToast('✓ Mensaje eliminado del servidor.');
      const updatedStats = await api.getStats();
      setStats(updatedStats);
    } catch (e) {
      console.error('Error deleting message:', e);
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    try {
      const updated = await api.updateSettings(newSettings);
      setSettings(updated);
      showToast('✓ Parámetros institucionales actualizados en el backend.');
    } catch (e) {
      console.error('Error updating settings:', e);
      showToast('Parámetros guardados localmente.');
    }
  };

  const handleUpdateService = async (serviceId: string, updates: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, ...updates } : s)));
    try {
      await api.updateService(serviceId, updates);
      showToast('✓ Servicio actualizado en el servidor.');
    } catch (e) {
      console.error('Error updating service:', e);
    }
  };

  const handleInquireProject = (projectTitle: string) => {
    setIsContactModalOpen(true);
  };

  const unreadCount = messages.filter((m) => m.status === 'Pendiente').length;

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] flex flex-col selection:bg-black selection:text-white">
      {/* Minimalist Landing Page Cover (matches user reference) */}
      {!hasEntered && (
        <SplashScreen
          onEnter={() => {
            setHasEntered(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Global Navigation Header - ONLY public sections are shown */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenContact={() => setIsContactModalOpen(true)}
        unreadCount={unreadCount}
        onReturnToLanding={() => {
          setHasEntered(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'inicio' && (
          <HomeView
            projects={projects}
            services={services}
            settings={settings}
            onSelectProject={setSelectedProject}
            onNavigate={handleNavigate}
            onOpenContact={() => setIsContactModalOpen(true)}
            onSubmitContact={handleCreateMessage}
          />
        )}

        {currentView === 'proyectos' && (
          <ProjectsView
            projects={projects}
            onSelectProject={setSelectedProject}
            onOpenBeforeAfter={(proj) => {
              handleNavigate('antes-despues');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'antes-despues' && (
          <BeforeAfterView
            projects={projects}
            onOpenContact={() => setIsContactModalOpen(true)}
            onSelectProject={setSelectedProject}
          />
        )}

        {currentView === 'servicios' && (
          <ServicesView
            services={services}
            onOpenContact={() => setIsContactModalOpen(true)}
          />
        )}

        {currentView === 'panel' && (
          adminUser ? (
            <AdminDashboardView
              projects={projects}
              messages={messages}
              services={services}
              settings={settings}
              stats={stats}
              adminUser={adminUser}
              onLogout={handleLogout}
              onAddProject={handleAddProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onSelectProject={setSelectedProject}
              onToggleMessageStatus={handleToggleMessageStatus}
              onDeleteMessage={handleDeleteMessage}
              onUpdateSettings={handleUpdateSettings}
              onUpdateService={handleUpdateService}
              onRefreshData={refreshBackendData}
              onNavigateView={handleNavigate}
            />
          ) : (
            <AdminLoginView
              onLoginSuccess={(user) => {
                setAdminUser(user);
                showToast(`Bienvenido al panel, ${user.name || 'Administrador'}`);
              }}
              onNavigateBack={() => handleNavigate('inicio')}
            />
          )
        )}

        {currentView === 'marca' && (
          adminUser ? (
            <BrandGuidelinesView onNavigate={handleNavigate} />
          ) : (
            <AdminLoginView
              onLoginSuccess={(user) => {
                setAdminUser(user);
                showToast(`Acceso concedido`);
              }}
              onNavigateBack={() => handleNavigate('inicio')}
            />
          )
        )}

        {currentView === 'ui-kit' && (
          adminUser ? (
            <UIKitView onNavigate={handleNavigate} />
          ) : (
            <AdminLoginView
              onLoginSuccess={(user) => {
                setAdminUser(user);
                showToast(`Acceso concedido`);
              }}
              onNavigateBack={() => handleNavigate('inicio')}
            />
          )
        )}
      </main>

      {/* Global Footer (shown on public views) */}
      {currentView !== 'panel' && currentView !== 'marca' && currentView !== 'ui-kit' && (
        <Footer
          onNavigate={handleNavigate}
          onOpenContact={() => setIsContactModalOpen(true)}
          onReturnToLanding={() => {
            setHasEntered(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Floating WhatsApp Action Button */}
      <WhatsAppButton />

      {/* Project Detail Technical Datasheet Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquireProject={handleInquireProject}
      />

      {/* Contact & Consultation Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSubmitMessage={handleCreateMessage}
      />

      {/* Global Toast Notification */}
      {toastText && (
        <div className="fixed top-20 right-6 z-50 bg-[#111111] text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl border border-white/20 animate-in fade-in slide-in-from-top-3 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastText}</span>
        </div>
      )}
    </div>
  );
}
