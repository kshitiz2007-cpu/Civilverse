import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Browser-safe client. Configure both public values to enable remote data/auth. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// Supabase's SDK validates its URL at construction time. This inert placeholder
// prevents build-time crashes; the app checks isSupabaseConfigured before use.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-anon-key',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
);
