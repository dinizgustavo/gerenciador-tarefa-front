import { createRouter, createWebHistory } from 'vue-router'
import TarefasView from '../views/TarefasView.vue'

const routes = [
  { path: '/', name: 'Tarefas', component: TarefasView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
