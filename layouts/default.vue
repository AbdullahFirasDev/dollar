<template>
  <div class="min-h-screen flex flex-col bg-page">
    <header class="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-slate-200/80 shadow-sm">
      <div class="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        <NuxtLink to="/" class="flex items-center gap-2 min-w-0" aria-label="الدولار العراقي — الصفحة الرئيسية">

          <span class="font-extrabold text-lg sm:text-xl text-ink-strong truncate">
            الدولار العراقي
          </span>
          <span class="hidden md:inline text-xs font-semibold text-brand-600 bg-primary-50 rounded-full px-2.5 py-1 shrink-0">
            Iraq · USD/IQD
          </span>
        </NuxtLink>

        <nav class="flex items-center gap-1.5 sm:gap-2" aria-label="التنقل الرئيسي">
          <LiveBadge />
          <NuxtLink
            to="/admin"
            class="hidden sm:inline-flex items-center gap-1.5 h-11 px-3 rounded-xl text-sm font-semibold
                   text-muted hover:bg-primary-50 hover:text-brand-600
                   transition-all duration-200 ease-in-out"
            title="لوحة التحكم — للمشرفين"
          >
            لوحة التحكم
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-slate-200/80 bg-surface">
      <div class="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 py-6 space-y-3 text-center">
        <p class="text-sm font-bold text-ink">
          جميع الحقوق محفوظة © — تم التطوير بواسطة عبدالله فراس
        </p>
        <p class="text-xs text-muted">
          أسعار استرشادية من السوق المحلي — قد تختلف قليلاً بين المحلات.
        </p>
        <NuxtLink
          to="/admin"
          class="inline-flex sm:hidden items-center justify-center gap-1.5 min-h-[48px] w-full sm:w-auto px-4
                 rounded-xl text-sm font-semibold text-muted hover:bg-primary-50 hover:text-brand-600
                 transition-all duration-200 ease-in-out"
        >
          لوحة التحكم
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Light flat design only — Cairo font is applied globally in assets/css/main.css
</script>
