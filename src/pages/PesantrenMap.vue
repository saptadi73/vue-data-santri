<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import AdminBoundaryLayers from './AdminBoundaryLayers.vue'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const USE_DUMMY_DATA = false // Set false jika backend sudah ready + CORS configured

let map = null
let baseTileLayer = null
let themeObserver = null
let boundaryLayersRef = ref(null)
const isLoading = ref(true)
const error = ref(null)
const theme = ref('light')

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
      } catch (fetchError) {
        throw new Error(`Backend API tidak dapat diakses. Pastikan server berjalan di ${API_BASE}`)
      }

      try {
        const heatResponse = await fetch(`${API_BASE}/gis/pesantren-heatmap`)
        if (!heatResponse.ok) throw new Error(`Gagal memuat heatmap (${heatResponse.status})`)
        const heatData = await heatResponse.json()

        // Backend mengirim FeatureCollection, extract ke array format [lat, lng, intensity]
        const heatFeatures = heatData.data?.features || heatData.features || []
        heat = heatFeatures.map((f) => ({
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
          weight: f.properties.intensity || 0,
        }))
      } catch (fetchError) {
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
        // Backend menggunakan 'category', map ke akreditasi
        const akreditasi = p.akreditasi || p.category
        return L.marker(latlng, {
          icon: createPesantrenIcon(akreditasi),
          pane: 'pesantrenPane',
        })
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties
        // Backend menggunakan 'name', 'category', 'students'
        const nama = p.nama || p.name
        const akreditasi = p.akreditasi || p.category
        const jumlahSantri = p.jumlah_santri || p.students || 0
        const jumlahFasilitas = p.jumlah_fasilitas || 0

        layer.bindPopup(
          `
          <div class="pesantren-popup">
            <strong class="pesantren-popup__title">${nama || 'Tidak ada nama'}</strong><br/>
            <span class="pesantren-popup__label">Akreditasi:</span> <strong>${akreditasi || 'N/A'}</strong><br/>
            <span class="pesantren-popup__label">Santri:</span> <strong>${jumlahSantri}</strong><br/>
            <span class="pesantren-popup__label">Fasilitas:</span> <strong>${jumlahFasilitas}</strong><br/>
            <span class="pesantren-popup__label">Skor:</span> <strong>${p.score || 0}</strong>
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

    // ===== HEATMAP =====
    if (heat && heat.length > 0) {
      // Normalisasi weight: backend mengirim score (0-100), perlu dinormalisasi ke 0-1
      const maxWeight = Math.max(...heat.map((p) => p.weight))
      const normalizedHeat = heat.map((p) => [p.lat, p.lng, p.weight / maxWeight])

      L.heatLayer(normalizedHeat, {
        radius: 40,
        blur: 25,
        maxZoom: 8,
        gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' },
      }).addTo(map)
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
          <strong style="display: block; margin-bottom: 8px;">Akreditasi Pesantren</strong>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 14px; height: 14px; background: #10b981; border-radius: 50%; margin-right: 6px; border: 2px solid #059669;"></span>
            <span>A - Sangat Baik</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 14px; height: 14px; background: #f59e0b; border-radius: 50%; margin-right: 6px; border: 2px solid #d97706;"></span>
            <span>B - Baik</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 14px; height: 14px; background: #ef4444; border-radius: 50%; margin-right: 6px; border: 2px solid #dc2626;"></span>
            <span>C - Cukup</span>
          </div>
          <div style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 14px; height: 14px; background: #9ca3af; border-radius: 50%; margin-right: 6px; border: 2px solid #6b7280;"></span>
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
</script>

<template>
  <div class="map-container">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Memuat peta pesantren...</p>
    </div>
    <div v-if="error" class="error-message">⚠️ {{ error }}</div>
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

/* Responsive */
@media (max-width: 768px) {
  .map-container {
    height: calc(100vh - 60px);
  }
}
</style>
