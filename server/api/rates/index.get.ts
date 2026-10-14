/**
 * GET /api/rates
 *
 * Resilient read endpoint: never touches the external API.
 * Always returns the latest USD rates stored in Supabase (the automatic
 * fallback when IQWealth is unreachable). Clients normally read the
 * same table directly via Supabase Realtime; this endpoint exists for
 * integrations and manual verification.
 */
export default defineEventHandler(async () => {
  const sb = useSupabaseAdmin()

  const [rates, settings] = await Promise.all([
    sb.from('rates').select('*').order('region'),
    sb.from('app_settings').select('auto_sync, last_synced_at, last_sync_source, last_sync_error').eq('id', 1).single(),
  ])

  return {
    rates: rates.data ?? [],
    settings: settings.data ?? null,
    errors: [rates.error?.message, settings.error?.message].filter(Boolean),
  }
})
