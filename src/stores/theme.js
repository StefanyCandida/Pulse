import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref(
    localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
  }

  watchEffect(() => {
    const root = document.documentElement
    if (isDarkMode.value) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  })

  return { isDarkMode, toggleTheme }
})