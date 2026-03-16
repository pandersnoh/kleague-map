import { createRouter, createWebHistory } from 'vue-router'
import MapView from '@/views/MapView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'map', component: MapView },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue')
    },
    {
      path: '/team/:id',
      name: 'team',
      component: () => import('@/views/TeamView.vue')
    }
  ]
})

export default router
