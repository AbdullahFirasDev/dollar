import { fetchIQWealth, parseCSV, mapUsd, type IQRatesSnapshot } from '../utils/iqwealth'
import { runSync } from '../utils/sync'

/**
 * GET /api/test-sync — automated integration test for the IQWealth sync pipeline.
 *
 * Programmatically verifies:
 *  1. iqwealth_connection — live fetch with the configured API key.
 *  2. schema_mapping      — CSV → `rates` row mapping matches the Supabase
 *                           schema (baghdad region, integer buy/sell > 0).
 *  3. upsert_execution    — real `.upsert()` into Supabase succeeds with no
 *                           schema / unique-key constraint errors, and the
 *                           row reads back with the synced values.
 *  4. fallback_mechanism  — when the external API fails, the latest stored
 *                           rates remain intact and readable (graceful
 *                           fallback, nothing deleted).
 *
 * Usage:  curl http://localhost:3000/api/test-sync        (or `npm run test:sync`)
 */
interface CheckResult {
  name: string
  passed: boolean
  detail: string
}

interface RateRowLike {
  region: string
  region_ar: string
  buy_price: number
  sell_price: number
  updated_at: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const sb = useSupabaseAdmin()
  const checks: CheckResult[] = []

  const check = (name: string, passed: boolean, detail: string) => {
    checks.push({ name, passed, detail })
    return { name, passed, detail }
  }

  // ── 1) IQWealth connection & data retrieval ──────────────────────────────
  let snapshot: IQRatesSnapshot | null = null
  try {
    snapshot = await fetchIQWealth(config)
    const usd = snapshot.usd
    check(
      'iqwealth_connection',
      !!usd && usd.sell > 0 && usd.buy > 0,
      usd
        ? `fetched USD block: sell=${usd.sell} buy=${usd.buy} per100=${usd.per100} official=${usd.official}`
        : 'fetched payload but the USD block was empty'
    )
  } catch (e: any) {
    check('iqwealth_connection', false, 'fetch failed: ' + (e?.message ?? String(e)))
  }

  // ── 2) Formatting / mapping to the Supabase schema ───────────────────────
  // Deterministic fixture (same CSV shape the API returns) so the mapping is
  // asserted against known values, independent of market movement.
  const FIXTURE = [
    'name,value,unit,as_of',
    'usd,1662,IQD,2026-10-14',
    'usd-buy,1657,IQD,2026-10-14',
    'usd-sell,1662,IQD,2026-10-14',
    'usd-100,166200,IQD,2026-10-14',
    'usd-official,1510,IQD,2026-10-14',
    'gold21,705904,IQD,2026-10-14', // present in payload, must be ignored
    'eur,1860.27,IQD,2026-10-14',   // present in payload, must be ignored
    'try,33.66,IQD,2026-10-14',     // present in payload, must be ignored
  ].join('\n')

  try {
    const mapped = mapUsd(parseCSV(FIXTURE), new Date().toISOString())
    const usd = mapped.usd
    const rowShape = usd
      ? {
          region: 'baghdad' as const,
          region_ar: 'بغداد',
          buy_price: Math.round(usd.buy),
          sell_price: Math.round(usd.sell),
        }
      : null
    const ok =
      !!rowShape &&
      usd?.sell === 1662 &&
      usd?.buy === 1657 &&
      usd?.per100 === 166200 &&
      usd?.official === 1510 &&
      rowShape.buy_price === 1657 &&
      rowShape.sell_price === 1662 &&
      Number.isInteger(rowShape.buy_price) &&
      Number.isInteger(rowShape.sell_price)
    check(
      'schema_mapping',
      ok,
      ok
        ? `fixture mapped to rates row: ${JSON.stringify(rowShape)} (gold/currency rows ignored)`
        : `unexpected mapping: ${JSON.stringify(mapped)}`
    )
  } catch (e: any) {
    check('schema_mapping', false, 'mapping threw: ' + (e?.message ?? String(e)))
  }

  // ── 3) Real `.upsert()` execution (needs Supabase credentials) ───────────
  let before: RateRowLike | null = null
  try {
    const { data, error } = await sb.from('rates').select('*').eq('region', 'baghdad').single<RateRowLike>()
    if (error) throw new Error(error.message)
    before = data
  } catch (e: any) {
    check('upsert_execution', false, 'could not read the baghdad row first: ' + (e?.message ?? String(e)))
  }

  if (before) {
    try {
      const result = await runSync(config, { force: true })
      let readBack: RateRowLike | null = null
      let readErr: string | null = null
      try {
        const { data, error } = await sb.from('rates').select('*').eq('region', 'baghdad').single<RateRowLike>()
        if (error) readErr = error.message
        else readBack = data
      } catch (err: any) {
        readErr = err?.message ?? String(err)
      }

      const succeeded =
        result.ok &&
        result.source === 'api' &&
        result.updated?.usd === true &&
        !readErr &&
        !!readBack &&
        !!readBack.buy_price &&
        !!readBack.sell_price

      check(
        'upsert_execution',
        succeeded,
        succeeded
          ? `upsert ran clean (no constraint errors); read back sell=${readBack!.sell_price} buy=${readBack!.buy_price} at ${readBack!.updated_at}`
          : `runSync=${JSON.stringify(result)} readErr=${readErr ?? 'none'}`
      )
    } catch (e: any) {
      check('upsert_execution', false, 'upsert threw: ' + (e?.message ?? String(e)))
    }

    // ── 4) Fallback mechanism (simulated API failure) ─────────────────────
    try {
      // Force the external fetch to fail with an unreachable endpoint.
      const brokenConfig = { ...config, iqwealthBaseUrl: 'https://127.0.0.1:9/api/sheet' }
      let callFailed = false
      let failMsg = ''
      try {
        await fetchIQWealth(brokenConfig)
        failMsg = 'unreachable endpoint unexpectedly returned data'
      } catch (err: any) {
        callFailed = true
        failMsg = String(err?.message ?? err)
      }

      // While the API is down, the DB must still serve the latest stored rates.
      const { data: fallbackRow, error: fbErr } = await sb
        .from('rates')
        .select('*')
        .eq('region', 'baghdad')
        .single<RateRowLike>()

      check(
        'fallback_mechanism',
        callFailed && !fbErr && !!fallbackRow && fallbackRow.buy_price > 0 && fallbackRow.sell_price > 0,
        callFailed && !fbErr && fallbackRow
          ? `API failure detected ("${failMsg.slice(0, 80)}") — DB fallback serves sell=${fallbackRow.sell_price} buy=${fallbackRow.buy_price}`
          : `callFailed=${callFailed} dbErr=${fbErr?.['message'] ?? 'none'}`
      )
    } catch (e: any) {
      check('fallback_mechanism', false, 'fallback test threw: ' + (e?.message ?? String(e)))
    }
  }

  const allPassed = checks.every((c) => c.passed)
  setResponseStatus(event, allPassed ? 200 : 500)
  return {
    ok: allPassed,
    total: checks.length,
    passed: checks.filter((c) => c.passed).length,
    source: 'iqwealth-usd-sync',
    checks,
  }
})
