<script setup>
import { ref, computed } from 'vue'
import NL2SQLWidget from '@/components/NL2SQLWidget.vue'

const activeTab = ref('santri')
const lastResult = ref(null)
const resultHistory = ref([])

const tabs = [
  { id: 'santri', label: 'AI - Data Santri', icon: '👥' },
  { id: 'pesantren', label: 'AI - Data Pesantren', icon: '🏫' },
  { id: 'general', label: 'AI - Search', icon: '🔍' },
]

const suggestedQueriesBySantri = [
  'Tunjukkan 10 santri terbaru',
  'Berapa jumlah santri miskin?',
  'Santri dengan skor tertinggi',
  'Distribusi santri per kategori kemiskinan',
  'Santri dari Jawa Barat',
  'Rata-rata skor santri per provinsi',
]

const suggestedQueriesByPesantren = [
  'Top 5 pesantren dengan skor tertinggi',
  'Berapa jumlah pesantren?',
  'Pesantren berkategori sangat layak',
  'Pesantren di Jawa Barat',
  'Distribusi pesantren per kategori',
  'Rata-rata skor pesantren',
]

const suggestedQueriesGeneral = [
  'Berapa total santri dan pesantren?',
  'Pesantren dengan santri terbanyak',
  'Statistik kemiskinan santri',
  'Tren skor pesantren tahun ini',
  'Peta distribusi santri',
  'Heatmap pesantren',
]

const currentSuggestions = computed(() => {
  switch (activeTab.value) {
    case 'santri':
      return suggestedQueriesBySantri
    case 'pesantren':
      return suggestedQueriesByPesantren
    default:
      return suggestedQueriesGeneral
  }
})

const handleResult = (data) => {
  lastResult.value = data
  resultHistory.value.unshift({
    timestamp: new Date().toISOString(),
    intent: data.intent,
    resultCount: Array.isArray(data.result) ? data.result.length : 1,
  })
  if (resultHistory.value.length > 20) {
    resultHistory.value = resultHistory.value.slice(0, 20)
  }
}

const handleError = (error) => {
  console.error('Query error:', error)
}
</script>

<template>
  <div class="nl2sql-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="title-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            />
          </svg>
          AI Search
        </h1>
        <p class="page-description">
          Cari data santri dan pesantren menggunakan AI dengan bahasa natural
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-container">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="page-content">
      <div class="content-grid">
        <!-- Widget Section -->
        <div class="widget-section">
          <NL2SQLWidget
            :suggestedQueries="currentSuggestions"
            :placeholder="`Cari tentang ${activeTab === 'santri' ? 'santri' : activeTab === 'pesantren' ? 'pesantren' : 'data'} menggunakan AI...`"
            @result="handleResult"
            @error="handleError"
          />
        </div>

        <!-- Info Section -->
        <div class="info-section">
          <!-- Query History -->
          <div v-if="resultHistory.length > 0" class="info-card">
            <h3 class="card-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="card-icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Query History
            </h3>
            <div class="history-list">
              <div
                v-for="(item, index) in resultHistory.slice(0, 10)"
                :key="index"
                class="history-item"
              >
                <div class="history-meta">
                  <span class="history-intent">{{ item.intent }}</span>
                  <span class="history-count">{{ item.resultCount }} results</span>
                </div>
                <span class="history-time">{{
                  new Date(item.timestamp).toLocaleTimeString()
                }}</span>
              </div>
            </div>
          </div>

          <!-- Help Card -->
          <div class="info-card">
            <h3 class="card-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="card-icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
              Cara Penggunaan
            </h3>
            <ul class="help-list">
              <li>Ketik pertanyaan dalam bahasa natural (Indonesia/Inggris)</li>
              <li>Gunakan query suggestion untuk memulai</li>
              <li>Sistem akan mendeteksi intent dan menjalankan query</li>
              <li>Hasil akan ditampilkan dalam format tabel atau summary</li>
              <li>Klik tab untuk kategori query yang berbeda</li>
            </ul>
          </div>

          <!-- Examples Card -->
          <div class="info-card">
            <h3 class="card-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="card-icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              Contoh Query
            </h3>
            <div class="examples-list">
              <div class="example-item"><strong>LIST:</strong> "Tunjukkan 10 santri terbaru"</div>
              <div class="example-item"><strong>FILTER:</strong> "Santri miskin di Bandung"</div>
              <div class="example-item"><strong>COUNT:</strong> "Berapa jumlah pesantren?"</div>
              <div class="example-item"><strong>RANKING:</strong> "Top 5 pesantren terbaik"</div>
              <div class="example-item"><strong>STATISTICS:</strong> "Rata-rata skor santri"</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nl2sql-page {
  min-height: calc(100vh - 80px);
  background: #f8fafc;
  padding-bottom: 40px;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48px 24px;
  color: white;
  text-align: center;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  margin: 0 0 12px 0;
  font-size: 36px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.title-icon {
  width: 40px;
  height: 40px;
}

.page-description {
  margin: 0;
  font-size: 16px;
  opacity: 0.95;
}

.tabs-container {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 64px;
  z-index: 100;
}

.tabs {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 4px;
  padding: 0 24px;
}

.tab-btn {
  padding: 16px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #667eea;
  background: #f8fafc;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-icon {
  font-size: 20px;
}

.page-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

.widget-section {
  min-height: 500px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-icon {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-intent {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
  text-transform: uppercase;
}

.history-count {
  font-size: 12px;
  color: #64748b;
}

.history-time {
  font-size: 11px;
  color: #94a3b8;
}

.help-list {
  margin: 0;
  padding-left: 20px;
  color: #475569;
  font-size: 14px;
  line-height: 1.8;
}

.help-list li {
  margin-bottom: 8px;
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.example-item {
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
}

.example-item strong {
  color: #667eea;
  margin-right: 8px;
}

/* Dark mode */
:global(.dark) .nl2sql-page {
  background: #0f172a;
}

:global(.dark) .tabs-container {
  background: #1e293b;
  border-color: #334155;
}

:global(.dark) .tab-btn {
  color: #94a3b8;
}

:global(.dark) .tab-btn:hover {
  color: #818cf8;
  background: #0f172a;
}

:global(.dark) .tab-btn.active {
  color: #818cf8;
  border-bottom-color: #818cf8;
}

:global(.dark) .info-card {
  background: #1e293b;
}

:global(.dark) .card-title {
  color: #e2e8f0;
}

:global(.dark) .history-item {
  background: #0f172a;
}

:global(.dark) .example-item {
  background: #0f172a;
  color: #cbd5e1;
}

/* Responsive */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .info-section {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .info-card {
    flex: 1;
    min-width: 280px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 32px 20px;
  }

  .page-title {
    font-size: 28px;
  }

  .title-icon {
    width: 32px;
    height: 32px;
  }

  .page-description {
    font-size: 14px;
  }

  .tabs {
    overflow-x: auto;
    padding: 0 16px;
  }

  .tab-btn {
    padding: 12px 16px;
    font-size: 13px;
    white-space: nowrap;
  }

  .page-content {
    padding: 20px 16px;
  }

  .info-section {
    flex-direction: column;
  }
}
</style>
