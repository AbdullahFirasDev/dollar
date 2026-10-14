/**
 * GET /api/rates
 *
 * Resilient read endpoint: never touches the external API.
 * Always returns the latest USD rates stored in Supabase (the automatic
 * fallback when IQWealth is unreachable). Clients normally read the
 * same table directly via Supabase Realtime; this endpoint exists for
 * integrations and manual verification.
 */
interface RateRow {
  id: string
  region: string
  region_ar: string
  buy_price: number
  sell_price: number
  updated_by: string | null
  updated_at: string
}

interface AppSettings {
  auto_sync: boolean
  last_synced_at: string | null
  last_sync_source: string | null
  last_sync_error: string | null
}

export default defineEventHandler(async () => {
  const [rates, settings] = await Promise.all([
    sbSelect<RateRow>('rates', { select: '*', order: 'region' }),
    sbSingle<AppSettings>('app_settings', {
      select: 'auto_sync, last_synced_at, last_sync_source, last_sync_error',
      eq: { id: 1 },
    }),
  ])

  return {
    rates: rates.data ?? [],
    settings: settings.data ?? null,
    errors: [rates.error?.message, settings.error?.message].filter(Boolean),
  }
})
