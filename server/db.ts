import fs from 'fs';
import path from 'path';
import { Project, ServiceItem, ContactMessage } from '../src/types';
import { INITIAL_PROJECTS, INITIAL_SERVICES, INITIAL_MESSAGES } from '../src/mockData';

export interface SiteSettings {
  studioName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  whatsappNumber: string;
}

export interface SiteStats {
  activeProjects: number;
  totalProjects: number;
  totalMessages: number;
  unreadMessages: number;
  visits: number;
  lastUpdated: string;
}

interface DatabaseSchema {
  projects: Project[];
  services: ServiceItem[];
  messages: ContactMessage[];
  settings: SiteSettings;
  stats: {
    visits: number;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

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

// In-memory cache
let dbCache: DatabaseSchema = {
  projects: [...INITIAL_PROJECTS],
  services: [...INITIAL_SERVICES],
  messages: [...INITIAL_MESSAGES],
  settings: { ...DEFAULT_SETTINGS },
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
};
