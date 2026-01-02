<script setup>
import { ref, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

// Dummy Data - Jenis Bantuan
const bantuanTypes = ref([
  {
    id: 1,
    nama: 'Program Keluarga Harapan (PKH)',
    total: 2456,
    tersalurkan: 2234,
    proses: 178,
    pending: 44,
    nominal: 1250000,
    icon: '💰',
    color: '#3b82f6',
  },
  {
    id: 2,
    nama: 'Kartu Indonesia Pintar (KIP)',
    total: 1987,
    tersalurkan: 1876,
    proses: 89,
    pending: 22,
    nominal: 450000,
    icon: '🎓',
    color: '#10b981',
  },
  {
    id: 3,
    nama: 'Bantuan Langsung Tunai (BLT)',
    total: 1543,
    tersalurkan: 1432,
    proses: 87,
    pending: 24,
    nominal: 600000,
    icon: '💵',
    color: '#f59e0b',
  },
  {
    id: 4,
    nama: 'Bantuan Sembako',
    total: 1234,
    tersalurkan: 1156,
    proses: 54,
    pending: 24,
    nominal: 300000,
    icon: '🛒',
    color: '#8b5cf6',
  },
  {
    id: 5,
    nama: 'Beasiswa Pendidikan',
    total: 987,
    tersalurkan: 923,
    proses: 43,
    pending: 21,
    nominal: 2000000,
    icon: '📚',
    color: '#ec4899',
  },
  {
    id: 6,
    nama: 'Bantuan Kesehatan',
    total: 765,
    tersalurkan: 712,
    proses: 38,
    pending: 15,
    nominal: 500000,
    icon: '⚕️',
    color: '#06b6d4',
  },
  {
    id: 7,
    nama: 'Bantuan Usaha Mikro',
    total: 543,
    tersalurkan: 498,
    proses: 32,
    pending: 13,
    nominal: 5000000,
    icon: '🏪',
    color: '#84cc16',
  },
  {
    id: 8,
    nama: 'Bantuan Lainnya',
    total: 432,
    tersalurkan: 398,
    proses: 26,
    pending: 8,
    nominal: 750000,
    icon: '📦',
    color: '#64748b',
  },
])

// Distribusi per Bulan (12 bulan)
const monthlyData = ref([
  { month: 'Jan', total: 786, tersalurkan: 734 },
  { month: 'Feb', total: 854, tersalurkan: 812 },
  { month: 'Mar', total: 923, tersalurkan: 876 },
  { month: 'Apr', total: 867, tersalurkan: 823 },
  { month: 'May', total: 945, tersalurkan: 901 },
  { month: 'Jun', total: 1023, tersalurkan: 978 },
  { month: 'Jul', total: 1087, tersalurkan: 1034 },
  { month: 'Aug', total: 1145, tersalurkan: 1089 },
  { month: 'Sep', total: 1198, tersalurkan: 1143 },
  { month: 'Oct', total: 1267, tersalurkan: 1208 },
  { month: 'Nov', total: 1312, tersalurkan: 1254 },
  { month: 'Dec', total: 1398, tersalurkan: 1345 },
])

// Distribusi per Provinsi
const provinsiDistribusi = ref([
  { provinsi: 'Jawa Barat', penerima: 2876, nominal: 3456000000 },
  { provinsi: 'Jawa Timur', penerima: 2543, nominal: 3123000000 },
  { provinsi: 'Jawa Tengah', penerima: 2234, nominal: 2789000000 },
  { provinsi: 'Banten', penerima: 1234, nominal: 1567000000 },
  { provinsi: 'DKI Jakarta', penerima: 876, nominal: 1234000000 },
  { provinsi: 'Sumatera Barat', penerima: 1098, nominal: 1345000000 },
])

// Computed Total Stats
const totalStats = computed(() => {
  const total = bantuanTypes.value.reduce((sum, b) => sum + b.total, 0)
  const tersalurkan = bantuanTypes.value.reduce((sum, b) => sum + b.tersalurkan, 0)
  const proses = bantuanTypes.value.reduce((sum, b) => sum + b.proses, 0)
  const pending = bantuanTypes.value.reduce((sum, b) => sum + b.pending, 0)
  const percentage = ((tersalurkan / total) * 100).toFixed(1)

  return { total, tersalurkan, proses, pending, percentage }
})

// Chart 1: Status Bantuan (Donut)
const statusBantuanOptions = ref({
  chart: {
    type: 'donut',
    height: 380,
  },
  colors: ['#10b981', '#f59e0b', '#ef4444'],
  labels: ['Tersalurkan', 'Dalam Proses', 'Pending'],
  legend: {
    position: 'bottom',
    fontSize: '14px',
  },
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return opts.w.config.series[opts.seriesIndex] + ' (' + val.toFixed(1) + '%)'
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
            label: 'Total Penerima',
            formatter: () => totalStats.value.total.toLocaleString(),
          },
        },
      },
    },
  },
  tooltip: {
    theme: 'dark',
  },
})

const statusBantuanSeries = computed(() => [
  totalStats.value.tersalurkan,
  totalStats.value.proses,
  totalStats.value.pending,
])

// Chart 2: Bantuan per Jenis (Bar Chart)
const jenisBarOptions = ref({
  chart: {
    type: 'bar',
    height: 400,
    toolbar: { show: false },
  },
  colors: ['#10b981', '#f59e0b', '#ef4444'],
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
    offsetX: 30,
    style: {
      fontSize: '12px',
      colors: ['#334155'],
    },
  },
  xaxis: {
    categories: bantuanTypes.value.map((b) => b.nama),
  },
  tooltip: {
    theme: 'dark',
  },
  legend: {
    position: 'top',
  },
})

const jenisBarSeries = ref([
  {
    name: 'Tersalurkan',
    data: bantuanTypes.value.map((b) => b.tersalurkan),
  },
  {
    name: 'Proses',
    data: bantuanTypes.value.map((b) => b.proses),
  },
  {
    name: 'Pending',
    data: bantuanTypes.value.map((b) => b.pending),
  },
])

// Chart 3: Monthly Trend (Area Chart)
const monthlyTrendOptions = ref({
  chart: {
    type: 'area',
    height: 350,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  colors: ['#3b82f6', '#10b981'],
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
  xaxis: {
    categories: monthlyData.value.map((m) => m.month),
  },
  yaxis: {
    title: { text: 'Jumlah Penerima' },
  },
  tooltip: {
    theme: 'dark',
  },
  legend: {
    position: 'top',
  },
})

const monthlyTrendSeries = ref([
  {
    name: 'Total Penerima',
    data: monthlyData.value.map((m) => m.total),
  },
  {
    name: 'Tersalurkan',
    data: monthlyData.value.map((m) => m.tersalurkan),
  },
])

// Chart 4: Provinsi Distribution (Column Chart)
const provinsiChartOptions = ref({
  chart: {
    type: 'bar',
    height: 350,
    toolbar: { show: false },
  },
  colors: ['#8b5cf6'],
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '60%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: provinsiDistribusi.value.map((p) => p.provinsi),
    labels: {
      rotate: -45,
      style: { fontSize: '11px' },
    },
  },
  yaxis: {
    title: { text: 'Jumlah Penerima' },
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val) => val.toLocaleString() + ' penerima',
    },
  },
})

const provinsiChartSeries = ref([
  {
    name: 'Penerima',
    data: provinsiDistribusi.value.map((p) => p.penerima),
  },
])

// Format Currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

// Calculate percentage
const calculatePercentage = (tersalurkan, total) => {
  return ((tersalurkan / total) * 100).toFixed(1)
}
</script>

<template>
  <div class="distribusi-container">
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
              d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          Distribusi Bantuan Sosial
        </h1>
        <p class="page-subtitle">Monitoring penyaluran bantuan untuk santri di seluruh Indonesia</p>
      </div>
    </div>

    <!-- Overview Stats -->
    <div class="overview-stats">
      <div class="overview-card blue">
        <div class="overview-icon">📊</div>
        <div class="overview-content">
          <p class="overview-label">Total Penerima</p>
          <h3 class="overview-value">{{ totalStats.total.toLocaleString() }}</h3>
          <p class="overview-desc">santri terdaftar</p>
        </div>
      </div>
      <div class="overview-card green">
        <div class="overview-icon">✅</div>
        <div class="overview-content">
          <p class="overview-label">Tersalurkan</p>
          <h3 class="overview-value">{{ totalStats.tersalurkan.toLocaleString() }}</h3>
          <p class="overview-desc">{{ totalStats.percentage }}% dari total</p>
        </div>
      </div>
      <div class="overview-card orange">
        <div class="overview-icon">⏳</div>
        <div class="overview-content">
          <p class="overview-label">Dalam Proses</p>
          <h3 class="overview-value">{{ totalStats.proses.toLocaleString() }}</h3>
          <p class="overview-desc">sedang diproses</p>
        </div>
      </div>
      <div class="overview-card red">
        <div class="overview-icon">⚠️</div>
        <div class="overview-content">
          <p class="overview-label">Pending</p>
          <h3 class="overview-value">{{ totalStats.pending.toLocaleString() }}</h3>
          <p class="overview-desc">perlu tindakan</p>
        </div>
      </div>
    </div>

    <!-- Bantuan Cards Grid -->
    <div class="bantuan-grid">
      <div v-for="bantuan in bantuanTypes" :key="bantuan.id" class="bantuan-card">
        <div class="bantuan-header">
          <div class="bantuan-icon" :style="{ background: bantuan.color }">
            {{ bantuan.icon }}
          </div>
          <div class="bantuan-title-section">
            <h4 class="bantuan-title">{{ bantuan.nama }}</h4>
            <p class="bantuan-nominal">{{ formatCurrency(bantuan.nominal) }}/penerima</p>
          </div>
        </div>

        <div class="bantuan-stats">
          <div class="bantuan-stat-item">
            <span class="stat-label">Total</span>
            <span class="stat-value">{{ bantuan.total }}</span>
          </div>
          <div class="bantuan-stat-item success">
            <span class="stat-label">Tersalurkan</span>
            <span class="stat-value">{{ bantuan.tersalurkan }}</span>
          </div>
          <div class="bantuan-stat-item warning">
            <span class="stat-label">Proses</span>
            <span class="stat-value">{{ bantuan.proses }}</span>
          </div>
          <div class="bantuan-stat-item danger">
            <span class="stat-label">Pending</span>
            <span class="stat-value">{{ bantuan.pending }}</span>
          </div>
        </div>

        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-label">Progress</span>
            <span class="progress-percentage"
              >{{ calculatePercentage(bantuan.tersalurkan, bantuan.total) }}%</span
            >
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{
                width: calculatePercentage(bantuan.tersalurkan, bantuan.total) + '%',
                background: bantuan.color,
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <!-- Status Bantuan -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Status Penyaluran Bantuan</h3>
          <p class="chart-subtitle">Overview status keseluruhan</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="donut"
            height="380"
            :options="statusBantuanOptions"
            :series="statusBantuanSeries"
          />
        </div>
      </div>

      <!-- Monthly Trend -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Tren Penyaluran Bulanan</h3>
          <p class="chart-subtitle">Data 12 bulan terakhir</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="area"
            height="350"
            :options="monthlyTrendOptions"
            :series="monthlyTrendSeries"
          />
        </div>
      </div>

      <!-- Bantuan per Jenis -->
      <div class="chart-card span-full">
        <div class="chart-header">
          <h3 class="chart-title">Detail Bantuan per Jenis</h3>
          <p class="chart-subtitle">Breakdown status per program</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="bar"
            height="400"
            :options="jenisBarOptions"
            :series="jenisBarSeries"
          />
        </div>
      </div>

      <!-- Provinsi Distribution -->
      <div class="chart-card span-full">
        <div class="chart-header">
          <h3 class="chart-title">Distribusi Penerima per Provinsi</h3>
          <p class="chart-subtitle">Top 6 provinsi</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="bar"
            height="350"
            :options="provinsiChartOptions"
            :series="provinsiChartSeries"
          />
        </div>
      </div>
    </div>

    <!-- Provinsi Table -->
    <div class="table-card">
      <div class="table-header">
        <h3 class="table-title">Detail Bantuan per Provinsi</h3>
        <p class="table-subtitle">Nominal dan jumlah penerima</p>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Provinsi</th>
              <th>Jumlah Penerima</th>
              <th>Total Nominal</th>
              <th>Rata-rata per Penerima</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="provinsi in provinsiDistribusi" :key="provinsi.provinsi">
              <td class="provinsi-name">{{ provinsi.provinsi }}</td>
              <td class="number-cell">{{ provinsi.penerima.toLocaleString() }} santri</td>
              <td class="number-cell bold">{{ formatCurrency(provinsi.nominal) }}</td>
              <td class="number-cell">
                {{ formatCurrency(provinsi.nominal / provinsi.penerima) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.distribusi-container {
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
  color: #10b981;
}

.page-subtitle {
  color: #64748b;
  font-size: 16px;
  margin: 0;
}

/* Overview Stats */
.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto 32px;
}

.overview-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.overview-card.blue .overview-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.overview-card.green .overview-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.overview-card.orange .overview-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.overview-card.red .overview-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.overview-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.overview-content {
  flex: 1;
}

.overview-label {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 4px 0;
  font-weight: 500;
}

.overview-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.overview-desc {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

/* Bantuan Cards Grid */
.bantuan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto 32px;
}

.bantuan-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.bantuan-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.bantuan-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.bantuan-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.bantuan-title-section {
  flex: 1;
}

.bantuan-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.bantuan-nominal {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.bantuan-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.bantuan-stat-item {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.bantuan-stat-item.success {
  background: #d1fae5;
}

.bantuan-stat-item.warning {
  background: #fed7aa;
}

.bantuan-stat-item.danger {
  background: #fee2e2;
}

.bantuan-stat-item .stat-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

.bantuan-stat-item .stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.progress-section {
  margin-top: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.progress-percentage {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Charts Section */
.charts-section {
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

.chart-card.span-full {
  grid-column: 1 / -1;
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

/* Table */
.table-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 1400px;
  margin: 0 auto;
}

.table-header {
  margin-bottom: 20px;
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
  text-align: right;
}

.number-cell.bold {
  font-weight: 700;
  color: #1e293b;
}

/* Dark Mode */
:global(.dark) .distribusi-container {
  background: #0f172a;
}

:global(.dark) .page-title {
  color: #e2e8f0;
}

:global(.dark) .page-subtitle {
  color: #94a3b8;
}

:global(.dark) .overview-card {
  background: #1e293b;
}

:global(.dark) .overview-label {
  color: #94a3b8;
}

:global(.dark) .overview-value {
  color: #e2e8f0;
}

:global(.dark) .overview-desc {
  color: #64748b;
}

:global(.dark) .bantuan-card {
  background: #1e293b;
}

:global(.dark) .bantuan-title {
  color: #e2e8f0;
}

:global(.dark) .bantuan-nominal {
  color: #94a3b8;
}

:global(.dark) .bantuan-stat-item {
  background: #0f172a;
}

:global(.dark) .bantuan-stat-item .stat-value {
  color: #e2e8f0;
}

:global(.dark) .progress-bar {
  background: #334155;
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
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .distribusi-container {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .title-icon {
    width: 28px;
    height: 28px;
  }

  .overview-stats {
    grid-template-columns: 1fr;
  }

  .bantuan-grid {
    grid-template-columns: 1fr;
  }

  .table-wrapper {
    overflow-x: scroll;
  }
}
</style>
