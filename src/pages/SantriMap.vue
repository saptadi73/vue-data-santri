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
      properties: { name: 'Ahmad Santoso', ekonomi: 'Menengah', score: 75 },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [110.3695, -7.7956] },
      properties: { name: 'Fatimah Zahra', ekonomi: 'Rendah', score: 85 },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [112.7521, -7.2575] },
      properties: { name: 'Muhammad Ridwan', ekonomi: 'Rendah', score: 90 },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [107.6191, -6.9175] },
      properties: { name: 'Siti Aisyah', ekonomi: 'Menengah', score: 70 },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [113.9213, -8.1545] },
      properties: { name: 'Abdullah Hakim', ekonomi: 'Rendah', score: 88 },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [109.1402, -6.8748] },
      properties: { name: 'Khadijah Nurma', ekonomi: 'Rendah', score: 92 },
    },
  ],
}

const dummyHeatData = [
  { lat: -6.2088, lng: 106.8456, weight: 0.8 },
  { lat: -7.7956, lng: 110.3695, weight: 1.0 },
  { lat: -7.2575, lng: 112.7521, weight: 0.9 },
  { lat: -6.9175, lng: 107.6191, weight: 0.7 },
  { lat: -8.1545, lng: 113.9213, weight: 0.95 },
  { lat: -6.8748, lng: 109.1402, weight: 1.0 },
  { lat: -7.5, lng: 111.0, weight: 0.6 },
  { lat: -6.5, lng: 108.0, weight: 0.75 },
]

onMounted(async () => {
  try {
    theme.value = resolveTheme()

    // Inisialisasi map
    map = L.map('map').setView([-2.5, 118], 5)
    applyBaseLayer(theme.value)

    // Create custom pane for santri markers with higher z-index
    map.createPane('santriPane')
    map.getPane('santriPane').style.zIndex = 400 // Same as default markers

    // Create popup pane with highest z-index to appear above everything
    map.createPane('popupPane')
    map.getPane('popupPane').style.zIndex = 1000 // Highest z-index for popups

    let geo, heat

    if (USE_DUMMY_DATA) {
      // Gunakan data dummy
      geo = dummyGeoData
      heat = dummyHeatData
    } else {
      // ===== FETCH DATA DARI API =====
      try {
        const geoResponse = await fetch(`${API_BASE}/gis/santri-points`)
        if (!geoResponse.ok) throw new Error(`Gagal memuat data santri (${geoResponse.status})`)
        geo = await geoResponse.json()
      } catch (fetchError) {
        throw new Error(`Backend API tidak dapat diakses. Pastikan server berjalan di ${API_BASE}`)
      }

      try {
        const heatResponse = await fetch(`${API_BASE}/gis/heatmap`)
        if (!heatResponse.ok) throw new Error(`Gagal memuat heatmap (${heatResponse.status})`)
        heat = await heatResponse.json()
      } catch (fetchError) {
        throw new Error(`Gagal mengambil data heatmap dari ${API_BASE}`)
      }
    }

    // Function to get marker color based on ekonomi level
    const getMarkerColor = (ekonomi) => {
      const level = ekonomi?.toLowerCase().trim() || ''

      if (level === 'miskin') {
        return { color: '#dc2626', fillColor: '#ef4444' } // Red - Miskin
      } else if (level === 'rentan') {
        return { color: '#f59e0b', fillColor: '#fbbf24' } // Yellow - Rentan
      } else if (level === 'cukup') {
        return { color: '#6b7280', fillColor: '#9ca3af' } // Gray - Cukup
      }

      // Default fallback untuk data yang tidak sesuai kategori
      return { color: '#9ca3af', fillColor: '#d1d5db' } // Light gray
    }

    // ===== TITIK SANTRI (Clustered Markers) =====
    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      spiderfyDistanceMultiplier: 1.2,
      disableClusteringAtZoom: 15,
    })

    const createSantriIcon = (ekonomi) => {
      const { color, fillColor } = getMarkerColor(ekonomi)
      // Use full-size 16x16 dot with box-sizing to keep center precise
      const html = `<span style="box-sizing:border-box;width:16px;height:16px;display:block;border-radius:50%;border:2px solid ${color};background:${fillColor}"></span>`
      return L.divIcon({
        className: 'santri-marker',
        html,
        iconSize: [16, 16],
        iconAnchor: [8, 8], // center anchor for precise positioning
        popupAnchor: [0, -8],
      })
    }

    const santriLayer = L.geoJSON(geo, {
      pointToLayer: (feature, latlng) => {
        const p = feature.properties || {}
        return L.marker(latlng, {
          icon: createSantriIcon(p.ekonomi),
          pane: 'santriPane',
        })
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties
        layer.bindPopup(
          `
          <div class="santri-popup">
            <strong class="santri-popup__title">${p.name || 'Tidak ada nama'}</strong><br/>
            <span class="santri-popup__label">Ekonomi:</span> <strong>${p.ekonomi || 'N/A'}</strong><br/>
            <span class="santri-popup__label">Skor:</span> <strong>${p.score || 0}</strong>
          </div>
        `,
          { className: 'santri-popup' },
        )

        layer.on('mouseover', function () {
          const el = this.getElement()
          if (el) {
            const dot = el.querySelector('span')
            if (dot) dot.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.2)'
          }
        })
        layer.on('mouseout', function () {
          const el = this.getElement()
          if (el) {
            const dot = el.querySelector('span')
            if (dot) dot.style.boxShadow = 'none'
          }
        })
      },
    })

    clusterGroup.addLayer(santriLayer)
    clusterGroup.addTo(map)

    // ===== HEATMAP =====
    if (heat && heat.length > 0) {
      // Normalisasi weight: backend mengirim score (0-100), perlu dinormalisasi ke 0-1
      const maxWeight = Math.max(...heat.map((p) => p.weight))
      const normalizedHeat = heat.map((p) => [p.lat, p.lng, p.weight / maxWeight])

      L.heatLayer(normalizedHeat, {
        radius: 30,
        blur: 20,
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
          <strong style="display: block; margin-bottom: 8px;">Level Ekonomi Santri</strong>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 12px; height: 12px; background: #ef4444; border-radius: 50%; margin-right: 6px; border: 2px solid #dc2626;"></span>
            <span>Miskin</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 12px; height: 12px; background: #fbbf24; border-radius: 50%; margin-right: 6px; border: 2px solid #f59e0b;"></span>
            <span>Rentan</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 12px; height: 12px; background: #9ca3af; border-radius: 50%; margin-right: 6px; border: 2px solid #6b7280;"></span>
            <span>Cukup</span>
          </div>
          <div style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 12px; height: 12px; background: #d1d5db; border-radius: 50%; margin-right: 6px; border: 2px solid #9ca3af;"></span>
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
      <p>Memuat peta...</p>
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
  height: calc(100vh - 80px); /* Sesuaikan dengan tinggi navbar */
  min-height: 500px;
  z-index: 1; /* Lebih rendah dari navbar (z-50) */
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

#map :deep(.santri-popup__title) {
  font-family: system-ui, sans-serif;
  font-size: 14px;
  color: #1e40af;
}

#map :deep(.santri-popup__label) {
  color: #475569;
  font-size: 13px;
}

#map :deep(.santri-popup .leaflet-popup-content-wrapper) {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 40px -18px rgba(15, 23, 42, 0.35);
}

#map :deep(.santri-popup .leaflet-popup-tip) {
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

:global(.dark) #map :deep(.santri-popup .leaflet-popup-content-wrapper) {
  background: #0f172a;
  border-color: #1f2937;
  box-shadow: 0 16px 40px -18px rgba(0, 0, 0, 0.6);
}

:global(.dark) #map :deep(.santri-popup .leaflet-popup-tip) {
  background: #0f172a;
  border-color: #1f2937;
}

:global(.dark) #map :deep(.santri-popup__title) {
  color: #c7d2fe;
}

:global(.dark) #map :deep(.santri-popup__label) {
  color: #cbd5e1;
}

/* Responsive */
@media (max-width: 768px) {
  .map-container {
    height: calc(100vh - 60px);
  }
}
</style>
