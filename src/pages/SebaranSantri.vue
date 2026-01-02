<script setup>
import { ref, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useRouter } from 'vue-router'

const router = useRouter()

// Dummy Data - Distribusi Santri per Provinsi
const provinsiData = ref([
  {
    provinsi: 'Jawa Barat',
    total: 3245,
    miskin: 1532,
    menengah: 1245,
    tinggi: 468,
    pesantren: 342,
    avgScore: 78.5,
    growth: 12.5,
  },
  {
    provinsi: 'Jawa Timur',
    total: 2876,
    miskin: 1398,
    menengah: 1123,
    tinggi: 355,
    pesantren: 287,
    avgScore: 76.3,
    growth: 10.2,
  },
  {
    provinsi: 'Jawa Tengah',
    total: 2654,
    miskin: 1287,
    menengah: 1045,
    tinggi: 322,
    pesantren: 265,
    avgScore: 75.8,
    growth: 8.7,
  },
  {
    provinsi: 'Banten',
    total: 1432,
    miskin: 687,
    menengah: 534,
    tinggi: 211,
    pesantren: 143,
    avgScore: 74.2,
    growth: 15.3,
  },
  {
    provinsi: 'DKI Jakarta',
    total: 987,
    miskin: 234,
    menengah: 456,
    tinggi: 297,
    pesantren: 98,
    avgScore: 82.1,
    growth: 7.8,
  },
  {
    provinsi: 'Sumatera Barat',
    total: 1264,
    miskin: 678,
    menengah: 432,
    tinggi: 154,
    pesantren: 112,
    avgScore: 73.5,
    growth: 9.4,
  },
  {
    provinsi: 'Aceh',
    total: 1098,
    miskin: 598,
    menengah: 378,
    tinggi: 122,
    pesantren: 95,
    avgScore: 72.8,
    growth: 11.2,
  },
  {
    provinsi: 'Lampung',
    total: 876,
    miskin: 445,
    menengah: 312,
    tinggi: 119,
    pesantren: 78,
    avgScore: 71.9,
    growth: 6.5,
  },
])

// Computed Stats
const totalStats = computed(() => ({
  totalSantri: provinsiData.value.reduce((sum, p) => sum + p.total, 0),
  totalMiskin: provinsiData.value.reduce((sum, p) => sum + p.miskin, 0),
  totalPesantren: provinsiData.value.reduce((sum, p) => sum + p.pesantren, 0),
  avgScore: (
    provinsiData.value.reduce((sum, p) => sum + p.avgScore, 0) / provinsiData.value.length
  ).toFixed(1),
}))

// Sort & Filter
const sortBy = ref('total')
const sortOrder = ref('desc')
const searchQuery = ref('')

const sortedData = computed(() => {
  let data = [...provinsiData.value]

  // Filter by search
  if (searchQuery.value) {
    data = data.filter((p) => p.provinsi.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }

  // Sort
  data.sort((a, b) => {
    const aVal = a[sortBy.value]
    const bVal = b[sortBy.value]
    return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
  })

  return data
})

const changeSortBy = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'desc'
  }
}

// Chart 1: Top 10 Provinsi (Bar Chart)
const topProvinsiOptions = ref({
  chart: {
    type: 'bar',
    height: 400,
    toolbar: { show: false },
  },
  colors: ['#3b82f6', '#f59e0b', '#ef4444'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '70%',
      borderRadius: 8,
    },
  },
  dataLabels: { enabled: false },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: provinsiData.value.slice(0, 8).map((p) => p.provinsi),
    labels: {
      rotate: -45,
      style: { fontSize: '11px' },
    },
  },
  yaxis: {
    title: { text: 'Jumlah Santri' },
  },
  fill: { opacity: 1 },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val) => val + ' santri',
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
  },
})

const topProvinsiSeries = ref([
  {
    name: 'Miskin',
    data: provinsiData.value.slice(0, 8).map((p) => p.miskin),
  },
  {
    name: 'Menengah',
    data: provinsiData.value.slice(0, 8).map((p) => p.menengah),
  },
  {
    name: 'Tinggi',
    data: provinsiData.value.slice(0, 8).map((p) => p.tinggi),
  },
])

// Chart 2: Distribusi by Ekonomi (Pie Chart)
const ekonomiDistribusiOptions = ref({
  chart: {
    type: 'donut',
    height: 400,
  },
  colors: ['#ef4444', '#f59e0b', '#10b981'],
  labels: ['Ekonomi Rendah', 'Ekonomi Menengah', 'Ekonomi Tinggi'],
  legend: {
    position: 'bottom',
    fontSize: '14px',
  },
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      const total = opts.w.config.series.reduce((a, b) => a + b, 0)
      const value = opts.w.config.series[opts.seriesIndex]
      return value + ' (' + val.toFixed(1) + '%)'
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Santri',
            formatter: () => totalStats.value.totalSantri.toLocaleString(),
          },
        },
      },
    },
  },
  tooltip: {
    theme: 'dark',
  },
})

const ekonomiDistribusiSeries = ref([
  provinsiData.value.reduce((sum, p) => sum + p.miskin, 0),
  provinsiData.value.reduce((sum, p) => sum + p.menengah, 0),
  provinsiData.value.reduce((sum, p) => sum + p.tinggi, 0),
])

// Chart 3: Growth Trend (Line Chart)
const growthTrendOptions = ref({
  chart: {
    type: 'line',
    height: 350,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  colors: ['#8b5cf6'],
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  markers: {
    size: 5,
    hover: { size: 7 },
  },
  xaxis: {
    categories: provinsiData.value.slice(0, 8).map((p) => p.provinsi),
    labels: {
      rotate: -45,
      style: { fontSize: '11px' },
    },
  },
  yaxis: {
    title: { text: 'Growth (%)' },
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val) => val.toFixed(1) + '%',
    },
  },
})

const growthTrendSeries = ref([
  {
    name: 'Pertumbuhan',
    data: provinsiData.value.slice(0, 8).map((p) => p.growth),
  },
])

// Chart 4: Ratio Santri per Pesantren (Bar)
const ratioOptions = ref({
  chart: {
    type: 'bar',
    height: 350,
    toolbar: { show: false },
  },
  colors: ['#10b981'],
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 8,
      dataLabels: {
        position: 'top',
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => val.toFixed(1),
    offsetX: 30,
    style: {
      fontSize: '12px',
      colors: ['#334155'],
    },
  },
  xaxis: {
    categories: provinsiData.value.slice(0, 8).map((p) => p.provinsi),
    title: { text: 'Santri per Pesantren' },
  },
  tooltip: {
    theme: 'dark',
  },
})

const ratioSeries = ref([
  {
    name: 'Ratio',
    data: provinsiData.value.slice(0, 8).map((p) => (p.total / p.pesantren).toFixed(1)),
  },
])

const goToMap = (type) => {
  if (type === 'santri') {
    router.push('/peta-santri')
  } else if (type === 'pesantren') {
    router.push('/peta-pesantren')
  }
}
</script>

<template>
  <div class="sebaran-container">
    <!-- Header -->
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
              d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
            />
          </svg>
          Sebaran Santri per Wilayah
        </h1>
        <p class="page-subtitle">Distribusi geografis santri dan pesantren di seluruh Indonesia</p>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="stat-box blue">
        <div class="stat-icon">👥</div>
        <div class="stat-details">
          <p class="stat-label">Total Santri</p>
          <h3 class="stat-value">{{ totalStats.totalSantri.toLocaleString() }}</h3>
        </div>
      </div>
      <div class="stat-box red">
        <div class="stat-icon">📊</div>
        <div class="stat-details">
          <p class="stat-label">Santri Miskin</p>
          <h3 class="stat-value">{{ totalStats.totalMiskin.toLocaleString() }}</h3>
        </div>
      </div>
      <div class="stat-box purple">
        <div class="stat-icon">🏫</div>
        <div class="stat-details">
          <p class="stat-label">Total Pesantren</p>
          <h3 class="stat-value">{{ totalStats.totalPesantren.toLocaleString() }}</h3>
        </div>
      </div>
      <div class="stat-box green">
        <div class="stat-icon">⭐</div>
        <div class="stat-details">
          <p class="stat-label">Avg Score</p>
          <h3 class="stat-value">{{ totalStats.avgScore }}</h3>
        </div>
      </div>
    </div>

    <!-- Map Links -->
    <div class="map-links">
      <button @click="goToMap('santri')" class="map-link-btn santri">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="btn-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
        <span>Lihat Peta Santri</span>
      </button>
      <button @click="goToMap('pesantren')" class="map-link-btn pesantren">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="btn-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
          />
        </svg>
        <span>Lihat Peta Pesantren</span>
      </button>
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <!-- Top Provinsi -->
      <div class="chart-card span-2">
        <div class="chart-header">
          <h3 class="chart-title">Distribusi Santri per Provinsi</h3>
          <p class="chart-subtitle">Berdasarkan status ekonomi</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="bar"
            height="400"
            :options="topProvinsiOptions"
            :series="topProvinsiSeries"
          />
        </div>
      </div>

      <!-- Ekonomi Distribution -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Distribusi Status Ekonomi</h3>
          <p class="chart-subtitle">Total nasional</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="donut"
            height="400"
            :options="ekonomiDistribusiOptions"
            :series="ekonomiDistribusiSeries"
          />
        </div>
      </div>

      <!-- Growth Trend -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Tren Pertumbuhan</h3>
          <p class="chart-subtitle">Growth rate per provinsi</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="line"
            height="350"
            :options="growthTrendOptions"
            :series="growthTrendSeries"
          />
        </div>
      </div>

      <!-- Ratio Santri per Pesantren -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Rasio Santri per Pesantren</h3>
          <p class="chart-subtitle">Kapasitas rata-rata</p>
        </div>
        <div class="chart-body">
          <VueApexCharts type="bar" height="350" :options="ratioOptions" :series="ratioSeries" />
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="table-card">
      <div class="table-header">
        <div>
          <h3 class="table-title">Data Lengkap per Provinsi</h3>
          <p class="table-subtitle">Klik kolom untuk sorting</p>
        </div>
        <div class="search-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="search-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari provinsi..."
            class="search-input"
          />
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th @click="changeSortBy('provinsi')" class="sortable">
                Provinsi
                <span class="sort-icon" v-if="sortBy === 'provinsi'">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="changeSortBy('total')" class="sortable">
                Total Santri
                <span class="sort-icon" v-if="sortBy === 'total'">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="changeSortBy('miskin')" class="sortable">
                Miskin
                <span class="sort-icon" v-if="sortBy === 'miskin'">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="changeSortBy('menengah')" class="sortable">
                Menengah
                <span class="sort-icon" v-if="sortBy === 'menengah'">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="changeSortBy('tinggi')" class="sortable">
                Tinggi
                <span class="sort-icon" v-if="sortBy === 'tinggi'">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="changeSortBy('pesantren')" class="sortable">
                Pesantren
                <span class="sort-icon" v-if="sortBy === 'pesantren'">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="changeSortBy('avgScore')" class="sortable">
                Avg Score
                <span class="sort-icon" v-if="sortBy === 'avgScore'">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="changeSortBy('growth')" class="sortable">
                Growth
                <span class="sort-icon" v-if="sortBy === 'growth'">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="provinsi in sortedData" :key="provinsi.provinsi">
              <td class="provinsi-name">{{ provinsi.provinsi }}</td>
              <td class="number-cell bold">{{ provinsi.total.toLocaleString() }}</td>
              <td class="number-cell">
                <span class="badge badge-red">{{ provinsi.miskin.toLocaleString() }}</span>
              </td>
              <td class="number-cell">
                <span class="badge badge-orange">{{ provinsi.menengah.toLocaleString() }}</span>
              </td>
              <td class="number-cell">
                <span class="badge badge-green">{{ provinsi.tinggi.toLocaleString() }}</span>
              </td>
              <td class="number-cell">{{ provinsi.pesantren.toLocaleString() }}</td>
              <td class="number-cell">{{ provinsi.avgScore.toFixed(1) }}</td>
              <td class="number-cell">
                <span class="growth-badge" :class="provinsi.growth > 10 ? 'high' : 'normal'">
                  +{{ provinsi.growth.toFixed(1) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sebaran-container {
  min-height: calc(100vh - 80px);
  background: #f8fafc;
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.title-icon {
  width: 36px;
  height: 36px;
  color: #3b82f6;
}

.page-subtitle {
  color: #64748b;
  font-size: 16px;
  margin: 0;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin: 0 auto 32px;
  max-width: 1400px;
}

.stat-box {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.stat-box.blue .stat-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-box.red .stat-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.stat-box.purple .stat-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-box.green .stat-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-details {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 4px 0;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* Map Links */
.map-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 0 auto 32px;
  max-width: 1400px;
}

.map-link-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 32px;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.map-link-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.map-link-btn.santri {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.map-link-btn.pesantren {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.btn-icon {
  width: 24px;
  height: 24px;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto 32px;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-card.span-2 {
  grid-column: span 2;
}

.chart-header {
  margin-bottom: 20px;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 12px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.chart-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.chart-body {
  min-height: 300px;
}

/* Data Table */
.table-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 1400px;
  margin: 0 auto;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.table-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  padding: 10px 12px 10px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  width: 250px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f8fafc;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.data-table th.sortable:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.sort-icon {
  margin-left: 4px;
  font-size: 12px;
}

.data-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.data-table td {
  padding: 14px 16px;
  font-size: 14px;
  color: #334155;
}

.provinsi-name {
  font-weight: 600;
  color: #1e293b;
}

.number-cell {
  text-align: center;
}

.number-cell.bold {
  font-weight: 700;
  color: #1e293b;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.badge-red {
  background: #fee2e2;
  color: #dc2626;
}

.badge-orange {
  background: #fed7aa;
  color: #ea580c;
}

.badge-green {
  background: #d1fae5;
  color: #059669;
}

.growth-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.growth-badge.high {
  background: #d1fae5;
  color: #059669;
}

.growth-badge.normal {
  background: #dbeafe;
  color: #2563eb;
}

/* Dark Mode */
:global(.dark) .sebaran-container {
  background: #0f172a;
}

:global(.dark) .page-title {
  color: #e2e8f0;
}

:global(.dark) .page-subtitle {
  color: #94a3b8;
}

:global(.dark) .stat-box {
  background: #1e293b;
}

:global(.dark) .stat-label {
  color: #94a3b8;
}

:global(.dark) .stat-value {
  color: #e2e8f0;
}

:global(.dark) .chart-card {
  background: #1e293b;
}

:global(.dark) .chart-header {
  border-color: #334155;
}

:global(.dark) .chart-title {
  color: #e2e8f0;
}

:global(.dark) .chart-subtitle {
  color: #94a3b8;
}

:global(.dark) .table-card {
  background: #1e293b;
}

:global(.dark) .table-title {
  color: #e2e8f0;
}

:global(.dark) .table-subtitle {
  color: #94a3b8;
}

:global(.dark) .search-input {
  background: #0f172a;
  border-color: #334155;
  color: #e2e8f0;
}

:global(.dark) .data-table thead {
  background: #0f172a;
}

:global(.dark) .data-table th {
  color: #94a3b8;
}

:global(.dark) .data-table tbody tr {
  border-color: #334155;
}

:global(.dark) .data-table tbody tr:hover {
  background: #0f172a;
}

:global(.dark) .data-table td {
  color: #cbd5e1;
}

:global(.dark) .provinsi-name {
  color: #e2e8f0;
}

:global(.dark) .number-cell.bold {
  color: #e2e8f0;
}

/* Responsive */
@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-card.span-2 {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .sebaran-container {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .title-icon {
    width: 28px;
    height: 28px;
  }

  .quick-stats {
    grid-template-columns: 1fr;
  }

  .map-links {
    grid-template-columns: 1fr;
  }

  .search-input {
    width: 100%;
  }

  .table-wrapper {
    overflow-x: scroll;
  }
}
</style>
