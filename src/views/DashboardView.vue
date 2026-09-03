<script setup>
import { computed } from 'vue'
import { useTaskStore } from '@/stores/tasks'

const taskStore = useTaskStore()

 const total = computed(() => taskStore.totalTasks)
const completed = computed(() => taskStore.completedTasks)
const pending = computed(() => total.value - completed.value)
const rate = computed(() => taskStore.completionRate)

 const kpiCards = computed(() => [
  {
    title: 'Total de Tarefas',
    value: total.value,
    badge: 'Criadas',
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-400',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  },
  {
    title: 'Concluídas',
    value: completed.value,
    badge: `${rate.value}% do Total`,
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    title: 'Pendentes',
    value: pending.value,
    badge: 'Em Andamento',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    title: 'Taxa de Entrega',
    value: `${rate.value}%`,
    badge: rate.value >= 70 ? 'Excelente' : 'Em Progresso',
    badgeClass: rate.value >= 70 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400' 
      : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  }
])

const statusDistribution = computed(() => {
  const todoCount = taskStore.tasksByStatus('todo').length
  const inProgressCount = taskStore.tasksByStatus('in_progress').length
  const doneCount = taskStore.tasksByStatus('done').length

  return [
    { label: 'A Fazer', count: todoCount, class: 'bg-amber-500' },
    { label: 'Em Andamento', count: inProgressCount, class: 'bg-blue-500' },
    { label: 'Concluído', count: doneCount, class: 'bg-emerald-500' }
  ]
})


const strokeDasharray = computed(() => {
  const circumference = 2 * Math.PI * 40
  const strokePercent = (rate.value / 100) * circumference
  return `${strokePercent} ${circumference}`
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Geral</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">Visão geral de desempenho e progresso dos projetos.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div
        v-for="card in kpiCards"
        :key="card.title"
        class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ card.title }}</span>
          <div class="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-indigo-600 dark:text-indigo-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="card.icon" />
            </svg>
          </div>
        </div>

        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ card.value }}</span>
          <span :class="['text-[11px] font-semibold px-2.5 py-0.5 rounded-full', card.badgeClass]">
            {{ card.badge }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm flex flex-col items-center justify-center">
        <h2 class="text-base font-bold text-gray-900 dark:text-white self-start mb-4">Taxa de Conclusão</h2>
        
        <div class="relative w-44 h-44 flex items-center justify-center my-2">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="12" class="text-gray-100 dark:text-gray-700" fill="transparent" />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              stroke-width="12"
              class="text-indigo-600 dark:text-indigo-500 transition-all duration-700 ease-out"
              fill="transparent"
              :stroke-dasharray="strokeDasharray"
              stroke-linecap="round"
            />
          </svg>
          <div class="absolute flex flex-col items-center text-center">
            <span class="text-3xl font-extrabold text-gray-900 dark:text-white">{{ rate }}%</span>
            <span class="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Concluído</span>
          </div>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          {{ completed }} de {{ total }} tarefas finalizadas.
        </p>
      </div>

      <div class="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm flex flex-col justify-between">
        <div>
          <h2 class="text-base font-bold text-gray-900 dark:text-white mb-1">Distribuição das Tarefas</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">Status atual do fluxo de trabalho.</p>

          <div class="space-y-4">
            <div v-for="item in statusDistribution" :key="item.label" class="space-y-1.5">
              <div class="flex justify-between text-xs font-medium">
                <span class="text-gray-700 dark:text-gray-300">{{ item.label }}</span>
                <span class="text-gray-500 dark:text-gray-400">{{ item.count }} tarefas</span>
              </div>
              <div class="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  :class="['h-full transition-all duration-500 rounded-full', item.class]"
                  :style="{ width: total > 0 ? `${(item.count / total) * 100}%` : '0%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-around text-xs text-gray-600 dark:text-gray-400">
          <div v-for="item in statusDistribution" :key="item.label" class="flex items-center gap-2">
            <span :class="['w-2.5 h-2.5 rounded-full', item.class]"></span>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>