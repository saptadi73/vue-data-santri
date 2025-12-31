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

          <!-- Next Step: Fill Parent Data -->
          <div
            class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-6"
          >
            <div class="flex items-start gap-4">
              <div class="shrink-0">
                <svg
                  class="h-6 w-6 text-blue-600 dark:text-blue-400"
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
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Langkah Selanjutnya
                </h3>
                <p class="text-blue-800 dark:text-blue-400 mb-2">
                  Setelah menyimpan data santri, lanjutkan dengan mengisi atau mengedit data orang
                  tua/wali santri.
                </p>
                <p v-if="checkingOrangtua" class="text-sm text-blue-700 dark:text-blue-300 mb-4">
                  Memeriksa keberadaan data orang tua...
                </p>
                <p v-else class="text-sm text-blue-800 dark:text-blue-300 mb-4">
                  {{
                    orangtuaExists
                      ? 'Data orang tua ditemukan. Klik untuk mengedit.'
                      : 'Belum ada data orang tua. Klik untuk menambahkan.'
                  }}
                </p>
                <router-link
                  :to="
                    orangtuaExists
                      ? `/santri/${santriId}/orangtua/edit/${orangtuaId}`
                      : `/santri/${santriId}/orangtua/tambah`
                  "
                  :class="[
                    'inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition',
                    checkingOrangtua
                      ? 'bg-blue-300 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white',
                  ]"
                  :aria-disabled="checkingOrangtua"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.697"
                    />
                  </svg>
                  {{
                    checkingOrangtua
                      ? 'Memuat...'
                      : orangtuaExists
                        ? 'Edit Data Orang Tua'
                        : 'Isi Data Orang Tua'
                  }}
                </router-link>
                <p v-if="orangtuaCheckError" class="mt-3 text-sm text-red-700 dark:text-red-300">
                  {{ orangtuaCheckError }}
                </p>
              </div>
            </div>
          </div>

          <!-- Next Step: Asset Data -->
          <div
            class="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6"
          >
            <div class="flex items-start gap-4">
              <div class="shrink-0">
                <svg
                  class="h-6 w-6 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c1.657 0 3-.895 3-2s-1.343-2-3-2-3 .895-3 2 1.343 2 3 2zm0 0v4m-4 6h8a2 2 0 002-2v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-emerald-900 dark:text-emerald-200 mb-2">
                  Data Asset Santri
                </h3>
                <p class="text-emerald-800 dark:text-emerald-300 mb-2">
                  Lengkapi informasi aset yang dimiliki santri untuk mendukung analisis kebutuhan.
                </p>
                <p v-if="checkingAsset" class="text-sm text-emerald-700 dark:text-emerald-200 mb-4">
                  Memeriksa keberadaan data aset...
                </p>
                <p v-else class="text-sm text-emerald-800 dark:text-emerald-200 mb-4">
                  {{
                    assetExists
                      ? 'Data aset ditemukan. Klik untuk mengedit.'
                      : 'Belum ada data aset. Klik untuk menambahkan.'
                  }}
                </p>
                <router-link
                  :to="
                    assetExists
                      ? `/santri/${santriId}/asset/edit/${assetId}`
                      : `/santri/${santriId}/asset/tambah`
                  "
                  :class="[
                    'inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition',
                    checkingAsset
                      ? 'bg-emerald-300 text-white cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white',
                  ]"
                  :aria-disabled="checkingAsset"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  {{
                    checkingAsset ? 'Memuat...' : assetExists ? 'Edit Data Aset' : 'Isi Data Aset'
                  }}
                </router-link>
                <p v-if="assetCheckError" class="mt-3 text-sm text-red-700 dark:text-red-300">
                  {{ assetCheckError }}
                </p>
              </div>
            </div>
          </div>

          <!-- Next Step: Rumah Data -->
          <div
            class="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-6"
          >
            <div class="flex items-start gap-4">
              <div class="shrink-0">
                <svg
                  class="h-6 w-6 text-amber-600 dark:text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-2">
                  Data Kondisi Rumah
                </h3>
                <p class="text-amber-800 dark:text-amber-300 mb-2">
                  Lengkapi informasi kondisi rumah tempat tinggal santri.
                </p>
                <p v-if="checkingRumah" class="text-sm text-amber-700 dark:text-amber-200 mb-4">
                  Memeriksa keberadaan data rumah...
                </p>
                <p v-else class="text-sm text-amber-800 dark:text-amber-200 mb-4">
                  {{
                    rumahExists
                      ? 'Data rumah ditemukan. Klik untuk mengedit.'
                      : 'Belum ada data rumah. Klik untuk menambahkan.'
                  }}
                </p>
                <router-link
                  :to="
                    rumahExists
                      ? `/santri/${santriId}/rumah/edit/${rumahId}`
                      : `/santri/${santriId}/rumah/tambah`
                  "
                  :class="[
                    'inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition',
                    checkingRumah
                      ? 'bg-amber-300 text-white cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700 text-white',
                  ]"
                  :aria-disabled="checkingRumah"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  {{
                    checkingRumah ? 'Memuat...' : rumahExists ? 'Edit Data Rumah' : 'Isi Data Rumah'
                  }}
                </router-link>
                <p v-if="rumahCheckError" class="mt-3 text-sm text-red-700 dark:text-red-300">
                  {{ rumahCheckError }}
                </p>
              </div>
            </div>
          </div>

          <!-- Next Step: Kesehatan Data -->
          <div
            class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6"
          >
            <div class="flex items-start gap-4">
              <div class="shrink-0">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
                  Data Kesehatan Santri
                </h3>
                <p class="text-red-800 dark:text-red-300 mb-2">
                  Lengkapi informasi kesehatan santri untuk pemantauan kesehatan.
                </p>
                <p v-if="checkingKesehatan" class="text-sm text-red-700 dark:text-red-200 mb-4">
                  Memeriksa keberadaan data kesehatan...
                </p>
                <p v-else class="text-sm text-red-800 dark:text-red-200 mb-4">
                  {{
                    kesehatanExists
                      ? 'Data kesehatan ditemukan. Klik untuk mengedit.'
                      : 'Belum ada data kesehatan. Klik untuk menambahkan.'
                  }}
                </p>
                <router-link
                  :to="
                    kesehatanExists
                      ? `/santri/${santriId}/kesehatan/edit/${kesehataanId}`
                      : `/santri/${santriId}/kesehatan/tambah`
                  "
                  :class="[
                    'inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition',
                    checkingKesehatan
                      ? 'bg-red-300 text-white cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white',
                  ]"
                  :aria-disabled="checkingKesehatan"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {{
                    checkingKesehatan
                      ? 'Memuat...'
                      : kesehatanExists
                        ? 'Edit Data Kesehatan'
                        : 'Isi Data Kesehatan'
                  }}
                </router-link>
                <p v-if="kesehataanCheckError" class="mt-3 text-sm text-red-700 dark:text-red-300">
                  {{ kesehataanCheckError }}
                </p>
              </div>
            </div>
          </div>

          <!-- Next Step: Bansos Data -->
          <div
            class="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-6"
          >
            <div class="flex items-start gap-4">
              <div class="shrink-0">
                <svg
                  class="h-6 w-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-2">
                  Data Bantuan Sosial
                </h3>
                <p class="text-purple-800 dark:text-purple-300 mb-2">
                  Lengkapi informasi bantuan sosial yang diterima santri.
                </p>
                <p v-if="checkingBansos" class="text-sm text-purple-700 dark:text-purple-200 mb-4">
                  Memeriksa keberadaan data bantuan sosial...
                </p>
                <p v-else class="text-sm text-purple-800 dark:text-purple-200 mb-4">
                  {{
                    bansosExists
                      ? 'Data bantuan sosial ditemukan. Klik untuk mengedit.'
                      : 'Belum ada data bantuan sosial. Klik untuk menambahkan.'
                  }}
                </p>
                <router-link
                  :to="
                    bansosExists
                      ? `/santri/${santriId}/bansos/edit/${bansosId}`
                      : `/santri/${santriId}/bansos/tambah`
                  "
                  :class="[
                    'inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition',
                    checkingBansos
                      ? 'bg-purple-300 text-white cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white',
                  ]"
                  :aria-disabled="checkingBansos"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{
                    checkingBansos
                      ? 'Memuat...'
                      : bansosExists
                        ? 'Edit Data Bantuan Sosial'
                        : 'Isi Data Bantuan Sosial'
                  }}
                </router-link>
                <p v-if="bansosCheckError" class="mt-3 text-sm text-red-700 dark:text-red-300">
                  {{ bansosCheckError }}
                </p>
              </div>
            </div>
          </div>

          <!-- Next Step: Pembiayaan Data -->
          <div
            class="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6"
          >
            <div class="flex items-start gap-4">
              <div class="shrink-0">
                <svg
                  class="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-indigo-900 dark:text-indigo-200 mb-2">
                  Data Pembiayaan
                </h3>
                <p class="text-indigo-800 dark:text-indigo-300 mb-2">
                  Lengkapi informasi pembiayaan pendidikan santri.
                </p>
                <p
                  v-if="checkingPembiayaan"
                  class="text-sm text-indigo-700 dark:text-indigo-200 mb-4"
                >
                  Memeriksa keberadaan data pembiayaan...
                </p>
                <p v-else class="text-sm text-indigo-800 dark:text-indigo-200 mb-4">
                  {{
                    pembiayaanExists
                      ? 'Data pembiayaan ditemukan. Klik untuk mengelola.'
                      : 'Belum ada data pembiayaan. Klik untuk menambahkan.'
                  }}
                </p>
                <router-link
                  :to="`/santri/${santriId}/pembiayaan`"
                  :class="[
                    'inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition',
                    checkingPembiayaan
                      ? 'bg-indigo-300 text-white cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white',
                  ]"
                  :aria-disabled="checkingPembiayaan"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{
                    checkingPembiayaan
                      ? 'Memuat...'
                      : pembiayaanExists
                        ? 'Kelola Data Pembiayaan'
                        : 'Isi Data Pembiayaan'
                  }}
                </router-link>
                <p v-if="pembiayaanCheckError" class="mt-3 text-sm text-red-700 dark:text-red-300">
                  {{ pembiayaanCheckError }}
                </p>
              </div>
            </div>
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
import { getOrangtuaList } from '@/services/orangtuaService'
import { getSantriAssets } from '@/services/santriAssetService'
import { getRumahBySantri } from '@/services/santriRumahService'
import { getKesehataanBySantri } from '@/services/santriKesehataanService'
import { getBansosBySantri } from '@/services/santriBansosService'
import { getPembiayaanBySantri } from '@/services/santriPembiayaanService'
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
const checkingOrangtua = ref(false)
const orangtuaExists = ref(false)
const orangtuaId = ref(null)
const orangtuaCheckError = ref(null)
const checkingAsset = ref(false)
const assetExists = ref(false)
const assetId = ref(null)
const assetCheckError = ref(null)
const checkingRumah = ref(false)
const rumahExists = ref(false)
const rumahId = ref(null)
const rumahCheckError = ref(null)
const checkingKesehatan = ref(false)
const kesehatanExists = ref(false)
const kesehataanId = ref(null)
const kesehataanCheckError = ref(null)
const checkingBansos = ref(false)
const bansosExists = ref(false)
const bansosId = ref(null)
const bansosCheckError = ref(null)
const checkingPembiayaan = ref(false)
const pembiayaanExists = ref(false)
const pembiayaanId = ref(null)
const pembiayaanCheckError = ref(null)

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
    const data = response?.data || response

    if (!data) {
      throw new Error('Data santri tidak ditemukan')
    }

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

const checkOrangtuaStatus = async () => {
  checkingOrangtua.value = true
  orangtuaCheckError.value = null

  try {
    const response = await getOrangtuaList(santriId, { per_page: 1 })
    const list = Array.isArray(response?.data) ? response.data : []

    if (list.length > 0) {
      orangtuaExists.value = true
      orangtuaId.value = list[0].id
    } else {
      orangtuaExists.value = false
      orangtuaId.value = null
    }
  } catch (err) {
    orangtuaCheckError.value = err.message || 'Gagal memeriksa data orangtua'
  } finally {
    checkingOrangtua.value = false
  }
}

const checkAssetStatus = async () => {
  checkingAsset.value = true
  assetCheckError.value = null

  try {
    const response = await getSantriAssets(santriId, { per_page: 1 })
    const list = Array.isArray(response?.data) ? response.data : []

    if (list.length > 0) {
      assetExists.value = true
      assetId.value = list[0].id
    } else {
      assetExists.value = false
      assetId.value = null
    }
  } catch (err) {
    assetCheckError.value = err.message || 'Gagal memeriksa data aset'
  } finally {
    checkingAsset.value = false
  }
}

const checkRumahStatus = async () => {
  checkingRumah.value = true
  rumahCheckError.value = null

  try {
    const response = await getRumahBySantri(santriId)

    if (response.success && response.data) {
      rumahExists.value = true
      rumahId.value = response.data.id
    } else {
      rumahExists.value = false
      rumahId.value = null
    }
  } catch (err) {
    rumahCheckError.value = err.message || 'Gagal memeriksa data rumah'
  } finally {
    checkingRumah.value = false
  }
}

const checkKesehataanStatus = async () => {
  checkingKesehatan.value = true
  kesehataanCheckError.value = null

  try {
    const response = await getKesehataanBySantri(santriId)

    if (response.success && response.data) {
      kesehatanExists.value = true
      kesehataanId.value = response.data.id
    } else {
      kesehatanExists.value = false
      kesehataanId.value = null
    }
  } catch (err) {
    kesehataanCheckError.value = err.message || 'Gagal memeriksa data kesehatan'
  } finally {
    checkingKesehatan.value = false
  }
}

const checkBansosStatus = async () => {
  checkingBansos.value = true
  bansosCheckError.value = null

  try {
    const response = await getBansosBySantri(santriId)

    if (response.success && response.data) {
      bansosExists.value = true
      bansosId.value = response.data.id
    } else {
      bansosExists.value = false
      bansosId.value = null
    }
  } catch (err) {
    bansosCheckError.value = err.message || 'Gagal memeriksa data bansos'
  } finally {
    checkingBansos.value = false
  }
}

const checkPembiayaanStatus = async () => {
  checkingPembiayaan.value = true
  pembiayaanCheckError.value = null

  try {
    const response = await getPembiayaanBySantri(santriId)

    if (response.success && response.data) {
      pembiayaanExists.value = true
      pembiayaanId.value = response.data.id
    } else {
      pembiayaanExists.value = false
      pembiayaanId.value = null
    }
  } catch (err) {
    pembiayaanCheckError.value = err.message || 'Gagal memeriksa data pembiayaan'
  } finally {
    checkingPembiayaan.value = false
  }
}

onMounted(() => {
  loadSantriData()
  checkOrangtuaStatus()
  checkAssetStatus()
  checkRumahStatus()
  checkKesehataanStatus()
  checkBansosStatus()
  checkPembiayaanStatus()
})
</script>
