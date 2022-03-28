import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/learn',
    name: 'Learn',
    component: () => import(/* webpackChunkName: "about" */ '../views/Learn.vue')
  },
  {
    path: '/play',
    name: 'Play',
    component: () => import(/* webpackChunkName: "about" */ '../views/Play.vue')
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import(/* webpackChunkName: "about" */ '../views/Create.vue')
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
