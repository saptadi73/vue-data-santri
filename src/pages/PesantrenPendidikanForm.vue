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
          {{ isEditMode ? 'Edit Data Pendidikan' : 'Tambah Data Pendidikan' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Isi informasi pendidikan pesantren dengan lengkap.
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
          <!-- Jenjang Pendidikan -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Jenjang Pendidikan
            </label>
            <select
              v-model="formData.jenjang_pendidikan"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Pilih jenjang pendidikan</option>
              <option value="semua_ra_ma">Semua Ada dari RA-MA</option>
              <option value="pendidikan_dasar">Pendidikan Dasar Saja (MI)</option>
              <option value="dasar_menengah_pertama">
                Pendidikan Dasar hingga Menengah Pertama (MI-MTs)
              </option>
              <option value="dasar_menengah_atas">Pendidikan Dasar - Menengah Atas (MI-MA)</option>
              <option value="satu_jenjang">Hanya satu jenjang Pendidikan</option>
            </select>
          </div>

          <!-- Kurikulum -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kurikulum
            </label>
            <select
              v-model="formData.kurikulum"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Pilih kurikulum</option>
              <option value="terstandar">Terstandar</option>
              <option value="lokal">Lokal</option>
              <option value="gabungan">Gabungan</option>
            </select>
          </div>

          <!-- Akreditasi -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Akreditasi
            </label>
            <select
              v-model="formData.akreditasi"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Pilih akreditasi</option>
              <option value="a">A</option>
              <option value="b">B</option>
              <option value="c">C</option>
              <option value="belum">Belum Terakreditasi</option>
            </select>
          </div>

          <!-- Jumlah Guru -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jumlah Guru Tetap
              </label>
              <input
                v-model.number="formData.jumlah_guru_tetap"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: 25"
              />
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jumlah Guru Tidak Tetap
              </label>
              <input
                v-model.number="formData.jumlah_guru_tidak_tetap"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: 5"
              />
            </div>
          </div>

          <!-- Guru S1 & Sertifikat -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Guru S1 ke Atas
              </label>
              <input
                v-model.number="formData.guru_s1_keatas"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: 20"
              />
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Persentase Guru Bersertifikat (%)
              </label>
              <input
                v-model.number="formData.persen_guru_bersertifikat"
                type="number"
                min="0"
                max="100"
                step="0.01"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: 80.5"
              />
            </div>
          </div>

          <!-- Rasio Guru Santri -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rasio Guru Santri
            </label>
            <input
              v-model.number="formData.rasio_guru_santri"
              type="number"
              step="0.01"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Contoh: 1.5"
            />
          </div>

          <!-- Prestasi Akademik & Non-Akademik -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prestasi Akademik
              </label>
              <select
                v-model="formData.prestasi_akademik"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih prestasi</option>
                <option value="nasional">Nasional</option>
                <option value="regional">Regional</option>
                <option value="tidak_ada">Tidak Ada</option>
              </select>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prestasi Non-Akademik
              </label>
              <select
                v-model="formData.prestasi_non_akademik"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Pilih prestasi</option>
                <option value="nasional">Nasional</option>
                <option value="regional">Regional</option>
                <option value="tidak_ada">Tidak Ada</option>
              </select>
            </div>
          </div>

          <!-- Prestasi Santri -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prestasi Santri
            </label>
            <select
              v-model="formData.prestasi_santri"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Pilih prestasi santri</option>
              <option value="nasional">Nasional</option>
              <option value="regional">Regional</option>
              <option value="tidak_ada">Tidak Ada</option>
            </select>
          </div>

          <!-- Program Unggulan -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Program Unggulan
            </label>
            <input
              v-model="formData.program_unggulan"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Contoh: Program Hafidz Quran"
            />
          </div>

          <!-- Fasilitas Mengajar -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fasilitas Mengajar
            </label>
            <select
              v-model="formData.fasilitas_mengajar"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Pilih fasilitas mengajar</option>
              <option value="lengkap">Lengkap</option>
              <option value="cukup_lengkap">Cukup Lengkap</option>
              <option value="kurang_lengkap">Kurang Lengkap</option>
            </select>
          </div>

          <!-- Metode Pembayaran -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Metode Pembayaran
            </label>
            <select
              v-model="formData.metode_pembayaran"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Pilih metode pembayaran</option>
              <option value="tunai">Tunai</option>
              <option value="transfer">Transfer</option>
              <option value="cicilan">Cicilan</option>
              <option value="bantuan">Bantuan</option>
            </select>
          </div>

          <!-- Biaya Bulanan -->
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Biaya Bulanan Minimum (Rp)
              </label>
              <input
                v-model.number="formData.biaya_bulanan_min"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: 500000"
              />
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Biaya Bulanan Maksimum (Rp)
              </label>
              <input
                v-model.number="formData.biaya_bulanan_max"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: 1000000"
              />
            </div>
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
  createPendidikan,
  getPendidikanDetail,
  updatePendidikan,
} from '@/services/pesantrenPendidikanService'

const route = useRoute()
const router = useRouter()

const pesantrenId = route.params.pesantrenId
const pendidikanId = route.params.pendidikanId
const loading = ref(false)
const error = ref(null)
const submitting = ref(false)
const successMessage = ref('')

const isEditMode = computed(() => !!pendidikanId)

const formData = ref({
  jenjang_pendidikan: '',
  kurikulum: '',
  akreditasi: '',
  jumlah_guru_tetap: null,
  jumlah_guru_tidak_tetap: null,
  guru_s1_keatas: null,
  persen_guru_bersertifikat: null,
  rasio_guru_santri: '',
  prestasi_akademik: '',
  prestasi_non_akademik: '',
  prestasi_santri: '',
  program_unggulan: '',
  fasilitas_mengajar: '',
  metode_pembayaran: '',
  biaya_bulanan_min: null,
  biaya_bulanan_max: null,
})

onMounted(async () => {
  if (isEditMode.value) {
    await loadPendidikanData()
  }
})

const loadPendidikanData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getPendidikanDetail(pendidikanId)

    // API returns data directly (with id, pesantren_id, etc.)
    if (response && response.id) {
      formData.value = { ...response }
      console.log('📚 Loaded pendidikan data:', formData.value)
    } else {
      error.value = 'Data pendidikan tidak ditemukan'
    }
  } catch (err) {
    console.error('❌ Error loading pendidikan:', err)
    error.value = err.message || 'Gagal memuat data pendidikan'
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
    const payload = {
      pesantren_id: pesantrenId,
      ...formData.value,
    }

    console.group('📝 Pendidikan Form Submit')
    console.log('Mode:', isEditMode.value ? 'EDIT' : 'CREATE')
    console.log('PendidikanId:', pendidikanId)
    console.log('PesantrenId:', pesantrenId)
    console.log('Payload:', payload)
    console.groupEnd()

    if (isEditMode.value) {
      response = await updatePendidikan(pendidikanId, payload)
    } else {
      response = await createPendidikan(payload)
    }

    console.log('Response:', response)

    if (response && response.id) {
      successMessage.value = isEditMode.value
        ? '✅ Data pendidikan berhasil diperbarui'
        : '✅ Data pendidikan berhasil ditambahkan'

      console.log('✅ Success:', response)

      setTimeout(() => {
        router.push(`/pondok/edit/${pesantrenId}`)
      }, 1500)
    }
  } catch (err) {
    console.error('❌ Error submitting form:', err)
    error.value = err.message || 'Gagal menyimpan data pendidikan'
  } finally {
    submitting.value = false
  }
}
</script>
