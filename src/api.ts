import { Project, ContactMessage, ServiceItem, SiteSettings, SiteStats } from './types';
import { INITIAL_PROJECTS, INITIAL_SERVICES, INITIAL_MESSAGES } from './mockData';
import { getSupabase, isSupabaseConfigured, uploadProjectImageToSupabase } from './lib/supabase';

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

export interface InfraStatus {
  cloudflare: {
    platform: string;
    configured: boolean;
    spaRedirects: boolean;
    outputDir: string;
    compatibilityDate: string;
    statusText: string;
  };
  supabase: {
    configured: boolean;
    url: string | null;
    hasServiceKey: boolean;
    bucket: string;
    statusText: string;
  };
  resend: {
    configured: boolean;
    recipient: string;
    statusText: string;
  };
}

export const api = {
  // Cloud Infrastructure Status
  async getInfraStatus(): Promise<InfraStatus> {
    try {
      const res = await fetch('/api/infra/status');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Infra status fallback:', e);
    }
    return {
      cloudflare: {
        platform: 'Cloudflare Pages',
        configured: true,
        spaRedirects: true,
        outputDir: 'dist',
        compatibilityDate: '2024-09-01',
        statusText: 'Listo para despliegue (Git / Direct Upload)',
      },
      supabase: {
        configured: isSupabaseConfigured(),
        url: isSupabaseConfigured() ? 'Conectado a Supabase' : null,
        hasServiceKey: false,
        bucket: 'project-images',
        statusText: isSupabaseConfigured() ? 'Conectado a Supabase' : 'Modo local activo (listo para vincular)',
      },
      resend: {
        configured: false,
        recipient: 'contacto@romeroestudio.com',
        statusText: 'Modo simulado local (listo para vincular)',
      },
    };
  },

  // Storage / Upload helper
  async uploadProjectImage(file: File): Promise<{ url: string | null; error: string | null }> {
    if (isSupabaseConfigured()) {
      return await uploadProjectImageToSupabase(file, 'renders');
    }
    // Fallback: convert to Object URL or base64 data for preview
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ url: reader.result as string, error: null });
      reader.onerror = () => resolve({ url: null, error: 'Error al leer el archivo local' });
      reader.readAsDataURL(file);
    });
  },

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
    // If Supabase is connected, query Supabase
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data, error } = await supabase.from('projects').select('*');
          if (!error && data && data.length > 0) {
            return data.map((item: any) => ({
              id: item.id,
              title: item.title,
              category: item.category,
              description: item.description,
              year: item.year,
              area: item.surface || item.area || '250 m²',
              scope: item.status || 'Obra Nueva',
              materials: 'Materiales nobles seleccionados',
              heroImage: item.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
              detailImage: item.images?.[1] || item.images?.[0],
              status: item.status || 'En curso',
              featured: true,
            }));
          }
        } catch (err) {
          console.warn('Supabase projects query failed, falling back to REST/local:', err);
        }
      }
    }

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
    // If Supabase is connected, save directly to Supabase as well
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const id = project.id || `proj-${Date.now()}`;
          await supabase.from('projects').insert({
            id,
            title: project.title,
            category: project.category,
            description: project.description || '',
            location: project.location || 'Buenos Aires',
            year: project.year || new Date().getFullYear(),
            surface: project.area || '250 m²',
            status: project.status || 'En curso',
            images: [project.heroImage, project.detailImage].filter(Boolean),
          });
        } catch (e) {
          console.warn('Could not insert into Supabase directly:', e);
        }
      }
    }

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return await res.json();
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('projects').update({
            title: updates.title,
            category: updates.category,
            description: updates.description,
            surface: updates.area,
            status: updates.status,
          }).eq('id', id);
        } catch (e) {
          console.warn('Could not update Supabase project directly:', e);
        }
      }
    }

    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return await res.json();
  },

  async deleteProject(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('projects').delete().eq('id', id);
        } catch (e) {
          console.warn('Could not delete from Supabase directly:', e);
        }
      }
    }

    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return true;
  },

  // Messages (Handles Resend delivery on server + Supabase storage)
  async getMessages(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data, error } = await supabase.from('messages').select('*').order('date', { ascending: false });
          if (!error && data && data.length > 0) {
            return data.map((m: any) => ({
              id: m.id,
              name: m.name,
              email: m.email,
              projectType: m.typology || 'Consulta General',
              estimatedArea: m.budget || '',
              message: m.message,
              date: m.date,
              status: m.status === 'read' ? 'Respondido' : 'Pendiente',
            }));
          }
        } catch (e) {
          console.warn('Supabase messages query fallback:', e);
        }
      }
    }

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
    // If Supabase is connected, store in Supabase table
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('messages').insert({
            id: `msg-${Date.now()}`,
            name: msg.name,
            email: msg.email,
            typology: msg.projectType,
            budget: msg.estimatedArea,
            message: msg.message,
            status: 'unread',
          });
        } catch (e) {
          console.warn('Failed to insert message into Supabase directly:', e);
        }
      }
    }

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    if (!res.ok) throw new Error('Failed to submit message');
    return await res.json();
  },

  async updateMessageStatus(id: string, status: 'Pendiente' | 'Respondido'): Promise<ContactMessage> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('messages').update({
            status: status === 'Respondido' ? 'read' : 'unread',
          }).eq('id', id);
        } catch (e) {
          console.warn('Failed to update Supabase message:', e);
        }
      }
    }

    const res = await fetch(`/api/messages/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update message status');
    return await res.json();
  },

  async deleteMessage(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('messages').delete().eq('id', id);
        } catch (e) {
          console.warn('Failed to delete Supabase message:', e);
        }
      }
    }

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

  // Authentication (Supabase Auth first if configured, else server API)
  async login(username: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
    // Supabase Auth attempt if configured
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: username,
            password,
          });
          if (!error && data?.user) {
            return {
              success: true,
              user: {
                username: data.user.email?.split('@')[0] || 'admin',
                email: data.user.email,
                name: data.user.user_metadata?.name || 'Director de Estudio',
                role: 'Director de Estudio',
                token: data.session?.access_token || 'supabase-token',
              },
            };
          }
        } catch (supabaseAuthErr) {
          console.warn('Supabase Auth error, attempting local fallback:', supabaseAuthErr);
        }
      }
    }

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
