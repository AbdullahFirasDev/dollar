<template>
  <div class="card card-hover relative overflow-hidden p-5 sm:p-6 h-full flex flex-col">
    <!-- Flat accent bar -->
    <span class="absolute inset-x-0 top-0 h-1.5 bg-brand-600" aria-hidden="true" />

    <div class="flex items-center gap-3 mb-3">
      <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-brand-600 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </span>
      <div>
        <h3 class="font-bold text-base sm:text-lg text-ink-strong leading-tight">حمّل التطبيق</h3>
        <p class="text-[11px] text-muted leading-tight">الدولار العراقي — PWA</p>
      </div>
    </div>

    <p class="text-sm text-muted leading-relaxed mb-5">
      ثبّت التطبيق على هاتفك تثبيتاً مباشراً — يعمل بدون إنترنت ويفتح أسرع بكثير من المتصفح في المرة القادمة.
    </p>

    <ul class="space-y-2 mb-6">
      <li v-for="perk in perks" :key="perk" class="flex items-center gap-2 text-xs text-ink">
        <span class="flex h-4 w-4 items-center justify-center rounded-full bg-gain-soft text-gain shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        {{ perk }}
      </li>
    </ul>

    <button
      class="btn btn-primary w-full mt-auto gap-2 text-sm"
      @click="handleInstallClick"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span>تحميل التطبيق</span>
    </button>

    <!-- iOS install steps modal (fade transition) -->
    <Transition name="fade">
      <div
        v-if="showIosModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
        role="dialog"
        aria-modal="true"
        aria-label="إرشادات التثبيت على iOS"
        @click.self="showIosModal = false"
      >
        <div class="bg-surface rounded-2xl p-6 max-w-sm w-full shadow-md border border-slate-200/80 text-center">
          <h3 class="text-lg font-bold text-ink-strong mb-2">تثبيت تطبيق الدولار العراقي</h3>
          <p class="text-sm text-muted mb-4 leading-relaxed">
            لتثبيت التطبيق على جهاز الآيفون الخاص بك، اتبع الخطوات البسيطة التالية:
          </p>

          <div class="space-y-3 text-right bg-page p-4 rounded-xl text-xs md:text-sm text-muted">
            <div class="flex items-center gap-3">
              <span class="bg-brand-600 text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold">1</span>
              <span>اضغط على زر المشاركة <strong class="text-brand-600">Share</strong> في متصفح Safari.</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="bg-brand-600 text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold">2</span>
              <span>انقر لأسفل واختر <strong class="text-brand-600">"إضافة إلى الشاشة الرئيسية"</strong>.</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="bg-brand-600 text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold">3</span>
              <span>اضغط على <strong class="text-brand-600">إضافة (Add)</strong> في الأعلى لتثبيت التطبيق.</span>
            </div>
          </div>

          <button
            class="btn btn-primary w-full mt-5 text-sm"
            @click="showIosModal = false"
          >
            فهمت ذلك
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const deferredPrompt = ref<any>(null)
const showIosModal = ref(false)
const isIosDevice = ref(false)

const perks = [
  'تحديث لحظي مباشر للأسعار',
  'يعمل حتى مع ضعف الإنترنت',
  'لا يحتاج مساحة تخزين كبيرة',
]

onMounted(() => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  isIosDevice.value = /iphone|ipad|ipod/.test(userAgent)

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })
})

async function handleInstallClick() {
  if (isIosDevice.value) {
    showIosModal.value = true
  } else if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    if (outcome === 'accepted') deferredPrompt.value = null
  } else {
    alert('التطبيق مثبت مسبقاً أو أن المتصفح الحالي لا يدعم التثبيت التلقائي. يمكنك التثبيت عبر إعدادات المتصفح.')
  }
}
</script>
