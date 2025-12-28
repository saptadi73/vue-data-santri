import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Beranda.vue'),
    },
    {
      path: '/beranda',
      name: 'beranda',
      component: () => import('@/pages/Beranda.vue'),
    },
    {
      path: '/peta-santri',
      name: 'peta-santri',
      component: () => import('@/pages/SantriMap.vue'),
    },
    {
      path: '/santri',
      name: 'santri-list',
      component: () => import('@/pages/SantriList.vue'),
    },
    {
      path: '/santri/tambah',
      name: 'santri-form',
      component: () => import('@/pages/SantriForm.vue'),
    },
    {
      path: '/santri/edit/:id',
      name: 'santri-edit',
      component: () => import('@/pages/SantriEdit.vue'),
    },
    {
      path: '/home',
      redirect: '/',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

export default router
