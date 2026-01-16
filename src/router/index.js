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
      path: '/peta-pesantren',
      name: 'peta-pesantren',
      component: () => import('@/pages/PesantrenMap.vue'),
    },
    {
      path: '/nl2sql',
      name: 'nl2sql',
      component: () => import('@/pages/NL2SQLPage.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/Dashboard.vue'),
    },
    {
      path: '/sebaran-santri',
      name: 'sebaran-santri',
      component: () => import('@/pages/SebaranSantri.vue'),
    },
    {
      path: '/distribusi-bantuan',
      name: 'distribusi-bantuan',
      component: () => import('@/pages/DistribusiBantuan.vue'),
    },
    {
      path: '/program-pendidikan-santri',
      name: 'program-pendidikan-santri',
      component: () => import('@/pages/ProgramPendidikanSantri.vue'),
    },
    {
      path: '/program-kesejahteraan-santri',
      name: 'program-kesejahteraan-santri',
      component: () => import('@/pages/ProgramKesejahteraanSantri.vue'),
    },
    {
      path: '/program-kesehatan-santri',
      name: 'program-kesehatan-santri',
      component: () => import('@/pages/ProgramKesehatanSantri.vue'),
    },
    {
      path: '/program-infrastruktur-pesantren',
      name: 'program-infrastruktur-pesantren',
      component: () => import('@/pages/ProgramInfrastrukturPesantren.vue'),
    },
    {
      path: '/program-kemandirian-ekonomi',
      name: 'program-kemandirian-ekonomi',
      component: () => import('@/pages/ProgramKemandirianEkonomi.vue'),
    },
    {
      path: '/backend-debug',
      name: 'backend-debug',
      component: () => import('@/pages/BackendDebug.vue'),
    },
    {
      path: '/ai-vision',
      name: 'ai-vision',
      component: () => import('@/pages/AIVisionPage.vue'),
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
      path: '/santri/:id/scoring',
      name: 'santri-scoring',
      component: () => import('@/pages/SantriScoring.vue'),
    },
    {
      path: '/santri/:santriId/pembiayaan',
      name: 'santri-pembiayaan',
      component: () => import('@/pages/SantriPembiayaan.vue'),
    },
    {
      path: '/santri/:santriId/pembiayaan/add',
      name: 'santri-pembiayaan-add',
      component: () => import('@/pages/SantriPembiayaanForm.vue'),
    },
    {
      path: '/santri/:santriId/pembiayaan/edit/:pembiayaanId',
      name: 'santri-pembiayaan-edit',
      component: () => import('@/pages/SantriPembiayaanForm.vue'),
    },
    {
      path: '/pesantren/:pesantrenId/fisik',
      name: 'pesantren-fisik',
      component: () => import('@/pages/PesantrenFisik.vue'),
    },
    {
      path: '/pesantren/:pesantrenId/fisik/add',
      name: 'pesantren-fisik-add',
      component: () => import('@/pages/PesantrenFisikForm.vue'),
    },
    {
      path: '/pesantren/:pesantrenId/fisik/edit/:fisikId',
      name: 'pesantren-fisik-edit',
      component: () => import('@/pages/PesantrenFisikForm.vue'),
    },
    {
      path: '/pesantren/:pesantrenId/pendidikan',
      name: 'pesantren-pendidikan',
      component: () => import('@/pages/PesantrenPendidikan.vue'),
    },
    {
      path: '/pesantren/:pesantrenId/pendidikan/add',
      name: 'pesantren-pendidikan-add',
      component: () => import('@/pages/PesantrenPendidikanForm.vue'),
    },
    {
      path: '/pesantren/:pesantrenId/pendidikan/edit/:pendidikanId',
      name: 'pesantren-pendidikan-edit',
      component: () => import('@/pages/PesantrenPendidikanForm.vue'),
    },
    {
      path: '/pesantren/:pesantrenId/fasilitas',
      name: 'pesantren-fasilitas',
      component: () => import('@/pages/PesantrenFasilitas.vue'),
    },
    {
      path: '/pesantren/:pesantrenId/fasilitas/add',
      name: 'pesantren-fasilitas-add',
      component: () => import('@/pages/PesantrenFasilitasForm.vue'),
    },
    {
      path: '/pesantren/:pesantrenId/fasilitas/edit/:fasilitasId',
      name: 'pesantren-fasilitas-edit',
      component: () => import('@/pages/PesantrenFasilitasForm.vue'),
    },
    {
      path: '/pondok/:id/scoring',
      name: 'pesantren-scoring',
      component: () => import('@/pages/PesantrenScoring.vue'),
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
