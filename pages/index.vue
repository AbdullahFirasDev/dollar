<template>
  <div class="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 py-6 sm:py-10">
    <!-- ═══ Top Row Grid: Live status banner + last-updated badge ═══ -->
    <section class="grid grid-cols-1 gap-3 mb-4 sm:mb-6" aria-label="حالة التحديث">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <!-- Live status banner -->
        <div
          class="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-surface px-4 py-3 shadow-sm"
        >
          <span v-if="connected" class="live-pulse"><span /><span /></span>
          <span
            v-else
            class="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300"
            aria-hidden="true"
          />
          <div class="min-w-0">
            <p class="text-sm font-bold text-ink-strong leading-tight">
              {{ connected ? 'البث المباشر يعمل الآن' : 'جارٍ الاتصال...' }}
            </p>
            <p class="text-[11px] text-muted leading-tight">
              أسعار صرف الدولار مقابل الدينار العراقي — تحديث لحظي
            </p>
          </div>
          <span
            class="ml-auto text-[10px] font-bold rounded-full px-2 py-0.5 shrink-0"
            :class="connected ? 'bg-emerald-50 text-gain' : 'bg-slate-100 text-muted'"
          >
            {{ connected ? 'LIVE' : '...' }}
          </span>
        </div>

        <!-- Last updated timestamp badge -->
        <div
          class="flex items-center justify-center md:justify-end gap-2 rounded-2xl border border-slate-200/80 bg-surface px-4 py-3 shadow-sm"
          aria-live="polite"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-accent shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-ink">
            آخر تحديث:
            <span class="font-extrabold text-ink-strong price-tabular">{{ agoText() }}</span>
          </p>
        </div>
      </div>
    </section>

    <!-- ═══ Main Grid ═══ -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <!-- Loading skeletons -->
      <template v-if="loading">
        <div v-for="i in 3" :key="`sk-${i}`" class="card p-5 animate-pulse" aria-busy="true">
          <div class="h-5 w-28 bg-slate-200 rounded mb-4" />
          <div class="grid grid-cols-2 gap-3">
            <div class="h-20 rounded-xl bg-slate-200" />
            <div class="h-20 rounded-xl bg-slate-200" />
          </div>
        </div>
      </template>

      <!-- Exchange rate cards: Baghdad · Erbil · Basra (per 100$) -->
      <template v-else>
        <RateCard region="baghdad" />
        <RateCard region="north" />
        <RateCard region="south" />
      </template>

      <!-- Interactive currency converter — dedicated grid card -->
      <div class="md:col-span-2 lg:col-span-2">
        <RateCalculator />
      </div>

      <!-- PWA download/install CTA card — bottom grid span -->
      <PwaCtaCard />
    </section>

  </div>
</template>

<script setup lang="ts">
const { loading, connected, agoText } = useRates()

useHead({ title: 'الدولار العراقي — سعر الدولار اليوم في بغداد وأربيل والبصرة' })
</script>
