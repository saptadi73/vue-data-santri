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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Data Fasilitas</h1>
        <p class="text-gray-600 dark:text-gray-400">Kelola informasi fasilitas pesantren</p>
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
          v-if="!fasilitasData"
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
            Belum Ada Data Fasilitas
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Belum ada informasi fasilitas yang tercatat. Silahkan tambahkan data fasilitas
            pesantren.
          </p>
          <router-link
            :to="`/pesantren/${pesantrenId}/fasilitas/add`"
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
            Tambah Data Fasilitas
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
                Informasi Fasilitas
              </h2>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-6">
              <!-- Jumlah Ruangan -->
              <div class="grid grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Jumlah Kamar
                  </label>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ fasilitasData.jumlah_kamar || '-' }} unit
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Jumlah Ruang Kelas
                  </label>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ fasilitasData.jumlah_ruang_kelas || '-' }} unit
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Jumlah Masjid
                  </label>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ fasilitasData.jumlah_masjid || '-' }} unit
                  </p>
                </div>
              </div>

              <!-- Fasilitas Utama -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Perpustakaan
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ perpustakaanLabel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Laboratorium
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ laboratoriumLabel }}</p>
                </div>
              </div>

              <!-- Fasilitas Komputer & Koperasi -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Ruang Komputer
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ ruangKomputerLabel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Koperasi
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ koperasiLabel }}</p>
                </div>
              </div>

              <!-- Kantin & Fasilitas Olahraga -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Kantin
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ kantinLabel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Fasilitas Olahraga
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ fasilitasOlahragaLabel }}</p>
                </div>
              </div>

              <!-- Fasilitas Kesehatan & Mengajar -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Fasilitas Kesehatan
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ fasilitasKesehatanLabel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Fasilitas Mengajar
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ fasilitasMengajarLabel }}</p>
                </div>
              </div>

              <!-- Fasilitas Komunikasi -->
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Fasilitas Komunikasi
                </label>
                <p class="text-gray-900 dark:text-white">{{ fasilitasKomunikasiLabel }}</p>
              </div>

              <!-- Akses & Fasilitas Transportasi -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Akses Transportasi
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ aksesTransportasiLabel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Fasilitas Transportasi
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ fasilitasTransportasiLabel }}</p>
                </div>
              </div>

              <!-- Akses Jalan & Jarak ke Kota -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Akses Jalan
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ aksesJalanLabel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Jarak ke Kota
                  </label>
                  <p class="text-gray-900 dark:text-white">
                    {{ fasilitasData.jarak_ke_kota_km || '-' }} km
                  </p>
                </div>
              </div>

              <!-- Asrama & Ruang Belajar -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Asrama
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ asramaLabel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Ruang Belajar
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ ruangBelajarLabel }}</p>
                </div>
              </div>

              <!-- Internet -->
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Internet
                </label>
                <p class="text-gray-900 dark:text-white">{{ internetLabel }}</p>
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
                :to="`/pesantren/${pesantrenId}/fasilitas/edit/${fasilitasId}`"
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
          Apakah Anda yakin ingin menghapus data fasilitas ini? Tindakan ini tidak dapat dibatalkan.
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
import { getFasilitasByPesantren, deleteFasilitas } from '@/services/pesantrenFasilitasService'

const route = useRoute()
const router = useRouter()

const pesantrenId = route.params.pesantrenId
const loading = ref(false)
const error = ref(null)
const fasilitasData = ref(null)
const fasilitasId = ref(null)
const showDeleteModal = ref(false)
const deleting = ref(false)

const booleanLabel = (value) => {
  return value ? 'Ada' : 'Tidak Ada'
}

const stringBooleanLabel = (value) => {
  const labels = {
    ada: 'Ada',
    tidak_ada: 'Tidak Ada',
  }
  return labels[value] || '-'
}

const perpustakaanLabel = computed(() => booleanLabel(fasilitasData.value?.perpustakaan))
const laboratoriumLabel = computed(() => booleanLabel(fasilitasData.value?.laboratorium))
const ruangKomputerLabel = computed(() => booleanLabel(fasilitasData.value?.ruang_komputer))
const koperasiLabel = computed(() => booleanLabel(fasilitasData.value?.koperasi))
const kantinLabel = computed(() => booleanLabel(fasilitasData.value?.kantin))

const fasilitasOlahragaLabel = computed(() => {
  const labels = {
    lengkap: 'Lengkap',
    cukup_lengkap: 'Cukup Lengkap',
    kurang_lengkap: 'Kurang Lengkap',
  }
  return labels[fasilitasData.value?.fasilitas_olahraga] || '-'
})

const fasilitasKesehatanLabel = computed(() => {
  const labels = {
    lengkap: 'Lengkap',
    cukup_lengkap: 'Cukup Lengkap',
    kurang_lengkap: 'Kurang Lengkap',
  }
  return labels[fasilitasData.value?.fasilitas_kesehatan] || '-'
})

const fasilitasMengajarLabel = computed(() => {
  const labels = {
    lengkap: 'Lengkap',
    cukup_lengkap: 'Cukup Lengkap',
    kurang_lengkap: 'Kurang Lengkap',
  }
  return labels[fasilitasData.value?.fasilitas_mengajar] || '-'
})

const fasilitasKomunikasiLabel = computed(() => {
  const labels = {
    lengkap: 'Lengkap',
    cukup_lengkap: 'Cukup Lengkap',
    kurang_lengkap: 'Kurang Lengkap',
  }
  return labels[fasilitasData.value?.fasilitas_komunikasi] || '-'
})

const aksesTransportasiLabel = computed(() => {
  const labels = {
    mudah: 'Mudah',
    cukup_mudah: 'Cukup Mudah',
    sulit: 'Sulit',
  }
  return labels[fasilitasData.value?.akses_transportasi] || '-'
})

const fasilitasTransportasiLabel = computed(() => {
  const labels = {
    bus: 'Bus',
    angkutan_umum: 'Angkutan Umum',
    kendaraan_pribadi: 'Kendaraan Pribadi',
    ojek: 'Ojek',
  }
  return labels[fasilitasData.value?.fasilitas_transportasi] || '-'
})

const aksesJalanLabel = computed(() => {
  const labels = {
    aspal: 'Aspal',
    cor_block: 'Cor Block',
    tanah: 'Tanah',
    kerikil: 'Kerikil',
  }
  return labels[fasilitasData.value?.akses_jalan] || '-'
})

const asramaLabel = computed(() => {
  const labels = {
    layak: 'Layak',
    cukup: 'Cukup',
    tidak_layak: 'Tidak Layak',
  }
  return labels[fasilitasData.value?.asrama] || '-'
})

const ruangBelajarLabel = computed(() => {
  const labels = {
    layak: 'Layak',
    cukup: 'Cukup',
    tidak_layak: 'Tidak Layak',
  }
  return labels[fasilitasData.value?.ruang_belajar] || '-'
})

const internetLabel = computed(() => {
  const labels = {
    stabil: 'Stabil',
    tidak_stabil: 'Tidak Stabil',
    tidak_ada: 'Tidak Ada',
  }
  return labels[fasilitasData.value?.internet] || '-'
})

onMounted(async () => {
  await loadFasilitasData()
})

const loadFasilitasData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getFasilitasByPesantren(pesantrenId)

    if (response.success) {
      if (response.data) {
        fasilitasData.value = response.data.data || response.data
        fasilitasId.value = response.data.id || response.data.id

        console.log('🏢 Fasilitas Data Loaded:', fasilitasData.value)
      } else {
        fasilitasData.value = null
      }
    }
  } catch (err) {
    console.error('❌ Error loading fasilitas:', err)
    error.value = err.message || 'Gagal memuat data fasilitas'
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
    const response = await deleteFasilitas(fasilitasId.value)

    if (response.success) {
      console.log('✅ Data fasilitas berhasil dihapus')
      setTimeout(() => {
        router.push(`/pondok/edit/${pesantrenId}`)
      }, 500)
    }
  } catch (err) {
    console.error('❌ Error deleting fasilitas:', err)
    error.value = err.message || 'Gagal menghapus data fasilitas'
    showDeleteModal.value = false
  } finally {
    deleting.value = false
  }
}
</script>
