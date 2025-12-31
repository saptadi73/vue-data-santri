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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Data Infrastruktur Fisik
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Kelola informasi infrastruktur fisik pesantren
        </p>
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
          v-if="!fisikData"
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
            Belum Ada Data Infrastruktur Fisik
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Belum ada informasi infrastruktur fisik yang tercatat. Silahkan tambahkan data
            infrastruktur fisik pesantren.
          </p>
          <router-link
            :to="`/pesantren/${pesantrenId}/fisik/add`"
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
            Tambah Data Infrastruktur Fisik
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
                Informasi Infrastruktur Fisik
              </h2>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-6">
              <!-- Luas Tanah & Luas Bangunan -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Luas Tanah
                  </label>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ fisikData.luas_tanah || '-' }} m²
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Luas Bangunan
                  </label>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ fisikData.luas_bangunan || '-' }} m²
                  </p>
                </div>
              </div>

              <!-- Status & Kondisi Bangunan -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Status Bangunan
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ statusBangunanLabel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Kondisi Bangunan
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ kondisiBangunanLabel }}</p>
                </div>
              </div>

              <!-- Air & Sanitasi -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Sumber Air
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ fisikData.sumber_air || '-' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Kualitas Air Bersih
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ kualitasAirLabel }}</p>
                </div>
              </div>

              <!-- MCK -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Fasilitas MCK
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ fasilitasMckLabel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Jumlah MCK
                  </label>
                  <p class="text-gray-900 dark:text-white">
                    {{ fisikData.jumlah_mck || '-' }} unit
                  </p>
                </div>
              </div>

              <!-- Lantai, Dinding, Atap -->
              <div class="grid grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Jenis Lantai
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ jenisLantaiLabel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Jenis Dinding
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ jenisDindingLabel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Jenis Atap
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ jenisAtapLabel }}</p>
                </div>
              </div>

              <!-- Listrik -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Sumber Listrik
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ fisikData.sumber_listrik || '-' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Daya Listrik (VA)
                  </label>
                  <p class="text-gray-900 dark:text-white">
                    {{ fisikData.daya_listrik_va || '-' }}
                  </p>
                </div>
              </div>

              <!-- Kestabilan Listrik & Keamanan -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Kestabilan Listrik
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ kestabilanListrikLabel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Sistem Keamanan
                  </label>
                  <p class="text-gray-900 dark:text-white">{{ sistemKeamananLabel }}</p>
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
                :to="`/pesantren/${pesantrenId}/fisik/edit/${fisikId}`"
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
          Apakah Anda yakin ingin menghapus data infrastruktur fisik ini? Tindakan ini tidak dapat
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
import { getFisikByPesantren, deleteFisik } from '@/services/pesantrenFisikService'

const route = useRoute()
const router = useRouter()

const pesantrenId = route.params.pesantrenId
const loading = ref(false)
const error = ref(null)
const fisikData = ref(null)
const fisikId = ref(null)
const showDeleteModal = ref(false)
const deleting = ref(false)

const statusBangunanLabel = computed(() => {
  const labels = {
    milik_sendiri: 'Milik Sendiri',
    milik_waqaf: 'Milik Waqaf',
    kontrak: 'Kontrak',
    menumpang: 'Menumpang',
  }
  return labels[fisikData.value?.status_bangunan] || '-'
})

const kondisiBangunanLabel = computed(() => {
  const labels = {
    permanen: 'Permanen',
    semi_permanen: 'Semi Permanen',
    non_permanen: 'Non Permanen',
  }
  return labels[fisikData.value?.kondisi_bangunan] || '-'
})

const kualitasAirLabel = computed(() => {
  const labels = {
    layak_minum: 'Layak Minum',
    layak_pakai: 'Layak Pakai',
    tidak_layak: 'Tidak Layak',
  }
  return labels[fisikData.value?.kualitas_air_bersih] || '-'
})

const fasilitasMckLabel = computed(() => {
  const labels = {
    lengkap: 'Lengkap',
    kurang_lengkap: 'Kurang Lengkap',
    tidak_ada: 'Tidak Ada',
  }
  return labels[fisikData.value?.fasilitas_mck] || '-'
})

const jenisLantaiLabel = computed(() => {
  const labels = {
    tanah: 'Tanah',
    semen: 'Semen',
    keramik: 'Keramik',
    marmer: 'Marmer',
  }
  return labels[fisikData.value?.jenis_lantai] || '-'
})

const jenisDindingLabel = computed(() => {
  const labels = {
    bambu: 'Bambu',
    kayu: 'Kayu',
    tembok: 'Tembok',
    batu_bata: 'Batu Bata',
  }
  return labels[fisikData.value?.jenis_dinding] || '-'
})

const jenisAtapLabel = computed(() => {
  const labels = {
    rumbia: 'Rumbia',
    seng: 'Seng',
    genteng_tanah_liat: 'Genteng Tanah Liat',
    beton: 'Beton',
  }
  return labels[fisikData.value?.jenis_atap] || '-'
})

const kestabilanListrikLabel = computed(() => {
  const labels = {
    stabil: 'Stabil',
    kurang_stabil: 'Kurang Stabil',
    tidak_stabil: 'Tidak Stabil',
  }
  return labels[fisikData.value?.kestabilan_listrik] || '-'
})

const sistemKeamananLabel = computed(() => {
  const labels = {
    ada: 'Ada',
    tidak_ada: 'Tidak Ada',
  }
  return labels[fisikData.value?.sistem_keamanan] || '-'
})

onMounted(async () => {
  await loadFisikData()
})

const loadFisikData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getFisikByPesantren(pesantrenId)

    if (response.success) {
      if (response.data) {
        fisikData.value = response.data.data || response.data
        fisikId.value = response.data.id || response.data.id

        console.log('🏗️ Fisik Data Loaded:', fisikData.value)
      } else {
        fisikData.value = null
      }
    }
  } catch (err) {
    console.error('❌ Error loading fisik:', err)
    error.value = err.message || 'Gagal memuat data infrastruktur fisik'
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
    const response = await deleteFisik(fisikId.value)

    if (response.success) {
      console.log('✅ Data infrastruktur fisik berhasil dihapus')
      setTimeout(() => {
        router.push(`/pondok/edit/${pesantrenId}`)
      }, 500)
    }
  } catch (err) {
    console.error('❌ Error deleting fisik:', err)
    error.value = err.message || 'Gagal menghapus data infrastruktur fisik'
    showDeleteModal.value = false
  } finally {
    deleting.value = false
  }
}
</script>
