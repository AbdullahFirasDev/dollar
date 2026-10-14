/**
 * Supabase REST helpers — native $fetch only, zero SDK dependency.
 *
 * Replaces `@supabase/supabase-js` in all server routes/utils so the Vercel
 * serverless bundle never has to resolve the package at runtime (the root
 * cause of ERR_MODULE_NOT_FOUND on /var/task).
 *
 * Mirrors the small `{ data, error }` surface the SDK offered so call sites
 * stay readable:
 *  - sbSelect  : GET  {base}/rest/v1/<table>               (rows array)
 *  - sbSingle  : GET  … with `Accept: application/vnd.pgrst.object+json`
 *  - sbUpsert  : POST … with `Prefer: resolution=merge-duplicates`
 *  - sbPatch   : PATCH … with `Prefer: return=representation`
 *  - sbGetUser : GET  {base}/auth/v1/user  (validates an access token)
 */

import { $fetch } from 'ofetch'

type SbError = { message: string } | null

interface SbResult<T> {
  data: T | null
  error: SbError
}

interface SelectOpts {
  select?: string
  eq?: Record<string, string | number | boolean>
  order?: string
}

interface SbCreds {
  base: string
  serviceKey: string
}

function sbCreds(): SbCreds {
  const config = useRuntimeConfig()
  const env = (name: string): string | undefined =>
    (globalThis as any).process?.env?.[name] as string | undefined
  // Accept both naming conventions used across the project/env files:
  // NUXT_PUBLIC_SUPABASE_URL or plain SUPABASE_URL, and the service key
  // as NUXT_SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY.
  const base =
    config.public.supabaseUrl ||
    env('SUPABASE_URL') ||
    env('NUXT_PUBLIC_SUPABASE_URL')
  const serviceKey =
    config.supabaseServiceKey ||
    env('SUPABASE_SERVICE_ROLE_KEY') ||
    env('SUPABASE_SERVICE_KEY')
  if (!base || !serviceKey) {
    throw new Error(
      'Missing server Supabase credentials. Set NUXT_PUBLIC_SUPABASE_URL and NUXT_SUPABASE_SERVICE_KEY (service role key) in .env'
    )
  }
  return { base: base.replace(/\/$/, ''), serviceKey }
}

function sbErrorMessage(e: any): string {
  return (
    e?.response?._data?.message ??
    e?.data?.message ??
    e?.message ??
    String(e)
  )
}

function buildQuery(o: SelectOpts): string {
  const qs = new URLSearchParams()
  if (o.select) qs.set('select', o.select)
  for (const [col, val] of Object.entries(o.eq ?? {})) {
    qs.set(col, `eq.${String(val)}`)
  }
  if (o.order) qs.set('order', o.order)
  const s = qs.toString()
  return s ? `?${s}` : ''
}

async function sbRequest<T>(
  path: string,
  query: string,
  init: {
    method?: 'GET' | 'POST' | 'PATCH'
    body?: unknown
    single?: boolean
    prefer?: string
  } = {}
): Promise<SbResult<T>> {
  const { base, serviceKey } = sbCreds()
  try {
    const headers: Record<string, string> = {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      ...(init.prefer ? { Prefer: init.prefer } : {}),
    }
    if (init.body !== undefined) headers['Content-Type'] = 'application/json'
    // `single` mirrors the SDK's .single(): PostgREST returns the row object
    // itself (and a 406 error when the query matches zero or many rows).
    if (init.single) headers.Accept = 'application/vnd.pgrst.object+json'
    const data = await $fetch<T>(`${base}/rest/v1/${path}${query}`, {
      method: init.method ?? 'GET',
      headers,
      ...(init.body !== undefined ? { body: init.body as any } : {}),
    })
    return { data, error: null }
  } catch (e: any) {
    return { data: null, error: { message: sbErrorMessage(e) } }
  }
}

/** SELECT — returns the matching rows as an array. */
export function sbSelect<T = any>(
  table: string,
  o: SelectOpts = {}
): Promise<SbResult<T[]>> {
  return sbRequest<T[]>(table, buildQuery(o))
}

/** SELECT … .single() — one row object (error when 0 rows). */
export function sbSingle<T = any>(
  table: string,
  o: Omit<SelectOpts, 'order'> = {}
): Promise<SbResult<T>> {
  return sbRequest<T>(table, buildQuery({ ...o, select: o.select ?? '*' }), {
    single: true,
  })
}

/** UPSERT with `on_conflict` — PostgREST merge-duplicates. */
export function sbUpsert(
  table: string,
  body: Record<string, any> | Array<Record<string, any>>,
  onConflict?: string
): Promise<SbResult<null>> {
  const conflictQuery = onConflict ? `?on_conflict=${onConflict}` : ''
  return sbRequest<null>(table, conflictQuery, {
    method: 'POST',
    body,
    prefer: 'resolution=merge-duplicates', // return=minimal: 201, empty body
  })
}

/** UPDATE with returning — echoes the updated row (single). */
export function sbPatch<T = any>(
  table: string,
  body: Record<string, any>,
  o: Omit<SelectOpts, 'order'> = {}
): Promise<SbResult<T>> {
  return sbRequest<T>(
    table,
    buildQuery({ select: o.select ?? '*', eq: o.eq }),
    {
      method: 'PATCH',
      body,
      single: true,
      prefer: 'return=representation',
    }
  )
}

/**
 * Validate a user access token (session JWT) — the REST equivalent of
 * `auth.getUser(token)`. Success means the token is a valid, unexpired
 * Supabase auth session.
 */
export async function sbGetUser(
  jwt: string
): Promise<SbResult<{ user: any }>> {
  const { base, serviceKey } = sbCreds()
  try {
    const user = await $fetch(`${base}/auth/v1/user`, {
      method: 'GET',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${jwt}`,
      },
    })
    return { data: { user }, error: null }
  } catch (e: any) {
    return { data: null, error: { message: sbErrorMessage(e) } }
  }
}
