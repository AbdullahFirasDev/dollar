<template>
  <div>
    <!-- زر التثبيت الرئيسي -->
    <button
      @click="handleInstallClick"
      class="flex items-center gap-2 bg-[#0C6FFF] hover:bg-[#009FE4] text-white font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all duration-300 text-sm md:text-base cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span>تحميل التطبيق</span>
    </button>

    <!-- نافذة إرشادات التثبيت لأجهزة أيفون (iOS) -->
    <div v-if="showIosModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center relative border border-[#60CBC7]/30">
        <h3 class="text-lg font-bold text-[#606060] mb-2 font-['Cairo']">تثبيت تطبيق الدولار العراقي</h3>
        <p class="text-sm text-[#606060] mb-4 leading-relaxed">
          لتثبيت التطبيق على جهاز الآيفون الخاص بك، اتبع الخطوات البسيطة التالية:
        </p>
        
        <div class="space-y-3 text-right bg-gray-50 p-4 rounded-xl text-xs md:text-sm text-[#606060]">
          <div class="flex items-center gap-3">
            <span class="bg-[#0C6FFF] text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold">1</span>
            <span>اضغط على زر المشاركة <strong class="text-[#0C6FFF]">Share</strong> في متصفح Safari.</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="bg-[#0C6FFF] text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold">2</span>
            <span>انقر لأسفل واختر <strong class="text-[#0C6FFF]">"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="bg-[#0C6FFF] text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold">3</span>
            <span>اضغط على <strong class="text-[#0C6FFF]">إضافة (Add)</strong> في الأعلى لتثبيت التطبيق.</span>
          </div>
        </div>

        <button
          @click="showIosModal = false"
          class="mt-5 w-full bg-[#0C6FFF] text-white py-2.5 rounded-xl font-bold hover:bg-[#009FE4] transition-colors"
        >
          فهمت ذلك
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const deferredPrompt = ref(null)
const showIosModal = ref(false)
const isIosDevice = ref(false)

onMounted(() => {
  // التحقق مما إذا كان الجهاز يعمل بنظام iOS (أيفون أو آيباد)
  const userAgent = window.navigator.userAgent.toLowerCase()
  isIosDevice.value = /iphone|ipad|ipod/.test(userAgent)

  // الاستماع لحدث التثبيت في أجهزة أندرويد و المتصفحات الداعمة
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })
})

const handleInstallClick = async () => {
  if (isIosDevice.value) {
    // إذا كان الجهاز آيفون، نظهر نافذة الإرشادات المصممة خصيصاً له
    showIosModal.value = true
  } else if (deferredPrompt.value) {
    // إذا كان جهاز أندرويد أو كمبيوتر، نظهر نافذة التثبيت التلقائية
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    if (outcome === 'accepted') {
      deferredPrompt.value = null
    }
  } else {
    // في حال تم تثبيت التطبيق مسبقاً أو المتصفح لا يدعم الحدث بشكل مباشر
    alert('التطبيق مثبت مسبقاً أو أن المتصفح الحالي لا يدعم التثبيت التلقائي. يمكنك التثبيت عبر إعدادات المتصفح.')
  }
}
</script>