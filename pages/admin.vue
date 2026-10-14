<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <!-- ─────────── Login state ─────────── -->
    <div v-if="!user && !checkingSession" class="card p-6 md:p-8 max-w-sm mx-auto">          <h1 class="font-bold text-xl mb-1 text-ink-strong"> تسجيل دخول المشرف</h1>
      <p class="text-xs text-slate-500 mb-5">الدخول محمي — للمشرفين فقط</p>

      <form @submit.prevent="signIn" class="space-y-3">
        <input v-model="email" type="email" required placeholder="البريد الإلكتروني" class="input" dir="ltr" />
        <input v-model="password" type="password" required placeholder="كلمة المرور" class="input" dir="ltr" />
        <button type="submit" class="btn btn-primary w-full" :disabled="busy">
          {{ busy ? 'جارٍ الدخول...' : 'دخول' }}
        </button>
        <p v-if="error" class="text-drop text-xs text-center">{{ error }}</p>
      </form>
    </div>

    <!-- ─────────── Dashboard state ─────────── -->
    <div v-else-if="user">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="font-bold text-xl text-ink-strong"> لوحة تحكم المشرف</h1>
          <p class="text-xs text-muted">{{ user.email }}</p>
        </div>
        <button class="btn btn-ghost text-sm" @click="signOut">خروج</button>
      </div>

      <!-- ─────────── Auto-Sync (IQWealth API) ─────────── -->
      <div class="card p-4 mb-5">
        <div class="flex items-center justify-between gap-3 mb-2">
          <div>
            <h2 class="font-bold text-sm sm:text-base text-ink-strong">⚡ مزامنة IQWealth الآلية</h2>
            <p class="text-[11px] text-muted mt-0.5">
              {{ autoSync ? 'النمط الآلي: يُسحب سعر الدولار (بغداد) تلقائياً من واجهة IQWealth كل 3 دقائق' : 'النمط اليدوي: لا تحديث تلقائي — التعديل من الحقول أدناه فقط' }}
            </p>
          </div>
          <!-- Toggle switch -->
          <button
            type="button"
            role="switch"
            :aria-checked="autoSync"
            :disabled="toggling"
            class="relative inline-flex h-8 w-14 shrink-0 rounded-full transition-colors items-center"
            :class="autoSync ? 'bg-brand-600' : 'bg-slate-300'"
            @click="toggleAutoSync"
          >
            <span class="inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform"
                  :class="autoSync ? 'translate-x-7' : 'translate-x-1'" />
          </button>
        </div>
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <p class="text-[11px] text-slate-400">
            <template v-if="lastSyncedAt">آخر مزامنة API: {{ shortTime(lastSyncedAt) }} — {{ lastSyncSource === 'iqwealth-api' ? 'IQWealth ✅' : 'فشلت ⚠️' }}</template>
            <template v-else>لم تتم أي مزامنة API بعد</template>
          </p>
          <button class="btn btn-primary h-10 min-h-0 px-3 text-xs" :disabled="syncing" @click="syncNow">
            {{ syncing ? 'جارٍ المزامنة...' : '🔄 مزامنة الآن' }}
          </button>
        </div>
        <p v-if="syncMsg" class="text-xs mt-2 text-center" :class="syncOk ? 'text-gain' : 'text-drop'">{{ syncMsg }}</p>
        <p v-if="!autoSync" class="text-[11px] text-amber-600 mt-2">
          ⚠️ النمط اليدوي مُفعَّل: بيانات API لن تُحدَّث — يتوفر زر «مزامنة الآن» لسحب القيم يدوياً وقتما تريد.
        </p>
      </div>

      <div class="grid gap-4">
        <div v-for="(row, region) in rates" :key="region" class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-bold text-ink-strong">{{ REGION_LABELS[region as Region].ar }}</h2>
            <span class="text-[11px] text-muted price-tabular">آخر تحديث: {{ shortTime(row.updated_at) }}</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] text-gain mb-1 font-bold">
                سعر البيع للمواطن (IQD)
              </label>
              <input
                v-model.number="draft[region as Region].sell"
                type="number"
                min="0"
                step="250"
                class="input tabular-nums"
                dir="ltr"
              />
            </div>
            <div>
              <label class="block text-[11px] text-brand-600 mb-1 font-bold">
                سعر الشراء من المواطن (IQD)
              </label>
              <input
                v-model.number="draft[region as Region].buy"
                type="number"
                min="0"
                step="250"
                class="input tabular-nums"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="sticky bottom-4 mt-5">
        <button class="btn btn-primary w-full shadow-lg min-h-[48px]" :disabled="saving" @click="saveAll">
          {{ saving ? 'جارٍ الحفظ والبث...' : ' حفظ وبث التحديث' }}
        </button>
        <p v-if="msg" class="text-center text-sm mt-2" :class="msgOk ? 'text-gain' : 'text-drop'">
          {{ msg }}
        </p>
      </div>
    </div>

    <!-- ─────────── Session check ─────────── -->
    <div v-else class="py-20 text-center text-slate-400">جارٍ التحقق من الجلسة...</div>
  </div>
</template>

<script setup lang="ts">
import type { RateRow } from '~/composables/useRates'
import type { SupabaseClient } from '@supabase/supabase-js'
import { REGION_LABELS } from '~/composables/useRates'

type Region = RateRow['region']
const REGIONS: Region[] = ['baghdad', 'north', 'south']

// Lazy client resolver — useSupabase() is browser-only (dynamic SDK import),
// so every call site awaits it instead of touching it during SSR setup.
let sbClient: SupabaseClient | null = null
async function getSupabase(): Promise<SupabaseClient> {
  sbClient ??= await useSupabase()
  return sbClient
}
const { rates, refresh } = useRates()

const user = ref<any>(null)
const checkingSession = ref(true)
const email = ref('')
const password = ref('')
const busy = ref(false)
const error = ref('')
const saving = ref(false)
const msg = ref('')
const msgOk = ref(false)

// ── Auto-Sync settings (app_settings table) ──
const autoSync = ref(true)
const toggling = ref(false)
const lastSyncedAt = ref<string | null>(null)
const lastSyncSource = ref<string | null>(null)
const syncing = ref(false)
const syncMsg = ref('')
const syncOk = ref(false)

async function loadSettings() {
  const supabase = await getSupabase()
  const { data } = await supabase
    .from('app_settings')
    .select('auto_sync, last_synced_at, last_sync_source, last_sync_error')
    .eq('id', 1)
    .single()
  if (data) {
    autoSync.value = data.auto_sync
    lastSyncedAt.value = data.last_synced_at
    lastSyncSource.value = data.last_sync_source
    if (data.last_sync_error) {
      syncOk.value = false
      syncMsg.value = '⚠️ آخر مزامنة API فشلت: ' + data.last_sync_error
    }
  }
}

async function toggleAutoSync() {
  const supabase = await getSupabase()
  const next = !autoSync.value
  toggling.value = true
  const { data: sessionData } = await supabase.auth.getSession()
  const uid = sessionData.session?.user?.id
  const { error: e } = await supabase
    .from('app_settings')
    .update({ auto_sync: next, updated_by: uid })
    .eq('id', 1)
  toggling.value = false
  if (e) {
    syncOk.value = false
    syncMsg.value = '⚠️ تعذر تغيير النمط: ' + (e.message ?? e)
    setTimeout(() => (syncMsg.value = ''), 4000)
    return
  }
  autoSync.value = next
  syncOk.value = true
  syncMsg.value = next ? '✅ تم تشغيل النمط الآلي (IQWealth API)' : '✅ تم التحويل إلى النمط اليدوي'
  refresh()
  setTimeout(() => (syncMsg.value = ''), 4000)
}

async function syncNow() {
  const supabase = await getSupabase()
  syncing.value = true
  syncMsg.value = ''
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    const res = await $fetch<any>('/api/rates/sync', {
      method: 'POST',
      query: { force: 'true' },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (res.ok && res.source === 'api') {
      syncOk.value = true
      syncMsg.value = res.updated?.usd
        ? '✅ تم سحب سعر الدولار من IQWealth و تحديث اللوحة'
        : '⚠️ وصل الرد من IQWealth لكنه لم يحتوي أسعار الدولار'
    } else {
      syncOk.value = false
      syncMsg.value = '⚠️ ' + (res.error ?? 'تعذر الوصول إلى API — القيم المعروضة هي آخر بيانات مخزنة')
    }
  } catch (e: any) {
    syncOk.value = false
    syncMsg.value = '⚠️ ' + (e?.data?.error ?? e?.message ?? 'فشل الاتصال بخادم المزامنة')
  } finally {
    syncing.value = false
    await loadSettings()
    await refresh()
    setTimeout(() => (syncMsg.value = ''), 5000)
  }
}

const draft = reactive<Record<Region, { buy: number; sell: number }>>({
  baghdad: { buy: 0, sell: 0 },
  north: { buy: 0, sell: 0 },
  south: { buy: 0, sell: 0 },
})

// Sync drafts whenever live rates change (e.g. landed mid-broadcast)
watch(
  () => ({ ...rates.value }),
  (r) => {
    for (const region of ['baghdad', 'north', 'south'] as Region[]) {
      if (r[region]) {
        draft[region].buy = r[region].buy_price
        draft[region].sell = r[region].sell_price
      }
    }
  },
  { immediate: true, deep: true }
)

onMounted(async () => {
  const supabase = await getSupabase()
  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user ?? null
  checkingSession.value = false

  await loadSettings()

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
    if (session) loadSettings()
  })
})

async function signIn() {
  const supabase = await getSupabase()
  busy.value = true
  error.value = ''
  const { data, error: e } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  busy.value = false
  if (e) error.value = e.message
  else user.value = data.user
}

async function signOut() {
  const supabase = await getSupabase()
  await supabase.auth.signOut()
  user.value = null
}

async function saveAll() {
  const supabase = await getSupabase()
  saving.value = true
  msg.value = ''
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const uid = sessionData.session?.user?.id
    const updates = REGIONS.map((region) => ({
      region,
      region_ar: REGION_LABELS[region].ar,
      buy_price: draft[region].buy,
      sell_price: draft[region].sell,
      updated_by: uid,
      updated_at: new Date().toISOString(),
    }))
    const { error: e } = await supabase.from('rates').upsert(updates, { onConflict: 'region' })
    if (e) throw e
    msgOk.value = true
    msg.value = '✅ تم الحفظ — التحديث بُثّ مباشرةً لجميع الزوار'
    await refresh()
  } catch (e: any) {
    msgOk.value = false
    msg.value = '⚠️ فشل الحفظ: ' + (e.message ?? e)
  } finally {
    saving.value = false
    setTimeout(() => (msg.value = ''), 4000)
  }
}

function shortTime(t: string) {
  return new Date(t).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
}

useHead({ title: 'لوحة التحكم — الدولار العراقي' })

definePageMeta({ layout: 'default' })
</script>
