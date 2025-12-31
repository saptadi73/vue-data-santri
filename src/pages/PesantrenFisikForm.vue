<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <router-link
          :to="`/pondok/edit/${pesantrenId}`"
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
          Kembali ke Edit Pondok Pesantren
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ isEditMode ? 'Edit Data Infrastruktur Fisik' : 'Tambah Data Infrastruktur Fisik' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Isi informasi infrastruktur fisik pesantren dengan lengkap.
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
          <!-- Luas Tanah -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Luas Tanah (m²)
            </label>
            <input
              v-model.number="formData.luas_tanah"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Contoh: 5000"
            />
          </div>

          <!-- Luas Bangunan -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Luas Bangunan (m²)
            </label>
            <input
              v-model.number="formData.luas_bangunan"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Contoh: 3000"
            />
          </div>

          <!-- Status Bangunan -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status Bangunan
            </label>
            <select
              v-model="formData.status_bangunan"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Pilih status bangunan</option>
              <option value="milik_sendiri">Milik Sendiri</option>
              <option value="wakaf">Wakaf</option>
              <option value="hibah">Hibah</option>
              <option value="pinjam">Pinjam</option>
              <option value="sewa">Sewa</option>
            </select>
          </div>

          <!-- Kondisi Bangunan -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kondisi Bangunan <span class="text-red-600">*</span>
            </label>
            <select
              v-model="formData.kondisi_bangunan"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Pilih kondisi bangunan</option>
              <option value="permanen">Permanen</option>
              <option value="semi_permanen">Semi Permanen</option>
              <option value="non_permanen">Non Permanen</option>
            </select>
          </div>

          <!-- Sumber Air & Kualitas Air -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sumber Air
              </label>
              <select
                v-model="formData.sumber_air"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih sumber air</option>
                <option value="PDAM">PDAM</option>
                <option value="sumur">Sumur</option>
                <option value="berbagai_macam">Berbagai Macam</option>
                <option value="hujan">Hujan</option>
                <option value="sungai">Sungai</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kualitas Air Bersih
              </label>
              <select
                v-model="formData.kualitas_air_bersih"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih kualitas air</option>
                <option value="layak_minum">Layak Minum</option>
                <option value="keruh">Keruh</option>
                <option value="berbau">Berbau</option>
                <option value="asin">Asin</option>
              </select>
            </div>
          </div>

          <!-- Fasilitas MCK & Jumlah MCK -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fasilitas MCK <span class="text-red-600">*</span>
              </label>
              <select
                v-model="formData.fasilitas_mck"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih fasilitas MCK</option>
                <option value="lengkap">Lengkap</option>
                <option value="kurang_lengkap">Kurang Lengkap</option>
                <option value="tidak_ada">Tidak Ada</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jumlah MCK
              </label>
              <input
                v-model.number="formData.jumlah_mck"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: 20"
              />
            </div>
          </div>

          <!-- Rasio Kepadatan Kamar -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rasio Kepadatan Kamar (orang/kamar) <span class="text-red-600">*</span>
            </label>
            <input
              v-model.number="formData.rasio_kepadatan_kamar"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Contoh: 4.5"
            />
          </div>

          <!-- Sanitasi, Air Bersih, Keamanan Bangunan -->
          <div class="grid grid-cols-3 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kondisi Sanitasi <span class="text-red-600">*</span>
              </label>
              <select
                v-model="formData.sanitasi"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="" disabled>Pilih kondisi sanitasi</option>
                <option value="layak">Layak</option>
                <option value="cukup">Cukup</option>
                <option value="tidak_layak">Tidak Layak</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ketersediaan Air Bersih <span class="text-red-600">*</span>
              </label>
              <select
                v-model="formData.air_bersih"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="" disabled>Pilih ketersediaan air bersih</option>
                <option value="lancar">Lancar</option>
                <option value="terbatas">Terbatas</option>
                <option value="tidak_tersedia">Tidak Tersedia</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keamanan Bangunan <span class="text-red-600">*</span>
              </label>
              <select
                v-model="formData.keamanan_bangunan"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="" disabled>Pilih tingkat keamanan bangunan</option>
                <option value="tinggi">Tinggi</option>
                <option value="standar">Standar</option>
                <option value="minim">Minim</option>
                <option value="tidak_aman">Tidak Aman</option>
              </select>
            </div>
          </div>

          <!-- Jenis Lantai, Dinding, Atap -->
          <div class="grid grid-cols-3 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jenis Lantai <span class="text-red-600">*</span>
              </label>
              <select
                v-model="formData.jenis_lantai"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih jenis lantai</option>
                <option value="marmer">Marmer</option>
                <option value="keramik">Keramik</option>
                <option value="beton">Beton</option>
                <option value="kayu">Kayu</option>
                <option value="tanah">Tanah</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jenis Dinding <span class="text-red-600">*</span>
              </label>
              <select
                v-model="formData.jenis_dinding"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih jenis dinding</option>
                <option value="tembok">Tembok</option>
                <option value="papan">Papan</option>
                <option value="kayu">Kayu</option>
                <option value="bambu">Bambu</option>
                <option value="anyaman">Anyaman</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jenis Atap <span class="text-red-600">*</span>
              </label>
              <select
                v-model="formData.jenis_atap"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih jenis atap</option>
                <option value="genteng_tanah_liat">Genteng Tanah Liat</option>
                <option value="metal">Metal</option>
                <option value="upvc">UPVC</option>
                <option value="seng">Seng</option>
                <option value="asbes">Asbes</option>
                <option value="ijuk">Ijuk</option>
              </select>
            </div>
          </div>

          <!-- Sumber Listrik & Daya Listrik -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sumber Listrik <span class="text-red-600">*</span>
              </label>
              <input
                v-model="formData.sumber_listrik"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: PLN, Generator"
              />
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Daya Listrik (VA)
              </label>
              <input
                v-model="formData.daya_listrik_va"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: 5500"
              />
            </div>
          </div>

          <!-- Kestabilan Listrik & Sistem Keamanan -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kestabilan Listrik
              </label>
              <select
                v-model="formData.kestabilan_listrik"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih kestabilan listrik</option>
                <option value="stabil">Stabil</option>
                <option value="tidak_stabil">Tidak Stabil</option>
                <option value="tidak_ada">Tidak Ada</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sistem Keamanan
              </label>
              <textarea
                v-model="formData.sistem_keamanan"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: CCTV dan satpam 24 jam"
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex gap-4 justify-end">
            <router-link
              :to="`/pondok/edit/${pesantrenId}`"
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
import { createFisik, updateFisik, getFisikDetail } from '@/services/pesantrenFisikService'

const route = useRoute()
const router = useRouter()

const pesantrenId = route.params.pesantrenId
const fisikId = route.params.fisikId

const isEditMode = computed(() => !!fisikId)

const loading = ref(false)
const submitting = ref(false)
const error = ref(null)
const successMessage = ref(null)

const formData = ref({
  pesantren_id: pesantrenId,
  luas_tanah: null,
  luas_bangunan: null,
  status_bangunan: '',
  kondisi_bangunan: '',
  sumber_air: '',
  kualitas_air_bersih: '',
  fasilitas_mck: '',
  jumlah_mck: null,
  rasio_kepadatan_kamar: null,
  sanitasi: '',
  air_bersih: '',
  keamanan_bangunan: '',
  jenis_lantai: '',
  jenis_dinding: '',
  jenis_atap: '',
  sumber_listrik: '',
  daya_listrik_va: '',
  kestabilan_listrik: '',
  sistem_keamanan: '',
})

onMounted(async () => {
  if (isEditMode.value) {
    await loadFisikData()
  }
})

const loadFisikData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getFisikDetail(fisikId)

    if (response && response.id) {
      formData.value = {
        pesantren_id: response.pesantren_id,
        luas_tanah: response.luas_tanah,
        luas_bangunan: response.luas_bangunan,
        status_bangunan: response.status_bangunan || '',
        kondisi_bangunan: response.kondisi_bangunan || '',
        sumber_air: response.sumber_air || '',
        kualitas_air_bersih: response.kualitas_air_bersih || '',
        fasilitas_mck: response.fasilitas_mck || '',
        jumlah_mck: response.jumlah_mck || null,
        rasio_kepadatan_kamar: response.rasio_kepadatan_kamar || null,
        sanitasi: response.sanitasi || '',
        air_bersih: response.air_bersih || '',
        keamanan_bangunan: response.keamanan_bangunan || '',
        jenis_lantai: response.jenis_lantai || '',
        jenis_dinding: response.jenis_dinding || '',
        jenis_atap: response.jenis_atap || '',
        sumber_listrik: response.sumber_listrik || '',
        daya_listrik_va: response.daya_listrik_va || '',
        kestabilan_listrik: response.kestabilan_listrik || '',
        sistem_keamanan: response.sistem_keamanan || '',
      }
    }
  } catch (err) {
    error.value = err.message || 'Gagal memuat data infrastruktur fisik'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  error.value = null
  successMessage.value = null
  submitting.value = true

  const payload = {
    pesantren_id: formData.value.pesantren_id,
    luas_tanah: formData.value.luas_tanah,
    luas_bangunan: formData.value.luas_bangunan,
    status_bangunan: formData.value.status_bangunan,
    kondisi_bangunan: formData.value.kondisi_bangunan,
    sumber_air: formData.value.sumber_air,
    kualitas_air_bersih: formData.value.kualitas_air_bersih,
    fasilitas_mck: formData.value.fasilitas_mck,
    jumlah_mck: formData.value.jumlah_mck,
    rasio_kepadatan_kamar: formData.value.rasio_kepadatan_kamar,
    sanitasi: formData.value.sanitasi,
    air_bersih: formData.value.air_bersih,
    keamanan_bangunan: formData.value.keamanan_bangunan,
    jenis_lantai: formData.value.jenis_lantai,
    jenis_dinding: formData.value.jenis_dinding,
    jenis_atap: formData.value.jenis_atap,
    sumber_listrik: formData.value.sumber_listrik,
    daya_listrik_va: formData.value.daya_listrik_va,
    kestabilan_listrik: formData.value.kestabilan_listrik,
    sistem_keamanan: formData.value.sistem_keamanan,
  }

  console.group('🏗️ Fisik Form Submit')
  console.log('Payload:', payload)
  console.groupEnd()

  try {
    let response
    if (isEditMode.value) {
      response = await updateFisik(fisikId, payload)
    } else {
      response = await createFisik(payload)
    }

    if (response && response.id) {
      successMessage.value = isEditMode.value
        ? 'Data infrastruktur fisik berhasil diperbarui!'
        : 'Data infrastruktur fisik berhasil disimpan!'

      setTimeout(() => {
        router.push(`/pondok/edit/${pesantrenId}`)
      }, 1500)
    }
  } catch (err) {
    console.error('Error submitting fisik:', err)
    error.value = err.message || 'Gagal menyimpan data infrastruktur fisik'
  } finally {
    submitting.value = false
  }
}
</script>
