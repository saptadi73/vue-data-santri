<script setup>
import { ref, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

// Dummy Data
const statsCards = ref([
  {
    title: 'Total Santri',
    value: '12,458',
    change: '+12.5%',
    trend: 'up',
    icon: '👥',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    title: 'Total Pesantren',
    value: '1,247',
    change: '+8.2%',
    trend: 'up',
    icon: '🏫',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    title: 'Santri Miskin',
    value: '4,892',
    change: '+15.3%',
    trend: 'up',
    icon: '📊',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    title: 'Avg Scoring',
    value: '78.5',
    change: '+5.1%',
    trend: 'up',
    icon: '⭐',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
])

// Santri Growth Trend (Line Chart)
const santriTrendOptions = ref({
  chart: {
    type: 'area',
    height: 350,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  colors: ['#3b82f6', '#8b5cf6'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
  xaxis: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
  },
  tooltip: {
    theme: 'dark',
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
  },
})

const santriTrendSeries = ref([
  {
    name: 'Santri Baru',
    data: [420, 532, 516, 575, 648, 692, 735, 788, 842, 895, 948, 1012],
  },
  {
    name: 'Pesantren Baru',
    data: [35, 42, 38, 47, 52, 58, 63, 68, 72, 78, 82, 89],
  },
])

// Distribusi per Provinsi (Bar Chart)
const provinsiDistribusiOptions = ref({
  chart: {
    type: 'bar',
    height: 350,
    toolbar: { show: false },
  },
  colors: ['#10b981', '#f59e0b'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
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
    categories: ['Jawa Barat', 'Jawa Timur', 'Jawa Tengah', 'Banten', 'Jakarta', 'Sumatra'],
  },
  fill: { opacity: 1 },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val) => val + ' unit',
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
  },
})

const provinsiDistribusiSeries = ref([
  {
    name: 'Santri',
    data: [3245, 2876, 2654, 1432, 987, 1264],
  },
  {
    name: 'Pesantren',
    data: [342, 287, 265, 143, 98, 112],
  },
])

// Kategori Scoring Santri (Donut Chart)
const scoringKategoriOptions = ref({
  chart: {
    type: 'donut',
    height: 350,
  },
  colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
  labels: ['Sangat Layak', 'Layak', 'Cukup Layak', 'Kurang Layak'],
  legend: {
    position: 'bottom',
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => Math.round(val) + '%',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Santri',
            formatter: () => '12,458',
          },
        },
      },
    },
  },
  tooltip: {
    theme: 'dark',
  },
})

const scoringKategoriSeries = ref([2456, 4892, 3654, 1456])

// Pesantren Quality Score (Radial Bar)
const pesantrenQualityOptions = ref({
  chart: {
    type: 'radialBar',
    height: 380,
  },
  colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
  plotOptions: {
    radialBar: {
      hollow: {
        size: '30%',
      },
      dataLabels: {
        name: {
          fontSize: '14px',
        },
        value: {
          fontSize: '16px',
          formatter: (val) => Math.round(val) + '%',
        },
      },
    },
  },
  labels: ['Fasilitas', 'Pendidikan', 'Kesehatan', 'Ekonomi'],
  legend: {
    show: true,
    position: 'bottom',
  },
})

const pesantrenQualitySeries = ref([85, 78, 72, 68])

// Ekonomi Status Distribution (Pie Chart)
const ekonomiStatusOptions = ref({
  chart: {
    type: 'pie',
    height: 350,
  },
  colors: ['#ef4444', '#f59e0b', '#10b981'],
  labels: ['Rendah', 'Menengah', 'Tinggi'],
  legend: {
    position: 'bottom',
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => Math.round(val) + '%',
  },
  tooltip: {
    theme: 'dark',
  },
})

const ekonomiStatusSeries = ref([4892, 5234, 2332])

// Bantuan Sosial Progress (Bar Chart Horizontal)
const bansosProgressOptions = ref({
  chart: {
    type: 'bar',
    height: 320,
    toolbar: { show: false },
  },
  colors: ['#8b5cf6'],
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
    formatter: (val) => val + ' santri',
    offsetX: 30,
    style: {
      fontSize: '12px',
      colors: ['#334155'],
    },
  },
  xaxis: {
    categories: ['PKH', 'KIP', 'BLT', 'Sembako', 'Beasiswa', 'Lainnya'],
  },
  tooltip: {
    theme: 'dark',
  },
})

const bansosProgressSeries = ref([
  {
    name: 'Penerima',
    data: [2456, 1987, 1543, 1234, 987, 543],
  },
])

// Monthly Activity Heatmap
const activityHeatmapOptions = ref({
  chart: {
    type: 'heatmap',
    height: 320,
    toolbar: { show: false },
  },
  colors: ['#3b82f6'],
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  },
  tooltip: {
    theme: 'dark',
  },
})

const activityHeatmapSeries = ref([
  { name: 'Senin', data: [30, 40, 35, 50] },
  { name: 'Selasa', data: [45, 55, 41, 67] },
  { name: 'Rabu', data: [42, 48, 39, 62] },
  { name: 'Kamis', data: [38, 52, 44, 58] },
  { name: 'Jumat', data: [55, 65, 60, 75] },
  { name: 'Sabtu', data: [20, 30, 25, 35] },
  { name: 'Minggu', data: [15, 25, 20, 30] },
])

// Top Pesantren (Bar Chart)
const topPesantrenOptions = ref({
  chart: {
    type: 'bar',
    height: 350,
    toolbar: { show: false },
  },
  colors: ['#8b5cf6'],
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 8,
      distributed: false,
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => val.toFixed(1),
    style: {
      fontSize: '12px',
      colors: ['#fff'],
    },
  },
  xaxis: {
    categories: [
      'Pondok Modern Darussalam',
      'Pesantren Al-Azhar',
      'Pondok Gontor',
      'Pesantren Lirboyo',
      'Pondok Sidogiri',
      'Pesantren Tebuireng',
    ],
    max: 100,
  },
  tooltip: {
    theme: 'dark',
  },
})

const topPesantrenSeries = ref([
  {
    name: 'Skor',
    data: [95.5, 92.3, 89.7, 87.2, 85.6, 83.4],
  },
])

// Recent Activities
const recentActivities = ref([
  {
    type: 'new',
    icon: '👤',
    title: 'Santri Baru Terdaftar',
    desc: '15 santri baru dari Jawa Barat',
    time: '2 jam yang lalu',
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    type: 'update',
    icon: '📊',
    title: 'Scoring Diperbarui',
    desc: 'Update scoring 45 santri',
    time: '4 jam yang lalu',
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    type: 'bansos',
    icon: '💰',
    title: 'Bantuan Tersalurkan',
    desc: 'PKH untuk 28 santri',
    time: '6 jam yang lalu',
    color: 'text-green-600 dark:text-green-400',
  },
  {
    type: 'pesantren',
    icon: '🏫',
    title: 'Pesantren Baru',
    desc: 'Pondok Al-Ikhlas terdaftar',
    time: '1 hari yang lalu',
    color: 'text-orange-600 dark:text-orange-400',
  },
])
</script>

<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="dashboard-header">
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
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
          Dashboard Analytics
        </h1>
        <p class="page-subtitle">Monitoring data santri dan pesantren secara real-time</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div v-for="card in statsCards" :key="card.title" class="stat-card" :class="card.bgColor">
        <div class="stat-icon-wrapper">
          <div class="stat-icon" :class="`bg-gradient-to-br ${card.color}`">
            <span class="icon-emoji">{{ card.icon }}</span>
          </div>
        </div>
        <div class="stat-content">
          <p class="stat-label">{{ card.title }}</p>
          <div class="stat-value-row">
            <h3 class="stat-value">{{ card.value }}</h3>
            <span class="stat-change" :class="card.trend === 'up' ? 'positive' : 'negative'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="change-icon"
              >
                <path
                  v-if="card.trend === 'up'"
                  fill-rule="evenodd"
                  d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                  clip-rule="evenodd"
                />
                <path
                  v-else
                  fill-rule="evenodd"
                  d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ card.change }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Charts Grid -->
    <div class="charts-grid">
      <!-- Santri Growth Trend -->
      <div class="chart-card span-2">
        <div class="chart-header">
          <h3 class="chart-title">Tren Pertumbuhan Santri & Pesantren</h3>
          <p class="chart-subtitle">Data 12 bulan terakhir</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="area"
            height="350"
            :options="santriTrendOptions"
            :series="santriTrendSeries"
          />
        </div>
      </div>

      <!-- Scoring Kategori -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Kategori Scoring Santri</h3>
          <p class="chart-subtitle">Distribusi kelayakan</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="donut"
            height="350"
            :options="scoringKategoriOptions"
            :series="scoringKategoriSeries"
          />
        </div>
      </div>

      <!-- Distribusi Provinsi -->
      <div class="chart-card span-2">
        <div class="chart-header">
          <h3 class="chart-title">Distribusi per Provinsi</h3>
          <p class="chart-subtitle">Top 6 provinsi dengan santri terbanyak</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="bar"
            height="350"
            :options="provinsiDistribusiOptions"
            :series="provinsiDistribusiSeries"
          />
        </div>
      </div>

      <!-- Ekonomi Status -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Status Ekonomi</h3>
          <p class="chart-subtitle">Distribusi tingkat ekonomi</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="pie"
            height="350"
            :options="ekonomiStatusOptions"
            :series="ekonomiStatusSeries"
          />
        </div>
      </div>

      <!-- Pesantren Quality -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Kualitas Pesantren</h3>
          <p class="chart-subtitle">Score rata-rata per kategori</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="radialBar"
            height="380"
            :options="pesantrenQualityOptions"
            :series="pesantrenQualitySeries"
          />
        </div>
      </div>

      <!-- Top Pesantren -->
      <div class="chart-card span-2">
        <div class="chart-header">
          <h3 class="chart-title">Top 6 Pesantren</h3>
          <p class="chart-subtitle">Berdasarkan total skor</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="bar"
            height="350"
            :options="topPesantrenOptions"
            :series="topPesantrenSeries"
          />
        </div>
      </div>

      <!-- Bantuan Sosial Progress -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Bantuan Sosial</h3>
          <p class="chart-subtitle">Distribusi jenis bantuan</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="bar"
            height="320"
            :options="bansosProgressOptions"
            :series="bansosProgressSeries"
          />
        </div>
      </div>

      <!-- Activity Heatmap -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Aktivitas Harian</h3>
          <p class="chart-subtitle">Aktivitas per minggu</p>
        </div>
        <div class="chart-body">
          <VueApexCharts
            type="heatmap"
            height="320"
            :options="activityHeatmapOptions"
            :series="activityHeatmapSeries"
          />
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="chart-card span-2">
        <div class="chart-header">
          <h3 class="chart-title">Aktivitas Terkini</h3>
          <p class="chart-subtitle">Update terbaru sistem</p>
        </div>
        <div class="activity-list">
          <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
            <div class="activity-icon" :class="activity.color">
              {{ activity.icon }}
            </div>
            <div class="activity-content">
              <h4 class="activity-title">{{ activity.title }}</h4>
              <p class="activity-desc">{{ activity.desc }}</p>
            </div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: calc(100vh - 80px);
  background: #f8fafc;
  padding: 24px;
}

.dashboard-header {
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
  color: #667eea;
}

.page-subtitle {
  color: #64748b;
  font-size: 16px;
  margin: 0;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.stat-icon-wrapper {
  flex-shrink: 0;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.icon-emoji {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 4px 0;
  font-weight: 500;
}

.stat-value-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.stat-change.positive {
  color: #10b981;
  background: #d1fae5;
}

.stat-change.negative {
  color: #ef4444;
  background: #fee2e2;
}

.change-icon {
  width: 16px;
  height: 16px;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
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

/* Recent Activities */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.activity-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.activity-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.activity-time {
  font-size: 12px;
  color: #94a3b8;
  white-space: nowrap;
}

/* Dark Mode */
:global(.dark) .dashboard-container {
  background: #0f172a;
}

:global(.dark) .page-title {
  color: #e2e8f0;
}

:global(.dark) .page-subtitle {
  color: #94a3b8;
}

:global(.dark) .stat-card {
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

:global(.dark) .activity-item {
  background: #0f172a;
}

:global(.dark) .activity-item:hover {
  background: #1e293b;
}

:global(.dark) .activity-icon {
  background: #334155;
}

:global(.dark) .activity-title {
  color: #e2e8f0;
}

/* Responsive */
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-card.span-2 {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .title-icon {
    width: 28px;
    height: 28px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .charts-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    font-size: 28px;
  }

  .stat-value {
    font-size: 24px;
  }

  .chart-card {
    padding: 20px;
  }
}
</style>
