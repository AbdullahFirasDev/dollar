<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
    <header class="sticky top-0 z-40 backdrop-blur bg-surface/90 dark:bg-slate-950/80 border-b border-primary-100 dark:border-slate-800 shadow-sm">
      <div class="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        <NuxtLink to="/" class="flex items-center gap-2 min-w-0">
          <span class="text-2xl shrink-0"></span>
          <span class="font-extrabold text-lg sm:text-xl text-primary-700 dark:text-white truncate">
            الدولار العراقي
          </span>
          <span class="hidden md:inline text-xs font-semibold text-muted bg-primary-50 dark:bg-slate-800 rounded-full px-2 py-0.5">
            Iraq · USD/IQD
          </span>
        </NuxtLink>

        <nav class="flex items-center gap-1.5 sm:gap-2" aria-label="التنقل الرئيسي">
          <LiveBadge />
          <NuxtLink
            to="/admin"
            class="hidden sm:inline-flex items-center gap-1.5 h-12 px-3 rounded-xl text-sm font-semibold
                   text-muted hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="لوحة التحكم — للمشرفين"
          >
            لوحة التحكم
          </NuxtLink>
          <button
            class="btn btn-ghost !min-h-[48px] !min-w-[48px] !px-2.5"
            aria-label="تبديل الوضع الليلي"
            @click="toggleTheme"
          >
            <ClientOnly><span v-if="dark">☀️</span><span v-else>🌙</span></ClientOnly>
          </button>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900">
      <div class="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 py-6 space-y-3 text-center">
        <p class="text-sm font-bold text-slate-700 dark:text-slate-200">
          جميع الحقوق محفوظة © — تم التطوير بواسطة عبدالله فراس
        </p>
        <p class="text-xs text-muted">
          أسعار استرشادية من السوق المحلي — قد تختلف قليلاً بين المحلات.
        </p>
        <NuxtLink
          to="/admin"
          class="inline-flex sm:hidden items-center justify-center gap-1.5 min-h-[48px] w-full sm:w-auto px-4
                 rounded-xl text-sm font-semibold text-muted hover:bg-primary-50 hover:text-primary-700
                 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
           لوحة التحكم
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const dark = useState('dark', () => true)

function applyTheme(v: boolean) {
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark', v)
    localStorage.setItem('theme', v ? 'dark' : 'light')
  }
}

onMounted(() => {
  dark.value = localStorage.getItem('theme') !== 'light'
  applyTheme(dark.value)
})

function toggleTheme() {
  dark.value = !dark.value
  applyTheme(dark.value)
}
</script>
