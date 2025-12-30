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
          {{ isEditMode ? 'Edit Data Bantuan Sosial' : 'Tambah Data Bantuan Sosial' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Isi informasi bantuan sosial yang diterima santri.
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
          <!-- Bantuan Sosial Nasional -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Program Bantuan Sosial Nasional
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Pilih bantuan sosial yang pernah atau sedang diterima santri
            </p>

            <div class="space-y-3">
              <!-- PKH -->
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="formData.pkh"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-gray-700 dark:text-gray-300 font-medium"
                  >PKH (Program Keluarga Harapan)</span
                >
              </label>

              <!-- BLT -->
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="formData.blt"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-gray-700 dark:text-gray-300 font-medium"
                  >BLT (Bantuan Langsung Tunai)</span
                >
              </label>

              <!-- BPNT -->
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="formData.bpnt"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-gray-700 dark:text-gray-300 font-medium"
                  >BPNT (Bantuan Pangan Non-Tunai)</span
                >
              </label>

              <!-- Kartu Keluarga Sejahtera -->
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="formData.kartu_keluarga_sejahtera"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-gray-700 dark:text-gray-300 font-medium">
                  Kartu Keluarga Sejahtera (KKS)
                </span>
              </label>

              <!-- Raskin -->
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="formData.raskin"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-gray-700 dark:text-gray-300 font-medium">
                  Raskin (Beras untuk Keluarga Miskin)
                </span>
              </label>
            </div>
          </div>

          <!-- Program Beasiswa -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Program Beasiswa
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Pilih jenis beasiswa yang diterima santri
            </p>

            <div class="space-y-3">
              <!-- Beasiswa Penuh -->
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="formData.beasiswa_penuh"
                  type="checkbox"
                  class="w-4 h-4 text-green-600 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                />
                <span class="text-gray-700 dark:text-gray-300 font-medium">Beasiswa Penuh</span>
              </label>

              <!-- Beasiswa Sebagian -->
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="formData.beasiswa_sebagian"
                  type="checkbox"
                  class="w-4 h-4 text-green-600 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                />
                <span class="text-gray-700 dark:text-gray-300 font-medium">Beasiswa Sebagian</span>
              </label>
            </div>
          </div>

          <!-- Bantuan Lainnya -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Bantuan Lainnya
            </h2>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keterangan Bantuan Lainnya (Opsional)
              </label>
              <textarea
                v-model="formData.bantuan_lainnya"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Contoh: Bantuan dari desa, kecamatan, organisasi sosial, dll"
              ></textarea>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Tuliskan bantuan lainnya yang diterima santri selain yang tersebut di atas
              </p>
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
import { createBansos, updateBansos, getBansosDetail } from '@/services/santriBansosService'

const route = useRoute()
const router = useRouter()

const santriId = route.params.santriId
const bansosId = route.params.bansosId

const isEditMode = computed(() => !!bansosId)

const loading = ref(false)
const submitting = ref(false)
const error = ref(null)
const successMessage = ref(null)

const formData = ref({
  santri_id: santriId,
  pkh: false,
  blt: false,
  bpnt: false,
  kartu_keluarga_sejahtera: false,
  raskin: false,
  beasiswa_penuh: false,
  beasiswa_sebagian: false,
  bantuan_lainnya: '',
})

onMounted(async () => {
  if (isEditMode.value) {
    await loadBansosData()
  }
})

const loadBansosData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getBansosDetail(bansosId)

    if (response.success && response.data) {
      const data = response.data
      formData.value = {
        santri_id: data.santri_id,
        pkh: data.pkh || false,
        blt: data.blt || false,
        bpnt: data.bpnt || false,
        kartu_keluarga_sejahtera: data.kartu_keluarga_sejahtera || false,
        raskin: data.raskin || false,
        beasiswa_penuh: data.beasiswa_penuh || false,
        beasiswa_sebagian: data.beasiswa_sebagian || false,
        bantuan_lainnya: data.bantuan_lainnya || '',
      }
    }
  } catch (err) {
    error.value = err.message || 'Gagal memuat data bantuan sosial'
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
    pkh: formData.value.pkh,
    blt: formData.value.blt,
    bpnt: formData.value.bpnt,
    kartu_keluarga_sejahtera: formData.value.kartu_keluarga_sejahtera,
    raskin: formData.value.raskin,
    beasiswa_penuh: formData.value.beasiswa_penuh,
    beasiswa_sebagian: formData.value.beasiswa_sebagian,
    bantuan_lainnya: formData.value.bantuan_lainnya || null,
  }

  console.group('💰 Bansos Form Submit')
  console.log('Payload:', payload)
  console.groupEnd()

  try {
    let response
    if (isEditMode.value) {
      response = await updateBansos(bansosId, payload)
    } else {
      response = await createBansos(payload)
    }

    if (response.success) {
      successMessage.value = isEditMode.value
        ? 'Data bantuan sosial berhasil diperbarui!'
        : 'Data bantuan sosial berhasil disimpan!'

      setTimeout(() => {
        router.push(`/santri/edit/${santriId}`)
      }, 1500)
    }
  } catch (err) {
    console.error('Error submitting bansos:', err)
    error.value = err.message || 'Gagal menyimpan data bantuan sosial'
  } finally {
    submitting.value = false
  }
}
</script>
