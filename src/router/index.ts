import { createRouter, type RouteRecordRaw, createWebHistory } from 'vue-router'
import Index from '../views/index/indexPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Index
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
