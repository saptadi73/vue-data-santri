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

      <!-- Scoring Guide -->
      <div
        class="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
      >
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg
            class="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400"
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
          Panduan Penilaian Kelayakan
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Kategori Kelayakan -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Kategori Kelayakan Pesantren
            </h3>
            <div class="space-y-2">
              <div class="flex items-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold mr-3"
                >
                  90+
                </div>
                <div>
                  <p class="font-semibold text-green-700 dark:text-green-400">Sangat Layak</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    Kondisi sangat baik, memenuhi semua standar
                  </p>
                </div>
              </div>

              <div class="flex items-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold mr-3"
                >
                  75-89
                </div>
                <div>
                  <p class="font-semibold text-blue-700 dark:text-blue-400">Layak</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    Kondisi baik, memenuhi standar kelayakan
                  </p>
                </div>
              </div>

              <div class="flex items-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold mr-3"
                >
                  60-74
                </div>
                <div>
                  <p class="font-semibold text-yellow-700 dark:text-yellow-400">Cukup Layak</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    Kondisi cukup, perlu beberapa perbaikan
                  </p>
                </div>
              </div>

              <div class="flex items-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold mr-3"
                >
                  &lt;60
                </div>
                <div>
                  <p class="font-semibold text-red-700 dark:text-red-400">Tidak Layak</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    Kondisi kurang, perlu perbaikan menyeluruh
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Dimensi Penilaian -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Dimensi Penilaian
            </h3>
            <div class="space-y-2">
              <div class="p-5 bg-white dark:bg-gray-800 rounded-lg">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    Kelayakan Fisik Bangunan
                  </p>
                  <span class="text-sm font-bold text-blue-600 dark:text-blue-400">40%</span>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Kondisi, status, keamanan, material bangunan
                </p>
              </div>

              <div class="p-5 bg-white dark:bg-gray-800 rounded-lg">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    Air Bersih & Sanitasi
                  </p>
                  <span class="text-sm font-bold text-cyan-600 dark:text-cyan-400">25%</span>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Sumber air, kualitas, fasilitas sanitasi
                </p>
              </div>

              <div class="p-5 bg-white dark:bg-gray-800 rounded-lg">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    Fasilitas Pendukung
                  </p>
                  <span class="text-sm font-bold text-amber-600 dark:text-amber-400">20%</span>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Listrik, mengajar, komunikasi, transportasi
                </p>
              </div>

              <div class="p-5 bg-white dark:bg-gray-800 rounded-lg">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">Mutu Pendidikan</p>
                  <span class="text-sm font-bold text-purple-600 dark:text-purple-400">15%</span>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Jenjang, kurikulum, akreditasi, prestasi
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <p class="text-xs text-blue-900 dark:text-blue-200">
            <strong>Catatan:</strong> Skor dihitung berdasarkan data fisik, fasilitas, dan
            pendidikan pesantren. Setiap parameter dinilai dan dikombinasikan dengan bobot yang
            telah ditentukan untuk menghasilkan skor akhir.
          </p>
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
              {{ Math.round(scoreData.skor_total || 0) }}
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
      <div v-if="breakdown && breakdown.dimensi" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Rincian Skor Dimensi</h2>

        <div class="space-y-6">
          <!-- Loop through each dimension -->
          <div
            v-for="(dimensi, index) in breakdown.dimensi"
            :key="index"
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <!-- Dimension Header -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {{ dimensi.nama }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Bobot: {{ dimensi.bobot }}% | Kontribusi: {{ dimensi.kontribusi.toFixed(2) }}
                  </p>
                </div>
                <div class="text-right">
                  <div
                    class="text-3xl font-bold mb-1"
                    :class="getSkorColor(dimensi.skor, dimensi.skor_maks)"
                  >
                    {{ Math.round(dimensi.skor) }}
                  </div>
                  <span
                    class="text-sm px-3 py-1 rounded-full"
                    :class="getInterpretasiClass(dimensi.interpretasi)"
                  >
                    {{ dimensi.interpretasi }}
                  </span>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  class="h-3 rounded-full transition-all"
                  :class="getSkorBarColor(dimensi.skor, dimensi.skor_maks)"
                  :style="{ width: ((dimensi.skor / dimensi.skor_maks) * 100).toFixed(1) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Parameter Details -->
            <div class="p-6">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Detail Parameter:
              </h4>
              <div class="space-y-3">
                <div
                  v-for="(param, pIndex) in dimensi.detail"
                  :key="pIndex"
                  class="flex items-center justify-between py-2 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ param.parameter }}
                    </p>
                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {{ formatNilaiParameter(param.nilai) }}
                    </p>
                  </div>
                  <div
                    class="ml-4 px-3 py-1 rounded-full text-sm font-semibold"
                    :class="getParamSkorClass(param.skor)"
                  >
                    {{ param.skor }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Section -->
        <div
          v-if="breakdown.interpretasi_kategori"
          class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <p class="text-sm text-blue-900 dark:text-blue-200">
            <strong>Interpretasi Keseluruhan:</strong> {{ breakdown.interpretasi_kategori }}
          </p>
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
const breakdown = ref(null)
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
    const response = await getPesantrenScore(pesantrenId)

    // If no score exists yet, it's not an error - just no data
    if (!response) {
      console.log('No score data found yet. User can calculate a new score.')
      scoreData.value = null
      breakdown.value = null
    } else {
      // API returns { skor: {...}, breakdown: {...} }
      scoreData.value = response.skor || response
      breakdown.value = response.breakdown || null

      console.log('Loaded score data:', scoreData.value)
      console.log('Loaded breakdown:', breakdown.value)
    }
  } catch (err) {
    console.error('Error loading score:', err)
    // Only show error for actual errors, not for missing data
    if (err.message && !err.message.includes('404')) {
      error.value = 'Gagal memuat data skor. Silakan coba lagi.'
    }
  } finally {
    loading.value = false
  }
}

async function handleCalculateScore() {
  calculating.value = true
  error.value = null
  successMessage.value = null

  try {
    const response = await calculatePesantrenScore(pesantrenId)

    // API returns { skor: {...}, breakdown: {...} }
    scoreData.value = response.skor || response
    breakdown.value = response.breakdown || null

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

// Helper functions for breakdown display
function getSkorColor(skor, skorMaks) {
  const percentage = (skor / skorMaks) * 100
  if (percentage >= 90) return 'text-green-600 dark:text-green-400'
  if (percentage >= 75) return 'text-blue-600 dark:text-blue-400'
  if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

function getSkorBarColor(skor, skorMaks) {
  const percentage = (skor / skorMaks) * 100
  if (percentage >= 90) return 'bg-green-600'
  if (percentage >= 75) return 'bg-blue-600'
  if (percentage >= 60) return 'bg-yellow-600'
  return 'bg-red-600'
}

function getInterpretasiClass(interpretasi) {
  const lower = interpretasi?.toLowerCase() || ''
  if (lower.includes('sangat baik')) {
    return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
  }
  if (lower.includes('baik')) {
    return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
  }
  if (lower.includes('cukup')) {
    return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
  }
  if (lower.includes('kurang') || lower.includes('buruk')) {
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
  }
  return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

function getParamSkorClass(skor) {
  if (skor >= 90) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
  if (skor >= 75) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
  if (skor >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
  if (skor > 0) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
  return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
}

function formatNilaiParameter(nilai) {
  if (!nilai) return 'Tidak ada data'
  // Remove "enum." suffix from backend enum values
  return nilai.replace(/enum\./gi, '').replace(/_/g, ' ')
}
</script>

<style scoped></style>
