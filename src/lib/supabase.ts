import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Project, ServiceItem, ContactMessage, SiteSettings } from '../types';

let supabaseClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key && url.trim() !== '' && key.trim() !== '');
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClient) {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return null;
    }
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseClient;
}

// Storage Helper for Project Renders and Images
export async function uploadProjectImageToSupabase(file: File, path?: string): Promise<{ url: string | null; error: string | null }> {
  const client = getSupabase();
  if (!client) {
    return { url: null, error: 'Supabase no está configurado aún' };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { error: uploadError } = await client.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = client.storage.from('project-images').getPublicUrl(filePath);
    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Error al subir la imagen' };
  }
}
