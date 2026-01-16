<script setup>
import { ref, computed, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { executeQuery, getIntents } from '@/services/nl2sqlService'

const props = defineProps({
  compact: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'Tanyakan tentang data santri atau pesantren...',
  },
  suggestedQueries: {
    type: Array,
    default: () => [
      'Tunjukkan 10 santri terbaru',
      'Berapa jumlah santri miskin?',
      'Top 5 pesantren dengan skor tertinggi',
      'Distribusi santri per kategori kemiskinan',
    ],
  },
})

const emit = defineEmits(['result', 'error'])
const ApexChart = VueApexCharts

// State
const query = ref('')
const isLoading = ref(false)
const result = ref(null)
const error = ref(null)
const queryHistory = ref([])
const intents = ref([])
const showSuggestions = ref(false)
const chartType = ref('bar')

// Get suggestions from intents
const fetchIntents = async () => {
  try {
    const data = await getIntents()
    if (data.success && data.data.intents) {
      intents.value = data.data.intents
    }
  } catch (err) {
    console.warn('Failed to load intents:', err)
  }
}

// Execute NL2SQL query
const handleSubmit = async () => {
  if (!query.value.trim()) return

  isLoading.value = true
  error.value = null
  result.value = null

  try {
    const data = await executeQuery(query.value, true)

    if (data.success) {
      result.value = data.data

      // Add to history
      queryHistory.value.unshift({
        query: query.value,
        timestamp: new Date().toISOString(),
        intent: data.data.intent,
        resultCount: Array.isArray(data.data.result) ? data.data.result.length : 1,
      })

      // Keep only last 10 queries
      if (queryHistory.value.length > 10) {
        queryHistory.value = queryHistory.value.slice(0, 10)
      }

      // Emit result to parent
      emit('result', data.data)
    } else {
      throw new Error(data.error || 'Query failed')
    }
  } catch (err) {
    error.value = err.message || 'Terjadi kesalahan saat memproses query'
    emit('error', error.value)
  } finally {
    isLoading.value = false
  }
}

// Use suggested query
const useSuggestion = (suggestion) => {
  query.value = suggestion
  handleSubmit()
  showSuggestions.value = false
}

// Clear results
const clearResults = () => {
  result.value = null
  error.value = null
}

// Format result for display
const formattedResult = computed(() => {
  if (!result.value) return null

  const { intent, result: data, execution_time_ms } = result.value

  return {
    intent,
    executionTime: execution_time_ms?.toFixed(2) || 0,
    data,
    isArray: Array.isArray(data),
    count: Array.isArray(data) ? data.length : 1,
  }
})

// Transform tabular result into ApexCharts-friendly data
const chartData = computed(() => {
  if (!formattedResult.value?.isArray || !formattedResult.value.data.length) return null

  const rows = formattedResult.value.data
  // Filter out ID, UUID, dan coordinate columns
  const allKeys = Object.keys(rows[0])
  
  // Check if result has coordinate data (untuk map visualization)
  const hasCoordinates =
    allKeys.some((k) => k.toLowerCase().includes('latitude') || k.toLowerCase().includes('lat')) &&
    allKeys.some((k) => k.toLowerCase().includes('longitude') || k.toLowerCase().includes('lng'))
  
  // Jika ada koordinat, jangan tampilkan chart (karena akan ditampilkan di map)
  if (hasCoordinates) {
    return null
  }
  
  const keys = allKeys.filter(
    (k) =>
      !k.toLowerCase().includes('id') &&
      !k.toLowerCase().includes('uuid') &&
      !k.toLowerCase().includes('latitude') &&
      !k.toLowerCase().includes('lat') &&
      !k.toLowerCase().includes('longitude') &&
      !k.toLowerCase().includes('lng'),
  )

  if (keys.length < 2) return null

  // Prioritize name/category columns for labels
  const nameColumns = [
    'nama_santri',
    'nama',
    'name',
    'nama_pesantren',
    'pesantren',
    'kategori_kemiskinan',
    'kategori',
    'provinsi',
  ]
  const labelKey = keys.find((key) => nameColumns.includes(key.toLowerCase())) || keys[0]

  // Find numeric column for values (exclude score if it's coordinate data)
  const valueKey =
    keys.find((key) => {
      const value = rows[0][key]
      return typeof value === 'number' || !isNaN(Number(value))
    }) || keys[1]

  const labels = rows.map((row) => String(row[labelKey] || 'N/A'))
  const values = rows.map((row) => {
    const val = row[valueKey]
    return typeof val === 'number' ? val : Number(val) || 0
  })

  return {
    labels,
    values,
    labelKey,
    valueKey,
  }
})

const chartSeries = computed(() => {
  if (!chartData.value) return []
  if (chartType.value === 'pie') {
    return chartData.value.values
  }
  return [
    {
      name: chartData.value.valueKey,
      data: chartData.value.values,
    },
  ]
})

const chartOptions = computed(() => {
  if (!chartData.value) return {}

  const common = {
    dataLabels: { enabled: true },
    legend: { position: 'bottom', show: true },
  }

  if (chartType.value === 'pie') {
    return {
      ...common,
      labels: chartData.value.labels || [],
      chart: {
        id: 'nl2sql-pie',
        type: 'pie',
        toolbar: { show: false },
      },
      tooltip: {
        y: {
          formatter: (val) => val,
        },
      },
    }
  }

  const isLine = chartType.value === 'line'
  const baseConfig = {
    ...common,
    chart: {
      id: isLine ? 'nl2sql-line' : 'nl2sql-bar',
      type: chartType.value,
      toolbar: { show: false },
    },
    xaxis: {
      categories: chartData.value.labels || [],
      title: { text: chartData.value.labelKey },
    },
    yaxis: {
      title: { text: chartData.value.valueKey },
    },
    tooltip: {
      y: {
        formatter: (val) => val,
      },
    },
  }

  if (isLine) {
    baseConfig.stroke = { curve: 'smooth', width: 3 }
    baseConfig.markers = {
      size: 5,
      strokeWidth: 2,
      hover: {
        size: 7,
        sizeOffset: 3,
      },
    }
  } else {
    baseConfig.plotOptions = {
      bar: { borderRadius: 4, horizontal: false },
    }
    baseConfig.stroke = { show: true, width: 1 }
  }

  return baseConfig
})

// Intent badge color
const getIntentColor = (intent) => {
  const colors = {
    list: 'blue',
    filter: 'green',
    count: 'purple',
    statistics: 'orange',
    ranking: 'red',
    location: 'teal',
    heatmap: 'pink',
    scoring: 'indigo',
  }
  return colors[intent?.toLowerCase()] || 'gray'
}

// Get visible columns (exclude ID fields)
const getVisibleColumns = (data) => {
  if (!Array.isArray(data) || data.length === 0) return []
  const allKeys = Object.keys(data[0])
  // Filter out ID columns
  return allKeys.filter(
    (key) => !key.toLowerCase().includes('id') && !key.toLowerCase().includes('uuid'),
  )
}

// Get visible data (exclude ID columns)
const getVisibleData = (obj) => {
  if (!obj || typeof obj !== 'object') return {}
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([key]) => !key.toLowerCase().includes('id') && !key.toLowerCase().includes('uuid'),
    ),
  )
}

onMounted(() => {
  fetchIntents()
})
</script>

<template>
  <div :class="['nl2sql-widget', { compact }]">
    <!-- Header -->
    <div class="widget-header">
      <div class="header-content">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          />
        </svg>
        <h3 class="title">AI Search</h3>
      </div>
      <button v-if="result" @click="clearResults" class="clear-btn" title="Clear results">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="icon-small"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Input Area -->
    <div class="input-area">
      <form @submit.prevent="handleSubmit" class="input-form">
        <input
          v-model="query"
          type="text"
          :placeholder="placeholder"
          class="input-field"
          :disabled="isLoading"
          @focus="showSuggestions = true"
        />
        <button
          type="submit"
          class="submit-btn"
          :disabled="isLoading || !query.trim()"
          :title="isLoading ? 'Processing...' : 'Search'"
        >
          <svg
            v-if="!isLoading"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="icon-small"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
          <div v-else class="spinner-small"></div>
        </button>
      </form>

      <!-- Suggested Queries -->
      <div v-if="showSuggestions && !result && suggestedQueries.length" class="suggestions">
        <p class="suggestions-label">Saran query:</p>
        <div class="suggestion-chips">
          <button
            v-for="(suggestion, index) in suggestedQueries"
            :key="index"
            @click="useSuggestion(suggestion)"
            class="suggestion-chip"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Memproses query...</p>
    </div>

    <!-- Error State -->
    <div v-if="error && !isLoading" class="error-state">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="icon-error"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <p class="error-message">{{ error }}</p>
      <button @click="error = null" class="dismiss-btn">Dismiss</button>
    </div>

    <!-- Result Display -->
    <div v-if="formattedResult && !isLoading" class="result-container">
      <!-- Result Header -->
      <div class="result-header">
        <div class="result-meta">
          <span :class="['intent-badge', getIntentColor(formattedResult.intent)]">
            {{ formattedResult.intent?.toUpperCase() }}
          </span>
          <span class="result-count">{{ formattedResult.count }} results</span>
          <span class="execution-time">{{ formattedResult.executionTime }}ms</span>
        </div>
      </div>

      <!-- Result Data -->
      <div class="result-data">
        <!-- Array Results (Table) -->
        <div
          v-if="formattedResult.isArray && formattedResult.data.length > 0"
          class="table-wrapper"
        >
          <table class="result-table">
            <thead>
              <tr>
                <th v-for="key in getVisibleColumns(formattedResult.data)" :key="key">
                  {{ key }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in formattedResult.data" :key="index">
                <td v-for="key in getVisibleColumns(formattedResult.data)" :key="key">
                  {{ row[key] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Single Result (Object) -->
        <div v-else-if="!formattedResult.isArray" class="single-result">
          <div
            v-for="[key, value] in Object.entries(getVisibleData(formattedResult.data))"
            :key="key"
            class="result-item"
          >
            <span class="result-key">{{ key }}:</span>
            <span class="result-value">{{ value }}</span>
          </div>
        </div>

        <!-- Empty Results -->
        <div v-else class="empty-result">
          <p>Tidak ada data ditemukan</p>
        </div>
      </div>

      <!-- Explanation -->
      <div v-if="result.explanation" class="explanation">
        <p class="explanation-text">{{ result.explanation }}</p>
      </div>

      <!-- Chart (ApexCharts) -->
      <div v-if="chartData" class="chart-container">
        <div class="chart-controls">
          <span class="chart-label">Chart:</span>
          <div class="chart-type-switch">
            <button
              v-for="type in ['bar', 'line', 'pie']"
              :key="type"
              type="button"
              @click="chartType = type"
              :class="['chart-type-btn', { active: chartType === type }]"
            >
              {{ type.toUpperCase() }}
            </button>
          </div>
        </div>
        <ApexChart
          :key="chartType"
          :type="chartType"
          height="320"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.nl2sql-widget {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 100%;
}

.nl2sql-widget.compact {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.widget-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  width: 24px;
  height: 24px;
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.clear-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.input-area {
  padding: 20px;
}

.input-form {
  display: flex;
  gap: 8px;
}

.input-field {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
}

.input-field:disabled {
  background: #f8fafc;
  cursor: not-allowed;
}

.submit-btn {
  background: #667eea;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.icon-small {
  width: 20px;
  height: 20px;
}

.suggestions {
  margin-top: 16px;
}

.suggestions-label {
  font-size: 12px;
  color: #64748b;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-chip {
  padding: 8px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-chip:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.loading-state {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: #64748b;
  font-size: 14px;
}

.error-state {
  padding: 20px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin: 0 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.icon-error {
  width: 32px;
  height: 32px;
  color: #dc2626;
}

.error-message {
  color: #991b1b;
  font-size: 14px;
  margin: 0;
  text-align: center;
}

.dismiss-btn {
  padding: 6px 16px;
  background: white;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.dismiss-btn:hover {
  background: #fef2f2;
}

.result-container {
  border-top: 1px solid #e2e8f0;
}

.result-header {
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.intent-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.intent-badge.blue {
  background: #dbeafe;
  color: #1e40af;
}
.intent-badge.green {
  background: #d1fae5;
  color: #065f46;
}
.intent-badge.purple {
  background: #e9d5ff;
  color: #6b21a8;
}
.intent-badge.orange {
  background: #fed7aa;
  color: #9a3412;
}
.intent-badge.red {
  background: #fecaca;
  color: #991b1b;
}
.intent-badge.teal {
  background: #ccfbf1;
  color: #115e59;
}
.intent-badge.pink {
  background: #fce7f3;
  color: #9f1239;
}
.intent-badge.indigo {
  background: #e0e7ff;
  color: #3730a3;
}
.intent-badge.gray {
  background: #f1f5f9;
  color: #475569;
}

.result-count {
  font-size: 13px;
  color: #64748b;
}

.execution-time {
  font-size: 12px;
  color: #94a3b8;
  font-family: monospace;
}

.result-data {
  max-height: 400px;
  overflow: auto;
}

.table-wrapper {
  overflow-x: auto;
}

.result-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.result-table thead {
  background: #f8fafc;
  position: sticky;
  top: 0;
  z-index: 1;
}

.result-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  border-bottom: 2px solid #e2e8f0;
}

.result-table td {
  padding: 12px 16px;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
}

.result-table tbody tr:hover {
  background: #f8fafc;
}

.single-result {
  padding: 20px;
}

.result-item {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.result-key {
  font-weight: 600;
  color: #475569;
  min-width: 150px;
}

.result-value {
  color: #1e293b;
}

.empty-result {
  padding: 40px 20px;
  text-align: center;
  color: #94a3b8;
}

.explanation {
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.explanation-text {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  font-style: italic;
}

.chart-container {
  padding: 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.chart-label {
  font-size: 12px;
  color: #475569;
}

.chart-type-switch {
  display: flex;
  gap: 6px;
}

.chart-type-btn {
  padding: 6px 10px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  font-size: 12px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.chart-type-btn:hover:not(.active) {
  border-color: #cbd5e1;
}

.chart-type-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

/* Dark mode support */
:global(.dark) .nl2sql-widget {
  background: #1e293b;
}

:global(.dark) .input-field {
  background: #0f172a;
  border-color: #334155;
  color: #e2e8f0;
}

:global(.dark) .input-field:focus {
  border-color: #667eea;
}

:global(.dark) .suggestion-chip {
  background: #334155;
  border-color: #475569;
  color: #cbd5e1;
}

:global(.dark) .result-header {
  background: #0f172a;
  border-color: #334155;
}

:global(.dark) .result-table thead {
  background: #0f172a;
}

:global(.dark) .result-table th {
  color: #cbd5e1;
  border-color: #334155;
}

:global(.dark) .result-table td {
  color: #e2e8f0;
  border-color: #1e293b;
}

:global(.dark) .result-table tbody tr:hover {
  background: #0f172a;
}

:global(.dark) .result-key {
  color: #cbd5e1;
}

:global(.dark) .result-value {
  color: #e2e8f0;
}

:global(.dark) .explanation {
  background: #0f172a;
  border-color: #334155;
}

/* Responsive */
@media (max-width: 768px) {
  .widget-header {
    padding: 12px 16px;
  }

  .title {
    font-size: 16px;
  }

  .input-area {
    padding: 16px;
  }

  .result-table {
    font-size: 12px;
  }

  .result-table th,
  .result-table td {
    padding: 8px 12px;
  }
}
</style>
