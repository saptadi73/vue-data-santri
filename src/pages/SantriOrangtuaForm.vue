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
          {{ isEditMode ? 'Edit Data Orang Tua' : 'Tambah Data Orang Tua' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Isi data orang tua/wali santri dengan lengkap
        </p>
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
        v-else-if="loadError"
        class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4"
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
          <p class="text-red-800 dark:text-red-300">{{ loadError }}</p>
        </div>
      </div>

      <!-- Form Content -->
      <template v-else>
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
          <!-- Basic Information -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Informasi Dasar
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nama -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Lengkap <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.nama"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <!-- NIK -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  NIK
                </label>
                <input
                  v-model="formData.nik"
                  type="text"
                  maxlength="16"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="16 digit NIK"
                />
              </div>

              <!-- Hubungan -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hubungan <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.hubungan"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Hubungan</option>
                  <option value="ayah">Ayah</option>
                  <option value="ibu">Ibu</option>
                  <option value="wali">Wali</option>
                </select>
              </div>

              <!-- Pendidikan -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pendidikan Terakhir
                </label>
                <select
                  v-model="formData.pendidikan"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Pendidikan</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                  <option value="Tidak Sekolah">Tidak Sekolah</option>
                </select>
              </div>

              <!-- Pekerjaan -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pekerjaan
                </label>
                <input
                  v-model="formData.pekerjaan"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Contoh: Petani, Guru, Wiraswasta"
                />
              </div>

              <!-- Pendapatan Bulanan -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pendapatan Bulanan (Rp)
                </label>
                <input
                  v-model.number="formData.pendapatan_bulanan"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="0"
                />
              </div>

              <!-- Status Hidup -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.status_hidup"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Status</option>
                  <option value="hidup">Hidup</option>
                  <option value="meninggal">Meninggal</option>
                </select>
              </div>

              <!-- Kontak Telepon -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nomor Telepon
                </label>
                <input
                  v-model="formData.kontak_telepon"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>
          </div>

          <!-- Photo Upload -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Foto Orang Tua/Wali
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Upload foto (format: JPG, PNG, max 5MB per file, opsional)
            </p>

            <!-- Existing Photos (Edit Mode) -->
            <div v-if="isEditMode && existingPhotos.length > 0" class="mb-4">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Foto yang sudah diupload ({{ existingPhotos.length }} foto)
              </p>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  v-for="(photo, index) in existingPhotos"
                  :key="photo.id"
                  class="relative group"
                >
                  <img
                    :src="getPhotoUrl(photo.url_photo)"
                    :alt="photo.nama_file"
                    class="w-full h-32 object-cover rounded border-2 border-blue-300 dark:border-blue-600"
                  />
                  <div
                    class="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded"
                  >
                    Existing
                  </div>
                </div>
              </div>
            </div>

            <!-- File Input -->
            <div class="mb-4">
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">Klik untuk upload</span> atau drag and drop
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 5MB)</p>
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

            <!-- Preview Selected Photos -->
            <div v-if="selectedFiles.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="(file, index) in selectedFiles"
                :key="index"
                class="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
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
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Simpan Data' }}
            </button>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createOrangtua, updateOrangtua, getOrangtuaDetail } from '@/services/orangtuaService'
import { API_BASE_URL } from '@/utils/apiConfig'

const route = useRoute()
const router = useRouter()

const santriId = route.params.santriId
const orangtuaId = route.params.orangtuaId

const loading = ref(false)
const loadError = ref(null)
const submitting = ref(false)
const error = ref(null)
const successMessage = ref(null)

const isEditMode = computed(() => !!orangtuaId)

const formData = ref({
  santri_id: santriId,
  nama: '',
  nik: '',
  hubungan: '',
  pendidikan: '',
  pekerjaan: '',
  pendapatan_bulanan: null,
  status_hidup: '',
  kontak_telepon: '',
})

const selectedFiles = ref([])
const existingPhotos = ref([])

// Load data if in edit mode
onMounted(async () => {
  if (isEditMode.value) {
    await loadOrangtuaData()
  }
})

const loadOrangtuaData = async () => {
  loading.value = true
  loadError.value = null

  try {
    const response = await getOrangtuaDetail(orangtuaId)

    if (response.success && response.data) {
      const data = response.data
      formData.value = {
        santri_id: data.santri_id,
        nama: data.nama || '',
        nik: data.nik || '',
        hubungan: data.hubungan || '',
        pendidikan: data.pendidikan || '',
        pekerjaan: data.pekerjaan || '',
        pendapatan_bulanan: data.pendapatan_bulanan || null,
        status_hidup: data.status_hidup || '',
        kontak_telepon: data.kontak_telepon || '',
      }

      // Load existing photos
      console.log('Raw foto_orangtua data:', data.foto_orangtua, 'Type:', typeof data.foto_orangtua)

      if (data.foto_orangtua) {
        let photosArray = []

        // If foto_orangtua is a string, it might be a single tuple or comma-separated tuples
        if (typeof data.foto_orangtua === 'string') {
          // Check if it's a single tuple format: "(path,filename)"
          const singleMatch = data.foto_orangtua.match(/^\(([^,]+),([^)]+)\)$/)
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
        else if (Array.isArray(data.foto_orangtua) && data.foto_orangtua.length > 0) {
          photosArray = data.foto_orangtua
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
    loadError.value = err.message || 'Gagal memuat data orangtua'
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

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  files.forEach((file) => {
    if (file.size > 5 * 1024 * 1024) {
      error.value = `File ${file.name} terlalu besar (max 5MB)`
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      selectedFiles.value.push({
        file: file,
        preview: e.target.result,
      })
    }
    reader.readAsDataURL(file)
  })

  event.target.value = ''
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const handleSubmit = async () => {
  error.value = null
  successMessage.value = null
  submitting.value = true

  try {
    const dataToSubmit = { ...formData.value }

    // Add selected files if any (both create and edit mode)
    if (selectedFiles.value.length > 0) {
      dataToSubmit.fotos = selectedFiles.value.map((f) => f.file)
    }

    let response
    if (isEditMode.value) {
      response = await updateOrangtua(orangtuaId, dataToSubmit)
    } else {
      response = await createOrangtua(dataToSubmit)
    }

    console.log('📥 Response from API:', response)
    console.log('📸 foto_orangtua in response:', response?.data?.foto_orangtua)

    if (response.success) {
      successMessage.value = isEditMode.value
        ? 'Data orangtua berhasil diperbarui!'
        : 'Data orangtua berhasil disimpan!'

      setTimeout(() => {
        router.push(`/santri/edit/${santriId}`)
      }, 1500)
    }
  } catch (err) {
    error.value = err.message || 'Gagal menyimpan data orangtua'
  } finally {
    submitting.value = false
  }
}
</script>
