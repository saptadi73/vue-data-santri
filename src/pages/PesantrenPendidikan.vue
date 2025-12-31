<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <router-link
          :to="`/pondok/edit/${pesantrenId}`"
          class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Kembali ke Data Pesantren
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Data Pendidikan</h1>
        <p class="text-gray-600 dark:text-gray-400">Kelola informasi pendidikan pesantren</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
        ></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat data...</p>
      </div>

      <!-- Content -->
      <template v-if="!loading">
        <!-- Error Message -->
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
        >
          <div class="flex items-center gap-3">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-red-800 dark:text-red-300">{{ error }}</p>
          </div>
        </div>

        <!-- No Data State -->
        <div
          v-if="!pendidikanData"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center"
        >
          <svg
            class="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Belum Ada Data Pendidikan
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Belum ada informasi pendidikan yang tercatat. Silahkan tambahkan data pendidikan
            pesantren.
          </p>
          <router-link
            :to="`/pesantren/${pesantrenId}/pendidikan/add`"
            class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Data Pendidikan
          </router-link>
        </div>

        <!-- Data Found State -->
        <div v-else class="space-y-6">
          <!-- Data Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <!-- Header -->
            <div
              class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700"
            >
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Informasi Pendidikan
              </h2>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-6">
              <!-- Jenjang & Kurikulum -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Jenjang Pendidikan
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ jenjangLabel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Kurikulum
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ kurikulumLabel }}</p>
                </div>
              </div>

              <!-- Akreditasi -->
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Akreditasi
                </label>
                <p class="text-gray-900 dark:text-white">{{ akreditasiLabel }}</p>
              </div>

              <!-- Guru Information -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Jumlah Guru Tetap
                  </label>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ pendidikanData.jumlah_guru_tetap || '-' }} orang
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Jumlah Guru Tidak Tetap
                  </label>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ pendidikanData.jumlah_guru_tidak_tetap || '-' }} orang
                  </p>
                </div>
              </div>

              <!-- Guru S1 & Sertifikat -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Guru S1 ke Atas
                  </label>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ pendidikanData.guru_s1_keatas || '-' }} orang
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Persentase Guru Bersertifikat
                  </label>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ pendidikanData.persen_guru_bersertifikat || '-' }}%
                  </p>
                </div>
              </div>

              <!-- Rasio Guru Santri -->
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Rasio Guru Santri
                </label>
                <p class="text-gray-900 dark:text-white">
                  {{ pendidikanData.rasio_guru_santri || '-' }}
                </p>
              </div>

              <!-- Prestasi -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Prestasi Akademik
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ prestasiAkademikLabel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Prestasi Non-Akademik
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ prestasiNonAkademikLabel }}</p>
                </div>
              </div>

              <!-- Prestasi Santri -->
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Prestasi Santri
                </label>
                <p class="text-gray-900 dark:text-white">{{ prestasiSantriLabel }}</p>
              </div>

              <!-- Program Unggulan -->
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Program Unggulan
                </label>
                <p class="text-gray-900 dark:text-white">
                  {{ pendidikanData.program_unggulan || '-' }}
                </p>
              </div>

              <!-- Fasilitas Mengajar -->
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Fasilitas Mengajar
                </label>
                <p class="text-gray-900 dark:text-white">{{ fasilitasMengajarLabel }}</p>
              </div>

              <!-- Metode Pembayaran -->
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Metode Pembayaran
                </label>
                <p class="text-gray-900 dark:text-white">{{ metodePembayaranLabel }}</p>
              </div>

              <!-- Biaya Bulanan -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Biaya Bulanan Minimum
                  </label>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    Rp{{ formatCurrency(pendidikanData.biaya_bulanan_min) || '-' }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Biaya Bulanan Maksimum
                  </label>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    Rp{{ formatCurrency(pendidikanData.biaya_bulanan_max) || '-' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div
              class="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700"
            >
              <button
                @click="confirmDelete"
                class="px-4 py-2 border border-red-300 dark:border-red-600 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
              >
                Hapus
              </button>
              <router-link
                :to="`/pesantren/${pesantrenId}/pendidikan/edit/${pendidikanId}`"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Edit
              </router-link>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Konfirmasi Penghapusan
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Apakah Anda yakin ingin menghapus data pendidikan ini? Tindakan ini tidak dapat
          dibatalkan.
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
          >
            Batal
          </button>
          <button
            @click="handleDelete"
            :disabled="deleting"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="deleting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ deleting ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPendidikanByPesantren, deletePendidikan } from '@/services/pesantrenPendidikanService'

const route = useRoute()
const router = useRouter()

const pesantrenId = route.params.pesantrenId
const loading = ref(false)
const error = ref(null)
const pendidikanData = ref(null)
const pendidikanId = ref(null)
const showDeleteModal = ref(false)
const deleting = ref(false)

const jenjangLabel = computed(() => {
  const labels = {
    semua_ra_ma: 'Semua Ada dari RA-MA',
    pendidikan_dasar: 'Pendidikan Dasar Saja (MI)',
    dasar_menengah_pertama: 'Pendidikan Dasar hingga Menengah Pertama (MI-MTs)',
    dasar_menengah_atas: 'Pendidikan Dasar - Menengah Atas (MI-MA)',
    satu_jenjang: 'Hanya satu jenjang Pendidikan',
  }
  return labels[pendidikanData.value?.jenjang_pendidikan] || '-'
})

const kurikulumLabel = computed(() => {
  const labels = {
    terstandar: 'Terstandar',
    lokal: 'Lokal',
    gabungan: 'Gabungan',
  }
  return labels[pendidikanData.value?.kurikulum] || '-'
})

const akreditasiLabel = computed(() => {
  const labels = {
    a: 'A',
    b: 'B',
    c: 'C',
    belum: 'Belum Terakreditasi',
  }
  return labels[pendidikanData.value?.akreditasi] || '-'
})

const prestasiAkademikLabel = computed(() => {
  const labels = {
    nasional: 'Nasional',
    regional: 'Regional',
    tidak_ada: 'Tidak Ada',
  }
  return labels[pendidikanData.value?.prestasi_akademik] || '-'
})

const prestasiNonAkademikLabel = computed(() => {
  const labels = {
    nasional: 'Nasional',
    regional: 'Regional',
    tidak_ada: 'Tidak Ada',
  }
  return labels[pendidikanData.value?.prestasi_non_akademik] || '-'
})

const prestasiSantriLabel = computed(() => {
  const labels = {
    nasional: 'Nasional',
    regional: 'Regional',
    tidak_ada: 'Tidak Ada',
  }
  return labels[pendidikanData.value?.prestasi_santri] || '-'
})

const fasilitasMengajarLabel = computed(() => {
  const labels = {
    lengkap: 'Lengkap',
    cukup_lengkap: 'Cukup Lengkap',
    kurang_lengkap: 'Kurang Lengkap',
  }
  return labels[pendidikanData.value?.fasilitas_mengajar] || '-'
})

const metodePembayaranLabel = computed(() => {
  const labels = {
    tunai: 'Tunai',
    transfer: 'Transfer',
    cicilan: 'Cicilan',
    bantuan: 'Bantuan',
  }
  return labels[pendidikanData.value?.metode_pembayaran] || '-'
})

const formatCurrency = (value) => {
  if (!value) return '0'
  return parseInt(value).toLocaleString('id-ID')
}

onMounted(async () => {
  await loadPendidikanData()
})

const loadPendidikanData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getPendidikanByPesantren(pesantrenId)

    if (response.success) {
      if (response.data) {
        pendidikanData.value = response.data.data || response.data
        pendidikanId.value = response.data.id || response.data.id

        console.log('📚 Pendidikan Data Loaded:', pendidikanData.value)
      } else {
        pendidikanData.value = null
      }
    }
  } catch (err) {
    console.error('❌ Error loading pendidikan:', err)
    error.value = err.message || 'Gagal memuat data pendidikan'
  } finally {
    loading.value = false
  }
}

const confirmDelete = () => {
  showDeleteModal.value = true
}

const handleDelete = async () => {
  deleting.value = true
  error.value = null

  try {
    const response = await deletePendidikan(pendidikanId.value)

    if (response.success) {
      console.log('✅ Data pendidikan berhasil dihapus')
      setTimeout(() => {
        router.push(`/pondok/edit/${pesantrenId}`)
      }, 500)
    }
  } catch (err) {
    console.error('❌ Error deleting pendidikan:', err)
    error.value = err.message || 'Gagal menghapus data pendidikan'
    showDeleteModal.value = false
  } finally {
    deleting.value = false
  }
}
</script>
