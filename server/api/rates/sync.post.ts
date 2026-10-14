import { runSync } from '../../utils/sync'

/**
 * POST /api/rates/sync?force=true
 *
 * Pulls the latest rates from IQWealth and upserts them into Supabase
 * (Realtime then broadcasts to all clients). Called by the scheduled
 * background job (server/plugins/auto-sync.ts) and by the admin
 * dashboard's "مزامنة الآن" button.
 *
 * ?force=true bypasses the auto_sync toggle and the 2-minute throttle.
 * Forced syncs must carry an admin access token (Authorization: Bearer)
 * so that anonymous visitors can't trigger API pulls on demand.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const force = query.force === 'true'

  if (force) {
    const auth = getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '') ?? ''
    if (!auth) {
      setResponseStatus(event, 401)
      return { ok: false, error: '🔒 المزامنة اليدوية تتطلب تسجيل دخول المشرف' }
    }
    const { data: userData, error } = await sbGetUser(auth)
    if (error || !userData?.user) {
      setResponseStatus(event, 401)
      return { ok: false, error: '🔒 جلسة المشرف غير صالحة — سجّل الدخول من جديد' }
    }
  }

  const result = await runSync(config, { force })

  // External API down → 502 with the fallback note; the DB still serves
  // the latest stored rows, so this is never fatal for clients.
  if (!result.ok) {
    setResponseStatus(event, 502)
  }
  return result
})
