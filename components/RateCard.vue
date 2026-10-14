<template>
  <div class="card card-hover p-4 sm:p-6 h-full group" role="group" :aria-label="label.ar">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2.5">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-brand-600 transition-transform duration-200 ease-in-out group-hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </span>
        <div>
          <h3 class="font-bold text-base sm:text-lg leading-tight text-ink-strong">{{ label.ar }}</h3>
          <p class="text-[11px] text-muted">{{ label.en }}</p>
        </div>
      </div>
      <div class="text-left shrink-0">
        <span
          class="block h-2 w-2 rounded-full mb-1 ml-auto transition-colors duration-200"
          :class="changed ? 'bg-accent' : 'bg-slate-300'"
        />
        <p class="text-[11px] text-muted price-tabular">{{ agoText() }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-xl bg-gain-soft p-3 sm:p-4 transition-all duration-200 ease-in-out">
        <p class="text-[10px] sm:text-xs font-bold text-gain mb-1">
          سعر البيع للمواطن (لكل 100$)
        </p>
        <p class="price-tabular num-update text-xl sm:text-2xl font-extrabold text-ink-strong"
           :class="dir === 'up' ? 'flash-up' : dir === 'down' ? 'flash-down' : ''">
          {{ fmt(rate?.sell_price * 100) }}
        </p>
        <p class="text-[10px] text-muted mt-1">
          <span class="font-bold" :class="dir === 'up' ? 'text-gain' : dir === 'down' ? 'text-drop' : ''">
            {{ dir === 'up' ? '▲' : dir === 'down' ? '▼' : '' }}
          </span>
          مقابل 100 دولار
        </p>
      </div>
      <div class="rounded-xl bg-primary-50 p-3 sm:p-4 transition-all duration-200 ease-in-out">
        <p class="text-[10px] sm:text-xs font-bold text-brand-600 mb-1">
          سعر الشراء من المواطن (لكل 100$)
        </p>
        <p class="price-tabular num-update text-xl sm:text-2xl font-extrabold text-ink-strong"
           :class="dir === 'up-s' ? 'flash-up' : dir === 'down-s' ? 'flash-down' : ''">
          {{ fmt(rate?.buy_price * 100) }}
        </p>
        <p class="text-[10px] text-muted mt-1">
          <span class="font-bold" :class="dir === 'up-s' ? 'text-gain' : dir === 'down-s' ? 'text-drop' : ''">
            {{ dir === 'up-s' ? '▲' : dir === 'down-s' ? '▼' : '' }}
          </span>
          مقابل 100 دولار
        </p>
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
