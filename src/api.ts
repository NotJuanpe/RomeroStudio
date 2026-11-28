import { Project, ContactMessage, ServiceItem, SiteSettings, SiteStats } from './types';
import { INITIAL_PROJECTS, INITIAL_SERVICES, INITIAL_MESSAGES } from './mockData';
import { getSupabase, isSupabaseConfigured, uploadProjectImageToSupabase } from './lib/supabase';

export const DEFAULT_SETTINGS: SiteSettings = {
  studioName: 'Romero Estudio - Arquitectura Integral',
  tagline: 'Arquitectura Integral & Gestión de Proyectos',
  email: 'contacto.romeroestudio@gmail.com',
  phone: '+54 9 11 3676-7925',
  address: 'Buenos Aires, Argentina',
  heroTitle: 'Arquitectura Integral.',
  heroSubtitle:
    'Diseñamos y materializamos espacios singulares aunando rigor técnico, nobleza en los materiales y un control riguroso de cada etapa de obra.',
  whatsappNumber: '5491136767925',
  instagramUrl: 'https://www.instagram.com/romeroestudio.arq/',
  linkedinUrl: '',
  logoUrl: '',
  logoInvertOnDark: true,
  heroStat1Value: '7',
  heroStat1Label: 'Años de Trayectoria',
  heroStat2Value: '+20',
  heroStat2Label: 'Obras Ejecutadas',
  heroStat3Value: '100%',
  heroStat3Label: 'Compromiso de Plazos',
};

export type PersistenceTarget = 'supabase' | 'server' | 'local';

const STORAGE_KEYS = {
  settings: 'romero_cms_settings_v1',
  projects: 'romero_cms_projects_v1',
  services: 'romero_cms_services_v1',
  messages: 'romero_cms_messages_v1',
  adminPass: 'romero_cms_admin_password_v1',
};

function readLocal<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeLocal<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`LocalStorage write failed for ${key}:`, err);
    return false;
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      return null;
    }
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function compressImageToDataUrl(
  file: File,
  options?: { preserveTransparency?: boolean; maxWidth?: number }
): Promise<string> {
  const preserveTransparency = options?.preserveTransparency ?? false;
  const maxWidth = options?.maxWidth ?? (preserveTransparency ? 640 : 1400);

  return new Promise((resolve, reject) => {
    // Keep SVG files as-is via FileReader
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error al leer SVG'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer la imagen'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => resolve(reader.result as string);
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const outputMime =
            preserveTransparency || file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const dataUrl =
            outputMime === 'image/png'
              ? canvas.toDataURL('image/png')
              : canvas.toDataURL('image/jpeg', 0.82);
          resolve(dataUrl);
        } catch {
          resolve(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function mapSupabaseProject(item: any): Project {
  const details = item.architectural_details || {};
  const images: string[] = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  const heroImage =
    images[0] ||
    details.heroImage ||
    '';
  const gallery =
    Array.isArray(details.gallery) && details.gallery.length > 0
      ? details.gallery
      : images.slice(1);

  return {
    id: item.id,
    title: item.title,
    category: item.category,
    description: item.description || '',
    longDescription: details.longDescription || item.description || '',
    year: item.year,
    area: item.surface || item.area || '250 m²',
    scope: details.scope || 'Obra Nueva',
    materials: details.materials || 'Materiales nobles seleccionados',
    heroImage,
    detailImage: details.detailImage || gallery[0] || undefined,
    beforeImage: details.beforeImage || undefined,
    afterImage: details.afterImage || undefined,
    location: item.location || 'Buenos Aires, Argentina',
    client: details.client || 'Privado',
    featured: details.featured ?? true,
    status: item.status || 'En curso',
    gallery,
    specs: details.specs || undefined,
  };
}

function toSupabaseProjectRow(project: Partial<Project>, id: string) {
  const images = [project.heroImage, ...(project.gallery || [])].filter(Boolean) as string[];
  const parsedYear =
    typeof project.year === 'number'
      ? project.year
      : parseInt(String(project.year || new Date().getFullYear()), 10) || new Date().getFullYear();

  return {
    id,
    title: project.title || 'Proyecto sin título',
    category: project.category || 'Residencial',
    description: project.description || '',
    location: project.location || 'Buenos Aires, Argentina',
    year: parsedYear,
    surface: project.area || '250 m²',
    status: project.status || 'En curso',
    images,
    architectural_details: {
      scope: project.scope || 'Obra Nueva',
      materials: project.materials || '',
      longDescription: project.longDescription || project.description || '',
      heroImage: project.heroImage || '',
      detailImage: project.detailImage || '',
      beforeImage: project.beforeImage || '',
      afterImage: project.afterImage || '',
      gallery: project.gallery || [],
      client: project.client || 'Privado',
      featured: project.featured ?? true,
      specs: project.specs || {},
    },
  };
}

function mapSupabaseSettings(row: any): SiteSettings {
  const social = row.social || {};
  return {
    ...DEFAULT_SETTINGS,
    studioName: row.studio_name || DEFAULT_SETTINGS.studioName,
    tagline: row.tagline || DEFAULT_SETTINGS.tagline,
    email: row.contact_email || DEFAULT_SETTINGS.email,
    phone: row.contact_phone || DEFAULT_SETTINGS.phone,
    address: row.office_address || DEFAULT_SETTINGS.address,
    heroTitle: social.heroTitle || DEFAULT_SETTINGS.heroTitle,
    heroSubtitle: social.heroSubtitle || row.description || DEFAULT_SETTINGS.heroSubtitle,
    whatsappNumber: social.whatsapp || DEFAULT_SETTINGS.whatsappNumber,
    instagramUrl: social.instagram ?? DEFAULT_SETTINGS.instagramUrl,
    linkedinUrl: social.linkedin ?? DEFAULT_SETTINGS.linkedinUrl,
    logoUrl: social.logoUrl ?? DEFAULT_SETTINGS.logoUrl,
    logoInvertOnDark: social.logoInvertOnDark ?? DEFAULT_SETTINGS.logoInvertOnDark,
    heroStat1Value: social.heroStat1Value || DEFAULT_SETTINGS.heroStat1Value,
    heroStat1Label: social.heroStat1Label || DEFAULT_SETTINGS.heroStat1Label,
    heroStat2Value: social.heroStat2Value || DEFAULT_SETTINGS.heroStat2Value,
    heroStat2Label: social.heroStat2Label || DEFAULT_SETTINGS.heroStat2Label,
    heroStat3Value: social.heroStat3Value || DEFAULT_SETTINGS.heroStat3Value,
    heroStat3Label: social.heroStat3Label || DEFAULT_SETTINGS.heroStat3Label,
  };
}

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
  backendReachable?: boolean;
}

export const api = {
  // Cloud Infrastructure Status
  async getInfraStatus(): Promise<InfraStatus> {
    const serverStatus = await fetchJson<InfraStatus>('/api/infra/status');
    if (serverStatus) {
      return { ...serverStatus, backendReachable: true };
    }

    return {
      cloudflare: {
        platform: 'Cloudflare Pages',
        configured: true,
        spaRedirects: true,
        outputDir: 'dist',
        compatibilityDate: '2024-09-01',
        statusText: 'Despliegue estático activo (Cloudflare Pages)',
      },
      supabase: {
        configured: isSupabaseConfigured(),
        url: isSupabaseConfigured() ? 'Conectado a Supabase' : null,
        hasServiceKey: false,
        bucket: 'project-images',
        statusText: isSupabaseConfigured()
          ? 'Conectado a Supabase'
          : 'Sin vincular (guardado local en navegador)',
      },
      resend: {
        configured: false,
        recipient: DEFAULT_SETTINGS.email,
        statusText: 'Requiere backend / Edge Function',
      },
      backendReachable: false,
    };
  },

  // Storage / Upload helper
  async uploadProjectImage(
    file: File,
    options?: { preserveTransparency?: boolean; maxWidth?: number; folder?: string }
  ): Promise<{ url: string | null; error: string | null }> {
    if (isSupabaseConfigured()) {
      const uploaded = await uploadProjectImageToSupabase(file, options?.folder || 'renders');
      if (uploaded.url) return uploaded;
      console.warn('Supabase upload failed, falling back to optimized inline image:', uploaded.error);
    }

    try {
      const dataUrl = await compressImageToDataUrl(file, options);
      return { url: dataUrl, error: null };
    } catch (err: any) {
      return { url: null, error: err?.message || 'Error al procesar la imagen' };
    }
  },

  // Stats
  async getStats(): Promise<SiteStats> {
    const serverStats = await fetchJson<SiteStats>('/api/stats');
    if (serverStats) return serverStats;

    const localProjects = readLocal<Project[]>(STORAGE_KEYS.projects) || INITIAL_PROJECTS;
    const localMessages = readLocal<ContactMessage[]>(STORAGE_KEYS.messages) || INITIAL_MESSAGES;
    return {
      activeProjects: localProjects.filter((p) => p.status === 'En curso').length,
      totalProjects: localProjects.length,
      totalMessages: localMessages.length,
      unreadMessages: localMessages.filter((m) => m.status === 'Pendiente').length,
      visits: 2418,
      lastUpdated: new Date().toISOString(),
    };
  },

  async recordVisit(): Promise<void> {
    await fetchJson('/api/stats/visit', { method: 'POST' });
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            const mapped = data.map(mapSupabaseProject);
            writeLocal(STORAGE_KEYS.projects, mapped);
            return mapped;
          }
        } catch (err) {
          console.warn('Supabase projects query failed:', err);
        }
      }
    }

    const serverProjects = await fetchJson<Project[]>('/api/projects');
    if (serverProjects && Array.isArray(serverProjects)) {
      writeLocal(STORAGE_KEYS.projects, serverProjects);
      return serverProjects;
    }

    const localProjects = readLocal<Project[]>(STORAGE_KEYS.projects);
    if (localProjects && Array.isArray(localProjects) && localProjects.length > 0) {
      return localProjects;
    }

    return INITIAL_PROJECTS;
  },

  async createProject(
    project: Partial<Project>
  ): Promise<{ data: Project; persistedTo: PersistenceTarget }> {
    const id = project.id || `proj-${Date.now()}`;
    const fullProject: Project = {
      id,
      title: project.title || 'Nuevo Proyecto',
      category: project.category || 'Residencial',
      description: project.description || 'Proyecto de arquitectura integral.',
      longDescription: project.longDescription || project.description,
      year: project.year || new Date().getFullYear(),
      area: project.area || '250 m²',
      scope: project.scope || 'Obra Nueva',
      materials: project.materials || 'Hormigón Visto, Acero, Vidrio',
      heroImage: project.heroImage || '',
      detailImage: project.detailImage,
      beforeImage: project.beforeImage,
      afterImage: project.afterImage,
      location: project.location || 'Buenos Aires, Argentina',
      client: project.client || 'Privado',
      featured: project.featured ?? true,
      status: project.status || 'En curso',
      gallery: project.gallery || [],
      specs: project.specs,
    };

    const currentLocal = readLocal<Project[]>(STORAGE_KEYS.projects) || INITIAL_PROJECTS;
    writeLocal(STORAGE_KEYS.projects, [fullProject, ...currentLocal.filter((p) => p.id !== id)]);

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { error } = await supabase
            .from('projects')
            .upsert(toSupabaseProjectRow(fullProject, id));
          if (!error) {
            return { data: fullProject, persistedTo: 'supabase' };
          }
          console.warn('Supabase project insert error:', error);
        } catch (e) {
          console.warn('Could not insert into Supabase directly:', e);
        }
      }
    }

    const serverCreated = await fetchJson<Project>('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullProject),
    });
    if (serverCreated) {
      return { data: serverCreated, persistedTo: 'server' };
    }

    return { data: fullProject, persistedTo: 'local' };
  },

  async updateProject(
    id: string,
    updates: Partial<Project>
  ): Promise<{ data: Project; persistedTo: PersistenceTarget }> {
    const currentLocal = readLocal<Project[]>(STORAGE_KEYS.projects) || INITIAL_PROJECTS;
    const existing = currentLocal.find((p) => p.id === id);
    const merged = { ...(existing || {}), ...updates, id } as Project;

    const updatedList = existing
      ? currentLocal.map((p) => (p.id === id ? merged : p))
      : [merged, ...currentLocal];
    writeLocal(STORAGE_KEYS.projects, updatedList);

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { error } = await supabase
            .from('projects')
            .upsert(toSupabaseProjectRow(merged, id));
          if (!error) {
            return { data: merged, persistedTo: 'supabase' };
          }
          console.warn('Supabase project update error:', error);
        } catch (e) {
          console.warn('Could not update Supabase project directly:', e);
        }
      }
    }

    const serverUpdated = await fetchJson<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (serverUpdated) {
      return { data: serverUpdated, persistedTo: 'server' };
    }

    return { data: merged, persistedTo: 'local' };
  },

  async deleteProject(id: string): Promise<{ success: boolean; persistedTo: PersistenceTarget }> {
    const currentLocal = readLocal<Project[]>(STORAGE_KEYS.projects) || INITIAL_PROJECTS;
    writeLocal(
      STORAGE_KEYS.projects,
      currentLocal.filter((p) => p.id !== id)
    );

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { error } = await supabase.from('projects').delete().eq('id', id);
          if (!error) {
            return { success: true, persistedTo: 'supabase' };
          }
        } catch (e) {
          console.warn('Could not delete from Supabase directly:', e);
        }
      }
    }

    const serverRes = await fetchJson(`/api/projects/${id}`, { method: 'DELETE' });
    if (serverRes) {
      return { success: true, persistedTo: 'server' };
    }

    return { success: true, persistedTo: 'local' };
  },

  // Messages
  async getMessages(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('date', { ascending: false });
          if (!error && data && data.length > 0) {
            const mapped: ContactMessage[] = data.map((m: any) => ({
              id: m.id,
              name: m.name,
              email: m.email,
              projectType: m.typology || 'Consulta General',
              estimatedArea: m.budget || '',
              message: m.message,
              date: m.date,
              status: m.status === 'read' ? 'Respondido' : 'Pendiente',
            }));
            writeLocal(STORAGE_KEYS.messages, mapped);
            return mapped;
          }
        } catch (e) {
          console.warn('Supabase messages query fallback:', e);
        }
      }
    }

    const serverMessages = await fetchJson<ContactMessage[]>('/api/messages');
    if (serverMessages && Array.isArray(serverMessages)) {
      writeLocal(STORAGE_KEYS.messages, serverMessages);
      return serverMessages;
    }

    const localMessages = readLocal<ContactMessage[]>(STORAGE_KEYS.messages);
    if (localMessages && Array.isArray(localMessages)) {
      return localMessages;
    }

    return INITIAL_MESSAGES;
  },

  async createMessage(
    msg: Omit<ContactMessage, 'id' | 'date' | 'status'>
  ): Promise<{ data: ContactMessage; persistedTo: PersistenceTarget }> {
    const newMessage: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pendiente',
    };

    const currentLocal = readLocal<ContactMessage[]>(STORAGE_KEYS.messages) || INITIAL_MESSAGES;
    writeLocal(STORAGE_KEYS.messages, [newMessage, ...currentLocal]);

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { error } = await supabase.from('messages').insert({
            id: newMessage.id,
            name: msg.name,
            email: msg.email,
            typology: msg.projectType || 'Consulta General',
            budget: msg.estimatedArea || '',
            message: msg.message,
            status: 'unread',
          });
          if (!error) {
            return { data: newMessage, persistedTo: 'supabase' };
          }
        } catch (e) {
          console.warn('Failed to insert message into Supabase directly:', e);
        }
      }
    }

    const serverCreated = await fetchJson<ContactMessage>('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    if (serverCreated) {
      return { data: serverCreated, persistedTo: 'server' };
    }

    return { data: newMessage, persistedTo: 'local' };
  },

  async updateMessageStatus(
    id: string,
    status: 'Pendiente' | 'Respondido'
  ): Promise<{ persistedTo: PersistenceTarget }> {
    const currentLocal = readLocal<ContactMessage[]>(STORAGE_KEYS.messages) || INITIAL_MESSAGES;
    writeLocal(
      STORAGE_KEYS.messages,
      currentLocal.map((m) => (m.id === id ? { ...m, status } : m))
    );

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { error } = await supabase
            .from('messages')
            .update({ status: status === 'Respondido' ? 'read' : 'unread' })
            .eq('id', id);
          if (!error) return { persistedTo: 'supabase' };
        } catch (e) {
          console.warn('Failed to update Supabase message:', e);
        }
      }
    }

    const serverUpdated = await fetchJson(`/api/messages/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (serverUpdated) return { persistedTo: 'server' };

    return { persistedTo: 'local' };
  },

  async deleteMessage(id: string): Promise<{ persistedTo: PersistenceTarget }> {
    const currentLocal = readLocal<ContactMessage[]>(STORAGE_KEYS.messages) || INITIAL_MESSAGES;
    writeLocal(
      STORAGE_KEYS.messages,
      currentLocal.filter((m) => m.id !== id)
    );

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { error } = await supabase.from('messages').delete().eq('id', id);
          if (!error) return { persistedTo: 'supabase' };
        } catch (e) {
          console.warn('Failed to delete Supabase message:', e);
        }
      }
    }

    const serverDeleted = await fetchJson(`/api/messages/${id}`, { method: 'DELETE' });
    if (serverDeleted) return { persistedTo: 'server' };

    return { persistedTo: 'local' };
  },

  // Services
  async getServices(): Promise<ServiceItem[]> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('order_index', { ascending: true });
          if (!error && data && data.length > 0) {
            const mapped: ServiceItem[] = data.map((s: any, idx: number) => {
              const fallback = INITIAL_SERVICES.find((f) => f.id === s.id) || INITIAL_SERVICES[idx];
              return {
                id: s.id,
                title: s.title || fallback?.title || 'Servicio',
                shortDesc: s.description || fallback?.shortDesc || '',
                fullDesc: fallback?.fullDesc || s.description || '',
                icon: fallback?.icon || 'architecture',
                deliverables: Array.isArray(s.deliverables) && s.deliverables.length > 0
                  ? s.deliverables
                  : fallback?.deliverables || [],
                timeline: s.phases?.[0] || fallback?.timeline || '',
                image: fallback?.image,
              };
            });
            writeLocal(STORAGE_KEYS.services, mapped);
            return mapped;
          }
        } catch (err) {
          console.warn('Supabase services query fallback:', err);
        }
      }
    }

    const serverServices = await fetchJson<ServiceItem[]>('/api/services');
    if (serverServices && Array.isArray(serverServices)) {
      writeLocal(STORAGE_KEYS.services, serverServices);
      return serverServices;
    }

    const localServices = readLocal<ServiceItem[]>(STORAGE_KEYS.services);
    if (localServices && Array.isArray(localServices) && localServices.length > 0) {
      return localServices;
    }

    return INITIAL_SERVICES;
  },

  async updateService(
    id: string,
    updates: Partial<ServiceItem>
  ): Promise<{ data: ServiceItem; persistedTo: PersistenceTarget }> {
    const currentLocal = readLocal<ServiceItem[]>(STORAGE_KEYS.services) || INITIAL_SERVICES;
    const existing = currentLocal.find((s) => s.id === id) || INITIAL_SERVICES[0];
    const merged: ServiceItem = { ...existing, ...updates, id };

    writeLocal(
      STORAGE_KEYS.services,
      currentLocal.map((s) => (s.id === id ? merged : s))
    );

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { error } = await supabase.from('services').upsert({
            id,
            title: merged.title,
            category: 'Arquitectura',
            description: merged.shortDesc,
            deliverables: merged.deliverables || [],
            phases: merged.timeline ? [merged.timeline] : [],
          });
          if (!error) return { data: merged, persistedTo: 'supabase' };
        } catch (err) {
          console.warn('Supabase service update failed:', err);
        }
      }
    }

    const serverUpdated = await fetchJson<ServiceItem>(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (serverUpdated) return { data: serverUpdated, persistedTo: 'server' };

    return { data: merged, persistedTo: 'local' };
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 'default')
            .maybeSingle();
          if (!error && data) {
            const mapped = mapSupabaseSettings(data);
            writeLocal(STORAGE_KEYS.settings, mapped);
            return mapped;
          }
        } catch (err) {
          console.warn('Supabase settings query failed:', err);
        }
      }
    }

    const serverSettings = await fetchJson<SiteSettings>('/api/settings');
    if (serverSettings) {
      const merged = { ...DEFAULT_SETTINGS, ...serverSettings };
      writeLocal(STORAGE_KEYS.settings, merged);
      return merged;
    }

    const localSettings = readLocal<Partial<SiteSettings>>(STORAGE_KEYS.settings);
    if (localSettings) {
      return { ...DEFAULT_SETTINGS, ...localSettings };
    }

    return { ...DEFAULT_SETTINGS };
  },

  async updateSettings(
    settings: Partial<SiteSettings>
  ): Promise<{ data: SiteSettings; persistedTo: PersistenceTarget }> {
    const currentLocal = readLocal<Partial<SiteSettings>>(STORAGE_KEYS.settings) || {};
    const merged: SiteSettings = { ...DEFAULT_SETTINGS, ...currentLocal, ...settings };
    writeLocal(STORAGE_KEYS.settings, merged);

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { error } = await supabase.from('settings').upsert({
            id: 'default',
            studio_name: merged.studioName,
            tagline: merged.tagline,
            description: merged.heroSubtitle,
            contact_email: merged.email,
            contact_phone: merged.phone,
            office_address: merged.address,
            social: {
              instagram: merged.instagramUrl || '',
              linkedin: merged.linkedinUrl || '',
              whatsapp: merged.whatsappNumber || '',
              heroTitle: merged.heroTitle || '',
              heroSubtitle: merged.heroSubtitle || '',
              logoUrl: merged.logoUrl || '',
              logoInvertOnDark: merged.logoInvertOnDark ?? true,
              heroStat1Value: merged.heroStat1Value || DEFAULT_SETTINGS.heroStat1Value,
              heroStat1Label: merged.heroStat1Label || DEFAULT_SETTINGS.heroStat1Label,
              heroStat2Value: merged.heroStat2Value || DEFAULT_SETTINGS.heroStat2Value,
              heroStat2Label: merged.heroStat2Label || DEFAULT_SETTINGS.heroStat2Label,
              heroStat3Value: merged.heroStat3Value || DEFAULT_SETTINGS.heroStat3Value,
              heroStat3Label: merged.heroStat3Label || DEFAULT_SETTINGS.heroStat3Label,
            },
            updated_at: new Date().toISOString(),
          });
          if (!error) {
            return { data: merged, persistedTo: 'supabase' };
          }
          console.warn('Supabase settings upsert error:', error);
        } catch (err) {
          console.warn('Could not update Supabase settings:', err);
        }
      }
    }

    const serverUpdated = await fetchJson<SiteSettings>('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    });
    if (serverUpdated) {
      const serverMerged = { ...DEFAULT_SETTINGS, ...serverUpdated };
      writeLocal(STORAGE_KEYS.settings, serverMerged);
      return { data: serverMerged, persistedTo: 'server' };
    }

    return { data: merged, persistedTo: 'local' };
  },

  // Authentication
  async verifySupabaseSession(): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;
    const supabase = getSupabase();
    if (!supabase) return false;
    try {
      const { data } = await supabase.auth.getSession();
      return Boolean(data.session);
    } catch {
      return false;
    }
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.warn('Supabase signOut error:', err);
        }
      }
    }
  },

  async login(username: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const authEmail =
            username.trim().toLowerCase() === 'admin'
              ? 'admin@romeroestudio.com'
              : username.trim();
          const { data, error } = await supabase.auth.signInWithPassword({
            email: authEmail,
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
                authProvider: 'supabase',
              },
            };
          }
          return {
            success: false,
            error:
              error?.message === 'Invalid login credentials'
                ? 'Credenciales inválidas en Supabase. Verificá tu correo y contraseña (o creá el usuario en Supabase > Authentication > Users).'
                : error?.message || 'No se pudo iniciar sesión en Supabase Auth.',
          };
        } catch (supabaseAuthErr: any) {
          return {
            success: false,
            error: supabaseAuthErr?.message || 'Error de conexión con Supabase Auth.',
          };
        }
      }
    }

    const serverRes = await fetchJson<{ success?: boolean; user?: any; error?: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      }
    );
    if (serverRes) {
      if (serverRes.success && serverRes.user) {
        return { success: true, user: serverRes.user };
      }
      return { success: false, error: serverRes.error || 'Credenciales inválidas' };
    }

    // Static hosting / offline fallback (only when Supabase is not configured)
    const savedLocalPass = readLocal<string>(STORAGE_KEYS.adminPass);
    const validPasswords = savedLocalPass
      ? [savedLocalPass]
      : ['romeroestudio', 'romero2026'];

    if (
      (username.trim().toLowerCase() === 'admin' ||
        username.trim().toLowerCase() === 'admin@romeroestudio.com') &&
      validPasswords.includes(password)
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

    return { success: false, error: 'Credenciales inválidas. Comprueba tu usuario y contraseña.' };
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { error } = await supabase.auth.updateUser({ password: newPassword });
          if (!error) return { success: true };
          return { success: false, error: error.message || 'No se pudo actualizar la contraseña en Supabase.' };
        } catch (err: any) {
          return { success: false, error: err?.message || 'Error al actualizar contraseña en Supabase.' };
        }
      }
    }

    const serverRes = await fetchJson<{ success?: boolean; error?: string }>(
      '/api/auth/change-password',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      }
    );

    if (serverRes) {
      if (serverRes.success) return { success: true };
      return { success: false, error: serverRes.error || 'Error al cambiar contraseña' };
    }

    // Local fallback when deployed statically
    const savedLocalPass = readLocal<string>(STORAGE_KEYS.adminPass);
    const validCurrent = savedLocalPass ? [savedLocalPass] : ['romeroestudio', 'romero2026'];
    if (!validCurrent.includes(currentPassword)) {
      return { success: false, error: 'La contraseña actual no es correcta.' };
    }
    writeLocal(STORAGE_KEYS.adminPass, newPassword);
    return { success: true };
  },
};
