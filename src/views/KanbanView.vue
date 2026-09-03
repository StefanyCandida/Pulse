 <script setup>
import { ref, reactive } from 'vue'
import { useTaskStore } from '@/stores/tasks'

const taskStore = useTaskStore()


const draggedTaskId = ref(null)

const handleDragStart = (event, taskId) => {
  draggedTaskId.value = taskId
  event.dataTransfer.effectAllowed = 'move'
}

const handleDrop = (status) => {
  if (draggedTaskId.value) {
    taskStore.moveTask(draggedTaskId.value, status)
    draggedTaskId.value = null
  }
}


const isModalOpen = ref(false)
const isEditing = ref(false)

const defaultForm = {
  id: null,
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: ''
}

const form = reactive({ ...defaultForm })

const openModal = (task = null) => {
  if (task) {
    isEditing.value = true
    Object.assign(form, task)
  } else {
    isEditing.value = false
    Object.assign(form, { ...defaultForm, dueDate: new Date().toISOString().split('T')[0] })
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  Object.assign(form, defaultForm)
}

const handleSubmit = () => {
  if (!form.title.trim()) return

  if (isEditing.value) {
    taskStore.updateTask({ ...form })
  } else {
    taskStore.addTask({ ...form })
  }
  closeModal()
}

const handleDelete = (taskId) => {
  if (confirm('Deseja realmente excluir esta tarefa?')) {
    taskStore.deleteTask(taskId)
  }
}


const priorityBadges = {
  low: { label: 'Baixa', class: 'bg-slate-800 text-slate-300' },
  medium: { label: 'Média', class: 'bg-amber-950/80 text-amber-400 border border-amber-800/50' },
  high: { label: 'Alta', class: 'bg-rose-950/80 text-rose-400 border border-rose-800/50' }
}
</script>

<template>
  <div class="w-full max-w-7xl mx-auto space-y-6">

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Quadro Kanban</h1>
        <p class="text-sm text-gray-400">Arraste os cards para alterar o status das tarefas em tempo real.</p>
      </div>
      <button
        @click="openModal()"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Nova Tarefa</span>
      </button>
    </div>


    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      <div
        v-for="column in taskStore.columns"
        :key="column.id"
        @dragover.prevent
        @drop="handleDrop(column.id)"
        class="bg-gray-800/60 rounded-2xl p-4 border border-gray-700/60 flex flex-col min-h-[550px]"
      >

      <div class="flex items-center justify-between pb-3 mb-3 border-b border-gray-700">
          <div class="flex items-center gap-2">
            <span :class="['w-3 h-3 rounded-full border-2', column.color]"></span>
            <h2 class="font-semibold text-gray-200 text-sm">{{ column.title }}</h2>
          </div>
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-700 text-gray-300">
            {{ taskStore.tasksByStatus(column.id).length }}
          </span>
        </div>


        <div class="space-y-3 flex-1 overflow-y-auto">
          <div
            v-for="task in taskStore.tasksByStatus(column.id)"
            :key="task.id"
            draggable="true"
            @dragstart="handleDragStart($event, task.id)"
            class="group bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm hover:border-indigo-500/50 transition-all duration-200 cursor-grab active:cursor-grabbing space-y-3"
          >
            <div class="flex items-start justify-between gap-2">
              <span :class="['text-[11px] font-semibold px-2 py-0.5 rounded-md', priorityBadges[task.priority]?.class]">
                {{ priorityBadges[task.priority]?.label }}
              </span>
              

              <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button @click.stop="openModal(task)" class="p-1 text-gray-400 hover:text-indigo-400 rounded">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click.stop="handleDelete(task.id)" class="p-1 text-gray-400 hover:text-rose-400 rounded">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h3 class="font-medium text-gray-100 text-sm leading-snug">{{ task.title }}</h3>
              <p v-if="task.description" class="text-xs text-gray-400 mt-1 line-clamp-2">
                {{ task.description }}
              </p>
            </div>

            <div class="pt-2 border-t border-gray-700/50 flex items-center justify-between text-[11px] text-gray-400">
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ task.dueDate }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div class="bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-700 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-gray-700">
          <h3 class="text-lg font-bold text-white">
            {{ isEditing ? 'Editar Tarefa' : 'Criar Nova Tarefa' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1">Título *</label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="Ex: Criar componente de formulário"
              class="w-full px-3.5 py-2 rounded-xl border border-gray-600 bg-gray-900 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1">Descrição</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Detalhes sobre esta tarefa..."
              class="w-full px-3.5 py-2 rounded-xl border border-gray-600 bg-gray-900 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-300 mb-1">Status</label>
              <select
                v-model="form.status"
                class="w-full px-3 py-2 rounded-xl border border-gray-600 bg-gray-900 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="todo">A Fazer</option>
                <option value="in_progress">Em Andamento</option>
                <option value="done">Concluído</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-300 mb-1">Prioridade</label>
              <select
                v-model="form.priority"
                class="w-full px-3 py-2 rounded-xl border border-gray-600 bg-gray-900 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1">Data de Entrega</label>
            <input
              v-model="form.dueDate"
              type="date"
              class="w-full px-3.5 py-2 rounded-xl border border-gray-600 bg-gray-900 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-700">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/20"
            >
              {{ isEditing ? 'Salvar Alterações' : 'Criar Tarefa' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>