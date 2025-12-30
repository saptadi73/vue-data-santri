<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ isEditMode ? 'Edit Data Aset Santri' : 'Tambah Data Aset Santri (Multi)' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{
            isEditMode
              ? 'Ubah detail aset dan kelola foto.'
              : 'Tambahkan satu atau beberapa aset sekaligus dengan foto.'
          }}
        </p>

        <!-- Info Box -->
        <div
          class="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div class="flex gap-3">
            <svg
              class="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="text-sm text-blue-800 dark:text-blue-300">
              <p class="font-semibold mb-1">Informasi Penting:</p>
              <p>
                Aset yang dimaksud adalah <strong>alat kerja atau kendaraan</strong> yang dipakai
                oleh <strong>orang tua/wali santri</strong> (contoh: motor, mobil, laptop,
                handphone, alat kerja, ternak, lahan, dll).
              </p>
              <p class="mt-1">
                <strong>Bukan rumah tempat tinggal</strong> yang ditempati, karena penilaian rumah
                tinggal akan didata secara terpisah.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Existing Assets (List & Navigate) -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Aset yang sudah ada</h2>
          <div class="flex items-center gap-3 text-sm">
            <span class="text-gray-600 dark:text-gray-400">{{ existingAssets.length }} aset</span>
            <router-link
              :to="{ name: 'santri-asset-add', params: { santriId } }"
              class="inline-flex items-center px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Tambah Aset
            </router-link>
          </div>
        </div>

        <div v-if="existingLoading" class="py-6 text-center text-gray-600 dark:text-gray-400">
          <div
            class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"
          ></div>
          <p class="mt-3">Memuat data aset...</p>
        </div>

        <div
          v-else-if="existingError"
          class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <p class="text-red-700 dark:text-red-300">{{ existingError }}</p>
        </div>

        <div v-else-if="existingAssets.length === 0" class="text-gray-600 dark:text-gray-400">
          Belum ada aset tercatat untuk santri ini.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jenis Aset
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jumlah
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nilai Perkiraan
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="asset in existingAssets" :key="asset.id">
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 capitalize">
                  {{ asset.jenis_aset || '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  {{ asset.jumlah ?? '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(asset.nilai_perkiraan) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <div class="flex items-center gap-2">
                    <router-link
                      :to="`/santri/${santriId}/asset/edit/${asset.id}`"
                      class="inline-flex items-center px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                    >
                      Edit
                    </router-link>
                    <span
                      v-if="isEditMode && asset.id === assetId"
                      class="px-2 py-1 text-xs rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200"
                    >
                      Sedang dibuka
                    </span>
                    <button
                      @click="handleDeleteAsset(asset.id)"
                      type="button"
                      :disabled="deletingAssetId === asset.id"
                      class="inline-flex items-center px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        v-if="deletingAssetId === asset.id"
                        class="animate-spin h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>{{ deletingAssetId === asset.id ? 'Menghapus...' : 'Hapus' }}</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Form Content -->
      <div>
        <div
          v-if="isEditMode && loading"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center mb-6"
        >
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
          ></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat detail aset...</p>
        </div>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
        >
          <div class="flex items-center gap-3">
            <svg
              class="h-6 w-6 text-green-600 dark:text-green-400"
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
            <p class="text-green-800 dark:text-green-300">{{ successMessage }}</p>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="error && !loading"
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

        <form v-if="!loading" @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Asset Items List -->
          <div class="space-y-4">
            <div
              v-for="(item, index) in assetItems"
              :key="index"
              class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-2 border-gray-200 dark:border-gray-700"
            >
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{
                    isEditMode
                      ? item.jenis_aset
                        ? `Detail Aset: ${item.jenis_aset}`
                        : 'Detail Aset'
                      : `Aset #${index + 1}`
                  }}
                </h2>
                <button
                  v-if="assetItems.length > 1"
                  @click="removeAssetItem(index)"
                  type="button"
                  class="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
                >
                  Hapus
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Jenis Aset -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jenis Aset <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="item.jenis_aset"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Pilih Jenis Aset</option>
                    <option value="motor">Motor</option>
                    <option value="mobil">Mobil</option>
                    <option value="sepeda">Sepeda</option>
                    <option value="hp">Handphone</option>
                    <option value="laptop">Laptop</option>
                    <option value="lahan">Lahan</option>
                    <option value="ternak">Ternak</option>
                    <option value="alat_kerja">Alat Kerja</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <!-- Jumlah -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jumlah <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="item.jumlah"
                    type="number"
                    min="1"
                    step="1"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                </div>

                <!-- Nilai Perkiraan -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nilai Perkiraan (Rp) <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="item.nilai_perkiraan"
                    type="number"
                    min="0"
                    step="1000"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {{ formatCurrency(item.nilai_perkiraan) }}
                  </p>
                </div>

                <!-- Upload & Kelola Foto -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Foto Aset (Opsional)
                  </label>

                  <div
                    v-if="isEditMode && item.existingPhotos && item.existingPhotos.length > 0"
                    class="mb-3 grid grid-cols-2 sm:grid-cols-4 gap-2"
                  >
                    <div
                      v-for="photo in item.existingPhotos"
                      :key="photo.id"
                      class="relative group"
                    >
                      <img
                        :src="buildPhotoUrl(photo.url_photo)"
                        :alt="photo.nama_file || 'Foto aset'"
                        class="w-full h-24 object-cover rounded border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        @click="removeExistingPhoto(index, photo.id)"
                        type="button"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <input
                    @change="handleFileChange($event, index)"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Format: JPG, PNG, WEBP. Max 5MB per file.
                  </p>

                  <!-- Preview Foto Baru -->
                  <div
                    v-if="item.photos && item.photos.length > 0"
                    class="mt-3 grid grid-cols-4 gap-2"
                  >
                    <div
                      v-for="(photo, photoIndex) in item.photos"
                      :key="photoIndex"
                      class="relative group"
                    >
                      <img
                        :src="photo.preview"
                        :alt="`Preview ${photoIndex + 1}`"
                        class="w-full h-20 object-cover rounded border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        @click="removePhoto(index, photoIndex)"
                        type="button"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Add More Asset Button -->
          <div v-if="!isEditMode" class="flex justify-center">
            <button
              @click="addAssetItem"
              type="button"
              class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tambah Aset Lain
            </button>
          </div>

          <!-- Submit Button -->
          <div class="flex gap-4 justify-end">
            <router-link
              :to="`/santri/edit/${santriId}`"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              Batal
            </router-link>
            <button
              type="submit"
              :disabled="submitting"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg
                v-if="submitting"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
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
              {{
                submitting
                  ? 'Menyimpan...'
                  : isEditMode
                    ? 'Simpan Perubahan'
                    : `Simpan ${assetItems.length} Aset`
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  bulkCreateAssets,
  getSantriAssets,
  getAssetDetail,
  updateAsset,
  addAssetPhotos,
  deleteAssetPhoto,
  createAssetWithPhotos,
  deleteAsset,
} from '@/services/santriAssetService'
import { API_BASE_URL } from '@/utils/apiConfig'

const route = useRoute()
const router = useRouter()

const santriId = route.params.santriId
const assetId = ref(route.params.assetId || null)
const isEditMode = computed(() => Boolean(assetId.value))

const loading = ref(true)
const submitting = ref(false)
const error = ref(null)
const successMessage = ref(null)

const existingAssets = ref([])
const existingError = ref(null)
const existingLoading = ref(true)
const deletingAssetId = ref(null)

const createEmptyAssetItem = () => ({
  id: null,
  jenis_aset: '',
  jumlah: 1,
  nilai_perkiraan: 0,
  photos: [],
  existingPhotos: [],
  removedPhotoIds: [],
})

const assetItems = ref(isEditMode.value ? [] : [createEmptyAssetItem()])

const addAssetItem = () => {
  assetItems.value.push(createEmptyAssetItem())
}

const removeAssetItem = (index) => {
  if (assetItems.value.length > 1) {
    assetItems.value[index].photos.forEach((photo) => {
      URL.revokeObjectURL(photo.preview)
    })
    assetItems.value.splice(index, 1)
  }
}

const handleFileChange = (event, index) => {
  const files = Array.from(event.target.files)
  const photos = []
  error.value = null

  files.forEach((file) => {
    if (file.size > 5 * 1024 * 1024) {
      error.value = `File ${file.name} terlalu besar (maksimal 5MB)`
      return
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      error.value = `File ${file.name} format tidak didukung`
      return
    }

    photos.push({
      file,
      preview: URL.createObjectURL(file),
    })
  })

  assetItems.value[index].photos = photos
}

const removePhoto = (assetIndex, photoIndex) => {
  const photo = assetItems.value[assetIndex].photos[photoIndex]
  URL.revokeObjectURL(photo.preview)
  assetItems.value[assetIndex].photos.splice(photoIndex, 1)
}

const removeExistingPhoto = (assetIndex, photoId) => {
  const item = assetItems.value[assetIndex]
  item.existingPhotos = item.existingPhotos.filter((p) => p.id !== photoId)
  if (!item.removedPhotoIds.includes(photoId)) {
    item.removedPhotoIds.push(photoId)
  }
}

const formatCurrency = (value) => {
  if (!value) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const buildPhotoUrl = (path) => {
  if (!path) return ''
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${API_BASE_URL}/${cleanPath}`
}

const loadExistingAssets = async () => {
  existingLoading.value = true
  existingError.value = null

  try {
    const response = await getSantriAssets(santriId, { per_page: 50 })
    existingAssets.value = Array.isArray(response?.data) ? response.data : []
  } catch (err) {
    existingError.value = err.message || 'Gagal memuat data aset'
  } finally {
    existingLoading.value = false
  }
}

const loadAssetDetail = async () => {
  loading.value = true
  error.value = null

  try {
    console.group('📦 Loading Asset Detail')
    console.log('Asset ID:', assetId.value)
    console.log('Route params:', route.params)

    const response = await getAssetDetail(assetId.value)
    console.log('API Response:', response)

    const asset = response?.data || response
    console.log('Parsed Asset:', asset)

    if (!asset || !asset.id) {
      throw new Error('Data aset tidak valid atau tidak ditemukan')
    }

    const newItem = {
      id: asset.id,
      jenis_aset: asset.jenis_aset || '',
      jumlah: asset.jumlah ?? 1,
      nilai_perkiraan: asset.nilai_perkiraan ?? 0,
      photos: [],
      existingPhotos: asset.foto_asset || [],
      removedPhotoIds: [],
    }

    console.log('Creating item:', newItem)
    assetItems.value = [newItem]
    console.log('Asset Items After Set:', assetItems.value)
    console.log('Asset Items Length:', assetItems.value.length)
    console.groupEnd()
  } catch (err) {
    console.error('Error loading asset:', err)
    error.value = err.message || 'Gagal memuat detail aset'
    console.groupEnd()
  } finally {
    loading.value = false
    console.log('Loading finished, loading.value =', loading.value)
  }
}

const handleSubmit = async () => {
  error.value = null
  successMessage.value = null
  submitting.value = true

  try {
    if (isEditMode.value) {
      await handleUpdateAsset()
      return
    }

    // If only one asset, use single create with photos (simpler, matches API guidance)
    if (assetItems.value.length === 1) {
      const item = assetItems.value[0]
      const response = await createAssetWithPhotos({
        santri_id: santriId,
        jenis_aset: item.jenis_aset,
        jumlah: Number(item.jumlah) || 1,
        nilai_perkiraan: Number(item.nilai_perkiraan) || 0,
        files: item.photos?.map((p) => p.file) || [],
      })

      if (response?.success) {
        successMessage.value = 'Berhasil menyimpan aset!'
        if (item.photos) {
          item.photos.forEach((photo) => URL.revokeObjectURL(photo.preview))
        }
        setTimeout(() => {
          router.push(`/santri/edit/${santriId}`)
        }, 1200)
        return
      }
    }

    // Fallback to bulk for multiple entries
    const formData = new FormData()

    const assets = assetItems.value.map((item) => ({
      santri_id: santriId,
      jenis_aset: item.jenis_aset,
      jumlah: Number(item.jumlah) || 1,
      nilai_perkiraan: Number(item.nilai_perkiraan) || 0,
    }))

    formData.append('assets', JSON.stringify(assets))

    assetItems.value.forEach((item, index) => {
      if (item.photos && item.photos.length > 0) {
        item.photos.forEach((photo) => {
          // Primary: per-index as documented
          formData.append(`fotos_${index}`, photo.file)
          // Fallback: unindexed field for backends expecting plain 'fotos'
          formData.append('fotos', photo.file)
        })
      }
    })

    const response = await bulkCreateAssets(formData)

    if (response.success) {
      // Try to attach photos explicitly if backend did not bind them in bulk
      const createdAssets = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : response?.data

      // createdAssets could be object for single insert
      if (createdAssets) {
        const assetsArray = Array.isArray(createdAssets) ? createdAssets : [createdAssets]
        // Upload photos sequentially to capture first error clearly
        for (let idx = 0; idx < assetsArray.length; idx += 1) {
          const created = assetsArray[idx]
          const item = assetItems.value[idx]
          if (!item || !created?.id || !item.photos?.length) continue
          try {
            await addAssetPhotos(
              created.id,
              item.photos.map((p) => p.file),
            )
          } catch (err) {
            console.error('Fallback photo upload failed:', err)
            throw err
          }
        }
      }

      successMessage.value = `Berhasil menyimpan ${assetItems.value.length} aset!`

      assetItems.value.forEach((item) => {
        item.photos.forEach((photo) => {
          URL.revokeObjectURL(photo.preview)
        })
      })

      setTimeout(() => {
        router.push(`/santri/edit/${santriId}`)
      }, 1200)
    }
  } catch (err) {
    console.error('Error submitting assets:', err)
    error.value = err.message || 'Gagal menyimpan data aset'
  } finally {
    submitting.value = false
  }
}

const handleDeleteAsset = async (targetId) => {
  if (!targetId) return
  const confirmDelete = window.confirm('Hapus aset ini?')
  if (!confirmDelete) return

  deletingAssetId.value = targetId
  error.value = null
  successMessage.value = null

  try {
    await deleteAsset(targetId)
    successMessage.value = 'Aset berhasil dihapus'
    await loadExistingAssets()

    if (isEditMode.value && assetId.value === targetId) {
      router.push(`/santri/${santriId}/asset/tambah`)
    }
  } catch (err) {
    console.error('Error deleting asset:', err)
    error.value = err.message || 'Gagal menghapus aset'
  } finally {
    deletingAssetId.value = null
  }
}

const handleUpdateAsset = async () => {
  const item = assetItems.value[0]
  if (!item) {
    error.value = 'Data aset tidak ditemukan'
    return
  }

  try {
    await updateAsset(assetId.value, {
      jenis_aset: item.jenis_aset,
      jumlah: Number(item.jumlah) || 1,
      nilai_perkiraan: Number(item.nilai_perkiraan) || 0,
    })

    if (item.removedPhotoIds && item.removedPhotoIds.length > 0) {
      await Promise.all(item.removedPhotoIds.map((id) => deleteAssetPhoto(id)))
    }

    if (item.photos && item.photos.length > 0) {
      await addAssetPhotos(
        assetId.value,
        item.photos.map((p) => p.file),
      )
    }

    item.photos.forEach((photo) => URL.revokeObjectURL(photo.preview))

    successMessage.value = 'Berhasil memperbarui aset'

    setTimeout(() => {
      router.push(`/santri/edit/${santriId}`)
    }, 1200)
  } catch (err) {
    console.error('Error updating asset:', err)
    error.value = err.message || 'Gagal memperbarui aset'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadExistingAssets()
  if (isEditMode.value) {
    loadAssetDetail()
  } else {
    loading.value = false
  }
})

watch(
  () => route.params.assetId,
  (newId) => {
    assetId.value = newId || null
    successMessage.value = null
    if (assetId.value) {
      loadAssetDetail()
    } else {
      // Switch to add mode: reset form to empty
      assetItems.value = [createEmptyAssetItem()]
      loading.value = false
    }
  },
)
</script>
