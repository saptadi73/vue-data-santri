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
          {{ isEditMode ? 'Edit Data Fasilitas' : 'Tambah Data Fasilitas' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Isi informasi fasilitas pesantren dengan lengkap.
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
          <!-- Jumlah Ruangan -->
          <div class="grid grid-cols-3 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jumlah Kamar
              </label>
              <input
                v-model.number="formData.jumlah_kamar"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: 10"
              />
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jumlah Ruang Kelas
              </label>
              <input
                v-model.number="formData.jumlah_ruang_kelas"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: 15"
              />
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jumlah Masjid
              </label>
              <input
                v-model.number="formData.jumlah_masjid"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: 1"
              />
            </div>
          </div>

          <!-- Fasilitas Boolean -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Perpustakaan
              </label>
              <select
                v-model="formData.perpustakaan"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option :value="null">Pilih perpustakaan</option>
                <option :value="true">Ada</option>
                <option :value="false">Tidak Ada</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Laboratorium
              </label>
              <select
                v-model="formData.laboratorium"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option :value="null">Pilih laboratorium</option>
                <option :value="true">Ada</option>
                <option :value="false">Tidak Ada</option>
              </select>
            </div>
          </div>

          <!-- Fasilitas Boolean (Lanjutan) -->
          <div class="grid grid-cols-3 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ruang Komputer
              </label>
              <select
                v-model="formData.ruang_komputer"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option :value="null">Pilih ruang komputer</option>
                <option :value="true">Ada</option>
                <option :value="false">Tidak Ada</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Koperasi
              </label>
              <select
                v-model="formData.koperasi"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option :value="null">Pilih koperasi</option>
                <option :value="true">Ada</option>
                <option :value="false">Tidak Ada</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kantin
              </label>
              <select
                v-model="formData.kantin"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option :value="null">Pilih kantin</option>
                <option :value="true">Ada</option>
                <option :value="false">Tidak Ada</option>
              </select>
            </div>
          </div>

          <!-- Fasilitas Enum -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fasilitas Olahraga
              </label>
              <select
                v-model="formData.fasilitas_olahraga"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih fasilitas</option>
                <option value="lengkap">Lengkap</option>
                <option value="cukup_lengkap">Cukup Lengkap</option>
                <option value="kurang_lengkap">Kurang Lengkap</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fasilitas Kesehatan
              </label>
              <select
                v-model="formData.fasilitas_kesehatan"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih fasilitas</option>
                <option value="lengkap">Lengkap</option>
                <option value="cukup_lengkap">Cukup Lengkap</option>
                <option value="kurang_lengkap">Kurang Lengkap</option>
              </select>
            </div>
          </div>

          <!-- Fasilitas Enum (Lanjutan) -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fasilitas Mengajar
              </label>
              <select
                v-model="formData.fasilitas_mengajar"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih fasilitas</option>
                <option value="lengkap">Lengkap</option>
                <option value="cukup_lengkap">Cukup Lengkap</option>
                <option value="kurang_lengkap">Kurang Lengkap</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fasilitas Komunikasi
              </label>
              <select
                v-model="formData.fasilitas_komunikasi"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih fasilitas</option>
                <option value="lengkap">Lengkap</option>
                <option value="cukup_lengkap">Cukup Lengkap</option>
                <option value="kurang_lengkap">Kurang Lengkap</option>
              </select>
            </div>
          </div>

          <!-- Akses & Transportasi -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Akses Transportasi
              </label>
              <select
                v-model="formData.akses_transportasi"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih akses</option>
                <option value="mudah">Mudah</option>
                <option value="cukup_mudah">Cukup Mudah</option>
                <option value="sulit">Sulit</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fasilitas Transportasi
              </label>
              <select
                v-model="formData.fasilitas_transportasi"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih fasilitas</option>
                <option value="bus">Bus</option>
                <option value="angkutan_umum">Angkutan Umum</option>
                <option value="kendaraan_pribadi">Kendaraan Pribadi</option>
                <option value="ojek">Ojek</option>
              </select>
            </div>
          </div>

          <!-- Akses Jalan & Jarak ke Kota -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Akses Jalan
              </label>
              <select
                v-model="formData.akses_jalan"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih kondisi jalan</option>
                <option value="aspal">Aspal</option>
                <option value="cor_block">Cor Block</option>
                <option value="tanah">Tanah</option>
                <option value="kerikil">Kerikil</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jarak ke Kota (km)
              </label>
              <input
                v-model.number="formData.jarak_ke_kota_km"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: 15.5"
              />
            </div>
          </div>

          <!-- Asrama & Ruang Belajar -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Asrama
              </label>
              <select
                v-model="formData.asrama"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih asrama</option>
                <option value="layak">Layak</option>
                <option value="cukup">Cukup</option>
                <option value="tidak_layak">Tidak Layak</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ruang Belajar
              </label>
              <select
                v-model="formData.ruang_belajar"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih ruang belajar</option>
                <option value="layak">Layak</option>
                <option value="cukup">Cukup</option>
                <option value="tidak_layak">Tidak Layak</option>
              </select>
            </div>
          </div>

          <!-- Internet -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Internet
            </label>
            <select
              v-model="formData.internet"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Pilih internet</option>
              <option value="stabil">Stabil</option>
              <option value="tidak_stabil">Tidak Stabil</option>
              <option value="tidak_ada">Tidak Ada</option>
            </select>
          </div>

          <!-- Submit Button -->
          <div class="flex gap-4 pt-6">
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="submitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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
              {{ submitting ? 'Menyimpan...' : isEditMode ? 'Update Data' : 'Tambah Data' }}
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
import {
  createFasilitas,
  getFasilitasDetail,
  updateFasilitas,
} from '@/services/pesantrenFasilitasService'

const route = useRoute()
const router = useRouter()

const pesantrenId = route.params.pesantrenId
const fasilitasId = route.params.fasilitasId
const loading = ref(false)
const error = ref(null)
const submitting = ref(false)
const successMessage = ref('')

const isEditMode = computed(() => !!fasilitasId)

const formData = ref({
  jumlah_kamar: null,
  jumlah_ruang_kelas: null,
  jumlah_masjid: null,
  perpustakaan: null,
  laboratorium: null,
  ruang_komputer: null,
  koperasi: null,
  kantin: null,
  fasilitas_olahraga: '',
  fasilitas_kesehatan: '',
  fasilitas_mengajar: '',
  fasilitas_komunikasi: '',
  akses_transportasi: '',
  fasilitas_transportasi: '',
  akses_jalan: '',
  jarak_ke_kota_km: null,
  asrama: '',
  ruang_belajar: '',
  internet: '',
})

onMounted(async () => {
  if (isEditMode.value) {
    await loadFasilitasData()
  }
})

const loadFasilitasData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getFasilitasDetail(fasilitasId)

    // API returns data directly (with id, pesantren_id, etc.)
    if (response && response.id) {
      formData.value = { ...response }
      console.log('🏢 Loaded fasilitas data:', formData.value)
    } else {
      error.value = 'Data fasilitas tidak ditemukan'
    }
  } catch (err) {
    console.error('❌ Error loading fasilitas:', err)
    error.value = err.message || 'Gagal memuat data fasilitas'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  error.value = null
  successMessage.value = ''

  try {
    let response

    if (isEditMode.value) {
      response = await updateFasilitas(fasilitasId, formData.value)
    } else {
      response = await createFasilitas({
        pesantren_id: pesantrenId,
        ...formData.value,
      })
    }

    if (response && response.id) {
      successMessage.value = isEditMode.value
        ? '✅ Data fasilitas berhasil diperbarui'
        : '✅ Data fasilitas berhasil ditambahkan'

      console.log('✅ Success:', response)

      setTimeout(() => {
        router.push(`/pondok/edit/${pesantrenId}`)
      }, 1500)
    }
  } catch (err) {
    console.error('❌ Error submitting form:', err)
    error.value = err.message || 'Gagal menyimpan data fasilitas'
  } finally {
    submitting.value = false
  }
}
</script>
