-- ==============================================================================
-- ROMERO ESTUDIO • ESQUEMA DE BASE DE DATOS SUPABASE (PostgreSQL + RLS + Storage)
-- ==============================================================================
-- Ejecuta este script en el Editor SQL de tu proyecto en Supabase (https://supabase.com/dashboard)

-- 1. TABLA: PROYECTOS (Obras de Arquitectura y Urbanismo)
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Residencial', 'Comercial', 'Corporativo', 'Urbanismo', 'Interiorismo')),
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    year INTEGER NOT NULL,
    surface TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Construido', 'En Construcción', 'En Proyecto')),
    images TEXT[] NOT NULL DEFAULT '{}',
    architectural_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLA: SERVICIOS (Líneas de práctica y entregables)
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    deliverables TEXT[] NOT NULL DEFAULT '{}',
    phases TEXT[] NOT NULL DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA: MENSAJES (Consultas y prospectos del formulario de contacto)
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    typology TEXT NOT NULL,
    budget TEXT,
    location TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA: CONFIGURACIÓN GENERAL DEL SITIO
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    studio_name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    office_address TEXT NOT NULL,
    hours TEXT,
    social JSONB DEFAULT '{"instagram": "https://instagram.com", "linkedin": "https://linkedin.com"}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 5. POLÍTICAS DE SEGURIDAD (Row Level Security - RLS)
-- ==============================================================================
-- Habilitar RLS en todas las tablas
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Proyectos: Lectura pública; Escritura restringida a usuarios autenticados
CREATE POLICY "Lectura pública de proyectos" 
    ON public.projects FOR SELECT 
    USING (true);

CREATE POLICY "Gestión de proyectos para administradores" 
    ON public.projects FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Servicios: Lectura pública; Escritura solo autenticados
CREATE POLICY "Lectura pública de servicios" 
    ON public.services FOR SELECT 
    USING (true);

CREATE POLICY "Gestión de servicios para administradores" 
    ON public.services FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Mensajes de Contacto: Inserción pública (cualquier cliente puede consultar); Lectura y gestión solo autenticados
CREATE POLICY "Envío público de consultas" 
    ON public.messages FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Lectura y gestión de mensajes para administradores" 
    ON public.messages FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Configuración: Lectura pública; Modificación solo autenticados
CREATE POLICY "Lectura pública de configuración" 
    ON public.settings FOR SELECT 
    USING (true);

CREATE POLICY "Edición de configuración para administradores" 
    ON public.settings FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- ==============================================================================
-- 6. SUPABASE STORAGE (Bucket para Renders y Fotografías de Alta Gama)
-- ==============================================================================
-- Crear bucket de imágenes de proyectos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage: Visualización pública de renders, subida solo para autenticados
CREATE POLICY "Acceso público a imágenes de proyectos" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'project-images');

CREATE POLICY "Subida de imágenes para administradores" 
    ON storage.objects FOR INSERT 
    TO authenticated 
    WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Modificación de imágenes para administradores" 
    ON storage.objects FOR UPDATE 
    TO authenticated 
    USING (bucket_id = 'project-images');

CREATE POLICY "Eliminación de imágenes para administradores" 
    ON storage.objects FOR DELETE 
    TO authenticated 
    USING (bucket_id = 'project-images');
