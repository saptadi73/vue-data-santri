<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <router-link
          :to="`/santri/${santriId}/pembiayaan`"
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
          Kembali ke Data Pembiayaan
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ isEditMode ? 'Edit Data Pembiayaan' : 'Tambah Data Pembiayaan' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Isi informasi pembiayaan santri dengan lengkap.
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
          <!-- Biaya Per Bulan -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Biaya Per Bulan <span class="text-red-600">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-4 top-3 text-gray-500 dark:text-gray-400">Rp</span>
              <input
                v-model.number="formData.biaya_per_bulan"
                type="number"
                min="0"
                step="1000"
                required
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Masukkan biaya per bulan"
              />
            </div>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Masukkan jumlah biaya per bulan dalam rupiah
            </p>
          </div>

          <!-- Sumber Biaya -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sumber Biaya <span class="text-red-600">*</span>
            </label>
            <select
              v-model="formData.sumber_biaya"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="" disabled>Pilih sumber biaya</option>
              <option value="orang_tua">Orang Tua</option>
              <option value="beasiswa">Beasiswa</option>
              <option value="donatur">Donatur</option>
              <option value="pesantren">Pesantren</option>
            </select>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Pilih asal pembiayaan pendidikan santri
            </p>
          </div>

          <!-- Status Pembayaran -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status Pembayaran <span class="text-red-600">*</span>
            </label>
            <select
              v-model="formData.status_pembayaran"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="" disabled>Pilih status pembayaran</option>
              <option value="lancar">Lancar</option>
              <option value="terlambat">Terlambat</option>
              <option value="belum_bayar">Belum Bayar</option>
            </select>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Pilih status pembayaran biaya pendidikan
            </p>
          </div>

          <!-- Tunggakan Bulan -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tunggakan Bulan <span class="text-red-600">*</span>
            </label>
            <input
              v-model.number="formData.tunggakan_bulan"
              type="number"
              min="0"
              max="60"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Masukkan jumlah tunggakan bulan"
            />
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Berapa bulan tunggakan pembayaran
            </p>
          </div>

          <!-- Keterangan -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keterangan (Opsional)
            </label>
            <textarea
              v-model="formData.keterangan"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Contoh: Pembayaran tepat waktu, pembayaran tertunda karena...dll"
            ></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Tambahkan catatan atau informasi tambahan tentang pembiayaan santri
            </p>
          </div>

          <!-- Submit Button -->
          <div class="flex gap-4 justify-end">
            <router-link
              :to="`/santri/${santriId}/pembiayaan`"
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
import {
  createPembiayaan,
  updatePembiayaan,
  getPembiayaanDetail,
} from '@/services/santriPembiayaanService'

const route = useRoute()
const router = useRouter()

const santriId = route.params.santriId
const pembiayaanId = route.params.pembiayaanId

const isEditMode = computed(() => !!pembiayaanId)

const loading = ref(false)
const submitting = ref(false)
const error = ref(null)
const successMessage = ref(null)

const formData = ref({
  santri_id: santriId,
  biaya_per_bulan: null,
  sumber_biaya: '',
  status_pembayaran: '',
  tunggakan_bulan: 0,
  keterangan: '',
})

onMounted(async () => {
  if (isEditMode.value) {
    await loadPembiayaanData()
  }
})

const loadPembiayaanData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getPembiayaanDetail(pembiayaanId)

    if (response.success && response.data) {
      const data = response.data
      formData.value = {
        santri_id: data.santri_id,
        biaya_per_bulan: data.biaya_per_bulan,
        sumber_biaya: data.sumber_biaya || '',
        status_pembayaran: data.status_pembayaran || '',
        tunggakan_bulan: data.tunggakan_bulan || 0,
        keterangan: data.keterangan || '',
      }
    }
  } catch (err) {
    error.value = err.message || 'Gagal memuat data pembiayaan'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  error.value = null
  successMessage.value = null
  submitting.value = true

  const payload = {
    santri_id: formData.value.santri_id,
    biaya_per_bulan: formData.value.biaya_per_bulan,
    sumber_biaya: formData.value.sumber_biaya,
    status_pembayaran: formData.value.status_pembayaran,
    tunggakan_bulan: formData.value.tunggakan_bulan,
    keterangan: formData.value.keterangan || null,
  }

  console.group('💰 Pembiayaan Form Submit')
  console.log('Payload:', payload)
  console.groupEnd()

  try {
    let response
    if (isEditMode.value) {
      response = await updatePembiayaan(pembiayaanId, payload)
    } else {
      response = await createPembiayaan(payload)
    }

    if (response.success) {
      successMessage.value = isEditMode.value
        ? 'Data pembiayaan berhasil diperbarui!'
        : 'Data pembiayaan berhasil disimpan!'

      setTimeout(() => {
        router.push(`/santri/${santriId}/pembiayaan`)
      }, 1500)
    }
  } catch (err) {
    console.error('Error submitting pembiayaan:', err)
    error.value = err.message || 'Gagal menyimpan data pembiayaan'
  } finally {
    submitting.value = false
  }
}
</script>
