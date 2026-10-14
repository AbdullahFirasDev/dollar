<template>
  <div class="flex items-center gap-1.5 text-xs rounded-full px-2.5 py-1 border font-bold transition-all duration-200 ease-in-out"
       :class="connected
         ? 'border-emerald-200 bg-gain-soft text-gain'
         : 'border-slate-300 text-muted'">
    <span v-if="connected" class="relative flex h-2.5 w-2.5 shrink-0">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gain opacity-75" />
      <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-gain" />
    </span>
    <span v-else class="h-2.5 w-2.5 rounded-full bg-slate-400 shrink-0" />
    {{ connected ? 'مباشر' : '...' }}
  </div>
</template>

<script setup lang="ts">
const { connected } = useRates()
</script>
