import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Watch from './pages/Watch.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/watch/:id',
    name: 'Watch',
    component: Watch,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

