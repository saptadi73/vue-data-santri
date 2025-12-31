<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <router-link
          :to="`/pondok/${pesantrenId}`"
          class="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 mb-4"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke Detail Pesantren
        </router-link>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Scoring Pesantren</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Evaluasi kelayakan fasilitas dan mutu pendidikan
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin">
          <svg
            class="w-12 h-12 text-teal-600 dark:text-teal-400"
            fill="none"
            stroke="currentColor"
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
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start"
      >
        <svg
          class="w-6 h-6 text-red-600 dark:text-red-400 mr-3 shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 class="font-semibold text-red-800 dark:text-red-200">Error</h3>
          <p class="text-red-700 dark:text-red-300">{{ error }}</p>
        </div>
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start"
      >
        <svg
          class="w-6 h-6 text-green-600 dark:text-green-400 mr-3 shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          <h3 class="font-semibold text-green-800 dark:text-green-200">Berhasil</h3>
          <p class="text-green-700 dark:text-green-300">{{ successMessage }}</p>
        </div>
      </div>

      <!-- Calculate Button -->
      <div class="mb-8">
        <button
          @click="handleCalculateScore"
          :disabled="calculating"
          class="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
        >
          <svg
            v-if="!calculating"
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 mr-2 animate-spin"
            fill="none"
            stroke="currentColor"
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
          </svg>
          {{
            calculating
              ? 'Sedang Menghitung...'
              : scoreData
                ? 'Hitung Ulang Skor'
                : 'Hitung Skor Pesantren'
          }}
        </button>
      </div>

      <!-- Score Summary Cards -->
      <div v-if="scoreData" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Total Score Card -->
        <div
          class="bg-linear-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-700 rounded-lg p-6"
        >
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Total Skor</h3>
          <div class="flex items-end gap-4">
            <div class="text-5xl font-bold text-teal-600 dark:text-teal-400">
              {{ Math.round(scoreData.skor_total) }}
            </div>
            <div class="mb-1 text-gray-600 dark:text-gray-400">/ 100</div>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span v-if="scoreData.calculated_at">
              Dihitung: {{ formatDate(scoreData.calculated_at) }}
            </span>
          </p>
        </div>

        <!-- Category Card -->
        <div
          :class="[
            'bg-linear-to-br rounded-lg p-6 border',
            getCategoryColorClass(scoreData.kategori_kelayakan),
          ]"
        >
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Kategori Kelayakan
          </h3>
          <div class="text-3xl font-bold" :class="getKategoriColor(scoreData.kategori_kelayakan)">
            {{ translateKategori(scoreData.kategori_kelayakan) }}
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-4">
            {{ getKategoriDescription(scoreData.kategori_kelayakan) }}
          </p>
        </div>
      </div>

      <!-- Score Breakdown (Dimensi) -->
      <div v-if="scoreData" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Rincian Skor Dimensi</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Kelayakan Fisik -->
          <div
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Kelayakan Fisik</h3>
              <span
                class="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full"
              >
                {{ scoreData.skor_kelayakan_fisik }}%
              </span>
            </div>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Skor: {{ scoreData.skor_kelayakan_fisik }}</span
                  >
                  <span class="text-xs text-gray-500 dark:text-gray-400">Bobot: 40%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class="h-2 rounded-full bg-blue-600"
                    :style="{ width: Math.min(scoreData.skor_kelayakan_fisik, 100) + '%' }"
                  ></div>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Status bangunan, kondisi, luas, dan material bangunan (lantai, dinding, atap)
              </p>
            </div>
          </div>

          <!-- Air & Sanitasi -->
          <div
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Air & Sanitasi</h3>
              <span
                class="text-sm px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 rounded-full"
              >
                {{ scoreData.skor_air_sanitasi }}%
              </span>
            </div>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Skor: {{ scoreData.skor_air_sanitasi }}</span
                  >
                  <span class="text-xs text-gray-500 dark:text-gray-400">Bobot: 25%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class="h-2 rounded-full bg-cyan-600"
                    :style="{ width: Math.min(scoreData.skor_air_sanitasi, 100) + '%' }"
                  ></div>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Sumber air, kualitas air, dan fasilitas sanitasi
              </p>
            </div>
          </div>

          <!-- Fasilitas Pendukung -->
          <div
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Fasilitas Pendukung
              </h3>
              <span
                class="text-sm px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full"
              >
                {{ scoreData.skor_fasilitas_pendukung }}%
              </span>
            </div>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Skor: {{ scoreData.skor_fasilitas_pendukung }}</span
                  >
                  <span class="text-xs text-gray-500 dark:text-gray-400">Bobot: 20%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class="h-2 rounded-full bg-amber-600"
                    :style="{ width: Math.min(scoreData.skor_fasilitas_pendukung, 100) + '%' }"
                  ></div>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Listrik, fasilitas mengajar, komunikasi, transportasi, akses jalan
              </p>
            </div>
          </div>

          <!-- Mutu Pendidikan -->
          <div
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Mutu Pendidikan</h3>
              <span
                class="text-sm px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full"
              >
                {{ scoreData.skor_mutu_pendidikan }}%
              </span>
            </div>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Skor: {{ scoreData.skor_mutu_pendidikan }}</span
                  >
                  <span class="text-xs text-gray-500 dark:text-gray-400">Bobot: 15%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class="h-2 rounded-full bg-purple-600"
                    :style="{ width: Math.min(scoreData.skor_mutu_pendidikan, 100) + '%' }"
                  ></div>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Jenjang pendidikan, kurikulum, akreditasi, prestasi santri
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- No Score Message -->
      <div
        v-if="!scoreData && !loading"
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
      >
        <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">Belum Ada Skor</h3>
        <p class="text-blue-800 dark:text-blue-300 mb-4">
          Skor pesantren belum dihitung. Klik tombol "Hitung Skor Pesantren" di atas untuk
          menghitung skor kelayakan pesantren berdasarkan data yang tersedia.
        </p>
        <p class="text-sm text-blue-700 dark:text-blue-400">
          Pastikan data fisik, fasilitas, dan pendidikan sudah lengkap sebelum menghitung skor.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { calculatePesantrenScore, getPesantrenScore } from '../services/pesantrenScoringService.js'

const route = useRoute()
const router = useRouter()
const pesantrenId = route.params.id

const scoreData = ref(null)
const loading = ref(true)
const calculating = ref(false)
const error = ref(null)
const successMessage = ref(null)

onMounted(async () => {
  await loadScore()
})

async function loadScore() {
  loading.value = true
  error.value = null

  try {
    const score = await getPesantrenScore(pesantrenId)
    scoreData.value = score
  } catch (err) {
    console.error('Error loading score:', err)
    error.value = 'Gagal memuat data skor. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

async function handleCalculateScore() {
  calculating.value = true
  error.value = null
  successMessage.value = null

  try {
    const result = await calculatePesantrenScore(pesantrenId)
    scoreData.value = result
    successMessage.value = 'Skor pesantren berhasil dihitung!'

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      successMessage.value = null
    }, 5000)
  } catch (err) {
    console.error('Error calculating score:', err)
    error.value = 'Gagal menghitung skor. Pastikan data pesantren sudah lengkap.'
  } finally {
    calculating.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return 'Baru saja'

  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return 'Baru saja'
  }
}

function translateKategori(kategori) {
  const translations = {
    sangat_layak: 'Sangat Layak',
    layak: 'Layak',
    cukup_layak: 'Cukup Layak',
    tidak_layak: 'Tidak Layak',
  }
  return translations[kategori] || kategori
}

function getKategoriColor(kategori) {
  const colors = {
    sangat_layak: 'text-green-600 dark:text-green-400',
    layak: 'text-blue-600 dark:text-blue-400',
    cukup_layak: 'text-yellow-600 dark:text-yellow-400',
    tidak_layak: 'text-red-600 dark:text-red-400',
  }
  return colors[kategori] || 'text-gray-600 dark:text-gray-400'
}

function getCategoryColorClass(kategori) {
  const classes = {
    sangat_layak:
      'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700',
    layak:
      'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700',
    cukup_layak:
      'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-700',
    tidak_layak:
      'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-700',
  }
  return (
    classes[kategori] ||
    'from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-700'
  )
}

function getKategoriDescription(kategori) {
  const descriptions = {
    sangat_layak: 'Pesantren memiliki fasilitas dan standar pendidikan yang sangat baik',
    layak: 'Pesantren memiliki fasilitas dan standar pendidikan yang baik',
    cukup_layak: 'Pesantren memiliki fasilitas dan standar pendidikan yang cukup memadai',
    tidak_layak: 'Pesantren perlu peningkatan fasilitas dan standar pendidikan',
  }
  return descriptions[kategori] || ''
}
</script>

<style scoped></style>
