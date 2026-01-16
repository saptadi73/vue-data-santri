<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ title }}
          </h2>
          <button
            v-if="!isProcessing"
            @click="close"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Processing State -->
        <div v-if="isProcessing" class="space-y-6">
          <!-- Spinner -->
          <div class="flex justify-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>

          <!-- Status Message -->
          <div class="text-center">
            <p class="text-gray-600 dark:text-gray-400 mb-2">{{ statusMessage }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-500">
              Estimasi waktu: {{ estimatedTime }}
            </p>
          </div>

          <!-- Progress Bar -->
          <div class="w-full">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Progress</span>
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ progressPercent }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: progressPercent + '%' }"
              ></div>
            </div>
          </div>

          <!-- Info -->
          <div class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p class="text-sm text-blue-800 dark:text-blue-300">
              ⏱️ Proses sedang berjalan. Jangan tutup halaman atau browser ini.
            </p>
          </div>
        </div>

        <!-- Success State -->
        <div v-else-if="isSuccess && result" class="space-y-6">
          <!-- Success Icon -->
          <div class="flex justify-center">
            <div class="bg-green-100 dark:bg-green-900/30 rounded-full p-3">
              <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <!-- Success Message -->
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ result.message }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Batch scoring telah selesai diproses.
            </p>
          </div>

          <!-- Stats -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Diproses:</span>
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{ result.totalProcessed }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Berhasil:</span>
              <span class="text-sm font-bold text-green-600 dark:text-green-400">{{ result.totalSuccess }}</span>
            </div>
            <div v-if="result.totalErrors > 0" class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Error:</span>
              <span class="text-sm font-bold text-red-600 dark:text-red-400">{{ result.totalErrors }}</span>
            </div>

            <!-- Category Stats -->
            <div v-if="result.categoryStats && Object.keys(result.categoryStats).length > 0" class="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
              <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Distribusi Kategori:</p>
              <div class="space-y-1 text-xs">
                <div v-if="result.categoryStats['Sangat Miskin'] > 0" class="flex justify-between">
                  <span class="text-gray-700 dark:text-gray-300">Sangat Miskin:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ result.categoryStats['Sangat Miskin'] }}</span>
                </div>
                <div v-if="result.categoryStats['Miskin'] > 0" class="flex justify-between">
                  <span class="text-gray-700 dark:text-gray-300">Miskin:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ result.categoryStats['Miskin'] }}</span>
                </div>
                <div v-if="result.categoryStats['Rentan'] > 0" class="flex justify-between">
                  <span class="text-gray-700 dark:text-gray-300">Rentan:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ result.categoryStats['Rentan'] }}</span>
                </div>
                <div v-if="result.categoryStats['Mampu'] > 0" class="flex justify-between">
                  <span class="text-gray-700 dark:text-gray-300">Mampu:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ result.categoryStats['Mampu'] }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Close Button -->
          <button
            @click="close"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>

        <!-- Error State -->
        <div v-else-if="isError && errorMessage" class="space-y-6">
          <!-- Error Icon -->
          <div class="flex justify-center">
            <div class="bg-red-100 dark:bg-red-900/30 rounded-full p-3">
              <svg class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <!-- Error Message -->
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Terjadi Kesalahan
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ errorMessage }}
            </p>
          </div>

          <!-- Error Details -->
          <div v-if="errorDetails" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p class="text-xs text-red-800 dark:text-red-300 font-mono break-all">
              {{ errorDetails }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              @click="retry"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Coba Lagi
            </button>
            <button
              @click="close"
              class="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Proses Batch Scoring',
  },
  isProcessing: {
    type: Boolean,
    default: false,
  },
  statusMessage: {
    type: String,
    default: 'Sedang memproses data...',
  },
  estimatedTime: {
    type: String,
    default: '15-30 detik',
  },
  progressPercent: {
    type: Number,
    default: 0,
  },
  isSuccess: {
    type: Boolean,
    default: false,
  },
  isError: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  errorDetails: {
    type: String,
    default: '',
  },
  result: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'retry'])

const close = () => {
  emit('close')
}

const retry = () => {
  emit('retry')
}
</script>

<style scoped>
/* Animation untuk progress bar */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
