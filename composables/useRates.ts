import type { Ref } from 'vue'
import type { SupabaseClient, RealtimePostgresChangesPayload, RealtimePostgresChangesFilter } from '@supabase/supabase-js'

export interface RateRow {
  id: string
  region: 'baghdad' | 'north' | 'south'
  region_ar: string
  buy_price: number // سعر الشراء من المواطن (shop buys from citizen)
  sell_price: number // سعر البيع للمواطن (shop sells to citizen)
  updated_at: string
}

export const REGION_LABELS: Record<RateRow['region'], { ar: string; en: string; icon: string }> = {
  baghdad: { ar: 'بغداد', en: 'Baghdad', icon: '' },
  north: { ar: 'الشمال / أربيل', en: 'North / Erbil', icon: '' },
  south: { ar: 'الجنوب / البصرة', en: 'South / Basra', icon: '' },
}

/**
 * Shared reactive rates store backed by Supabase Realtime.
 * One channel per browser session, shared across every component via useState.
 */
let _channel: ReturnType<SupabaseClient['channel']> | null = null

export function useRates() {
  const rates = useState<Record<string, RateRow>>('rates', () => ({}))
  const prev = useState<Record<string, { buy: number; sell: number } | null>>(
    'rates-prev',
    () => ({})
  )
  const loading = useState('rates-loading', () => true)
  const connected = useState('rates-connected', () => false)
  const lastUpdatedAt = useState<string | null>('rates-last-updated', () => null)
  // Ticker so "updated X ago" text refreshes without hitting the network
  const now = ref(Date.now())

  async function fetchRates() {
    try {
      const supabase = useSupabase()
      const { data, error } = await supabase
        .from('rates')
        .select('id, region, region_ar, buy_price, sell_price, updated_at')
        .order('region')
      if (error) throw error
      const map: Record<string, RateRow> = {}
      let latest: string | null = null
      for (const row of data as RateRow[]) {
        map[row.region] = row
        if (!latest || row.updated_at > latest) latest = row.updated_at
      }
      // Snapshot previous values so the UI can flash green/red on change
      prev.value = Object.fromEntries(
        Object.entries(rates.value).map(([k, v]) => [k, { buy: v.buy_price, sell: v.sell_price }])
      )
      rates.value = map
      lastUpdatedAt.value = latest
    } catch (e) {
      console.error('[rates] fetch failed', e)
    } finally {
      loading.value = false
    }
  }

  function subscribe() {
    if (_channel) return
    const supabase = useSupabase()
    _channel = supabase
      .channel('rates-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rates' } as RealtimePostgresChangesFilter<'*'>,
        (payload: RealtimePostgresChangesPayload<RateRow>) => {
          // Delete events have no `new` row — guard with a type check
          const row = 'new' in payload ? (payload.new as RateRow) : undefined
          if (!row?.region) return
          const current = rates.value[row.region]
          prev.value = {
            ...prev.value,
            [row.region]: current ? { buy: current.buy_price, sell: current.sell_price } : null,
          }
          rates.value = { ...rates.value, [row.region]: row }
          lastUpdatedAt.value = row.updated_at
        }
      )
      .subscribe((status: string) => {
        connected.value = status === 'SUBSCRIBED'
        if (status === 'SUBSCRIBED') loading.value = false
      })
  }

  onMounted(async () => {
    await fetchRates()
    // Safety net: refetch every 60s in case Realtime drops silently
    const t = setInterval(fetchRates, 60_000)
    const nowTicker = setInterval(() => (now.value = Date.now()), 15_000)
    onUnmounted(() => {
      clearInterval(t)
      clearInterval(nowTicker)
    })
    subscribe()
  })

  function agoText(): string {
    if (!lastUpdatedAt.value) return '...'
    const diff = Math.max(0, now.value - new Date(lastUpdatedAt.value).getTime())
    const mins = Math.floor(diff / 60_000)
    if (mins < 1) return 'الآن مباشرة'
    if (mins === 1) return 'قبل دقيقة'
    if (mins < 60) return `قبل ${mins} دقائق`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `قبل ${hours} ساعة`
    const days = Math.floor(hours / 24)
    return `قبل ${days} يوم`
  }

  return { rates, prev, loading, connected, lastUpdatedAt, agoText, refresh: fetchRates }
}
