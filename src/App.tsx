/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenView, Project, ContactMessage, ServiceItem } from './types';
import { INITIAL_PROJECTS, INITIAL_SERVICES, INITIAL_MESSAGES } from './mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ContactModal } from './components/ContactModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { SplashScreen } from './components/SplashScreen';

// Views
import { HomeView } from './views/HomeView';
import { ProjectsView } from './views/ProjectsView';
import { BeforeAfterView } from './views/BeforeAfterView';
import { ServicesView } from './views/ServicesView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { BrandGuidelinesView } from './views/BrandGuidelinesView';
import { UIKitView } from './views/UIKitView';

export default function App() {
  const [currentView, setCurrentView] = useState<ScreenView>('inicio');
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);
  
  // Modals
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastText(text);
    setTimeout(() => setToastText(null), 3000);
  };

  // Handlers for dynamic data in memory
  const handleAddProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    showToast(`Proyecto "${newProject.title}" incorporado al portfolio.`);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    showToast('Proyecto eliminado del panel.');
  };

  const handleCreateMessage = (msgData: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const newMessage: ContactMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pendiente',
    };
    setMessages((prev) => [newMessage, ...prev]);
    showToast('¡Consulta enviada y registrada en el Panel de Gestión!');
  };

  const handleToggleMessageStatus = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? { ...m, status: m.status === 'Pendiente' ? 'Respondido' : 'Pendiente' }
          : m
      )
    );
  };

  const handleDeleteMessage = (msgId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    showToast('Mensaje eliminado.');
  };

  const handleInquireProject = (projectTitle: string) => {
    setIsContactModalOpen(true);
  };

  const unreadCount = messages.filter((m) => m.status === 'Pendiente').length;

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] flex flex-col selection:bg-black selection:text-white">
      {/* Optional Splash Screen Intro */}
      {showSplash && (
        <SplashScreen onEnter={() => setShowSplash(false)} />
      )}

      {/* Global Navigation Header (hidden when on panel for cleaner CMS experience or full width) */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenContact={() => setIsContactModalOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'inicio' && (
          <HomeView
            projects={projects}
            services={services}
            onSelectProject={setSelectedProject}
            onNavigate={setCurrentView}
            onOpenContact={() => setIsContactModalOpen(true)}
            onSubmitContact={handleCreateMessage}
          />
        )}

        {currentView === 'proyectos' && (
          <ProjectsView
            projects={projects}
            onSelectProject={setSelectedProject}
            onOpenBeforeAfter={(proj) => {
              setCurrentView('antes-despues');
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
          <AdminDashboardView
            projects={projects}
            messages={messages}
            services={services}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            onSelectProject={setSelectedProject}
            onToggleMessageStatus={handleToggleMessageStatus}
            onDeleteMessage={handleDeleteMessage}
          />
        )}

        {currentView === 'marca' && <BrandGuidelinesView />}

        {currentView === 'ui-kit' && <UIKitView />}
      </main>

      {/* Global Footer (shown on public views) */}
      {currentView !== 'panel' && (
        <Footer
          onNavigate={setCurrentView}
          onOpenContact={() => setIsContactModalOpen(true)}
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
