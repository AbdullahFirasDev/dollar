import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let admin: SupabaseClient | null = null  // process-free env access helper (works in the Nitro server runtime)
  function env(name: string): string | undefined {
  return (globalThis as any).process?.env?.[name] as string | undefined
}

/**
 * Supabase client for server routes using the service-role key.
 * This bypasses RLS so server-side syncs (IQWealth API → DB) can upsert rows
 * while public writes stay locked behind the admin auth policies.
 */
export function useSupabaseAdmin(): SupabaseClient {
  if (!admin) {
    const config = useRuntimeConfig()
    // Accept both naming conventions used across the project/env files:
    // NUXT_PUBLIC_SUPABASE_URL or plain SUPABASE_URL, and the service key
    // as NUXT_SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY.
    const url =
      config.public.supabaseUrl ||
      env('SUPABASE_URL') ||
      env('NUXT_PUBLIC_SUPABASE_URL')
    const serviceKey =
      config.supabaseServiceKey ||
      env('SUPABASE_SERVICE_ROLE_KEY') ||
      env('SUPABASE_SERVICE_KEY')
    if (!url || !serviceKey) {
      throw new Error(
        'Missing server Supabase credentials. Set NUXT_PUBLIC_SUPABASE_URL and NUXT_SUPABASE_SERVICE_KEY (service role key) in .env'
      )
    }
    admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return admin
}
