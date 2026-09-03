<!-- src/layouts/AppLayout.vue -->
<script setup>
import SidebarNav from '@/components/layout/SidebarNav.vue'
</script>

<template>
  <div class="flex w-full min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors duration-200">

    <SidebarNav class="w-64 flex-shrink-0 min-h-screen" />

   
    <main class="flex-1 w-full overflow-y-auto p-6 md:p-8">
      <slot />
    </main>
  </div>
</template>