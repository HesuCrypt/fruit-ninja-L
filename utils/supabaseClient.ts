import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION START ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
// --- CONFIGURATION END ---

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = () => {
    return (SUPABASE_URL as string) !== 'https://YOUR_PROJECT_ID.supabase.co' &&
        (SUPABASE_ANON_KEY as string) !== 'YOUR_SUPABASE_ANON_KEY';
};