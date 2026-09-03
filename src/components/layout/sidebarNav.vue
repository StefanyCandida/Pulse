<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

const route = useRoute()
const themeStore = useThemeStore()

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    name: 'Quadro Kanban',
    path: '/kanban',
    icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2m0 10V7m6 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2'
  }
]

const isActive = (path) => route.path === path
</script>

<template>
  <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-colors duration-200">
    <div>
      <div class="h-16 flex items-center gap-3 px-6 border-b border-gray-200 dark:border-gray-700">
        <div class="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/30">
          DP
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-gray-900 dark:text-white tracking-wide text-base leading-tight">DevPulse</span>
          <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">Front-end Suite</span>
        </div>
      </div>

      <nav class="p-4 space-y-1.5">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150',
            isActive(item.path)
              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
          ]"
        >
          <svg class="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
          </svg>
          <span>{{ item.name }}</span>
        </RouterLink>
      </nav>
    </div>

    <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
      <button
        @click="themeStore.toggleTheme"
        class="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-sm font-medium"
      >
        <span class="flex items-center gap-2">
          <span>{{ themeStore.isDarkMode ? 'Modo Claro' : 'Modo Escuro' }}</span>
        </span>
        <span class="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase font-mono">
          {{ themeStore.isDarkMode ? 'Dark' : 'Light' }}
        </span>
      </button>
    </div>
  </aside>
</template>