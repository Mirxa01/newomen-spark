// Helper to get supabase client lazily - prevents crash when env vars not ready
const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export const getSupabase = async () => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not configured");
    return null;
  }
  const { supabase } = await import("@/integrations/supabase/client");
  return supabase;
};

export { isSupabaseConfigured };
