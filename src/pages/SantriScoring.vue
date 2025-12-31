<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <router-link
            :to="`/santri/${santriId}/edit`"
            class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </router-link>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Scoring Santri</h1>
        </div>
        <p class="text-gray-600 dark:text-gray-400">
          Hitung dan analisis skor kemiskinan santri berdasarkan berbagai indikator
        </p>
      </div>

      <!-- Calculate Score Card -->
      <div
        class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ scoreExists ? 'Hitung Ulang Skor' : 'Hitung Skor Santri' }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{
                scoreExists
                  ? 'Klik tombol di bawah untuk menghitung ulang skor berdasarkan data terbaru.'
                  : 'Belum ada data skor. Klik tombol di bawah untuk menghitung skor pertama kali.'
              }}
            </p>

            <!-- Info Box -->
            <div
              class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4"
            >
              <div class="flex items-start gap-3">
                <svg
                  class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0"
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
                <div class="text-sm text-blue-800 dark:text-blue-300">
                  <p class="font-medium mb-1">Indikator yang dinilai:</p>
                  <ul class="list-disc list-inside space-y-1 ml-2">
                    <li>Kondisi Ekonomi Orang Tua</li>
                    <li>Kondisi Rumah</li>
                    <li>Kepemilikan Aset</li>
                    <li>Pembiayaan Pendidikan</li>
                    <li>Kondisi Kesehatan</li>
                    <li>Bantuan Sosial yang Diterima</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Kategori Kemiskinan Info -->
            <div
              class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4"
            >
              <div class="flex items-start gap-3">
                <svg
                  class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  <p class="font-medium mb-2">Kategori Kemiskinan berdasarkan Total Skor:</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-red-500"></div>
                      <span
                        ><strong class="text-red-700 dark:text-red-400">Sangat Miskin:</strong> Skor
                        ≥ 80</span
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span
                        ><strong class="text-orange-700 dark:text-orange-400">Miskin:</strong> Skor
                        65-79</span
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span
                        ><strong class="text-yellow-700 dark:text-yellow-400">Rentan:</strong> Skor
                        45-64</span
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-green-500"></div>
                      <span
                        ><strong class="text-green-700 dark:text-green-400">Tidak Miskin:</strong>
                        Skor &lt; 45</span
                      >
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">
                    * Semakin tinggi skor, semakin tinggi tingkat kemiskinan
                  </p>
                </div>
              </div>
            </div>

            <button
              @click="handleCalculateScore"
              :disabled="isCalculating"
              :class="[
                'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition',
                isCalculating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg',
              ]"
            >
              <svg
                v-if="isCalculating"
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              {{
                isCalculating ? 'Menghitung...' : scoreExists ? 'Hitung Ulang Skor' : 'Hitung Skor'
              }}
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mt-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5"
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
            <p class="text-sm text-red-800 dark:text-red-300">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="mt-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4"
        >
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5"
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
            <p class="text-sm text-green-800 dark:text-green-300">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Score Result Table -->
      <div
        v-if="scoreData"
        class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Hasil Scoring</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Dihitung pada: {{ formatDate(scoreData.calculated_at) }}
          </p>
        </div>

        <!-- Warning untuk data tidak lengkap -->
        <div
          v-if="isScoreIncomplete(scoreData)"
          class="p-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800"
        >
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div class="flex-1">
              <p class="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                Data Belum Lengkap
              </p>
              <p class="text-sm text-yellow-700 dark:text-yellow-400">
                Skor sangat rendah atau 0 karena data santri belum lengkap. Pastikan semua data
                telah diisi:
                <strong>Orang Tua, Asset, Rumah, Kesehatan, Bansos, dan Pembiayaan</strong>.
              </p>
            </div>
          </div>
        </div>

        <!-- Score Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gray-50 dark:bg-gray-900/50">
          <div
            :class="[
              'rounded-lg p-4 border-2',
              getKategoriColor(scoreData.kategori_kemiskinan).border,
            ]"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Skor</p>
                <p
                  :class="[
                    'text-3xl font-bold',
                    getKategoriColor(scoreData.kategori_kemiskinan).text,
                  ]"
                >
                  {{ getTotalScore(scoreData) }}
                </p>
                <p
                  v-if="scoreData.skor_total !== getTotalScore(scoreData)"
                  class="text-xs text-gray-500 mt-1"
                >
                  (API: {{ scoreData.skor_total }})
                </p>
              </div>
              <div
                :class="[
                  'w-16 h-16 rounded-full flex items-center justify-center',
                  getKategoriColor(scoreData.kategori_kemiskinan).bg,
                ]"
              >
                <svg
                  class="w-8 h-8"
                  :class="getKategoriColor(scoreData.kategori_kemiskinan).text"
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
              </div>
            </div>
          </div>

          <div
            :class="[
              'rounded-lg p-4 border-2',
              getKategoriColor(scoreData.kategori_kemiskinan).border,
            ]"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Kategori Kemiskinan</p>
                <p
                  :class="[
                    'text-2xl font-bold',
                    getKategoriColor(scoreData.kategori_kemiskinan).text,
                  ]"
                >
                  {{ scoreData.kategori_kemiskinan }}
                </p>
              </div>
              <div
                :class="[
                  'w-16 h-16 rounded-full flex items-center justify-center',
                  getKategoriColor(scoreData.kategori_kemiskinan).bg,
                ]"
              >
                <svg
                  class="w-8 h-8"
                  :class="getKategoriColor(scoreData.kategori_kemiskinan).text"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Score Breakdown by Dimensi -->
        <div class="space-y-4">
          <div
            v-for="(dimensi, index) in scoreData.breakdown?.dimensi || []"
            :key="index"
            class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <!-- Dimensi Header -->
            <div class="bg-gray-50 dark:bg-gray-900/50 px-6 py-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p class="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Dimensi
                  </p>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {{ dimensi.nama }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Skor
                  </p>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {{ dimensi.skor }} / {{ dimensi.skor_maks }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Kontribusi
                  </p>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {{ dimensi.kontribusi }}% (Bobot: {{ dimensi.bobot }}%)
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Interpretasi
                  </p>
                  <p
                    :class="[
                      'text-lg font-semibold mt-1',
                      getInterpretasiColor(dimensi.interpretasi).text,
                    ]"
                  >
                    {{ dimensi.interpretasi }}
                  </p>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mt-4">
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    :style="{ width: ((dimensi.skor / dimensi.skor_maks) * 100).toFixed(1) + '%' }"
                    :class="[
                      'h-2 rounded-full transition-all',
                      getProgressColor(dimensi.skor, dimensi.skor_maks),
                    ]"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Detail Parameters -->
            <div
              v-if="dimensi.detail && dimensi.detail.length > 0"
              class="bg-white dark:bg-gray-800"
            >
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead
                    class="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700"
                  >
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Parameter
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Nilai
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Skor
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr
                      v-for="(param, pidx) in dimensi.detail"
                      :key="pidx"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td
                        class="px-6 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                      >
                        {{ param.parameter }}
                      </td>
                      <td
                        class="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ param.nilai }}
                      </td>
                      <td
                        class="px-6 py-3 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        {{ param.skor }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Old Table for reference (keep backup) -->
        <!-- Detailed Score Breakdown -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Indikator
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Skor
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Persentase
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white"
                      >Skor Ekonomi</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{
                    scoreData.skor_ekonomi
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm text-gray-600 dark:text-gray-400"
                    >{{ getPercentage(scoreData.skor_ekonomi, getTotalScore(scoreData)) }}%</span
                  >
                </td>
              </tr>

              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white"
                      >Skor Rumah</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{
                    scoreData.skor_rumah
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm text-gray-600 dark:text-gray-400"
                    >{{ getPercentage(scoreData.skor_rumah, getTotalScore(scoreData)) }}%</span
                  >
                </td>
              </tr>

              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">Skor Aset</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{
                    scoreData.skor_aset
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm text-gray-600 dark:text-gray-400"
                    >{{ getPercentage(scoreData.skor_aset, getTotalScore(scoreData)) }}%</span
                  >
                </td>
              </tr>

              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white"
                      >Skor Pembiayaan</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{
                    scoreData.skor_pembiayaan
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm text-gray-600 dark:text-gray-400"
                    >{{ getPercentage(scoreData.skor_pembiayaan, getTotalScore(scoreData)) }}%</span
                  >
                </td>
              </tr>

              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-red-500"></div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white"
                      >Skor Kesehatan</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{
                    scoreData.skor_kesehatan
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm text-gray-600 dark:text-gray-400"
                    >{{ getPercentage(scoreData.skor_kesehatan, getTotalScore(scoreData)) }}%</span
                  >
                </td>
              </tr>

              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white"
                      >Skor Bansos</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{
                    scoreData.skor_bansos
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm text-gray-600 dark:text-gray-400"
                    >{{ getPercentage(scoreData.skor_bansos, getTotalScore(scoreData)) }}%</span
                  >
                </td>
              </tr>

              <tr class="bg-gray-100 dark:bg-gray-900 font-semibold">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-bold text-gray-900 dark:text-white"
                    >Total (Dihitung)</span
                  >
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm font-bold text-gray-900 dark:text-white">{{
                    getTotalScore(scoreData)
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm font-bold text-gray-900 dark:text-white">100%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Metadata -->
        <div
          class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-gray-600 dark:text-gray-400">Metode:</span>
              <span class="ml-2 font-medium text-gray-900 dark:text-white">{{
                scoreData.metode
              }}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Versi:</span>
              <span class="ml-2 font-medium text-gray-900 dark:text-white">{{
                scoreData.version
              }}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">ID Skor:</span>
              <span class="ml-2 font-mono text-xs text-gray-900 dark:text-white">{{
                scoreData.id
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  calculateSantriScore,
  getSantriScore,
  checkSantriScoreExists,
} from '../services/scoringService'

const route = useRoute()
const santriId = computed(() => route.params.id)

const scoreData = ref(null)
const isCalculating = ref(false)
const scoreExists = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Load existing score on mount
onMounted(async () => {
  await loadScore()
})

const loadScore = async () => {
  try {
    scoreExists.value = await checkSantriScoreExists(santriId.value)
    if (scoreExists.value) {
      scoreData.value = await getSantriScore(santriId.value)
    }
  } catch (error) {
    console.error('Error loading score:', error)
  }
}

const handleCalculateScore = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isCalculating.value = true

  console.log('📊 [SantriScoring] Starting score calculation for santri:', santriId.value)

  try {
    console.log('📊 [SantriScoring] Calling calculateSantriScore...')
    const result = await calculateSantriScore(santriId.value)
    console.log('✅ [SantriScoring] Score calculation successful:', result)
    scoreData.value = result
    scoreExists.value = true
    successMessage.value = 'Skor berhasil dihitung dan disimpan!'

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error('❌ [SantriScoring] Error calculating score:', error)
    console.error('❌ [SantriScoring] Error message:', error.message)
    console.error('❌ [SantriScoring] Full error object:', error)

    // Provide more detailed error message
    let detailedError = error.message || 'Gagal menghitung skor'

    // If error message contains common issues
    if (error.message?.includes('400')) {
      detailedError += ' - Silakan periksa console untuk detail error dari server'
    } else if (error.message?.includes('500')) {
      detailedError = 'Server error. Hubungi administrator.'
    }

    errorMessage.value = detailedError
  } finally {
    isCalculating.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Baru saja'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    return 'Baru saja'
  }
}

const getPercentage = (score, total) => {
  if (!total || total === 0) return '0'
  return ((score / total) * 100).toFixed(1)
}

const getTotalScore = (data) => {
  // Hitung manual karena backend mungkin salah
  if (!data) return 0
  return (
    (data.skor_ekonomi || 0) +
    (data.skor_rumah || 0) +
    (data.skor_aset || 0) +
    (data.skor_pembiayaan || 0) +
    (data.skor_kesehatan || 0) +
    (data.skor_bansos || 0)
  )
}

const isScoreIncomplete = (data) => {
  if (!data) return false
  const totalCalculated = getTotalScore(data)
  // Jika total < 10, kemungkinan data belum lengkap
  return totalCalculated < 10
}

const getKategoriColor = (kategori) => {
  switch (kategori) {
    case 'Sangat Miskin':
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-300 dark:border-red-700',
      }
    case 'Miskin':
      return {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-300 dark:border-orange-700',
      }
    case 'Rentan':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        border: 'border-yellow-300 dark:border-yellow-700',
      }
    case 'Tidak Miskin':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-300 dark:border-green-700',
      }
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-700 dark:text-gray-400',
        border: 'border-gray-300 dark:border-gray-600',
      }
  }
}

const getInterpretasiColor = (interpretasi) => {
  switch (interpretasi) {
    case 'Buruk':
      return {
        text: 'text-red-700 dark:text-red-400',
        bg: 'bg-red-100 dark:bg-red-900/30',
      }
    case 'Sedang':
      return {
        text: 'text-yellow-700 dark:text-yellow-400',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      }
    case 'Baik':
      return {
        text: 'text-green-700 dark:text-green-400',
        bg: 'bg-green-100 dark:bg-green-900/30',
      }
    default:
      return {
        text: 'text-gray-700 dark:text-gray-400',
        bg: 'bg-gray-100 dark:bg-gray-700',
      }
  }
}

const getProgressColor = (score, maxScore) => {
  const percentage = (score / maxScore) * 100
  if (percentage <= 33) return 'bg-green-500'
  if (percentage <= 66) return 'bg-yellow-500'
  return 'bg-red-500'
}
</script>
