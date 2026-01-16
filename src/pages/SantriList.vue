<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Data Santri</h1>
        <p class="text-gray-600 dark:text-gray-400">Kelola data santri dengan mudah</p>
      </div>

      <!-- Action Bar -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <!-- Search -->
          <div class="w-full md:w-96">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Cari nama atau NIK..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <svg
                class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <!-- Filters & Add Button -->
          <div class="flex gap-3 w-full md:w-auto flex-wrap">
            <select
              v-model="filters.provinsi"
              @change="loadSantriData"
              class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Semua Provinsi</option>
              <option v-for="prov in provinsiList" :key="prov.code" :value="prov.name">
                {{ prov.name }}
              </option>
            </select>

            <select
              v-model="filters.jenis_kelamin"
              @change="loadSantriData"
              class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Semua Gender</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>

            <select
              v-model="pagination.per_page"
              @change="changePerPage"
              class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              title="Items per page"
            >
              <option value="10">10 / Halaman</option>
              <option value="20">20 / Halaman</option>
              <option value="50">50 / Halaman</option>
              <option value="100">100 / Halaman</option>
            </select>
            <button
              @click="handleBatchScore"
              :disabled="santriList.length === 0 || batchScoringInProgress"
              title="Hitung score untuk semua santri secara batch (15-30 detik)"
              class="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Batch Score
            </button>
            <router-link
              to="/santri/tambah"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tambah Santri
            </router-link>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
        ></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat data...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
      >
        <div class="flex items-center gap-3">
          <svg
            class="h-6 w-6 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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

      <!-- Table -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Foto
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Nama
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  NIK
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Gender
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Provinsi
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Kabupaten
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jumlah Foto
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="santriList.length === 0">
                <td colspan="8" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p class="mt-4">Tidak ada data santri</p>
                </td>
              </tr>
              <tr
                v-for="santri in santriList"
                :key="santri.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                  >
                    <svg
                      class="h-6 w-6 text-gray-400 dark:text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ santri.nama }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ santri.nik }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="
                      santri.jenis_kelamin === 'L'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-pink-100 text-pink-800'
                    "
                  >
                    {{ santri.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-gray-300">{{ santri.provinsi }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-gray-300">{{ santri.kabupaten }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ santri.foto_count || 0 }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end gap-2">
                    <router-link
                      :to="`/santri/edit/${santri.id}`"
                      class="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </router-link>
                    <button
                      @click="confirmDelete(santri)"
                      class="text-red-600 hover:text-red-900"
                      title="Hapus"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="santriList.length > 0"
          class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6"
        >
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Menampilkan
              <span class="font-medium">{{ (pagination.page - 1) * pagination.per_page + 1 }}</span>
              sampai
              <span class="font-medium">{{
                Math.min(pagination.page * pagination.per_page, pagination.total)
              }}</span>
              dari
              <span class="font-medium">{{ pagination.total }}</span>
              hasil
            </div>
            <div class="flex gap-2">
              <button
                @click="goToPage(pagination.page - 1)"
                :disabled="pagination.page === 1"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                Sebelumnya
              </button>

              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-1 border rounded-md text-sm font-medium',
                  page === pagination.page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
              >
                {{ page }}
              </button>

              <button
                @click="goToPage(pagination.page + 1)"
                :disabled="pagination.page === pagination.total_pages"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50"
      @click="showDeleteModal = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-700 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800"
        @click.stop
      >
        <div class="mt-3 text-center">
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30"
          >
            <svg
              class="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4">
            Hapus Santri
          </h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Apakah Anda yakin ingin menghapus <strong>{{ santriToDelete?.nama }}</strong
              >? Semua data dan foto akan dihapus secara permanen.
            </p>
          </div>
          <div class="flex gap-3 justify-center mt-4">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              @click="handleDelete"
              :disabled="deleting"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {{ deleting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Modal for Batch Scoring -->
    <ProgressModal
      :is-visible="showBatchScoringModal"
      :title="'Batch Scoring Santri'"
      :is-processing="batchScoringInProgress"
      :status-message="batchScoringStatus"
      :progress-percent="batchScoringProgress"
      :is-success="batchScoringSuccess"
      :is-error="batchScoringError"
      :error-message="batchScoringErrorMsg"
      :error-details="batchScoringErrorDetails"
      :result="batchScoringResult"
      @close="closeBatchScoringModal"
      @retry="handleBatchScore"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getSantriList, deleteSantri } from '@/services/santriService'
import ProgressModal from '@/components/ProgressModal.vue'
import { batchCalculateSantriScores, formatBatchResult } from '@/services/bulkScoringService'

const santriList = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const provinsiList = ref([])
const filters = ref({
  provinsi: '',
  jenis_kelamin: '',
})

const pagination = ref({
  page: 1,
  per_page: 20,
  total: 0,
  total_pages: 0,
})

const showDeleteModal = ref(false)
const santriToDelete = ref(null)
const deleting = ref(false)

// Batch Scoring State
const showBatchScoringModal = ref(false)
const batchScoringInProgress = ref(false)
const batchScoringSuccess = ref(false)
const batchScoringError = ref(false)
const batchScoringStatus = ref('Menghitung score santri...')
const batchScoringProgress = ref(0)
const batchScoringErrorMsg = ref('')
const batchScoringErrorDetails = ref('')
const batchScoringResult = ref(null)

let searchTimeout = null

// Computed property for visible page numbers
const visiblePages = computed(() => {
  const pages = []
  const currentPage = pagination.value.page
  const totalPages = pagination.value.total_pages

  // Show max 5 pages
  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, startPage + 4)

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

// Load santri data
const loadSantriData = async () => {
  loading.value = true
  error.value = null

  try {
    const params = {
      page: pagination.value.page,
      per_page: pagination.value.per_page,
    }

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    if (filters.value.provinsi) {
      params.provinsi = filters.value.provinsi
    }

    if (filters.value.jenis_kelamin) {
      params.jenis_kelamin = filters.value.jenis_kelamin
    }

    const response = await getSantriList(params)

    console.log('🔍 [SantriList] API Response:', response)
    console.log('🔍 [SantriList] Response Type:', typeof response)
    console.log(
      '🔍 [SantriList] Response Keys:',
      response ? Object.keys(response) : 'null/undefined',
    )

    if (response && response.success) {
      santriList.value = response.data || []

      // Handle pagination data - normalize from backend format
      let paginationData = null
      if (response.meta && response.meta.pagination) {
        // Backend returns pagination inside meta
        const backendPag = response.meta.pagination
        paginationData = {
          page: backendPag.current_page || 1,
          per_page: backendPag.per_page || 20,
          total: backendPag.total_items || 0,
          total_pages: backendPag.total_pages || 1,
        }
      } else if (response.pagination) {
        paginationData = response.pagination
      } else {
        // Fallback if no pagination data in response
        paginationData = {
          page: pagination.value.page,
          per_page: pagination.value.per_page,
          total: santriList.value.length,
          total_pages: 1,
        }
      }

      pagination.value = paginationData

      console.log('✅ [SantriList] Loaded data:', santriList.value.length, 'items')
      console.log('✅ [SantriList] Pagination:', pagination.value)
    } else {
      // Handle unsuccessful response
      console.warn('⚠️ [SantriList] Unsuccessful response:', response)
      santriList.value = []
      pagination.value = {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 0,
      }
    }
  } catch (err) {
    error.value = err.message || 'Gagal memuat data santri. Pastikan API server berjalan.'
    console.error('❌ [SantriList] Error loading santri:', err)
    // Set empty data on error
    santriList.value = []
    pagination.value = {
      page: 1,
      per_page: 20,
      total: 0,
      total_pages: 0,
    }
  } finally {
    loading.value = false
  }
}

// Handle search with debounce
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    loadSantriData()
  }, 500)
}

// Go to specific page
const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    pagination.value.page = page
    loadSantriData()
  }
}

// Change items per page
const changePerPage = () => {
  pagination.value.page = 1
  loadSantriData()
}

// Confirm delete
const confirmDelete = (santri) => {
  santriToDelete.value = santri
  showDeleteModal.value = true
}

// Handle delete
const handleDelete = async () => {
  if (!santriToDelete.value) return

  deleting.value = true
  try {
    await deleteSantri(santriToDelete.value.id)
    showDeleteModal.value = false
    santriToDelete.value = null
    await loadSantriData()
  } catch (err) {
    error.value = err.message || 'Gagal menghapus santri'
  } finally {
    deleting.value = false
  }
}

// Load provinsi list from backend API
const loadProvinsiList = async () => {
  try {
    const provinsiSet = new Set()
    let page = 1
    let hasMoreData = true

    // Fetch all pages to get all unique provinsi
    while (hasMoreData) {
      const response = await getSantriList({ page, per_page: 100 })

      console.log(`📍 Response halaman ${page}:`, response)

      if (response && response.success && response.data) {
        response.data.forEach((santri) => {
          console.log('Santri:', santri.nama, '- Provinsi:', santri.provinsi)
          if (santri.provinsi) {
            provinsiSet.add(santri.provinsi)
          }
        })

        // Check if there are more pages - handle both pagination formats
        let totalPages = 1
        if (response.meta && response.meta.pagination) {
          totalPages = response.meta.pagination.total_pages || 1
        } else if (response.pagination) {
          totalPages = response.pagination.total_pages || 1
        }

        hasMoreData = page < totalPages
        page++
      } else {
        console.warn('⚠️ Response tidak valid atau tidak ada data')
        hasMoreData = false
      }
    }

    console.log('📋 Daftar provinsi unik:', Array.from(provinsiSet))

    provinsiList.value = Array.from(provinsiSet)
      .sort()
      .map((name) => ({ name, code: name }))

    console.log('✅ ProvinsiList final:', provinsiList.value)
  } catch (err) {
    console.error('❌ Error loading provinsi list:', err)
  }
}

// Batch Scoring Methods
const handleBatchScore = async () => {
  // Reset state
  showBatchScoringModal.value = true
  batchScoringInProgress.value = true
  batchScoringSuccess.value = false
  batchScoringError.value = false
  batchScoringStatus.value = 'Menghitung score santri...'
  batchScoringProgress.value = 0
  batchScoringErrorMsg.value = ''
  batchScoringErrorDetails.value = ''
  batchScoringResult.value = null

  try {
    // Simulate progress updates (since API doesn't provide real-time progress)
    const progressInterval = setInterval(() => {
      if (batchScoringProgress.value < 90) {
        batchScoringProgress.value += Math.random() * 20
      }
    }, 500)

    console.log('🟡 Starting batch scoring for all santri...')
    const result = await batchCalculateSantriScores()

    clearInterval(progressInterval)
    batchScoringProgress.value = 100

    // Format result untuk display
    const formattedResult = formatBatchResult(result)

    console.log('🟢 Batch scoring success:', formattedResult)

    batchScoringResult.value = formattedResult
    batchScoringSuccess.value = true
    batchScoringInProgress.value = false

    // Auto reload data setelah 2 detik
    setTimeout(() => {
      loadSantriData()
    }, 2000)
  } catch (err) {
    console.error('🔴 Batch scoring error:', err)

    batchScoringError.value = true
    batchScoringInProgress.value = false
    batchScoringErrorMsg.value =
      err.message || 'Gagal menghitung score. Pastikan server API berjalan dengan baik.'
    batchScoringErrorDetails.value = err.stack || ''
  }
}

const closeBatchScoringModal = () => {
  showBatchScoringModal.value = false
  // Reset state setelah modal ditutup
  setTimeout(() => {
    batchScoringInProgress.value = false
    batchScoringSuccess.value = false
    batchScoringError.value = false
    batchScoringStatus.value = 'Menghitung score santri...'
    batchScoringProgress.value = 0
    batchScoringErrorMsg.value = ''
    batchScoringErrorDetails.value = ''
    batchScoringResult.value = null
  }, 300)
}

onMounted(() => {
  loadProvinsiList()
  loadSantriData()
})
</script>
