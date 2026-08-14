// Supabase Client Helper for Frontend Auth & Realtime Subscriptions
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ughvlbsqdciytocgpkjc.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Gut0P9vJ3OPrae_42HkBaw_EqqbJvBW';

export const supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY
};

export default supabaseConfig;
