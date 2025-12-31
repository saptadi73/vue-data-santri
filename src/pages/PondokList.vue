<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Data Pondok Pesantren</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Kelola data pondok pesantren, pencarian, dan pagination sebelum menginput data santri.
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="w-full md:w-96">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Cari nama atau NSP..."
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

          <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <select
              v-model="filters.provinsi"
              @change="applyFilters"
              class="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Semua Provinsi</option>
              <option v-for="prov in provinsiList" :key="prov" :value="prov">
                {{ prov }}
              </option>
            </select>
            <select
              v-model="filters.kabupaten"
              @change="applyFilters"
              class="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              :disabled="!filters.provinsi"
            >
              <option value="">Semua Kabupaten</option>
              <option v-for="kab in filteredKabupatenList" :key="kab" :value="kab">
                {{ kab }}
              </option>
            </select>
            <router-link
              to="/pondok/tambah"
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
              Tambah Pondok
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
        ></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat data...</p>
      </div>

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

      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Nama / NSP
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Kyai
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Santri
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Guru
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Provinsi
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Kabupaten
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Tahun Berdiri
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="pondokList.length === 0">
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
                  <p class="mt-4">Belum ada data pondok pesantren</p>
                </td>
              </tr>
              <tr
                v-for="pondok in pondokList"
                :key="pondok.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ pondok.nama }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    NSP: {{ pondok.nsp || '-' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-gray-300">
                    {{ pondok.nama_kyai || '-' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {{ pondok.jumlah_santri ?? '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {{ pondok.jumlah_guru ?? '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {{ pondok.provinsi || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {{ pondok.kabupaten || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {{ pondok.tahun_berdiri || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end gap-2">
                    <router-link
                      :to="`/pondok/edit/${pondok.id}`"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
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
                      @click="confirmDelete(pondok)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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

        <div
          v-if="pagination.total > 0"
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
            Hapus Pondok
          </h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Apakah Anda yakin ingin menghapus <strong>{{ pondokToDelete?.nama }}</strong
              >? Data akan dihapus permanen.
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
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { deletePondok, getPondokList } from '@/services/pondokPesantrenService'

const pondokList = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const filters = ref({ provinsi: '', kabupaten: '' })
const provinsiList = ref([])
const kabupatenMap = ref({})

const pagination = ref({
  page: 1,
  per_page: 10,
  total: 0,
  total_pages: 1,
})

const showDeleteModal = ref(false)
const pondokToDelete = ref(null)
const deleting = ref(false)

let searchTimeout = null

const visiblePages = computed(() => {
  const pages = []
  const currentPage = pagination.value.page
  const totalPages = pagination.value.total_pages

  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, startPage + 4)

  if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4)

  for (let i = startPage; i <= endPage; i += 1) pages.push(i)
  return pages
})

const filteredKabupatenList = computed(() => {
  if (!filters.value.provinsi) return []
  return kabupatenMap.value[filters.value.provinsi] || []
})

const loadPondokData = async () => {
  loading.value = true
  error.value = null

  try {
    const params = {
      page: pagination.value.page,
      per_page: pagination.value.per_page,
      search: searchQuery.value,
      provinsi: filters.value.provinsi,
      kabupaten: filters.value.kabupaten,
    }

    const response = await getPondokList(params)
    const items = response?.data || []
    const pageInfo = response?.pagination || params

    pondokList.value = items
    pagination.value = {
      page: Number(pageInfo.page) || 1,
      per_page: Number(pageInfo.per_page) || 10,
      total: Number(pageInfo.total) || 0,
      total_pages: Number(pageInfo.total_pages) || 1,
    }

    // Extract unique provinsi and kabupaten from all loaded data
    extractProvinsiKabupaten(items)
  } catch (err) {
    error.value = err.message || 'Gagal memuat data pondok pesantren.'
    pondokList.value = []
    pagination.value = { page: 1, per_page: 10, total: 0, total_pages: 1 }
  } finally {
    loading.value = false
  }
}

const extractProvinsiKabupaten = (items) => {
  const provSet = new Set()
  const kabMap = {}

  items.forEach((pondok) => {
    if (pondok.provinsi) {
      provSet.add(pondok.provinsi)

      if (!kabMap[pondok.provinsi]) {
        kabMap[pondok.provinsi] = new Set()
      }

      if (pondok.kabupaten) {
        kabMap[pondok.provinsi].add(pondok.kabupaten)
      }
    }
  })

  // Convert sets to sorted arrays
  provinsiList.value = Array.from(provSet).sort()
  const convertedMap = {}
  Object.keys(kabMap).forEach((prov) => {
    convertedMap[prov] = Array.from(kabMap[prov]).sort()
  })
  kabupatenMap.value = convertedMap

  console.log('📍 Provinsi & Kabupaten Extracted:', {
    provinsiList: provinsiList.value,
    kabupatenMap: kabupatenMap.value,
  })
}

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    loadPondokData()
  }, 400)
}

const applyFilters = () => {
  pagination.value.page = 1
  loadPondokData()
}

// Reset kabupaten filter when provinsi changes
watch(
  () => filters.value.provinsi,
  () => {
    filters.value.kabupaten = ''
  },
)

const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    pagination.value.page = page
    loadPondokData()
  }
}

const confirmDelete = (pondok) => {
  pondokToDelete.value = pondok
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!pondokToDelete.value) return
  deleting.value = true

  try {
    await deletePondok(pondokToDelete.value.id)
    showDeleteModal.value = false
    pondokToDelete.value = null
    await loadPondokData()
  } catch (err) {
    error.value = err.message || 'Gagal menghapus pondok pesantren.'
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadPondokData()
})
</script>
