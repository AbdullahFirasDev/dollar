<template>
  <div class="flex items-center gap-1.5 text-xs rounded-full px-2.5 py-1 border font-bold"
       :class="connected
         ? 'border-mint/40 bg-mint/10 text-mint-dark dark:text-mint'
         : 'border-slate-300 dark:border-slate-700 text-muted'">
    <span class="h-2 w-2 rounded-full"
          :class="connected ? 'bg-mint live-dot' : 'bg-slate-400'" />
    {{ connected ? 'مباشر' : '...' }}
  </div>
</template>

<script setup lang="ts">
const { connected } = useRates()
</script>
