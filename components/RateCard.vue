<template>
  <div class="card p-4 sm:p-6 h-full">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="text-2xl sm:text-3xl">{{ label.icon }}</span>
        <div>
          <h3 class="font-bold text-base sm:text-xl leading-tight text-slate-800 dark:text-slate-100">{{ label.ar }}</h3>
          <p class="text-[11px] sm:text-xs text-muted dark:text-slate-400">{{ label.en }}</p>
        </div>
      </div>
      <div class="text-left shrink-0">
        <div class="h-2 w-2 rounded-full mb-1 inline-block"
             :class="changed ? 'bg-cyan-highlight live-dot' : 'bg-slate-300 dark:bg-slate-700'" />
        <p class="text-[11px] text-muted dark:text-slate-500">{{ agoText() }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2.5 sm:gap-3">
      <div class="rounded-xl bg-mint/10 border border-mint/30 p-2.5 sm:p-4">
        <p class="text-[10px] sm:text-xs font-bold text-mint-dark dark:text-mint mb-1">
          سعر البيع للمواطن (لكل 100$)
        </p>
        <p class="price-tabular num-update text-lg sm:text-2xl lg:text-[1.75rem] font-extrabold text-mint-dark dark:text-mint"
           :class="dir === 'up' ? 'flash-up' : dir === 'down' ? 'flash-down' : ''">
          {{ fmt(rate?.sell_price * 100) }}
        </p>
        <p class="text-[10px] text-muted dark:text-slate-400 mt-1">مقابل 100 دولار</p>
      </div>
      <div class="rounded-xl bg-primary-50 dark:bg-brand-500/10 border border-primary-100 dark:border-brand-500/30 p-2.5 sm:p-4">
        <p class="text-[10px] sm:text-xs font-bold text-primary-700 dark:text-brand-500 mb-1">
          سعر الشراء من المواطن (لكل 100$)
        </p>
        <p class="price-tabular num-update text-lg sm:text-2xl lg:text-[1.75rem] font-extrabold text-primary-700 dark:text-brand-500"
           :class="dir === 'up-s' ? 'flash-up' : dir === 'down-s' ? 'flash-down' : ''">
          {{ fmt(rate?.buy_price * 100) }}
        </p>
        <p class="text-[10px] text-muted dark:text-slate-400 mt-1">مقابل 100 دولار</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RateRow } from '~/composables/useRates'

const props = defineProps<{ region: 'baghdad' | 'north' | 'south' }>()

const { rates, prev, agoText } = useRates()
const rate = computed(() => rates.value[props.region])
const label = REGION_LABELS[props.region]

const dir = ref<'up' | 'down' | 'up-s' | 'down-s' | ''>('')
const changed = computed(() =>
  dir.value === 'up' || dir.value === 'down' || dir.value === 'up-s' || dir.value === 'down-s'
)
watch(
  () => rates.value[props.region],
  (n) => {
    const p = prev.value[props.region]
    if (!n || !p) return
    if (n.sell_price > p.sell) dir.value = 'up'
    else if (n.sell_price < p.sell) dir.value = 'down'
    else if (n.buy_price > p.buy) dir.value = 'up-s'
    else if (n.buy_price < p.buy) dir.value = 'down-s'
    setTimeout(() => (dir.value = ''), 1000)
  }
)

function fmt(v?: number) {
  if (v == null) return '—'
  return v.toLocaleString('en-US')
}
</script>
