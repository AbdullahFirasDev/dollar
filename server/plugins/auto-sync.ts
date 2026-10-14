import { runSync } from '../utils/sync'

/**
 * Background auto-sync scheduler for the IQWealth → Supabase pipeline.
 *
 * Runs every 3 minutes while the server is alive. runSync() itself is safe
 * to call repeatedly — it honours the admin "Auto-Sync / Manual Override"
 * toggle in app_settings and self-throttles to one pull per 2 minutes,
 * so multiple app instances won't hammer the external API.
 */
export default defineNitroPlugin((nitro) => {
  const config = useRuntimeConfig()
  const INTERVAL_MS = 3 * 60 * 1000

  async function tick() {
    try {
      const result = await runSync(config)
      if (result.source === 'api') {
        console.log('[auto-sync] synced from IQWealth:', result.updated)
      }
    } catch (e: any) {
      console.error('[auto-sync] unexpected failure:', e?.message ?? e)
    }
  }

  // First pull shortly after boot (once env/DB are warm), then on an interval.
  const boot = setTimeout(tick, 10_000)
  const interval = setInterval(tick, INTERVAL_MS)

  nitro.hooks.hook('close', () => {
    clearTimeout(boot)
    clearInterval(interval)
  })
})
