import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes('TU_PROYECTO')) {
  console.error(
    '[Supabase] VITE_SUPABASE_URL no está configurado en el archivo .env\n' +
    'Agrega la URL de tu proyecto Supabase: https://TU_PROYECTO.supabase.co'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
