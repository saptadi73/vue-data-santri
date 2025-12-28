<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <router-link
          to="/pondok"
          class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0 7-7m-7 7h18"
            />
          </svg>
          Kembali ke Daftar Pondok
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ isEdit ? 'Edit Pondok Pesantren' : 'Tambah Pondok Pesantren' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Lengkapi informasi pondok pesantren sesuai dokumentasi. Upload foto dilakukan bersamaan
          dengan simpan data.
        </p>
      </div>

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

      <div
        v-if="error"
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

      <div
        v-if="loadingDetail"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 text-center"
      >
        <div
          class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"
        ></div>
        <p class="mt-3 text-gray-600 dark:text-gray-400">Memuat detail pondok...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Informasi Umum</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Nama Pondok <span class="text-red-500">*</span></label
              >
              <input
                v-model="formData.nama"
                required
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: Pondok Pesantren Al-Ikhlas"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >NSP</label
              >
              <input
                v-model="formData.nsp"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nomor Statistik Pesantren"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Nama Kyai</label
              >
              <input
                v-model="formData.nama_kyai"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nama pengasuh/kyai"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Tahun Berdiri</label
              >
              <input
                v-model="formData.tahun_berdiri"
                type="number"
                min="1800"
                max="2099"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: 1985"
              />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Alamat & Lokasi</h2>
            <button
              type="button"
              @click="getCurrentLocation"
              :disabled="gettingLocation"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <span class="icon text-base">{{
                gettingLocation ? 'hourglass_empty' : 'my_location'
              }}</span>
              <span>{{ gettingLocation ? 'Mengambil Lokasi...' : 'Ambil GPS Otomatis' }}</span>
            </button>
          </div>

          <div
            v-if="locationError"
            class="mb-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-300"
          >
            {{ locationError }}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Alamat <span class="text-red-500">*</span></label
              >
              <input
                v-model="formData.alamat"
                required
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nama jalan dan nomor"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Desa/Kelurahan</label
              >
              <input
                v-model="formData.desa"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Kecamatan</label
              >
              <input
                v-model="formData.kecamatan"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Kabupaten/Kota <span class="text-red-500">*</span></label
              >
              <input
                v-model="formData.kabupaten"
                required
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Provinsi <span class="text-red-500">*</span></label
              >
              <input
                v-model="formData.provinsi"
                required
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Kode Pos</label
              >
              <input
                v-model="formData.kode_pos"
                type="text"
                maxlength="10"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Longitude</label
              >
              <input
                v-model="formData.longitude"
                type="number"
                step="any"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Latitude</label
              >
              <input
                v-model="formData.latitude"
                type="number"
                step="any"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Kontak & Media</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Telepon</label
              >
              <input
                v-model="formData.telepon"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Email</label
              >
              <input
                v-model="formData.email"
                type="email"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Website</label
              >
              <input
                v-model="formData.website"
                type="url"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://contoh.com"
              />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Kapasitas</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Jumlah Santri</label
              >
              <input
                v-model="formData.jumlah_santri"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Jumlah Guru</label
              >
              <input
                v-model="formData.jumlah_guru"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Jumlah Foto (baru)</label
              >
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Upload beberapa foto sekaligus di bawah.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Foto Pondok</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Maksimum 5MB per file, format JPG/PNG.
          </p>

          <!-- Existing Gallery Photos -->
          <div v-if="existingPhotos.gallery.length > 0" class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Galeri Foto ({{ existingPhotos.gallery.length }} foto)
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="photo in existingPhotos.gallery"
                :key="photo.id"
                class="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <img
                  :src="getPhotoUrl(photo.path)"
                  :alt="`Gallery photo`"
                  class="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  @click="openPhotoModal(photo)"
                />
              </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Untuk menghapus foto, hubungi administrator
            </p>
          </div>

          <!-- Upload New Photos -->
          <div class="mb-4">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tambah Foto Baru
            </h3>
            <label
              class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  class="w-10 h-10 mb-3 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0-3 3m3-3v12"
                  />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Klik untuk upload</span> atau drag and drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 5MB per file)</p>
              </div>
              <input
                type="file"
                class="hidden"
                multiple
                accept="image/jpeg,image/png,image/jpg"
                @change="handleFileSelect"
              />
            </label>
          </div>

          <!-- Preview New Photos -->
          <div v-if="selectedFiles.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="relative group rounded-lg overflow-hidden border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20"
            >
              <img
                :src="file.preview"
                :alt="`Preview ${index + 1}`"
                class="w-full h-40 object-cover"
              />
              <div
                class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <button
                  type="button"
                  @click="removeFile(index)"
                  class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
              <div
                class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 truncate"
              >
                {{ file.file.name }}
              </div>
              <div class="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Baru
              </div>
            </div>
          </div>
          <p v-if="selectedFiles.length > 0" class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {{ selectedFiles.length }} foto baru siap diupload
          </p>
        </div>

        <!-- Photo Modal -->
        <div
          v-if="showPhotoModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          @click.self="showPhotoModal = false"
        >
          <div
            class="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
          >
            <!-- Close Button -->
            <button
              @click="showPhotoModal = false"
              class="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 transition-colors"
              title="Tutup"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <!-- Image -->
            <div class="flex items-center justify-center p-8">
              <img
                :src="getPhotoUrl(selectedPhoto.path)"
                alt="Full view"
                class="max-w-full max-h-[75vh] object-contain"
              />
            </div>

            <!-- Image Info -->
            <div
              class="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800"
            >
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <strong>File:</strong> {{ selectedPhoto.path }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex gap-4 justify-end">
          <router-link
            to="/pondok"
            class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            Batal
          </router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Menyimpan...' : isEdit ? 'Update Pondok' : 'Simpan Pondok' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createPondok, getPondokDetail, updatePondok } from '@/services/pondokPesantrenService'
import { API_BASE_URL } from '@/utils/apiConfig'

const router = useRouter()
const route = useRoute()
const isEdit = computed(() => Boolean(route.params.id))

const formData = ref({
  nama: '',
  nsp: '',
  alamat: '',
  desa: '',
  kecamatan: '',
  kabupaten: '',
  provinsi: '',
  kode_pos: '',
  longitude: '',
  latitude: '',
  telepon: '',
  email: '',
  website: '',
  nama_kyai: '',
  jumlah_santri: '',
  jumlah_guru: '',
  tahun_berdiri: '',
})

const selectedFiles = ref([])
const existingPhotos = ref({
  mainPhoto: null,
  gallery: [],
})
const showPhotoModal = ref(false)
const selectedPhoto = ref(null)
const successMessage = ref('')
const error = ref(null)
const loadingDetail = ref(false)
const submitting = ref(false)
const gettingLocation = ref(false)
const locationError = ref('')

const revokePreview = (fileObj) => {
  if (fileObj?.preview) URL.revokeObjectURL(fileObj.preview)
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files || [])
  const validFiles = []

  files.forEach((file) => {
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) return
    if (file.size > 5 * 1024 * 1024) return
    validFiles.push({ file, preview: URL.createObjectURL(file) })
  })

  selectedFiles.value = [...selectedFiles.value, ...validFiles]
  event.target.value = ''
}

const removeFile = (index) => {
  const fileObj = selectedFiles.value[index]
  revokePreview(fileObj)
  selectedFiles.value.splice(index, 1)
}

const openPhotoModal = (photo) => {
  selectedPhoto.value = photo
  showPhotoModal.value = true
}

const getPhotoUrl = (photoPath) => {
  if (!photoPath) return ''
  if (photoPath.startsWith('http')) return photoPath
  if (photoPath.startsWith('uploads/')) return `${API_BASE_URL}/${photoPath}`
  return `${API_BASE_URL}/uploads/${photoPath}`
}

const mapDetailToForm = (detail) => {
  formData.value = {
    nama: detail?.nama || '',
    nsp: detail?.nsp || '',
    alamat: detail?.alamat || '',
    desa: detail?.desa || '',
    kecamatan: detail?.kecamatan || '',
    kabupaten: detail?.kabupaten || '',
    provinsi: detail?.provinsi || '',
    kode_pos: detail?.kode_pos || '',
    longitude: detail?.lokasi?.coordinates?.[0] ?? detail?.longitude ?? '',
    latitude: detail?.lokasi?.coordinates?.[1] ?? detail?.latitude ?? '',
    telepon: detail?.telepon || '',
    email: detail?.email || '',
    website: detail?.website || '',
    nama_kyai: detail?.nama_kyai || '',
    jumlah_santri: detail?.jumlah_santri ?? '',
    jumlah_guru: detail?.jumlah_guru ?? '',
    tahun_berdiri: detail?.tahun_berdiri ?? '',
  }

  existingPhotos.value = {
    mainPhoto: detail?.foto_path ? { path: detail.foto_path } : null,
    gallery: Array.isArray(detail?.foto_pesantren)
      ? detail.foto_pesantren.map((f, idx) => ({ id: idx, path: f.url_photo }))
      : [],
  }

  console.log('API Detail Response:', detail)
  console.log('Extracted Photos:', existingPhotos.value)
}

const loadDetail = async () => {
  if (!isEdit.value) return
  loadingDetail.value = true
  error.value = null

  try {
    const detail = await getPondokDetail(route.params.id)
    mapDetailToForm(detail)
  } catch (err) {
    error.value = err.message || 'Gagal memuat detail pondok pesantren.'
  } finally {
    loadingDetail.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  successMessage.value = ''
  error.value = null

  const payload = { ...formData.value }
  const files = selectedFiles.value.map((item) => item.file)

  try {
    if (isEdit.value) {
      await updatePondok(route.params.id, payload, files)
      successMessage.value = 'Data pondok berhasil diperbarui.'
    } else {
      await createPondok(payload, files)
      successMessage.value = 'Data pondok berhasil disimpan.'
      formData.value = {
        nama: '',
        nsp: '',
        alamat: '',
        desa: '',
        kecamatan: '',
        kabupaten: '',
        provinsi: '',
        kode_pos: '',
        longitude: '',
        latitude: '',
        telepon: '',
        email: '',
        website: '',
        nama_kyai: '',
        jumlah_santri: '',
        jumlah_guru: '',
        tahun_berdiri: '',
      }
      selectedFiles.value.forEach(revokePreview)
      selectedFiles.value = []
    }

    setTimeout(() => router.push('/pondok'), 800)
  } catch (err) {
    error.value = err.message || 'Gagal menyimpan data pondok.'
  } finally {
    submitting.value = false
  }
}

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    locationError.value = 'Browser tidak mendukung geolokasi.'
    return
  }

  gettingLocation.value = true
  locationError.value = ''

  // First attempt with high accuracy
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      formData.value.latitude = latitude.toFixed(6)
      formData.value.longitude = longitude.toFixed(6)
      gettingLocation.value = false
    },
    (error) => {
      // If high accuracy times out, try with lower accuracy
      if (error.code === error.TIMEOUT) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            formData.value.latitude = latitude.toFixed(6)
            formData.value.longitude = longitude.toFixed(6)
            gettingLocation.value = false
            locationError.value = 'Lokasi didapat dengan akurasi standar (bukan presisi tinggi)'
          },
          (retryError) => {
            gettingLocation.value = false
            handleLocationError(retryError)
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 },
        )
      } else {
        gettingLocation.value = false
        handleLocationError(error)
      }
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
  )
}

const handleLocationError = (geoError) => {
  const code = geoError?.code
  if (code === 1) locationError.value = 'Izin lokasi ditolak.'
  else if (code === 2) locationError.value = 'Lokasi tidak tersedia.'
  else if (code === 3)
    locationError.value = 'Permintaan lokasi kedaluwarsa. Pastikan GPS aktif dan coba lagi.'
  else locationError.value = geoError?.message || 'Gagal mengambil lokasi.'
}

onMounted(() => {
  loadDetail()
})

onUnmounted(() => {
  selectedFiles.value.forEach(revokePreview)
})
</script>
