import fs from 'fs';
import path from 'path';
import { Project, ServiceItem, ContactMessage, SiteSettings, SiteStats } from '../src/types';
import { INITIAL_PROJECTS, INITIAL_SERVICES, INITIAL_MESSAGES } from '../src/mockData';

interface DatabaseSchema {
  projects: Project[];
  services: ServiceItem[];
  messages: ContactMessage[];
  settings: SiteSettings;
  admin: {
    username: string;
    email: string;
    password: string;
    name: string;
    role: string;
  };
  stats: {
    visits: number;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const DEFAULT_ADMIN = {
  username: 'admin',
  email: 'admin@romeroestudio.com',
  password: 'romeroestudio',
  name: 'Arq. Ignacio Romero',
  role: 'Director de Estudio',
};

const DEFAULT_SETTINGS: SiteSettings = {
  studioName: 'Romero Estudio - Arquitectura Integral',
  tagline: 'Arquitectura Integral & Gestión de Proyectos',
  email: 'contacto.romeroestudio@gmail.com',
  phone: '+54 9 11 3676-7925',
  address: 'Buenos Aires, Argentina',
  heroTitle: 'Arquitectura Integral.',
  heroSubtitle: 'Diseñamos y materializamos espacios singulares aunando rigor técnico, nobleza en los materiales y un control riguroso de cada etapa de obra.',
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

// In-memory cache
let dbCache: DatabaseSchema = {
  projects: [...INITIAL_PROJECTS],
  services: [...INITIAL_SERVICES],
  messages: [...INITIAL_MESSAGES],
  settings: { ...DEFAULT_SETTINGS },
  admin: { ...DEFAULT_ADMIN },
  stats: { visits: 2418 },
};

function ensureDbFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const fileData = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      dbCache = {
        projects: parsed.projects || INITIAL_PROJECTS,
        services: parsed.services || INITIAL_SERVICES,
        messages: parsed.messages || INITIAL_MESSAGES,
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
        admin: { ...DEFAULT_ADMIN, ...(parsed.admin || {}) },
        stats: { visits: parsed.stats?.visits ?? 2418 },
      };
    } else {
      saveDb();
    }
  } catch (err) {
    console.error('Error initializing database file, running with memory cache:', err);
  }
}

function saveDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database to file:', err);
  }
}

// Initialize on module load
ensureDbFile();

export const db = {
  // Projects
  getProjects: (): Project[] => {
    return dbCache.projects;
  },
  getProjectById: (id: string): Project | undefined => {
    return dbCache.projects.find((p) => p.id === id);
  },
  addProject: (project: Project): Project => {
    dbCache.projects.unshift(project);
    saveDb();
    return project;
  },
  updateProject: (id: string, updates: Partial<Project>): Project | null => {
    const index = dbCache.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    dbCache.projects[index] = { ...dbCache.projects[index], ...updates };
    saveDb();
    return dbCache.projects[index];
  },
  deleteProject: (id: string): boolean => {
    const prevLength = dbCache.projects.length;
    dbCache.projects = dbCache.projects.filter((p) => p.id !== id);
    if (dbCache.projects.length !== prevLength) {
      saveDb();
      return true;
    }
    return false;
  },

  // Messages
  getMessages: (): ContactMessage[] => {
    return dbCache.messages;
  },
  addMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>): ContactMessage => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMessage: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      date: formattedDate,
      status: 'Pendiente',
    };
    dbCache.messages.unshift(newMessage);
    saveDb();
    return newMessage;
  },
  updateMessageStatus: (id: string, status: 'Pendiente' | 'Respondido'): ContactMessage | null => {
    const msg = dbCache.messages.find((m) => m.id === id);
    if (!msg) return null;
    msg.status = status;
    saveDb();
    return msg;
  },
  deleteMessage: (id: string): boolean => {
    const prevLength = dbCache.messages.length;
    dbCache.messages = dbCache.messages.filter((m) => m.id !== id);
    if (dbCache.messages.length !== prevLength) {
      saveDb();
      return true;
    }
    return false;
  },

  // Services
  getServices: (): ServiceItem[] => {
    return dbCache.services;
  },
  updateService: (id: string, updates: Partial<ServiceItem>): ServiceItem | null => {
    const index = dbCache.services.findIndex((s) => s.id === id);
    if (index === -1) return null;
    dbCache.services[index] = { ...dbCache.services[index], ...updates };
    saveDb();
    return dbCache.services[index];
  },

  // Settings
  getSettings: (): SiteSettings => {
    return dbCache.settings;
  },
  updateSettings: (updates: Partial<SiteSettings>): SiteSettings => {
    dbCache.settings = { ...dbCache.settings, ...updates };
    saveDb();
    return dbCache.settings;
  },

  // Stats
  getStats: (): SiteStats => {
    const activeProjects = dbCache.projects.filter((p) => p.status === 'En curso').length;
    const totalProjects = dbCache.projects.length;
    const totalMessages = dbCache.messages.length;
    const unreadMessages = dbCache.messages.filter((m) => m.status === 'Pendiente').length;

    return {
      activeProjects,
      totalProjects,
      totalMessages,
      unreadMessages,
      visits: dbCache.stats.visits,
      lastUpdated: new Date().toISOString(),
    };
  },
  incrementVisits: (): number => {
    dbCache.stats.visits += 1;
    saveDb();
    return dbCache.stats.visits;
  },

  // Authentication
  validateLogin: (userOrEmail: string, pass: string): { valid: boolean; user?: { username: string; email: string; name: string; role: string; token: string } } => {
    const input = userOrEmail.trim().toLowerCase();
    const admin = dbCache.admin || DEFAULT_ADMIN;
    
    const matchesUser = input === admin.username.toLowerCase() || input === admin.email.toLowerCase();
    const matchesPass = pass === admin.password;

    if (matchesUser && matchesPass) {
      // Simple signed deterministic session token for demo/production CMS
      const token = `romero-token-${Buffer.from(`${admin.username}:${Date.now()}`).toString('base64')}`;
      return {
        valid: true,
        user: {
          username: admin.username,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          token,
        },
      };
    }

    return { valid: false };
  },

  getAdminProfile: () => {
    const admin = dbCache.admin || DEFAULT_ADMIN;
    return {
      username: admin.username,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
  },

  updateAdminPassword: (currentPass: string, newPass: string): { success: boolean; message: string } => {
    const admin = dbCache.admin || DEFAULT_ADMIN;
    if (admin.password !== currentPass) {
      return { success: false, message: 'La contraseña actual no es correcta.' };
    }
    if (!newPass || newPass.length < 4) {
      return { success: false, message: 'La nueva contraseña debe tener al menos 4 caracteres.' };
    }
    dbCache.admin.password = newPass;
    saveDb();
    return { success: true, message: 'Contraseña actualizada exitosamente.' };
  },
};
