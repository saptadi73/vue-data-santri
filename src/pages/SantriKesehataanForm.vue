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
          {{ isEditMode ? 'Edit Data Kesehatan' : 'Tambah Data Kesehatan' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Isi informasi kesehatan santri untuk pemantauan kesehatan.
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
          <!-- Antropometri -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Data Antropometri
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Tinggi Badan -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tinggi Badan (cm) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="formData.tinggi_badan"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Contoh: 170"
                />
              </div>

              <!-- Berat Badan -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Berat Badan (kg) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="formData.berat_badan"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Contoh: 65"
                />
              </div>
            </div>
          </div>

          <!-- Status Gizi & Alergi Obat -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Status Gizi & Alergi
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Status Gizi -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status Gizi
                </label>
                <select
                  v-model="formData.status_gizi"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Status Gizi</option>
                  <option value="kurang">Kurang</option>
                  <option value="baik">Baik</option>
                  <option value="lebih">Lebih</option>
                  <option value="obesitas">Obesitas</option>
                </select>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Status gizi berdasarkan IMT dan pengukuran kesehatan
                </p>
              </div>

              <!-- Alergi Obat -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alergi Obat
                </label>
                <input
                  v-model="formData.alergi_obat"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Contoh: Amoksisilin, Penisilin"
                />
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tuliskan nama obat yang menimbulkan alergi (jika ada)
                </p>
              </div>
            </div>
          </div>

          <!-- Riwayat Penyakit -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Riwayat Kesehatan
            </h2>

            <div class="space-y-4">
              <!-- Riwayat Penyakit -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Riwayat Penyakit (Opsional)
                </label>
                <textarea
                  v-model="formData.riwayat_penyakit"
                  rows="4"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Contoh: Alergi terhadap makanan tertentu, asma, dll"
                ></textarea>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tuliskan riwayat penyakit atau alergi yang dimiliki santri
                </p>
              </div>

              <!-- Kebutuhan Khusus -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kebutuhan Khusus (Opsional)
                </label>
                <textarea
                  v-model="formData.kebutuhan_khusus"
                  rows="4"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Contoh: Memerlukan diet khusus, pengawasan medis tertentu, dll"
                ></textarea>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tuliskan kebutuhan kesehatan khusus yang perlu diperhatikan
                </p>
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
import {
  createKesehatan,
  updateKesehatan,
  getKesehataanDetail,
} from '@/services/santriKesehataanService'

const route = useRoute()
const router = useRouter()

const santriId = route.params.santriId
const kesehataanId = route.params.kesehataanId

const isEditMode = computed(() => !!kesehataanId)

const loading = ref(false)
const submitting = ref(false)
const error = ref(null)
const successMessage = ref(null)

const formData = ref({
  santri_id: santriId,
  tinggi_badan: null,
  berat_badan: null,
  status_gizi: '',
  alergi_obat: '',
  riwayat_penyakit: '',
  kebutuhan_khusus: '',
})

onMounted(async () => {
  if (isEditMode.value) {
    await loadKesehataanData()
  }
})

const loadKesehataanData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getKesehataanDetail(kesehataanId)
    console.log('🏥 Raw response from API:', response)

    if (response.success && response.data) {
      const data = response.data
      console.log('📋 Kesehatan data received:', data)

      formData.value = {
        santri_id: data.santri_id,
        tinggi_badan: data.tinggi_badan || null,
        berat_badan: data.berat_badan || null,
        status_gizi: data.status_gizi || '',
        alergi_obat: data.alergi_obat || '',
        riwayat_penyakit: data.riwayat_penyakit || '',
        kebutuhan_khusus: data.kebutuhan_khusus || '',
      }

      console.log('✅ Form data after loading:', formData.value)
    } else {
      console.warn('⚠️ No data received or response not successful')
    }
  } catch (err) {
    console.error('❌ Error loading kesehatan:', err)
    error.value = err.message || 'Gagal memuat data kesehatan'
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
    tinggi_badan: formData.value.tinggi_badan,
    berat_badan: formData.value.berat_badan,
    status_gizi: formData.value.status_gizi || null,
    alergi_obat: formData.value.alergi_obat || null,
    riwayat_penyakit: formData.value.riwayat_penyakit || null,
    kebutuhan_khusus: formData.value.kebutuhan_khusus || null,
  }

  console.group('🏥 Kesehatan Form Submit')
  console.log('Payload:', payload)
  console.groupEnd()

  try {
    let response
    if (isEditMode.value) {
      response = await updateKesehatan(kesehataanId, payload)
    } else {
      response = await createKesehatan(payload)
    }

    if (response.success) {
      successMessage.value = isEditMode.value
        ? 'Data kesehatan berhasil diperbarui!'
        : 'Data kesehatan berhasil disimpan!'

      setTimeout(() => {
        router.push(`/santri/edit/${santriId}`)
      }, 1500)
    }
  } catch (err) {
    console.error('Error submitting kesehatan:', err)
    error.value = err.message || 'Gagal menyimpan data kesehatan'
  } finally {
    submitting.value = false
  }
}
</script>
