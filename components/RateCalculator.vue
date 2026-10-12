<template>
  <div class="card p-4 sm:p-6 lg:p-8">
    <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
      <h2 class="font-bold text-base sm:text-xl text-slate-800 dark:text-slate-100">آلة حاسبة</h2>
      <div class="flex rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden text-xs sm:text-sm">
        <button
          v-for="(r, key) in regionOptions"
          :key="key"
          class="px-3 sm:px-4 min-h-[44px] sm:min-h-[48px] font-bold transition-colors"
          :class="selected === key
            ? 'bg-brand-600 text-white'
            : 'text-muted hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800'"
          @click="selected = key"
        >
          {{ r.ar }}
        </button>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4 lg:gap-6">
      <!-- Input side -->
      <div>
        <div class="flex rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden mb-3 text-sm">
          <button
            class="flex-1 min-h-[48px] font-bold transition-colors"
            :class="direction === 'usd2iqd' ? 'bg-brand-600 text-white' : 'text-muted hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800'"
            @click="direction = 'usd2iqd'"
          >
            USD → IQD
          </button>
          <button
            class="flex-1 min-h-[48px] font-bold transition-colors"
            :class="direction === 'iqd2usd' ? 'bg-brand-600 text-white' : 'text-muted hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800'"
            @click="direction = 'iqd2usd'"
          >
            IQD → USD
          </button>
        </div>

        <div class="relative">
          <input
            v-model.number="amount"
            type="number"
            min="0"
            inputmode="decimal"
            class="input text-xl sm:text-2xl font-extrabold price-tabular"
            :placeholder="direction === 'usd2iqd' ? 'دولار...' : 'دينار...'"
            :dir="direction === 'usd2iqd' ? 'ltr' : 'rtl'"
          />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted font-bold">
            {{ direction === 'usd2iqd' ? '$' : 'IQD' }}
          </span>
        </div>
      </div>

      <!-- Breakdown side -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden">
        <div class="p-3 sm:p-4 bg-mint/5">
          <div class="flex justify-between items-center gap-3">
            <div class="min-w-0">
              <p class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200"> إذا بعت {{ youAreSelling }} للمنفذ</p>
              <p class="text-[11px] text-muted">سعر الشراء من المواطن (لكل 100$): {{ fmtDisplay(rate?.buy_price * 100) }}</p>
            </div>
            <p class="price-tabular text-base sm:text-xl lg:text-2xl font-extrabold text-mint-dark dark:text-mint shrink-0"
               :dir="direction === 'usd2iqd' ? 'rtl' : 'ltr'">
              {{ fmt(sellResult) }}
            </p>
          </div>
        </div>
        <div class="p-3 sm:p-4 bg-primary-50/50 dark:bg-brand-500/5">
          <div class="flex justify-between items-center gap-3">
            <div class="min-w-0">
              <p class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200"> إذا اشريت {{ youAreBuying }} من المنفذ</p>
              <p class="text-[11px] text-muted">سعر البيع للمواطن (لكل 100$): {{ fmtDisplay(rate?.sell_price * 100) }}</p>
            </div>
            <p class="price-tabular text-base sm:text-xl lg:text-2xl font-extrabold text-primary-700 dark:text-brand-500 shrink-0"
               :dir="direction === 'usd2iqd' ? 'rtl' : 'ltr'">
              {{ fmt(buyResult) }}
            </p>
          </div>
        </div>
        <div class="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/40 text-center">
          <p class="text-[10px] sm:text-xs text-muted">
            الفرق بين البيع والشراء (سعر المحل): {{ fmt(spread * 100) }} IQD لكل 100 دولار
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RateRow } from '~/composables/useRates'

const selected = ref<'baghdad' | 'north' | 'south'>('baghdad')
const direction = ref<'usd2iqd' | 'iqd2usd'>('usd2iqd')
const amount = ref<number | null>(null)

const { rates } = useRates()
const rate = computed(() => rates.value[selected.value])
const regionOptions = REGION_LABELS

const youAreSelling = computed(() =>
  direction.value === 'usd2iqd' ? 'دولاراتك' : 'ديناراتك'
)
const youAreBuying = computed(() =>
  direction.value === 'usd2iqd' ? 'دولارات' : 'دينارات'
)

// "Sell to shop" means the shop BUYS from the citizen -> use buy_price
const sellResult = computed(() => {
  if (!amount.value || !rate.value) return 0
  const r = direction.value === 'usd2iqd' ? rate.value.buy_price : 1 / rate.value.buy_price
  return Math.floor(amount.value * r)
})

// "Buy from shop" means the shop SELLS to the citizen -> use sell_price
const buyResult = computed(() => {
  if (!amount.value || !rate.value) return 0
  const r = direction.value === 'usd2iqd' ? rate.value.sell_price : 1 / rate.value.sell_price
  return Math.floor(amount.value * r * 1000) / 1000
})

const spread = computed(() =>
  rate.value ? rate.value.sell_price - rate.value.buy_price : 0
)

function fmt(v?: number | null) {
  if (v == null || isNaN(v)) return '—'
  return v.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

function fmtDisplay(v?: number | null) {
  if (v == null || isNaN(v)) return '—'
  return v.toLocaleString('en-US')
}
</script>
