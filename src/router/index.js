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
      path: '/pondok',
      name: 'pondok-list',
      component: () => import('@/pages/PondokList.vue'),
    },
    {
      path: '/pondok/tambah',
      name: 'pondok-add',
      component: () => import('@/pages/PondokForm.vue'),
    },
    {
      path: '/pondok/edit/:id',
      name: 'pondok-edit',
      component: () => import('@/pages/PondokForm.vue'),
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
      path: '/santri/:santriId/orangtua/tambah',
      name: 'santri-orangtua-add',
      component: () => import('@/pages/SantriOrangtuaForm.vue'),
    },
    {
      path: '/santri/:santriId/orangtua/edit/:orangtuaId',
      name: 'santri-orangtua-edit',
      component: () => import('@/pages/SantriOrangtuaForm.vue'),
    },
    {
      path: '/santri/:santriId/asset/tambah',
      name: 'santri-asset-add',
      component: () => import('@/pages/SantriAssetForm.vue'),
    },
    {
      path: '/santri/:santriId/asset/edit/:assetId',
      name: 'santri-asset-edit',
      component: () => import('@/pages/SantriAssetForm.vue'),
    },
    {
      path: '/santri/:santriId/rumah/tambah',
      name: 'santri-rumah-add',
      component: () => import('@/pages/SantriRumahForm.vue'),
    },
    {
      path: '/santri/:santriId/rumah/edit/:rumahId',
      name: 'santri-rumah-edit',
      component: () => import('@/pages/SantriRumahForm.vue'),
    },
    {
      path: '/santri/:santriId/kesehatan/tambah',
      name: 'santri-kesehatan-add',
      component: () => import('@/pages/SantriKesehataanForm.vue'),
    },
    {
      path: '/santri/:santriId/kesehatan/edit/:kesehataanId',
      name: 'santri-kesehatan-edit',
      component: () => import('@/pages/SantriKesehataanForm.vue'),
    },
    {
      path: '/santri/:santriId/bansos/tambah',
      name: 'santri-bansos-add',
      component: () => import('@/pages/SantriBansosForm.vue'),
    },
    {
      path: '/santri/:santriId/bansos/edit/:bansosId',
      name: 'santri-bansos-edit',
      component: () => import('@/pages/SantriBansosForm.vue'),
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
