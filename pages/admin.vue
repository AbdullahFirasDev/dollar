<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <!-- ─────────── Login state ─────────── -->
    <div v-if="!user && !checkingSession" class="card p-6 md:p-8 max-w-sm mx-auto">
      <h1 class="font-bold text-xl mb-1"> تسجيل دخول المشرف</h1>
      <p class="text-xs text-slate-500 mb-5">الدخول محمي — للمشرفين فقط</p>

      <form @submit.prevent="signIn" class="space-y-3">
        <input v-model="email" type="email" required placeholder="البريد الإلكتروني" class="input" dir="ltr" />
        <input v-model="password" type="password" required placeholder="كلمة المرور" class="input" dir="ltr" />
        <button type="submit" class="btn btn-primary w-full" :disabled="busy">
          {{ busy ? 'جارٍ الدخول...' : 'دخول' }}
        </button>
        <p v-if="error" class="text-red-500 text-xs text-center">{{ error }}</p>
      </form>
    </div>

    <!-- ─────────── Dashboard state ─────────── -->
    <div v-else-if="user">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="font-bold text-xl"> لوحة تحكم المشرف</h1>
          <p class="text-xs text-slate-500">{{ user.email }}</p>
        </div>
        <button class="btn btn-ghost text-sm" @click="signOut">خروج</button>
      </div>

      <div class="grid gap-4">
        <div v-for="(row, region) in rates" :key="region" class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-bold">{{ REGION_LABELS[region as Region].icon }} {{ REGION_LABELS[region as Region].ar }}</h2>
            <span class="text-[11px] text-slate-400">آخر تحديث: {{ shortTime(row.updated_at) }}</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] text-mint-dark dark:text-mint mb-1 font-bold">
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
              <label class="block text-[11px] text-primary-700 dark:text-brand-500 mb-1 font-bold">
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
        <p v-if="msg" class="text-center text-sm mt-2" :class="msgOk ? 'text-mint-dark dark:text-mint' : 'text-red-500'">
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
import { REGION_LABELS } from '~/composables/useRates'

type Region = RateRow['region']
const REGIONS: Region[] = ['baghdad', 'north', 'south']

const supabase = useSupabase()
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
  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user ?? null
  checkingSession.value = false

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })
})

async function signIn() {
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
  await supabase.auth.signOut()
  user.value = null
}

async function saveAll() {
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
