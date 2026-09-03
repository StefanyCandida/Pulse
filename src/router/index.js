import { createRouter, createWebHistory } from 'vue-router'

const DashboardView = () => import('@/views/DashboardView.vue')
const KanbanView = () => import('@/views/KanbanView.vue')

const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { title: 'Dashboard | DevPulse', layout: 'AppLayout' }
  },
  {
    path: '/kanban',
    name: 'kanban',
    component: KanbanView,
    meta: { title: 'Quadro Kanban | DevPulse', layout: 'AppLayout' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'DevPulse Dashboard'
  next()
})

export default router