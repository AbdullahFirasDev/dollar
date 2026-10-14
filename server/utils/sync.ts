import { fetchIQWealth } from './iqwealth'

export interface SyncResult {
  ok: boolean
  source: 'api' | 'db-fallback' | 'skipped'
  reason?: string
  updated?: {
    usd: boolean
  }
  error?: string
}

interface AppSettings {
  auto_sync: boolean
  last_synced_at: string | null
  last_sync_source: string | null
  last_sync_error: string | null
}

const THROTTLE_MS = 2 * 60 * 1000 // min 2 min between automatic syncs

/**
 * Fetch the latest USD rates from IQWealth and upsert them into Supabase so
 * Realtime broadcasts to every connected client. Designed to fail gracefully:
 * on any external API error the DB keeps serving the last known rates
 * (nothing is deleted) and the error is recorded in app_settings.
 */
export async function runSync(
  config: ReturnType<typeof useRuntimeConfig>,
  opts: { force?: boolean } = {}
): Promise<SyncResult & { settings?: AppSettings }> {
  const now = new Date()

  // 1) Read admin settings (auto-sync vs manual override)
  const { data: settings } = await sbSingle<AppSettings>('app_settings', {
    select: 'auto_sync, last_synced_at, last_sync_source, last_sync_error',
    eq: { id: 1 },
  })

  const auto = settings?.auto_sync ?? true
  if (!auto && !opts.force) {
    return { ok: true, source: 'skipped', reason: 'manual_override' }
  }
  // Throttle automatic (non-forced) syncs so multiple instances / clients don't hammer the API
  if (!opts.force && settings?.last_synced_at) {
    const since = now.getTime() - new Date(settings.last_synced_at).getTime()
    if (since < THROTTLE_MS && since >= 0) {
      return { ok: true, source: 'skipped', reason: 'throttled' }
    }
  }

  try {
    // 2) Fetch + parse the external API (throws on failure/timeout)
    const snap = await fetchIQWealth(config)

    // 3) Upsert USD (Baghdad) — IQWealth reports the Baghdad market;
    //    the Erbil/Basra rows stay under admin control.
    if (!snap.usd) throw new Error('IQWealth payload contained no USD rates')
    const { error } = await sbUpsert(
      'rates',
      {
        region: 'baghdad',
        region_ar: 'بغداد',
        buy_price: Math.round(snap.usd.buy),
        sell_price: Math.round(snap.usd.sell),
        updated_by: null,
        updated_at: now.toISOString(),
      },
      'region'
    )
    if (error) throw new Error('USD upsert failed: ' + error.message)

    // 4) Record sync metadata
    const { data: newSettings } = await sbPatch<AppSettings>(
      'app_settings',
      {
        last_synced_at: now.toISOString(),
        last_sync_source: 'iqwealth-api',
        last_sync_error: null,
      },
      {
        select: 'auto_sync, last_synced_at, last_sync_source, last_sync_error',
        eq: { id: 1 },
      }
    )

    return { ok: true, source: 'api', updated: { usd: true }, settings: newSettings ?? undefined }
  } catch (e: any) {
    // External API failed or DB write refused — keep the latest DB records
    // as the fallback (nothing deleted), just log the error.
    const msg = e?.message ?? String(e)
    console.error('[sync] IQWealth sync failed, serving DB values:', msg)
    await sbPatch('app_settings', { last_sync_error: msg.slice(0, 500) }, { eq: { id: 1 } })
    return { ok: false, source: 'db-fallback', error: msg }
  }
}
