<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <router-link
          :to="`/santri/edit/${santriId}`"
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
          Kembali ke Data Santri
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Data Pembiayaan</h1>
        <p class="text-gray-600 dark:text-gray-400">Kelola informasi pembiayaan santri</p>
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
          v-if="!pembiayaanData"
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
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Belum Ada Data Pembiayaan
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Belum ada informasi pembiayaan yang tercatat. Silahkan tambahkan data pembiayaan santri.
          </p>
          <router-link
            :to="`/santri/${santriId}/pembiayaan/add`"
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
            Tambah Data Pembiayaan
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
                Informasi Pembiayaan
              </h2>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-4">
              <!-- Biaya Per Bulan -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Biaya Per Bulan
                  </label>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    Rp {{ formatCurrency(pembiayaanData.biaya_per_bulan) }}
                  </p>
                </div>

                <!-- Status Pembayaran -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Status Pembayaran
                  </label>
                  <div class="flex items-center gap-2">
                    <span
                      :class="[
                        'px-3 py-1 rounded-full text-sm font-medium',
                        pembiayaanData.status_pembayaran === 'lancar'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : pembiayaanData.status_pembayaran === 'terlambat'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
                      ]"
                    >
                      {{ statusPembayaranLabel }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Sumber Biaya -->
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Sumber Biaya
                </label>
                <p class="text-gray-900 dark:text-white">
                  {{ sumberBiayaLabel }}
                </p>
              </div>

              <!-- Tunggakan Bulan -->
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Tunggakan Bulan
                </label>
                <p
                  :class="[
                    'font-semibold',
                    pembiayaanData.tunggakan_bulan === 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400',
                  ]"
                >
                  {{ pembiayaanData.tunggakan_bulan || 0 }} bulan
                </p>
              </div>

              <!-- Keterangan -->
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Keterangan
                </label>
                <p class="text-gray-700 dark:text-gray-300">
                  {{ pembiayaanData.keterangan || '-' }}
                </p>
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
                :to="`/santri/${santriId}/pembiayaan/edit/${pembiayaanId}`"
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
          Apakah Anda yakin ingin menghapus data pembiayaan ini? Tindakan ini tidak dapat
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
import { getPembiayaanBySantri, deletePembiayaan } from '@/services/santriPembiayaanService'

const route = useRoute()
const router = useRouter()

const santriId = route.params.santriId
const loading = ref(false)
const error = ref(null)
const pembiayaanData = ref(null)
const pembiayaanId = ref(null)
const showDeleteModal = ref(false)
const deleting = ref(false)

const statusPembayaranLabel = computed(() => {
  const labels = {
    lancar: 'Lancar',
    terlambat: 'Terlambat',
    belum_bayar: 'Belum Bayar',
  }
  return labels[pembiayaanData.value?.status_pembayaran] || '-'
})

const sumberBiayaLabel = computed(() => {
  const labels = {
    orang_tua: 'Orang Tua',
    beasiswa: 'Beasiswa',
    donatur: 'Donatur',
    pesantren: 'Pesantren',
  }
  return labels[pembiayaanData.value?.sumber_biaya] || '-'
})

const formatCurrency = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('id-ID').format(value)
}

onMounted(async () => {
  await loadPembiayaanData()
})

const loadPembiayaanData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getPembiayaanBySantri(santriId)

    if (response.success) {
      if (response.data) {
        pembiayaanData.value = response.data.data || response.data
        pembiayaanId.value = response.data.id || response.data.id

        console.log('💰 Pembiayaan Data Loaded:', pembiayaanData.value)
      } else {
        pembiayaanData.value = null
      }
    }
  } catch (err) {
    console.error('❌ Error loading pembiayaan:', err)
    error.value = err.message || 'Gagal memuat data pembiayaan'
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
    const response = await deletePembiayaan(pembiayaanId.value)

    if (response.success) {
      console.log('✅ Data pembiayaan berhasil dihapus')
      setTimeout(() => {
        router.push(`/santri/edit/${santriId}`)
      }, 500)
    }
  } catch (err) {
    console.error('❌ Error deleting pembiayaan:', err)
    error.value = err.message || 'Gagal menghapus data pembiayaan'
    showDeleteModal.value = false
  } finally {
    deleting.value = false
  }
}
</script>
