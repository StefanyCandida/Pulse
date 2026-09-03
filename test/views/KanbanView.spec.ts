import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import KanbanView from '../../src/views/KanbanView.vue'

const mockTaskStore = {
  columns: [
    {
      id: 'todo',
      title: 'A Fazer',
      color: 'bg-yellow-500'
    },
    {
      id: 'in_progress',
      title: 'Em Andamento',
      color: 'bg-blue-500'
    },
    {
      id: 'done',
      title: 'Concluído',
      color: 'bg-green-500'
    }
  ],

  tasksByStatus: vi.fn(() => []),

  addTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  moveTask: vi.fn()
}

vi.mock('@/stores/tasks', () => ({
  useTaskStore: () => mockTaskStore
}))

describe('KanbanView', () => {
  it('deve exibir as colunas do Kanban', () => {
    const wrapper = mount(KanbanView)

    expect(wrapper.text()).toContain('A Fazer')
    expect(wrapper.text()).toContain('Em Andamento')
    expect(wrapper.text()).toContain('Concluído')
  })
})


it('deve abrir o modal ao clicar em Nova Tarefa', async () => {
  const wrapper = mount(KanbanView)

  expect(wrapper.text()).not.toContain('Criar Nova Tarefa')

  await wrapper
    .get('button')
    .trigger('click')

  expect(wrapper.text()).toContain('Criar Nova Tarefa')
})

it('não deve criar tarefa sem título', async () => {
  const wrapper = mount(KanbanView)

  await wrapper.get('button').trigger('click')

  const form = wrapper.get('form')

  await form.trigger('submit')

  expect(mockTaskStore.addTask).not.toHaveBeenCalled()
})


it('deve abrir o modal ao clicar em Nova Tarefa', async () => {
  const wrapper = mount(KanbanView)

  expect(wrapper.text()).not.toContain('Criar Nova Tarefa')

  await wrapper.get('button').trigger('click')

  expect(wrapper.text()).toContain('Criar Nova Tarefa')
})
it('não deve criar tarefa sem título', async () => {
  const wrapper = mount(KanbanView)

  await wrapper.get('button').trigger('click')
  await wrapper.get('form').trigger('submit')

  expect(mockTaskStore.addTask).not.toHaveBeenCalled()
})

it('deve criar uma tarefa preenchida pelo usuário', async () => {
  const wrapper = mount(KanbanView)

  await wrapper.get('button').trigger('click')

  const inputs = wrapper.findAll('input')

  await inputs[0].setValue('Estudar testes unitários')

  await wrapper.get('form').trigger('submit')

  expect(mockTaskStore.addTask).toHaveBeenCalled()

  expect(mockTaskStore.addTask).toHaveBeenCalledWith(
    expect.objectContaining({
      title: 'Estudar testes unitários'
    })
  )
})
