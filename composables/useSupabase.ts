import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function useSupabase(): SupabaseClient {
  if (!client) {
    const config = useRuntimeConfig()
    const url = config.public.supabaseUrl
    const key = config.public.supabaseAnonKey
    if (!url || !key) {
      throw new Error(
        'Missing Supabase credentials. Set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY in .env'
      )
    }
    client = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true },
      realtime: { params: { eventsPerSecond: 5 } },
    })
  }
  return client
}
