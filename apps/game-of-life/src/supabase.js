import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// You'll need to create a project at https://supabase.com and add your credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey &&
    !supabaseUrl.includes('YOUR_SUPABASE') &&
    !supabaseAnonKey.includes('YOUR_SUPABASE'))

// Create a mock client if not configured
const mockClient = {
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        signInWithOAuth: async () => ({ error: { message: 'Supabase not configured' } }),
        signOut: async () => ({ error: null }),
    },
    from: () => ({
        select: async () => ({ data: [], error: null }),
        insert: async () => ({ data: null, error: null }),
        update: async () => ({ data: null, error: null }),
        upsert: async () => ({ data: null, error: null }),
        delete: async () => ({ data: null, error: null }),
    }),
}

// Export real client if configured, otherwise mock
export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : mockClient

// Log configuration status
if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase not configured. Running in demo mode (data stored locally only).')
    console.info('To enable cloud sync, create a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}
