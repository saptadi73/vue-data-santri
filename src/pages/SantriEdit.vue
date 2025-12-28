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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Data Santri</h1>
        <p class="text-gray-600 dark:text-gray-400">Perbarui data santri dengan teliti</p>
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
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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

          <!-- Existing Photos -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Foto yang Sudah Ada
            </h2>
            <div v-if="existingPhotos.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="photo in existingPhotos"
                :key="photo.id"
                class="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <img
                  :src="getPhotoUrl(photo.url_photo)"
                  :alt="photo.nama_file"
                  class="w-full h-40 object-cover"
                />
                <div
                  class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3"
                >
                  <button
                    type="button"
                    @click="openPhotoModal(photo)"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Lihat
                  </button>
                  <button
                    type="button"
                    @click="confirmDeletePhoto(photo)"
                    :disabled="deletingPhotoId === photo.id"
                    class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {{ deletingPhotoId === photo.id ? 'Menghapus...' : 'Hapus' }}
                  </button>
                </div>
                <div
                  class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 truncate"
                >
                  {{ photo.nama_file }}
                </div>
              </div>
            </div>
            <p v-else class="text-gray-500 text-center py-8">Belum ada foto yang diupload</p>
          </div>

          <!-- Add New Photos -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Tambah Foto Baru
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Upload foto tambahan (format: JPG, PNG, max 5MB per file)
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
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG (MAX. 5MB per file)
                  </p>
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
            <div v-if="newFiles.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="(file, index) in newFiles"
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
                    @click="removeNewFile(index)"
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
              {{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </template>
    </div>

    <!-- Delete Photo Confirmation Modal -->
    <div
      v-if="showDeletePhotoModal"
      class="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50"
      @click="showDeletePhotoModal = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-700 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800"
        @click.stop
      >
        <div class="mt-3 text-center">
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30"
          >
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4">
            Hapus Foto
          </h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Apakah Anda yakin ingin menghapus foto ini? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div class="flex gap-3 justify-center mt-4">
            <button
              @click="showDeletePhotoModal = false"
              class="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              @click="handleDeletePhoto"
              :disabled="deletingPhotoId"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Photo View Modal -->
    <div
      v-if="showPhotoModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      @click="showPhotoModal = false"
    >
      <div
        class="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto"
        @click.stop
      >
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

        <div class="flex items-center justify-center p-8">
          <img
            :src="getPhotoUrl(photoToView?.url_photo)"
            :alt="photoToView?.nama_file || 'Full view'"
            class="max-w-full max-h-[75vh] object-contain"
          />
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <strong>File:</strong> {{ photoToView?.nama_file }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSantriDetail, updateSantri, deleteSantriPhoto } from '@/services/santriService'
import { API_BASE_URL } from '@/utils/apiConfig'

const route = useRoute()
const router = useRouter()

const santriId = route.params.id

const loading = ref(true)
const loadError = ref(null)
const submitting = ref(false)
const error = ref(null)
const successMessage = ref(null)
const gettingLocation = ref(false)
const locationError = ref(null)

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

const existingPhotos = ref([])
const newFiles = ref([])
const showDeletePhotoModal = ref(false)
const photoToDelete = ref(null)
const deletingPhotoId = ref(null)
const showPhotoModal = ref(false)
const photoToView = ref(null)
const openPhotoModal = (photo) => {
  photoToView.value = photo
  showPhotoModal.value = true
}

// Load santri data
const loadSantriData = async () => {
  loading.value = true
  loadError.value = null

  try {
    const response = await getSantriDetail(santriId)

    if (response.success) {
      const data = response.data

      // Populate form
      formData.value = {
        nama: data.nama || '',
        nik: data.nik || '',
        no_kk: data.no_kk || '',
        tempat_lahir: data.tempat_lahir || '',
        tanggal_lahir: data.tanggal_lahir || '',
        jenis_kelamin: data.jenis_kelamin || '',
        status_tinggal: data.status_tinggal || '',
        lama_mondok_tahun: data.lama_mondok_tahun || null,
        provinsi: data.provinsi || '',
        kabupaten: data.kabupaten || '',
        kecamatan: data.kecamatan || '',
        desa: data.desa || '',
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      }

      existingPhotos.value = data.foto_santri || []
    }
  } catch (err) {
    loadError.value = err.message || 'Gagal memuat data santri'
    console.error('Error loading santri:', err)
  } finally {
    loading.value = false
  }
}

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

// Handle file selection
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)

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
      newFiles.value.push({
        file: file,
        preview: e.target.result,
      })
    }
    reader.readAsDataURL(file)
  })

  // Reset input
  event.target.value = ''
}

// Remove new file
const removeNewFile = (index) => {
  newFiles.value.splice(index, 1)
}

// Confirm delete photo
const confirmDeletePhoto = (photo) => {
  photoToDelete.value = photo
  showDeletePhotoModal.value = true
}

// Handle delete photo
const handleDeletePhoto = async () => {
  if (!photoToDelete.value) return

  deletingPhotoId.value = photoToDelete.value.id

  try {
    await deleteSantriPhoto(photoToDelete.value.id)

    // Remove from existing photos
    existingPhotos.value = existingPhotos.value.filter((p) => p.id !== photoToDelete.value.id)

    showDeletePhotoModal.value = false
    photoToDelete.value = null
    successMessage.value = 'Foto berhasil dihapus'

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (err) {
    error.value = err.message || 'Gagal menghapus foto'
  } finally {
    deletingPhotoId.value = null
  }
}

// Handle form submission
const handleSubmit = async () => {
  error.value = null
  successMessage.value = null
  submitting.value = true

  try {
    // Prepare files
    const files = newFiles.value.map((item) => item.file)

    // Submit data
    const response = await updateSantri(santriId, formData.value, files)

    if (response.success) {
      successMessage.value = 'Data santri berhasil diperbarui!'

      // Clear new files
      newFiles.value = []

      // Reload data to get updated photos
      await loadSantriData()

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/santri')
      }, 2000)
    }
  } catch (err) {
    error.value = err.message || 'Gagal memperbarui data santri'
    console.error('Error updating santri:', err)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadSantriData()
})
</script>
