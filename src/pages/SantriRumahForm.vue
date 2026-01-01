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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ isEditMode ? 'Edit Data Rumah' : 'Tambah Data Rumah' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Isi informasi kondisi rumah tempat tinggal santri.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
        ></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Memuat data...</p>
      </div>

      <!-- Form Content -->
      <template v-if="!loading">
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

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Status Kepemilikan -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Status Kepemilikan Rumah
            </h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status Rumah <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.status_rumah"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Status Rumah</option>
                  <option value="milik_sendiri">Milik Sendiri</option>
                  <option value="kontrak">Kontrak</option>
                  <option value="menumpang">Menumpang</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Kondisi Fisik Bangunan -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Kondisi Fisik Bangunan
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Jenis Lantai -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jenis Lantai <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.jenis_lantai"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Jenis Lantai</option>
                  <option value="tanah">Tanah</option>
                  <option value="semen">Semen</option>
                  <option value="keramik">Keramik</option>
                </select>
              </div>

              <!-- Jenis Dinding -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jenis Dinding <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.jenis_dinding"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Jenis Dinding</option>
                  <option value="bambu">Bambu</option>
                  <option value="kayu">Kayu</option>
                  <option value="tembok">Tembok</option>
                </select>
              </div>

              <!-- Jenis Atap -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jenis Atap <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.jenis_atap"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Jenis Atap</option>
                  <option value="rumbia">Rumbia</option>
                  <option value="seng">Seng</option>
                  <option value="genteng">Genteng</option>
                  <option value="beton">Beton</option>
                </select>
              </div>

              <!-- Akses Air Bersih -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Akses Air Bersih <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.akses_air_bersih"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Akses Air Bersih</option>
                  <option value="layak">Layak</option>
                  <option value="tidak_layak">Tidak Layak</option>
                </select>
              </div>

              <!-- Daya Listrik -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daya Listrik (VA)
                </label>
                <select
                  v-model="formData.daya_listrik_va"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Daya Listrik (Opsional)</option>
                  <option value="450">450 VA</option>
                  <option value="900">900 VA</option>
                  <option value="1300">1300 VA</option>
                  <option value="2200">2200 VA</option>
                  <option value="3500">3500 VA</option>
                  <option value="5500">5500 VA</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Foto Rumah -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Foto Rumah</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Unggah foto rumah untuk dokumentasi (opsional)
            </p>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pilih Foto
              </label>
              <input
                @change="handleFileChange"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Format: JPG, PNG, WEBP. Maksimal 5MB per file. Bisa upload multiple foto.
              </p>

              <!-- Existing Photos (Edit Mode) -->
              <div v-if="isEditMode && existingPhotos.length > 0" class="mt-4">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Foto yang sudah diupload ({{ existingPhotos.length }} foto)
                </p>
                <div class="grid grid-cols-4 gap-2">
                  <div
                    v-for="(photo, index) in existingPhotos"
                    :key="photo.id"
                    class="relative group"
                  >
                    <img
                      :src="getPhotoUrl(photo.url_photo)"
                      :alt="photo.nama_file"
                      class="w-full h-24 object-cover rounded border-2 border-blue-300 dark:border-blue-600"
                    />
                    <div
                      class="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded"
                    >
                      Existing
                    </div>
                  </div>
                </div>
              </div>

              <!-- Preview Foto -->
              <div v-if="photos && photos.length > 0" class="mt-4">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Preview ({{ photos.length }} foto)
                </p>
                <div class="grid grid-cols-4 gap-2">
                  <div v-for="(photo, index) in photos" :key="index" class="relative group">
                    <img
                      :src="photo.preview"
                      :alt="`Preview ${index + 1}`"
                      class="w-full h-24 object-cover rounded border border-gray-300 dark:border-gray-600"
                    />
                    <button
                      @click="removePhoto(index)"
                      type="button"
                      class="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
              {{ submitting ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Simpan Data' }}
            </button>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createRumah, updateRumah, getRumahDetail } from '@/services/santriRumahService'
import { API_BASE_URL } from '@/utils/apiConfig'

const route = useRoute()
const router = useRouter()

const santriId = route.params.santriId
const rumahId = route.params.rumahId
const apiBaseUrl = API_BASE_URL

const isEditMode = computed(() => !!rumahId)

const loading = ref(false)
const submitting = ref(false)
const error = ref(null)
const successMessage = ref(null)

const formData = ref({
  santri_id: santriId,
  status_rumah: '',
  jenis_lantai: '',
  jenis_dinding: '',
  jenis_atap: '',
  akses_air_bersih: '',
  daya_listrik_va: '',
})

const photos = ref([])
const existingPhotos = ref([])

onMounted(async () => {
  if (isEditMode.value) {
    await loadRumahData()
  }
})

const loadRumahData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getRumahDetail(rumahId)

    if (response.success && response.data) {
      const data = response.data
      formData.value = {
        santri_id: data.santri_id,
        status_rumah: data.status_rumah || '',
        jenis_lantai: data.jenis_lantai || '',
        jenis_dinding: data.jenis_dinding || '',
        jenis_atap: data.jenis_atap || '',
        akses_air_bersih: data.akses_air_bersih || '',
        daya_listrik_va: data.daya_listrik_va || '',
      }

      // Load existing photos
      console.log('Raw foto_rumah data:', data.foto_rumah)

      if (data.foto_rumah) {
        let photosArray = []

        // If foto_rumah is a string, it might be a single tuple or comma-separated tuples
        if (typeof data.foto_rumah === 'string') {
          // Check if it's a single tuple format: "(path,filename)"
          const singleMatch = data.foto_rumah.match(/^\(([^,]+),([^)]+)\)$/)
          if (singleMatch) {
            photosArray = [
              {
                url_photo: singleMatch[1].trim(),
                nama_file: singleMatch[2].trim(),
                id: Math.random().toString(36),
              },
            ]
          }
        }
        // If it's an array
        else if (Array.isArray(data.foto_rumah) && data.foto_rumah.length > 0) {
          photosArray = data.foto_rumah
            .map((item) => {
              // If already an object with url_photo, use it directly
              if (typeof item === 'object' && item.url_photo) {
                return item
              }
              // If it's a string tuple like "(path,filename)", parse it
              if (typeof item === 'string') {
                const match = item.match(/^\(([^,]+),([^)]+)\)$/)
                if (match) {
                  return {
                    url_photo: match[1].trim(),
                    nama_file: match[2].trim(),
                    id: Math.random().toString(36),
                  }
                }
              }
              return item
            })
            .filter((item) => item && item.url_photo) // Filter out invalid items
        }

        console.log('Parsed photos:', photosArray)
        existingPhotos.value = photosArray
      }
    }
  } catch (err) {
    error.value = err.message || 'Gagal memuat data rumah'
  } finally {
    loading.value = false
  }
}

// Get full photo URL with normalization (handles backslashes)
const getPhotoUrl = (url) => {
  if (!url) return ''
  // Normalize backslashes to forward slashes
  let normalized = url.replace(/\\/g, '/')
  // If already absolute URL
  if (/^https?:\/\//i.test(normalized)) return normalized
  // Ensure leading slash
  if (!normalized.startsWith('/')) normalized = `/${normalized}`
  return `${API_BASE_URL}${normalized}`
}

const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  const newPhotos = []

  files.forEach((file) => {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      error.value = `File ${file.name} terlalu besar (maksimal 5MB)`
      return
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      error.value = `File ${file.name} format tidak didukung`
      return
    }

    newPhotos.push({
      file: file,
      preview: URL.createObjectURL(file),
    })
  })

  photos.value = [...photos.value, ...newPhotos]
}

const removePhoto = (index) => {
  if (photos.value[index]) {
    URL.revokeObjectURL(photos.value[index].preview)
    photos.value.splice(index, 1)
  }
}

const handleSubmit = async () => {
  error.value = null
  successMessage.value = null
  submitting.value = true

  try {
    let payload

    // Use FormData if there are photos, otherwise use JSON
    if (photos.value.length > 0) {
      payload = new FormData()
      payload.append('santri_id', formData.value.santri_id)
      payload.append('status_rumah', formData.value.status_rumah)
      payload.append('jenis_lantai', formData.value.jenis_lantai)
      payload.append('jenis_dinding', formData.value.jenis_dinding)
      payload.append('jenis_atap', formData.value.jenis_atap)
      payload.append('akses_air_bersih', formData.value.akses_air_bersih)
      payload.append('daya_listrik_va', formData.value.daya_listrik_va)

      // Append photos with indexed field names
      photos.value.forEach((photo, index) => {
        payload.append(`fotos`, photo.file)
      })
    } else {
      payload = {
        santri_id: formData.value.santri_id,
        status_rumah: formData.value.status_rumah,
        jenis_lantai: formData.value.jenis_lantai,
        jenis_dinding: formData.value.jenis_dinding,
        jenis_atap: formData.value.jenis_atap,
        akses_air_bersih: formData.value.akses_air_bersih,
        daya_listrik_va: formData.value.daya_listrik_va,
      }
    }

    console.group('🏠 Rumah Form Submit')
    console.log('Has photos:', photos.value.length > 0)
    console.log('Photo count:', photos.value.length)
    console.log('Is FormData:', payload instanceof FormData)
    if (payload instanceof FormData) {
      console.log('FormData contents:')
      for (let [key, value] of payload.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value)
      }
    }
    console.groupEnd()

    let response
    if (isEditMode.value) {
      response = await updateRumah(rumahId, payload)
    } else {
      response = await createRumah(payload)
    }

    console.log('📥 Response from API:', response)
    console.log('📸 foto_rumah in response:', response?.data?.foto_rumah)

    if (response.success) {
      successMessage.value = isEditMode.value
        ? 'Data rumah berhasil diperbarui!'
        : 'Data rumah berhasil disimpan!'

      setTimeout(() => {
        router.push(`/santri/edit/${santriId}`)
      }, 1500)
    }
  } catch (err) {
    console.error('Error submitting rumah:', err)
    error.value = err.message || 'Gagal menyimpan data rumah'
  } finally {
    submitting.value = false
  }
}
</script>
