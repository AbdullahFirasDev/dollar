<template>
  <div class="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 py-6 sm:py-10">
    <section class="text-center mb-6 sm:mb-10">
      <h1 class="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-primary-700 dark:text-white mb-2">
        سعر الدولار اليوم في العراق
      </h1>
      <p class="text-muted dark:text-slate-400 text-sm sm:text-base lg:text-lg">
      </p>
      <p class="mt-2 text-xs sm:text-sm text-muted dark:text-slate-500" aria-live="polite">
        آخر تحديث: <span class="font-bold text-primary-700 dark:text-cyan-highlight">{{ agoText() }}</span>
      </p>
    </section>

    <section v-if="loading" class="grid gap-4 sm:gap-5 md:grid-cols-3" aria-busy="true">
      <div v-for="i in 3" :key="i" class="card p-5 sm:p-6 animate-pulse">
        <div class="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
        <div class="grid grid-cols-2 gap-3">
          <div class="h-16 sm:h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div class="h-16 sm:h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </section>

    <section v-else class="grid gap-4 sm:gap-5 md:grid-cols-3">
      <RateCard region="baghdad" />
      <RateCard region="north" />
      <RateCard region="south" />
    </section>

    <section class="mt-6 sm:mt-10">
      <RateCalculator />
    </section>
  </div>
</template>

<script setup lang="ts">
const { loading, agoText } = useRates()

useHead({
  title: 'الدولار العراقي — سعر الدولار اليوم في بغداد وأربيل والبصرة'
})
</script>
