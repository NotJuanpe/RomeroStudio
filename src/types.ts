export type ProjectCategory = 'Residencial' | 'Comercial' | 'Reforma' | 'Corporativo';
export type ProjectStatus = 'En curso' | 'Completado' | 'En planificación';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  longDescription?: string;
  year: number | string;
  area: string; // e.g. "420 m²"
  scope: string; // e.g. "Obra Nueva", "Reforma Integral"
  materials: string; // e.g. "Hormigón Visto, Acero, Vidrio Templado"
  heroImage: string;
  detailImage?: string;
  beforeImage?: string;
  afterImage?: string;
  location?: string;
  client?: string;
  featured?: boolean;
  status: ProjectStatus;
  gallery?: string[];
  specs?: {
    [key: string]: string;
  };
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  deliverables: string[];
  timeline: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  projectType?: string;
  estimatedArea?: string;
  message: string;
  date: string;
  status: 'Pendiente' | 'Respondido';
}

export type ScreenView =
  | 'inicio'
  | 'proyectos'
  | 'servicios'
  | 'antes-despues'
  | 'panel'
  | 'marca'
  | 'ui-kit';
