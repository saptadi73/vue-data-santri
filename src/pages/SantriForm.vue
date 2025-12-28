<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <router-link
          to="/santri"
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
          Kembali ke Daftar Santri
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tambah Santri Baru</h1>
        <p class="text-gray-600 dark:text-gray-400">Lengkapi data santri dengan teliti</p>
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

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Personal Information -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Pribadi</h2>
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
                NIK <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.nik"
                type="text"
                required
                pattern="[0-9]{16}"
                maxlength="16"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="16 digit NIK"
              />
            </div>

            <!-- No KK -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >No. KK</label
              >
              <input
                v-model="formData.no_kk"
                type="text"
                pattern="[0-9]{16}"
                maxlength="16"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="16 digit No. KK"
              />
            </div>

            <!-- Tempat Lahir -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Tempat Lahir</label
              >
              <input
                v-model="formData.tempat_lahir"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Kota/kabupaten kelahiran"
              />
            </div>

            <!-- Tanggal Lahir -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tanggal Lahir <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.tanggal_lahir"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <!-- Jenis Kelamin -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jenis Kelamin <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.jenis_kelamin"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih...</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <!-- Status Tinggal -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Status Tinggal</label
              >
              <select
                v-model="formData.status_tinggal"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih...</option>
                <option value="mondok">Mondok</option>
                <option value="pulang_pergi">Pulang Pergi</option>
              </select>
            </div>

            <!-- Lama Mondok -->
            <div v-if="formData.status_tinggal === 'mondok'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lama Mondok (Tahun)
              </label>
              <input
                v-model.number="formData.lama_mondok_tahun"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Contoh: 2"
              />
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Alamat</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Provinsi -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Provinsi <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.provinsi"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Nama provinsi"
              />
            </div>

            <!-- Kabupaten -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kabupaten/Kota <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.kabupaten"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Nama kabupaten/kota"
              />
            </div>

            <!-- Kecamatan -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Kecamatan</label
              >
              <input
                v-model="formData.kecamatan"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Nama kecamatan"
              />
            </div>

            <!-- Desa -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Desa/Kelurahan</label
              >
              <input
                v-model="formData.desa"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Nama desa/kelurahan"
              />
            </div>
          </div>
        </div>

        <!-- GPS Coordinates -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">GPS Coordinates</h3>
            <button
              type="button"
              @click="getCurrentLocation"
              :disabled="gettingLocation"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <span class="icon text-base">{{
                gettingLocation ? 'hourglass_empty' : 'my_location'
              }}</span>
              <span>{{ gettingLocation ? 'Mengambil Lokasi...' : 'Get GPS Coordinate' }}</span>
            </button>
          </div>

          <div
            v-if="locationError"
            class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-300"
          >
            {{ locationError }}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Latitude -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Latitude (Opsional)
              </label>
              <input
                v-model.number="formData.latitude"
                type="number"
                step="any"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="-6.92"
              />
            </div>

            <!-- Longitude -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Longitude (Opsional)
              </label>
              <input
                v-model.number="formData.longitude"
                type="number"
                step="any"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="107.61"
              />
            </div>
          </div>
        </div>

        <!-- Photo Upload -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Foto Santri</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Upload maksimal 5 foto (format: JPG, PNG, max 5MB per file)
          </p>

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

          <!-- Preview Photos -->
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
            to="/santri"
            class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            Batal
          </router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Menyimpan...' : 'Simpan Data Santri' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createSantri } from '@/services/santriService'

const router = useRouter()

const formData = ref({
  nama: '',
  nik: '',
  no_kk: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  jenis_kelamin: '',
  status_tinggal: '',
  lama_mondok_tahun: null,
  provinsi: '',
  kabupaten: '',
  kecamatan: '',
  desa: '',
  latitude: null,
  longitude: null,
})

const selectedFiles = ref([])
const submitting = ref(false)
const error = ref(null)
const successMessage = ref(null)
const gettingLocation = ref(false)
const locationError = ref(null)

// Get current GPS location
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    locationError.value = 'Geolocation tidak didukung oleh browser Anda'
    return
  }

  gettingLocation.value = true
  locationError.value = null

  navigator.geolocation.getCurrentPosition(
    (position) => {
      formData.value.latitude = parseFloat(position.coords.latitude.toFixed(6))
      formData.value.longitude = parseFloat(position.coords.longitude.toFixed(6))
      gettingLocation.value = false
    },
    (error) => {
      gettingLocation.value = false
      switch (error.code) {
        case error.PERMISSION_DENIED:
          locationError.value = 'Akses lokasi ditolak. Mohon izinkan akses lokasi di browser Anda.'
          break
        case error.POSITION_UNAVAILABLE:
          locationError.value = 'Informasi lokasi tidak tersedia.'
          break
        case error.TIMEOUT:
          locationError.value = 'Waktu permintaan lokasi habis.'
          break
        default:
          locationError.value = 'Terjadi kesalahan saat mengambil lokasi.'
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
  )
}

// Handle file selection
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)

  // Validate number of files
  if (selectedFiles.value.length + files.length > 5) {
    error.value = 'Maksimal 5 foto yang dapat diupload'
    return
  }

  // Validate each file
  files.forEach((file) => {
    // Check file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      error.value = `File ${file.name} bukan format gambar yang valid`
      return
    }

    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      error.value = `File ${file.name} melebihi ukuran maksimal 5MB`
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedFiles.value.push({
        file: file,
        preview: e.target.result,
      })
    }
    reader.readAsDataURL(file)
  })

  // Reset input
  event.target.value = ''
}

// Remove file
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

// Handle form submission
const handleSubmit = async () => {
  error.value = null
  successMessage.value = null
  submitting.value = true

  try {
    // Prepare files
    const files = selectedFiles.value.map((item) => item.file)

    // Submit data
    const response = await createSantri(formData.value, files)

    if (response.success) {
      successMessage.value = 'Data santri berhasil disimpan!'

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/santri')
      }, 2000)
    }
  } catch (err) {
    error.value = err.message || 'Gagal menyimpan data santri'
    console.error('Error creating santri:', err)
  } finally {
    submitting.value = false
  }
}
</script>
