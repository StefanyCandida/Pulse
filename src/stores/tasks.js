import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useTaskStore = defineStore('tasks', () => {
  const columns = ref([
    { id: 'todo', title: 'A Fazer', color: 'border-yellow-500' },
    { id: 'in_progress', title: 'Em Andamento', color: 'border-blue-500' },
    { id: 'done', title: 'Concluído', color: 'border-green-500' }
  ])

  const initialTasks = [
    {
      id: '1',
      title: 'Configurar rotas com Vue Router',
      description: 'Definir as rotas do projeto e lazy loading de views.',
      status: 'done',
      priority: 'high',
      dueDate: '2026-09-01'
    },
    {
      id: '2',
      title: 'Desenvolver a Pinia Store do Kanban',
      description: 'Criar funções de CRUD e movimentação das tarefas.',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2026-09-05'
    },
    {
      id: '3',
      title: 'Integrar ApexCharts na Dashboard',
      description: 'Exibir gráfico de produtividade semanal com dados dinâmicos.',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-09-10'
    }
  ]

  const tasks = ref(JSON.parse(localStorage.getItem('devpulse_tasks')) || initialTasks)

  watch(
    tasks,
    (newTasks) => {
      localStorage.setItem('devpulse_tasks', JSON.stringify(newTasks))
    },
    { deep: true }
  )

  const tasksByStatus = computed(() => {
    return (status) => tasks.value.filter((task) => task.status === status)
  })

  const totalTasks = computed(() => tasks.value.length)
  const completedTasks = computed(() => tasks.value.filter((t) => t.status === 'done').length)
  const completionRate = computed(() => {
    if (totalTasks.value === 0) return 0
    return Math.round((completedTasks.value / totalTasks.value) * 100)
  })

  function addTask(newTask) {
    const task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      description: newTask.description || '',
      status: newTask.status || 'todo',
      priority: newTask.priority || 'medium',
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0]
    }
    tasks.value.push(task)
  }

  function updateTask(updatedTask) {
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updatedTask }
    }
  }

  function moveTask(taskId, newStatus) {
    const task = tasks.value.find((t) => t.id === taskId)
    if (task) {
      task.status = newStatus
    }
  }

  function deleteTask(taskId) {
    tasks.value = tasks.value.filter((t) => t.id !== taskId)
  }

  return {
    columns,
    tasks,
    tasksByStatus,
    totalTasks,
    completedTasks,
    completionRate,
    addTask,
    updateTask,
    moveTask,
    deleteTask
  }
})