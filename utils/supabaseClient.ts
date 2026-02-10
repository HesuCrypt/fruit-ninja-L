import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION START ---
// 1. Go to your Supabase Project Settings -> API
// 2. Copy "Project URL" and paste it below
const SUPABASE_URL = 'https://donyytroqwwsxfqfzowd.supabase.co';

// 3. Copy "anon public" key and paste it below
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvbnl5dHJvcXd3c3hmcWZ6b3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MDc4MjIsImV4cCI6MjA4NjI4MzgyMn0.Qrm83iZSTdjnQJNI8YoPHwb_wefMY-bV3Yqd6fioUjg';
// --- CONFIGURATION END ---

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = () => {
    return (SUPABASE_URL as string) !== 'https://YOUR_PROJECT_ID.supabase.co' &&
        (SUPABASE_ANON_KEY as string) !== 'YOUR_SUPABASE_ANON_KEY';
};