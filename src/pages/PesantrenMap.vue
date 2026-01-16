<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import AdminBoundaryLayers from './AdminBoundaryLayers.vue'
import NL2SQLWidget from '@/components/NL2SQLWidget.vue'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const USE_DUMMY_DATA = false // Set false jika backend sudah ready + CORS configured

let map = null
let baseTileLayer = null
let themeObserver = null
let heatmapLayer = null
let choropletheLayer = null
let clusterGroupRef = null
let nl2sqlLayerRef = null
let boundaryLayersRef = ref(null)
const isLoading = ref(true)
const error = ref(null)
const theme = ref('light')
const showHeatmap = ref(true)
const showChoropleth = ref(false)
const choroplethMetric = ref('count') // 'count', 'avg_score'
const displayMode = ref('points') // 'points', 'heatmap', 'choropleth'

const showNL2SQLWidget = ref(false)
const pesantrenQueries = [
  'Top 10 pesantren terbaik',
  'Pesantren berkategori sangat layak',
  'Jumlah pesantren per provinsi',
  'Rata-rata skor pesantren',
  'Pesantren di Jawa Timur',
  'Pesantren dengan fasilitas lengkap',
]

const handleNL2SQLResult = async (data) => {
  if (!map) return

  try {
    // Remove previous NL2SQL layer if exists
    if (nl2sqlLayerRef) {
      map.removeLayer(nl2sqlLayerRef)
      nl2sqlLayerRef = null
    }

    // Get query result - check if we have coordinates
    const result = data.result

    // Check if result has coordinate data
    const hasCoordinates =
      Array.isArray(result) &&
      result.length > 0 &&
      (result[0].latitude || result[0].lat) &&
      (result[0].longitude || result[0].lng)

    if (!hasCoordinates) {
      console.log('Query result tidak memiliki koordinat, skip map visualization')
      return
    }

    // Convert result to GeoJSON features
    const features = result.map((item, index) => {
      const lat = item.latitude || item.lat
      const lng = item.longitude || item.lng

      return {
        type: 'Feature',
        id: item.id || `nl2sql-${index}`,
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: { ...item },
      }
    })

    const geojson = {
      type: 'FeatureCollection',
      features,
    }

    // Create cluster group for NL2SQL results
    const nl2sqlCluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      iconCreateFunction: (cluster) => {
        return L.divIcon({
          html: `<div class="nl2sql-cluster"><span>${cluster.getChildCount()}</span></div>`,
          className: 'nl2sql-cluster-icon',
          iconSize: L.point(40, 40),
        })
      },
    })

    // Add markers to cluster
    const nl2sqlLayer = L.geoJSON(geojson, {
      pointToLayer: (feature, latlng) => {
        const p = feature.properties
        const akreditasi = p.akreditasi || p.kategori || p.status

        // Use highlighted color for NL2SQL results
        const html = `<span style="box-sizing:border-box;width:20px;height:20px;display:block;border-radius:50%;border:3px solid #8b5cf6;background:#a78bfa;box-shadow:0 0 10px rgba(139,92,246,0.6)"></span>`

        return L.marker(latlng, {
          icon: L.divIcon({
            className: 'nl2sql-marker',
            html,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
          }),
          pane: 'santriPane',
        })
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties
        const nama = p.nama_pesantren || p.nama || p.name || 'Tidak ada nama'
        const akreditasi = p.akreditasi || p.kategori || 'Tidak ada data'
        const skor = p.skor_total || p.skor || p.score || 'N/A'
        const provinsi = p.provinsi || '-'
        const kabupaten = p.kabupaten || '-'

        const popupContent = `
          <div class="nl2sql-popup">
            <div class="popup-badge">AI Result</div>
            <h4>${nama}</h4>
            <div class="popup-info">
              <p><strong>Akreditasi:</strong> ${akreditasi}</p>
              <p><strong>Skor:</strong> ${skor}</p>
              <p><strong>Lokasi:</strong> ${kabupaten}, ${provinsi}</p>
            </div>
          </div>
        `
        layer.bindPopup(popupContent, { pane: 'popupPane' })
      },
    })

    nl2sqlLayer.addTo(nl2sqlCluster)
    nl2sqlCluster.addTo(map)
    nl2sqlLayerRef = nl2sqlCluster

    // Fit bounds to show all results
    if (features.length > 0) {
      const bounds = L.geoJSON(geojson).getBounds()
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 })
    }

    console.log(`✅ Menampilkan ${features.length} hasil NL2SQL di peta`)
  } catch (error) {
    console.error('Error displaying NL2SQL results:', error)
  }
}

// Data dummy untuk testing
const dummyGeoData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [106.8456, -6.2088] },
      properties: {
        id: '660e8400-e29b-41d4-a716-446655440001',
        nama: 'Pondok Pesantren Al-Ikhlas',
        akreditasi: 'A',
        jumlah_santri: 150,
        jumlah_fasilitas: 12,
        score: 85,
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [110.3695, -7.7956] },
      properties: {
        id: '660e8400-e29b-41d4-a716-446655440002',
        nama: 'Pondok Pesantren As-Sunnah',
        akreditasi: 'B',
        jumlah_santri: 200,
        jumlah_fasilitas: 15,
        score: 78,
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [112.7521, -7.2575] },
      properties: {
        id: '660e8400-e29b-41d4-a716-446655440003',
        nama: "Pondok Pesantren Nurul Qur'an",
        akreditasi: 'A',
        jumlah_santri: 180,
        jumlah_fasilitas: 18,
        score: 90,
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [107.6191, -6.9175] },
      properties: {
        id: '660e8400-e29b-41d4-a716-446655440004',
        nama: 'Pondok Pesantren Daarul Hana',
        akreditasi: 'B',
        jumlah_santri: 120,
        jumlah_fasilitas: 10,
        score: 72,
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [113.9213, -8.1545] },
      properties: {
        id: '660e8400-e29b-41d4-a716-446655440005',
        nama: 'Pondok Pesantren Al-Haramain',
        akreditasi: 'A',
        jumlah_santri: 250,
        jumlah_fasilitas: 20,
        score: 88,
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [109.1402, -6.8748] },
      properties: {
        id: '660e8400-e29b-41d4-a716-446655440006',
        nama: 'Pondok Pesantren Assalaam',
        akreditasi: 'C',
        jumlah_santri: 100,
        jumlah_fasilitas: 8,
        score: 65,
      },
    },
  ],
}

const dummyHeatData = [
  { lat: -6.2088, lng: 106.8456, weight: 0.85 },
  { lat: -7.7956, lng: 110.3695, weight: 0.78 },
  { lat: -7.2575, lng: 112.7521, weight: 0.9 },
  { lat: -6.9175, lng: 107.6191, weight: 0.72 },
  { lat: -8.1545, lng: 113.9213, weight: 0.88 },
  { lat: -6.8748, lng: 109.1402, weight: 0.65 },
]

onMounted(async () => {
  try {
    theme.value = resolveTheme()

    // Inisialisasi map
    map = L.map('map').setView([-2.5, 118], 5)
    applyBaseLayer(theme.value)

    // Create custom pane for pesantren markers with higher z-index
    map.createPane('pesantrenPane')
    map.getPane('pesantrenPane').style.zIndex = 400

    // Create popup pane with highest z-index to appear above everything
    map.createPane('popupPane')
    map.getPane('popupPane').style.zIndex = 1000

    let geo, heat

    if (USE_DUMMY_DATA) {
      // Gunakan data dummy
      geo = dummyGeoData
      heat = dummyHeatData
    } else {
      // ===== FETCH DATA DARI API =====
      try {
        const geoResponse = await fetch(`${API_BASE}/gis/pesantren-points`)
        if (!geoResponse.ok) throw new Error(`Gagal memuat data pesantren (${geoResponse.status})`)
        const geoData = await geoResponse.json()

        // Backend membungkus GeoJSON dalam object data
        geo = geoData.data || geoData

        // Debug: log first feature to see structure
        if (geo.features && geo.features.length > 0) {
          console.log('Sample pesantren feature properties:', geo.features[0].properties)
        }
      } catch (fetchError) {
        console.error('Error fetching pesantren points:', fetchError)
        throw new Error(`Backend API tidak dapat diakses. Pastikan server berjalan di ${API_BASE}`)
      }

      try {
        const heatResponse = await fetch(`${API_BASE}/gis/pesantren-heatmap`)
        if (!heatResponse.ok) throw new Error(`Gagal memuat heatmap (${heatResponse.status})`)
        const heatData = await heatResponse.json()

        // Backend mengirim array langsung atau wrapped dalam data property
        const heatArray = Array.isArray(heatData) ? heatData : heatData.data || []
        heat = heatArray.map((f) => ({
          lat: f.lat,
          lng: f.lng,
          weight: f.weight || f.skor || f.score || 0,
        }))
        console.log('✅ Loaded pesantren heatmap data points:', heat.length)
      } catch (fetchError) {
        console.error('Error fetching pesantren heatmap:', fetchError)
        throw new Error(`Gagal mengambil data heatmap dari ${API_BASE}`)
      }
    }

    // Function to get marker color based on akreditasi level
    const getMarkerColor = (akreditasi) => {
      const level = akreditasi?.toLowerCase().trim() || ''

      // Support akreditasi A/B/C
      if (level === 'a' || level === 'sangat_layak' || level === 'sangat layak') {
        return { color: '#059669', fillColor: '#10b981' } // Green - Akreditasi A / Sangat Layak
      } else if (level === 'b' || level === 'layak') {
        return { color: '#d97706', fillColor: '#f59e0b' } // Amber - Akreditasi B / Layak
      } else if (level === 'c' || level === 'tidak_layak' || level === 'tidak layak') {
        return { color: '#dc2626', fillColor: '#ef4444' } // Red - Akreditasi C / Tidak Layak
      }

      // Default fallback
      return { color: '#6b7280', fillColor: '#9ca3af' } // Gray
    }

    // ===== TITIK PESANTREN (Clustered Markers) =====
    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      spiderfyDistanceMultiplier: 1.2,
      disableClusteringAtZoom: 15,
    })

    const createPesantrenIcon = (akreditasi) => {
      const { color, fillColor } = getMarkerColor(akreditasi)
      // Use square marker for pesantren
      const html = `<span style="box-sizing:border-box;width:18px;height:18px;display:block;border-radius:50%;border:2px solid ${color};background:${fillColor}"></span>`
      return L.divIcon({
        className: 'pesantren-marker',
        html,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -9],
      })
    }

    const pesantrenLayer = L.geoJSON(geo, {
      pointToLayer: (feature, latlng) => {
        const p = feature.properties || {}
        // Backend bisa menggunakan berbagai field names untuk kategori
        const akreditasi = p.akreditasi || p.category || p.kelayakan || p.kategori
        return L.marker(latlng, {
          icon: createPesantrenIcon(akreditasi),
          pane: 'pesantrenPane',
        })
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties
        // Backend bisa menggunakan berbagai field names
        const nama = p.nama || p.name || p.nama_pesantren || 'Tidak ada nama'
        const akreditasi = p.akreditasi || p.category || p.kelayakan || p.kategori || 'N/A'
        const jumlahSantri = p.jumlah_santri || p.students || p.total_santri || 0
        const score = p.score || p.skor || p.total_score || 0

        layer.bindPopup(
          `
          <div class="pesantren-popup">
            <strong class="pesantren-popup__title">${nama}</strong><br/>
            <span class="pesantren-popup__label">Kategori Kelayakan:</span> <strong>${akreditasi}</strong><br/>
            <span class="pesantren-popup__label">Santri:</span> <strong>${jumlahSantri}</strong><br/>
            <span class="pesantren-popup__label">Skor:</span> <strong>${score}</strong>
          </div>
        `,
          { className: 'pesantren-popup' },
        )

        layer.on('mouseover', function () {
          const el = this.getElement()
          if (el) {
            const marker = el.querySelector('span')
            if (marker) marker.style.boxShadow = '0 0 0 4px rgba(0,0,0,0.3)'
          }
        })
        layer.on('mouseout', function () {
          const el = this.getElement()
          if (el) {
            const marker = el.querySelector('span')
            if (marker) marker.style.boxShadow = 'none'
          }
        })
      },
    })

    clusterGroup.addLayer(pesantrenLayer)
    clusterGroup.addTo(map)
    clusterGroupRef = clusterGroup

    // ===== HEATMAP =====
    if (heat && heat.length > 0) {
      // Normalisasi weight: backend mengirim score (0-100), perlu dinormalisasi ke 0-1
      const maxWeight = Math.max(...heat.map((p) => p.weight))
      const normalizedHeat = heat.map((p) => [p.lat, p.lng, p.weight / maxWeight])

      heatmapLayer = L.heatLayer(normalizedHeat, {
        radius: 40,
        blur: 25,
        maxZoom: 8,
        gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' },
      })

      if (showHeatmap.value) {
        heatmapLayer.addTo(map)
      }
    }

    // ===== CHOROPLETH (Aggregate by Kabupaten) =====
    try {
      const boundaryResponse = await fetch('/data/geo/indonesia-kabupaten.geojson')
      if (boundaryResponse.ok) {
        const boundaryData = await boundaryResponse.json()

        // Aggregate pesantren data by kabupaten
        const aggregateByKabupaten = (geoData) => {
          const aggregate = {}
          geoData.features?.forEach((feature) => {
            const kabupaten = feature.properties?.kabupaten || 'Unknown'
            if (!aggregate[kabupaten]) {
              aggregate[kabupaten] = { count: 0, total_score: 0, features: [] }
            }
            aggregate[kabupaten].count += 1
            aggregate[kabupaten].total_score += feature.properties?.score || 0
            aggregate[kabupaten].features.push(feature)
          })
          return aggregate
        }

        const pesantrenAggregated = aggregateByKabupaten(geo)

        // Determine color based on metric
        const getColor = (value, max) => {
          const ratio = max > 0 ? value / max : 0
          if (ratio > 0.8) return '#dc2626' // Red
          if (ratio > 0.6) return '#ea580c' // Orange
          if (ratio > 0.4) return '#f59e0b' // Amber
          if (ratio > 0.2) return '#84cc16' // Lime
          return '#22c55e' // Green
        }

        // Calculate max value for normalization
        const values = Object.values(pesantrenAggregated).map((v) =>
          choroplethMetric.value === 'count' ? v.count : v.total_score / v.count,
        )
        const maxValue = Math.max(...values)

        const choroplethLayer = L.geoJSON(boundaryData, {
          style: (feature) => {
            const kabupaten = feature.properties?.nama || feature.properties?.NAME || 'Unknown'
            const data = pesantrenAggregated[kabupaten]
            const value =
              data && choroplethMetric.value === 'count'
                ? data.count
                : data
                  ? data.total_score / data.count
                  : 0

            return {
              fillColor: getColor(value, maxValue),
              weight: 2,
              opacity: 0.7,
              color: '#333',
              fillOpacity: 0.6,
            }
          },
          onEachFeature: (feature, layer) => {
            const kabupaten = feature.properties?.nama || feature.properties?.NAME || 'Unknown'
            const data = pesantrenAggregated[kabupaten]

            const tooltip =
              data && choroplethMetric.value === 'count'
                ? `<strong>${kabupaten}</strong><br>Pesantren: ${data.count}`
                : data
                  ? `<strong>${kabupaten}</strong><br>Rata-rata Skor: ${(data.total_score / data.count).toFixed(2)}`
                  : `<strong>${kabupaten}</strong><br>Data tidak tersedia`

            layer.bindPopup(tooltip)
            layer.on('mouseover', function () {
              this.setStyle({ weight: 3, opacity: 1 })
            })
            layer.on('mouseout', function () {
              this.setStyle({ weight: 2, opacity: 0.7 })
            })
          },
        })

        choropletheLayer = choroplethLayer
      }
    } catch (err) {
      console.warn('Choropleth data tidak tersedia:', err)
    }

    // Zoom ke area Jawa
    map.setView([-7.5, 110.0], 7)

    // ===== TAMBAHKAN BOUNDARY LAYERS =====
    if (boundaryLayersRef.value) {
      boundaryLayersRef.value.addLayers(map)
    }

    // ===== TAMBAHKAN LEGEND =====
    const legend = L.control({ position: 'bottomleft' })
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend')
      div.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); font-size: 12px;">
          <strong style="display: block; margin-bottom: 8px;">Kategori Kelayakan Pesantren</strong>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 10px; height: 10px; background: #10b981; border-radius: 50%; margin-right: 6px; border: 1px solid #059669;"></span>
            <span>A - Sangat Baik</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 10px; height: 10px; background: #f59e0b; border-radius: 50%; margin-right: 6px; border: 1px solid #d97706;"></span>
            <span>B - Baik</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 10px; height: 10px; background: #ef4444; border-radius: 50%; margin-right: 6px; border: 1px solid #dc2626;"></span>
            <span>C - Cukup</span>
          </div>
          <div style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 10px; height: 10px; background: #9ca3af; border-radius: 50%; margin-right: 6px; border: 1px solid #6b7280;"></span>
            <span>Tidak ada data</span>
          </div>
        </div>
      `
      return div
    }
    legend.addTo(map)

    startThemeObserver()

    isLoading.value = false
  } catch (err) {
    console.error('Error loading map data:', err)
    error.value = err.message
    isLoading.value = false
  }
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
  if (baseTileLayer) {
    baseTileLayer.remove()
    baseTileLayer = null
  }
  stopThemeObserver()
})

const resolveTheme = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

const createTileLayer = (mode) => {
  const isDark = mode === 'dark'
  return L.tileLayer(
    isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: isDark
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | © CARTO'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    },
  )
}

const applyBaseLayer = (mode) => {
  if (!map) return
  if (baseTileLayer) baseTileLayer.remove()
  baseTileLayer = createTileLayer(mode)
  baseTileLayer.addTo(map)
}

const syncTheme = () => {
  const mode = resolveTheme()
  if (mode === theme.value) return
  theme.value = mode
  applyBaseLayer(mode)
}

const startThemeObserver = () => {
  if (themeObserver) return
  themeObserver = new MutationObserver(syncTheme)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  window.addEventListener('storage', syncTheme)
}

const stopThemeObserver = () => {
  if (themeObserver) {
    themeObserver.disconnect()
    themeObserver = null
  }
  window.removeEventListener('storage', syncTheme)
}

const toggleHeatmap = () => {
  showHeatmap.value = !showHeatmap.value
  if (!map || !heatmapLayer) return

  if (showHeatmap.value) {
    heatmapLayer.addTo(map)
  } else {
    map.removeLayer(heatmapLayer)
  }
}

const toggleChoropleth = () => {
  showChoropleth.value = !showChoropleth.value
  if (!map || !choropletheLayer) return

  if (showChoropleth.value) {
    choropletheLayer.addTo(map)
    if (clusterGroupRef) map.removeLayer(clusterGroupRef)
    if (heatmapLayer && map.hasLayer(heatmapLayer)) map.removeLayer(heatmapLayer)
    displayMode.value = 'choropleth'
  } else {
    map.removeLayer(choropletheLayer)
    if (clusterGroupRef) clusterGroupRef.addTo(map)
    displayMode.value = 'points'
  }
}

const changeChoroplethMetric = (metric) => {
  choroplethMetric.value = metric
  // Reload choropleth dengan metric baru
  if (choropletheLayer && map.hasLayer(choropletheLayer)) {
    map.removeLayer(choropletheLayer)
    toggleChoropleth()
  }
}
</script>

<template>
  <div class="map-container">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Memuat peta pesantren...</p>
    </div>
    <div v-if="error" class="error-message">⚠️ {{ error }}</div>

    <!-- Heatmap Toggle Control -->
    <div class="heatmap-control">
      <button
        @click="toggleHeatmap"
        :class="['heatmap-toggle-btn', { active: showHeatmap }]"
        title="Tampilkan/Sembunyikan Heatmap Kepadatan Pesantren Berdasarkan Skor Kelayakan"
      >
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
            d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
          />
        </svg>
        <span class="btn-text">Heatmap</span>
      </button>
      <div class="heatmap-info" v-if="showHeatmap">
        <p class="info-text">Menampilkan kepadatan pesantren berdasarkan skor kelayakan</p>
      </div>
    </div>

    <!-- Choropleth Toggle & Filter Control -->
    <div class="choropleth-control">
      <button
        @click="toggleChoropleth"
        :class="['choropleth-toggle-btn', { active: showChoropleth }]"
        title="Tampilkan/Sembunyikan Choropleth Map (Aggregasi per Kabupaten)"
      >
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
            d="M9 6.75V15m6-6v8.25m.503-6.257l2.707-2.707a1.5 1.5 0 00-2.12-2.12l-2.707 2.707m3.427 3.427l2.707-2.707a1.5 1.5 0 10-2.121-2.121l-2.707 2.707m3.427 3.427l-2.707 2.707a1.5 1.5 0 01-2.121-2.12l2.707-2.707m0-3.427l-2.707-2.707a1.5 1.5 0 00-2.121 2.12l2.707 2.707"
          />
        </svg>
        <span class="btn-text">Choropleth</span>
      </button>
      <div class="choropleth-info" v-if="showChoropleth">
        <p class="info-label">Tampilkan berdasarkan:</p>
        <div class="metric-buttons">
          <button
            @click="changeChoroplethMetric('count')"
            :class="['metric-btn', { active: choroplethMetric === 'count' }]"
          >
            Jumlah Pesantren
          </button>
          <button
            @click="changeChoroplethMetric('avg_score')"
            :class="['metric-btn', { active: choroplethMetric === 'avg_score' }]"
          >
            Rata-rata Skor
          </button>
        </div>
      </div>
    </div>

    <!-- NL2SQL Query Widget Button -->
    <button
      @click="showNL2SQLWidget = !showNL2SQLWidget"
      class="nl2sql-toggle-btn"
      :class="{ active: showNL2SQLWidget }"
      title="Natural Language Query untuk Pesantren"
    >
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
      <span class="btn-text">AI Query</span>
    </button>

    <!-- NL2SQL Widget Panel -->
    <div v-if="showNL2SQLWidget" class="nl2sql-panel">
      <div class="panel-header">
        <h3>Natural Language Query - Pesantren</h3>
        <button @click="showNL2SQLWidget = false" class="close-btn">×</button>
      </div>
      <div class="panel-content">
        <NL2SQLWidget
          compact
          :suggestedQueries="pesantrenQueries"
          placeholder="Tanyakan tentang data pesantren..."
          @result="handleNL2SQLResult"
        />
      </div>
    </div>

    <div id="map"></div>
    <AdminBoundaryLayers ref="boundaryLayersRef" />
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 80px);
  min-height: 500px;
  z-index: 1;
  background: #f8fafc;
}

#map {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

/* Override z-index Leaflet agar tidak menutupi navbar */
#map :deep(.leaflet-pane),
#map :deep(.leaflet-map-pane) {
  z-index: 1 !important;
}

#map :deep(.leaflet-control) {
  z-index: 10 !important;
}

#map :deep(.leaflet-popup) {
  z-index: 1000 !important;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #2563eb;
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

.loading-overlay p {
  margin-top: 16px;
  color: #64748b;
  font-size: 14px;
}

.error-message {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fee2e2;
  color: #991b1b;
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  z-index: 1001;
  font-size: 14px;
}

#map :deep(.pesantren-popup__title) {
  font-family: system-ui, sans-serif;
  font-size: 14px;
  color: #047857;
  font-weight: 600;
}

#map :deep(.pesantren-popup__label) {
  color: #475569;
  font-size: 13px;
}

#map :deep(.pesantren-popup .leaflet-popup-content-wrapper) {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 40px -18px rgba(15, 23, 42, 0.35);
}

#map :deep(.pesantren-popup .leaflet-popup-tip) {
  background: #fff;
  border: 1px solid #e2e8f0;
}

:global(.dark) .map-container {
  background: #0f172a;
}

:global(.dark) .loading-overlay {
  background: rgba(15, 23, 42, 0.9);
}

:global(.dark) .loading-overlay p {
  color: #cbd5e1;
}

:global(.dark) .spinner {
  border-color: #1f2937;
  border-top-color: #22d3ee;
}

:global(.dark) .error-message {
  background: rgba(248, 113, 113, 0.15);
  color: #fecdd3;
  border-color: rgba(254, 205, 211, 0.45);
}

:global(.dark) #map :deep(.pesantren-popup .leaflet-popup-content-wrapper) {
  background: #0f172a;
  border-color: #1f2937;
  box-shadow: 0 16px 40px -18px rgba(0, 0, 0, 0.6);
}

:global(.dark) #map :deep(.pesantren-popup .leaflet-popup-tip) {
  background: #0f172a;
  border-color: #1f2937;
}

:global(.dark) #map :deep(.pesantren-popup__title) {
  color: #6ee7b7;
}

:global(.dark) #map :deep(.pesantren-popup__label) {
  color: #cbd5e1;
}

/* Heatmap Toggle Control */
.heatmap-control {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

/* Choropleth Toggle Control */
.choropleth-control {
  position: absolute;
  top: 20px;
  right: 280px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.choropleth-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.choropleth-toggle-btn:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.choropleth-toggle-btn.active {
  background: #7c3aed;
  border-color: #7c3aed;
  color: white;
}

.choropleth-toggle-btn .icon {
  width: 20px;
  height: 20px;
}

.choropleth-toggle-btn .btn-text {
  user-select: none;
}

.choropleth-info {
  background: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  max-width: 220px;
}

.choropleth-info .info-label {
  margin: 0 0 8px 0;
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  text-align: right;
}

.metric-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-btn {
  padding: 6px 10px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s ease;
}

.metric-btn:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
}

.metric-btn.active {
  background: #7c3aed;
  border-color: #7c3aed;
  color: white;
}

:global(.dark) .choropleth-info {
  background: #1e293b;
  border-color: #334155;
}

:global(.dark) .choropleth-info .info-label {
  color: #94a3b8;
}

:global(.dark) .choropleth-toggle-btn {
  background: #1e293b;
  border-color: #334155;
  color: #cbd5e1;
}

:global(.dark) .choropleth-toggle-btn:hover {
  border-color: #475569;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

:global(.dark) .choropleth-toggle-btn.active {
  background: #8b5cf6;
  border-color: #8b5cf6;
  color: white;
}

:global(.dark) .metric-btn {
  background: #334155;
  border-color: #475569;
  color: #cbd5e1;
}

:global(.dark) .metric-btn:hover {
  background: #475569;
  border-color: #64748b;
}

:global(.dark) .metric-btn.active {
  background: #8b5cf6;
  border-color: #8b5cf6;
  color: white;
}

/* NL2SQL Toggle Button */
.nl2sql-toggle-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 600;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.nl2sql-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

.nl2sql-toggle-btn.active {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.nl2sql-toggle-btn .icon {
  width: 20px;
  height: 20px;
}

/* NL2SQL Widget Panel */
.nl2sql-panel {
  position: absolute;
  bottom: 80px;
  right: 20px;
  z-index: 1000;
  width: 450px;
  max-height: 70vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 24px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.panel-content {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

:global(.dark) .nl2sql-panel {
  background: #1e293b;
}

/* Responsive */
@media (max-width: 1024px) {
  .choropleth-control {
    right: 240px;
  }
}

@media (max-width: 768px) {
  .map-container {
    height: calc(100vh - 60px);
  }

  .heatmap-control,
  .choropleth-control {
    top: 10px;
    right: 10px;
  }

  .heatmap-toggle-btn,
  .choropleth-toggle-btn {
    padding: 8px 12px;
    font-size: 13px;
  }

  .heatmap-toggle-btn .icon,
  .choropleth-toggle-btn .icon {
    width: 18px;
    height: 18px;
  }

  .heatmap-info,
  .choropleth-info {
    max-width: 180px;
  }

  .heatmap-info .info-text {
    font-size: 10px;
  }

  .choropleth-info .info-label {
    font-size: 10px;
  }

  .metric-btn {
    font-size: 10px;
    padding: 5px 8px;
  }
}
</style>
