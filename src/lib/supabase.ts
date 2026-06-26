import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured =
  !!supabaseUrl &&
  !supabaseUrl.includes('TU_PROYECTO') &&
  !!supabaseAnonKey &&
  !supabaseAnonKey.includes('TU_ANON_KEY');

if (!isSupabaseConfigured) {
  console.warn(
    '[AcoVen] ⚠️ Supabase no está configurado.\n' +
    'Crea un archivo .env en la raíz del proyecto con:\n' +
    '  VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui\n' +
    'La app cargará en modo sin conexión hasta que lo configures.'
  );
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
