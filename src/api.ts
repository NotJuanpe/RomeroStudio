import { Project, ContactMessage, ServiceItem, SiteSettings, SiteStats } from './types';
import { INITIAL_PROJECTS, INITIAL_SERVICES, INITIAL_MESSAGES } from './mockData';

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

export const api = {
  // Stats
  async getStats(): Promise<SiteStats> {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch (e) {
      return {
        activeProjects: 12,
        totalProjects: INITIAL_PROJECTS.length,
        totalMessages: INITIAL_MESSAGES.length,
        unreadMessages: INITIAL_MESSAGES.filter((m) => m.status === 'Pendiente').length,
        visits: 2418,
        lastUpdated: new Date().toISOString(),
      };
    }
  },

  async recordVisit(): Promise<void> {
    try {
      await fetch('/api/stats/visit', { method: 'POST' });
    } catch {
      // Non-blocking
    }
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      return await res.json();
    } catch (e) {
      console.warn('Falling back to local projects data:', e);
      return INITIAL_PROJECTS;
    }
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return await res.json();
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return await res.json();
  },

  async deleteProject(id: string): Promise<boolean> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return true;
  },

  // Messages
  async getMessages(): Promise<ContactMessage[]> {
    try {
      const res = await fetch('/api/messages');
      if (!res.ok) throw new Error('Failed to fetch messages');
      return await res.json();
    } catch (e) {
      console.warn('Falling back to local messages data:', e);
      return INITIAL_MESSAGES;
    }
  },

  async createMessage(msg: Omit<ContactMessage, 'id' | 'date' | 'status'>): Promise<ContactMessage> {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    if (!res.ok) throw new Error('Failed to submit message');
    return await res.json();
  },

  async updateMessageStatus(id: string, status: 'Pendiente' | 'Respondido'): Promise<ContactMessage> {
    const res = await fetch(`/api/messages/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update message status');
    return await res.json();
  },

  async deleteMessage(id: string): Promise<boolean> {
    const res = await fetch(`/api/messages/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete message');
    return true;
  },

  // Services
  async getServices(): Promise<ServiceItem[]> {
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error('Failed to fetch services');
      return await res.json();
    } catch (e) {
      return INITIAL_SERVICES;
    }
  },

  async updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update service');
    return await res.json();
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      return await res.json();
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return await res.json();
  },

  // Authentication
  async login(username: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Credenciales inválidas' };
      }
      return { success: true, user: data.user };
    } catch (e) {
      // Offline / client fallback check
      if (
        (username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'admin@romeroestudio.com') &&
        (password === 'romeroestudio' || password === 'romero2026')
      ) {
        return {
          success: true,
          user: {
            username: 'admin',
            email: 'admin@romeroestudio.com',
            name: 'Arq. Ignacio Romero',
            role: 'Director de Estudio',
            token: 'demo-local-token',
          },
        };
      }
      return { success: false, error: 'No se pudo conectar con el servidor de autenticación' };
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Error al cambiar contraseña' };
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  },
};
