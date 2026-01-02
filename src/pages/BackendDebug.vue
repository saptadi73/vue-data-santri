<script setup>
import { ref, computed } from 'vue'
import {
  testBackendConnection,
  testScoringEndpoints,
  testGISEndpoints,
  testSantriEndpoints,
  runFullBackendDiagnostics,
} from '@/utils/backendDebug'
import {
  detailedGISDebug,
  checkCORS,
  testGISWithFilters,
  networkTrace,
  validateResponseFormat,
  checkBackendHealth,
} from '@/utils/advancedDebug'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const ENV_MODE = import.meta.env.MODE
const testResults = ref([])
const isTestRunning = ref(false)
const selectedTest = ref('connection')

const commands = {
  diagnostics:
    'import {runFullBackendDiagnostics} from "@/utils/backendDebug"; runFullBackendDiagnostics()',
  connection: 'import {testBackendConnection} from "@/utils/backendDebug"; testBackendConnection()',
  gis: 'import {testGISEndpoints} from "@/utils/backendDebug"; testGISEndpoints()',
  scoring: 'import {testScoringEndpoints} from "@/utils/backendDebug"; testScoringEndpoints()',
  santri: 'import {testSantriEndpoints} from "@/utils/backendDebug"; testSantriEndpoints()',
  detailedGIS: 'import {detailedGISDebug} from "@/utils/advancedDebug"; detailedGISDebug()',
  cors: 'import {checkCORS} from "@/utils/advancedDebug"; checkCORS()',
  health: 'import {checkBackendHealth} from "@/utils/advancedDebug"; checkBackendHealth()',
}

const testOptions = [
  { value: 'connection', label: '🔌 Test Backend Connection' },
  { value: 'scoring', label: '📊 Test Scoring Endpoints' },
  { value: 'gis', label: '🗺️ Test GIS Endpoints' },
  { value: 'santri', label: '👤 Test Santri API' },
  { value: 'full', label: '🔍 Run Full Diagnostics' },
  { value: 'health', label: '🏥 Backend Health Check' },
  { value: 'detailedGIS', label: '📋 Detailed GIS Debug' },
  { value: 'cors', label: '🔐 Check CORS Config' },
]

const runTest = async () => {
  isTestRunning.value = true
  testResults.value = []

  console.clear()
  console.log('%c🧪 Running Backend Tests', 'color: blue; font-size: 14px; font-weight: bold')

  try {
    switch (selectedTest.value) {
      case 'connection':
        await testBackendConnection()
        break
      case 'scoring':
        await testScoringEndpoints()
        break
      case 'gis':
        await testGISEndpoints()
        break
      case 'santri':
        await testSantriEndpoints()
        break
      case 'full':
        await runFullBackendDiagnostics()
        break
      case 'health':
        await checkBackendHealth()
        break
      case 'detailedGIS':
        await detailedGISDebug()
        break
      case 'cors':
        await checkCORS()
        break
    }

    console.log(
      '%c✅ Test completed! Check console for detailed results.',
      'color: green; font-weight: bold',
    )
  } catch (error) {
    console.error('❌ Test failed:', error)
  }

  isTestRunning.value = false
}

const copyCommand = (key) => {
  const command = commands[key]
  navigator.clipboard.writeText(command).then(() => {
    alert('Command copied to clipboard! Paste in browser console.')
  })
}
</script>

<template>
  <div
    class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6"
  >
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          🔧 Backend Debug Console
        </h1>
        <p class="text-slate-600 dark:text-slate-400">Test and debug backend endpoints</p>
      </div>

      <!-- Connection Status -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-500"
      >
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">
          📍 Backend Connection
        </h2>
        <div class="space-y-2 mb-4">
          <p class="text-sm">
            <span class="font-medium">API Base URL:</span>
            <code
              class="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-blue-600 dark:text-blue-400"
            >
              {{ API_BASE }}
            </code>
          </p>
          <p class="text-sm">
            <span class="font-medium">Environment:</span>
            <code class="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{{ ENV_MODE }}</code>
          </p>
        </div>
      </div>

      <!-- Test Selection -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">🧪 Select Test</h2>

        <div class="space-y-3 mb-6">
          <div v-for="option in testOptions" :key="option.value" class="flex items-center">
            <input
              :id="option.value"
              v-model="selectedTest"
              type="radio"
              :value="option.value"
              class="h-4 w-4 text-blue-600 dark:text-blue-400"
            />
            <label
              :for="option.value"
              class="ml-3 cursor-pointer text-slate-700 dark:text-slate-300 font-medium"
            >
              {{ option.label }}
            </label>
          </div>
        </div>

        <button
          @click="runTest"
          :disabled="isTestRunning"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition"
        >
          <span v-if="!isTestRunning">▶️ Run Test</span>
          <span v-else>⏳ Running...</span>
        </button>
      </div>

      <!-- Quick Commands -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          ⚡ Quick Console Commands
        </h2>

        <div class="space-y-3">
          <!-- Diagnostics -->
          <div class="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
            <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Full Diagnostics:
            </p>
            <code
              class="text-xs bg-slate-800 text-green-400 p-2 rounded block overflow-x-auto mb-2 whitespace-pre-wrap wrap-break-word"
            >
              runFullBackendDiagnostics()
            </code>
            <button
              @click="copyCommand('diagnostics')"
              class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              📋 Copy
            </button>
          </div>

          <!-- Test Connection -->
          <div class="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
            <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Test Connection:
            </p>
            <code
              class="text-xs bg-slate-800 text-green-400 p-2 rounded block overflow-x-auto mb-2 whitespace-pre-wrap wrap-break-word"
            >
              testBackendConnection()
            </code>
            <button
              @click="copyCommand('connection')"
              class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              📋 Copy
            </button>
          </div>

          <!-- Test GIS -->
          <div class="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
            <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Test GIS:</p>
            <code
              class="text-xs bg-slate-800 text-green-400 p-2 rounded block overflow-x-auto mb-2 whitespace-pre-wrap wrap-break-word"
            >
              testGISEndpoints()
            </code>
            <button
              @click="copyCommand('gis')"
              class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              📋 Copy
            </button>
          </div>

          <!-- Test Scoring -->
          <div class="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
            <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Test Scoring:</p>
            <code
              class="text-xs bg-slate-800 text-green-400 p-2 rounded block overflow-x-auto mb-2 whitespace-pre-wrap wrap-break-word"
            >
              testScoringEndpoints()
            </code>
            <button
              @click="copyCommand('scoring')"
              class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              📋 Copy
            </button>
          </div>

          <!-- Test Santri -->
          <div class="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
            <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Test Santri API:
            </p>
            <code
              class="text-xs bg-slate-800 text-green-400 p-2 rounded block overflow-x-auto mb-2 whitespace-pre-wrap wrap-break-word"
            >
              testSantriEndpoints()
            </code>
            <button
              @click="copyCommand('santri')"
              class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              📋 Copy
            </button>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div
        class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6"
      >
        <h2 class="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
          📖 How to Use
        </h2>

        <ol class="space-y-2 text-sm text-yellow-800 dark:text-yellow-200 list-decimal list-inside">
          <li>
            Open browser DevTools:
            <code class="bg-white dark:bg-slate-800 px-2 py-1 rounded">F12</code>
          </li>
          <li>Go to <strong>Console</strong> tab</li>
          <li>Select a test type above</li>
          <li>Click <strong>Run Test</strong> button</li>
          <li>Check console output for results</li>
          <li>Or copy a quick command and paste directly in console</li>
        </ol>
      </div>

      <!-- API Endpoints Reference -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          📚 API Endpoints Reference
        </h2>

        <div class="space-y-4">
          <div class="border-l-4 border-green-500 pl-4">
            <h3 class="font-semibold text-slate-900 dark:text-white">Scoring</h3>
            <code class="text-sm text-green-600 dark:text-green-400 block"
              >POST {{ API_BASE }}/api/scoring/{'{santriId}'}/calculate</code
            >
            <code class="text-sm text-green-600 dark:text-green-400 block"
              >GET {{ API_BASE }}/api/scoring/santri/{'{santriId}'}</code
            >
          </div>

          <div class="border-l-4 border-blue-500 pl-4">
            <h3 class="font-semibold text-slate-900 dark:text-white">GIS</h3>
            <code class="text-sm text-blue-600 dark:text-blue-400 block"
              >GET {{ API_BASE }}/gis/santri-points</code
            >
            <code class="text-sm text-blue-600 dark:text-blue-400 block"
              >GET {{ API_BASE }}/gis/pesantren-points</code
            >
            <code class="text-sm text-blue-600 dark:text-blue-400 block"
              >GET {{ API_BASE }}/gis/heatmap</code
            >
            <code class="text-sm text-blue-600 dark:text-blue-400 block"
              >GET {{ API_BASE }}/gis/pesantren-heatmap</code
            >
          </div>

          <div class="border-l-4 border-purple-500 pl-4">
            <h3 class="font-semibold text-slate-900 dark:text-white">Santri API</h3>
            <code class="text-sm text-purple-600 dark:text-purple-400 block"
              >GET {{ API_BASE }}/api/santri-pribadi</code
            >
            <code class="text-sm text-purple-600 dark:text-purple-400 block"
              >GET {{ API_BASE }}/api/santri-pribadi/{'{santriId}'}</code
            >
            <code class="text-sm text-purple-600 dark:text-purple-400 block"
              >POST {{ API_BASE }}/api/santri-pribadi</code
            >
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-sm text-slate-600 dark:text-slate-400 mt-8">
        <p>🔍 Backend Debug Console v1.0</p>
        <p>Created for development and testing purposes</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
code {
  font-family: 'Courier New', monospace;
}
</style>
