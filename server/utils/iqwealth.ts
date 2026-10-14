/**
 * IQWealth / IraqSM data source — server side only (USD/IQD focus).
 *
 * Official public endpoint: https://iraqsm.com/api/sheet/all (CSV: name,value,unit,as_of).
 * The licensed key (iqw_...) is attached on every request via Authorization/X-API-Key
 * so that a licensed endpoint is honoured automatically if/when the key authorizes one.
 *
 * Names available (verified live): usd, usd-buy, usd-sell, usd-100, usd-official, usd-gap,
 * plus gold/currency/ISX names we intentionally ignore for the USD-only board.
 */

export interface IQEntry {
  name: string
  value: number
  unit: string
  as_of: string
}

export interface IQUsdRates {
  sell: number   // IQD per 1 USD sold to the citizen (Baghdad market)
  buy: number    // IQD per 1 USD bought from the citizen
  per100: number // price of 100 USD
  official: number // Central Bank official rate (0 when unavailable)
}

export interface IQRatesSnapshot {
  usd: IQUsdRates | null
  fetchedAt: string
}

export function parseCSV(csv: string): IQEntry[] {
  const lines = csv.trim().split(/\r?\n/)
  const out: IQEntry[] = []
  for (const line of lines) {
    if (!line || line.startsWith('name,')) continue
    const [name, value, unit, as_of] = line.split(',')
    const v = Number(value)
    if (!name || !Number.isFinite(v)) continue
    out.push({ name: name.toLowerCase(), value: v, unit: unit ?? '', as_of: as_of ?? '' })
  }
  return out
}

function num(entries: IQEntry[], name: string): number | null {
  const e = entries.find((x) => x.name === name)
  return e && Number.isFinite(e.value) ? e.value : null
}

export function mapUsd(entries: IQEntry[], fetchedAt: string): IQRatesSnapshot {
  const sell = num(entries, 'usd') ?? num(entries, 'usd-sell')
  const buy = num(entries, 'usd-buy')
  const per100 = num(entries, 'usd-100')
  const official = num(entries, 'usd-official')

  return {
    usd:
      sell != null
        ? {
            sell,
            buy: buy ?? sell,
            per100: per100 ?? sell * 100,
            official: official ?? 0,
          }
        : null,
    fetchedAt,
  }
}

/**
 * Fetch raw data from IQWealth and extract the USD block. Throws on
 * network failure / timeout — callers fall back to the latest Supabase
 * rows in that case.
 */
export async function fetchIQWealth(config: ReturnType<typeof useRuntimeConfig>): Promise<IQRatesSnapshot> {
  const base = config.iqwealthBaseUrl || 'https://iraqsm.com/api/sheet'
  const url = `${base.replace(/\/$/, '')}/all`
  const key =
    config.iqwealthApiKey ||
    (globalThis as any).process?.env?.IQWEALTH_API_KEY ||
    'iqw_UkH3TuIDko9Tgd6P8J1bSQT29WCT35bS'

  const res = await $fetch.raw(url, {
    method: 'GET',
    timeout: 10_000,
    retry: 1,
    headers: {
      accept: 'text/csv, application/json;q=0.9, */*;q=0.5',
      // Licensed key: sent both ways so any of the provider's accepted
      // header schemes works without needing a code change later.
      ...(key ? { authorization: `Bearer ${key}`, 'x-api-key': key } : {}),
    },
  })

  const text = (res._data ?? '') as string
  if (typeof text !== 'string' || !text.trim()) throw new Error('IQWealth returned an empty payload')

  let entries: IQEntry[]
  const trimmed = text.trim()
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    // A licensed endpoint may return JSON instead of CSV — accept both shapes.
    const parsed = JSON.parse(trimmed)
    const arr: any[] = Array.isArray(parsed) ? parsed : (parsed.data ?? parsed.rates ?? [])
    entries = arr
      .map((r: any) => ({
        name: String(r.name ?? r.item ?? '').toLowerCase(),
        value: Number(r.value ?? r.price),
        unit: String(r.unit ?? ''),
        as_of: String(r.as_of ?? r.date ?? ''),
      }))
      .filter((r) => r.name && Number.isFinite(r.value))
  } else {
    entries = parseCSV(trimmed)
  }
  if (!entries.length) throw new Error('IQWealth payload had no usable rows')
  return mapUsd(entries, new Date().toISOString())
}
