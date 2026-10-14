import type { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null
let creating: Promise<SupabaseClient> | null = null

/**
 * Browser-only Supabase client (anon key + Realtime).
 *
 * The SDK is imported dynamically — never statically — so the Nitro
 * server bundle contains zero `@supabase/*` code/imports and the Vercel
 * serverless function can't fail with ERR_MODULE_NOT_FOUND. All callers
 * (useRates, pages/admin.vue) only reach this after mount, on the client.
 */
export async function useSupabase(): Promise<SupabaseClient> {
  if (import.meta.server) {
    throw new Error('[useSupabase] Supabase client SDK is browser-only — it must never run on the server')
  }
  if (client) return client
  creating ??= (async () => {
    const config = useRuntimeConfig()
    const url = config.public.supabaseUrl
    const key = config.public.supabaseAnonKey
    if (!url || !key) {
      throw new Error(
        'Missing Supabase credentials. Set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY in .env'
      )
    }
    const { createClient } = await import('@supabase/supabase-js')
    client = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true },
      realtime: { params: { eventsPerSecond: 5 } },
    })
    return client
  })()
  return creating
}
