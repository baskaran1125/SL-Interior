import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

if (!isConfigured) {
  console.warn(
    'Supabase credentials not found. The site will use fallback/static content. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable dynamic content.'
  );
}

// Create a real client only if configured; otherwise use a dummy URL to prevent crashes
export const supabase: SupabaseClient = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder-key'
);

export const isSupabaseConfigured = isConfigured;
