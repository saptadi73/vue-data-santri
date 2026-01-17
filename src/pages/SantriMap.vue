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
import { executeQueryMap } from '@/services/nl2sqlService'

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
// Refs for rebuilding choropleth on metric change
let santriGeoRef = null
let kabupatenBoundaryRef = null
let choroplethThresholdsRef = null
const isLoading = ref(true)
const error = ref(null)
const theme = ref('light')
const showHeatmap = ref(true)
const showChoropleth = ref(false)
const choroplethMetric = ref('count') // 'count', 'avg_score'
const displayMode = ref('points') // 'points', 'heatmap', 'choropleth'

const showNL2SQLWidget = ref(false)
const santriQueries = [
  'Santri miskin di Jawa Barat',
  'Top 10 santri dengan skor tertinggi',
  'Jumlah santri per kategori',
  'Rata-rata skor santri',
  'Santri dari Bandung',
  'Distribusi santri per provinsi',
]

// Data dummy untuk testing
const dummyGeoData = {
  type: 'FeatureCollection',
  features: [
    // Jakarta
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [106.8456, -6.2088] },
      properties: { name: 'Ahmad Santoso', ekonomi: 'Miskin', score: 75, kabupaten: 'Jakarta' },
    },
    // Bandung (Jawa Barat)
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [107.6191, -6.9175] },
      properties: { name: 'Siti Aisyah', ekonomi: 'Menengah', score: 70, kabupaten: 'Bandung' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [107.6191, -6.9175] },
      properties: { name: 'Bambang', ekonomi: 'Menengah', score: 65, kabupaten: 'Bandung' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [107.6191, -6.9175] },
      properties: { name: 'Indah', ekonomi: 'Miskin', score: 80, kabupaten: 'Bandung' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [107.6191, -6.9175] },
      properties: { name: 'Rudi', ekonomi: 'Rendah', score: 85, kabupaten: 'Bandung' },
    },
    // Surabaya (Jawa Timur)
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [110.3695, -7.7956] },
      properties: { name: 'Fatimah Zahra', ekonomi: 'Rendah', score: 85, kabupaten: 'Surabaya' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [110.3695, -7.7956] },
      properties: { name: 'Ahmad Wijaya', ekonomi: 'Miskin', score: 88, kabupaten: 'Surabaya' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [110.3695, -7.7956] },
      properties: { name: 'Lina', ekonomi: 'Rendah', score: 95, kabupaten: 'Surabaya' },
    },
    // Sidoarjo (Jawa Timur)
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [112.7521, -7.2575] },
      properties: { name: 'Muhammad Ridwan', ekonomi: 'Rendah', score: 90, kabupaten: 'Sidoarjo' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [112.7521, -7.2575] },
      properties: { name: 'Rina Santoso', ekonomi: 'Menengah', score: 78, kabupaten: 'Sidoarjo' },
    },
    // Semarang (Jawa Tengah)
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [109.1402, -6.8748] },
      properties: { name: 'Khadijah Nurma', ekonomi: 'Rendah', score: 92, kabupaten: 'Semarang' },
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

    // Suppress Canvas2D willReadFrequently warning - we already set it in renderer
    const originalWarn = console.warn
    const warnFilter = new RegExp('Canvas2D.*willReadFrequently')
    console.warn = function (...args) {
      if (!warnFilter.test(String(args[0]))) {
        originalWarn.apply(console, args)
      }
    }

    // Inisialisasi map dengan renderer yang optimal
    map = L.map('map', {
      renderer: L.canvas({ willReadFrequently: true }),
    }).setView([-2.5, 118], 5)
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
      santriGeoRef = geo // ✅ Pastikan santriGeoRef diset untuk dummy data
    } else {
      // ===== FETCH DATA DARI API =====
      try {
        const geoResponse = await fetch(`${API_BASE}/gis/santri-points`)
        if (!geoResponse.ok) throw new Error(`Gagal memuat data santri (${geoResponse.status})`)
        const geoData = await geoResponse.json()

        // Backend membungkus GeoJSON dalam object data
        geo = geoData.data || geoData
        santriGeoRef = geo
      } catch (fetchError) {
        console.error('❌ Error fetching santri points:', fetchError?.message || fetchError)
        console.warn('⚠️ Continuing with empty santri data to prevent full error...')
        geo = { type: 'FeatureCollection', features: [] }
        santriGeoRef = geo
        // Jangan throw - lanjutkan dengan data kosong supaya choropleth tetap render
      }

      try {
        const heatResponse = await fetch(`${API_BASE}/gis/heatmap`)
        if (!heatResponse.ok) throw new Error(`Gagal memuat heatmap (${heatResponse.status})`)
        const heatData = await heatResponse.json()

        // Backend mengirim array langsung atau wrapped dalam data property
        const heatArray = Array.isArray(heatData) ? heatData : heatData.data || []
        heat = heatArray.map((f) => ({
          lat: f.lat,
          lng: f.lng,
          weight: f.weight || f.skor || f.score || 0,
        }))
      } catch (fetchError) {
        console.error('❌ Error fetching heatmap:', fetchError?.message || fetchError)
        console.warn('⚠️ Continuing with empty heatmap data...')
        heat = []
        // Jangan throw - lanjutkan tanpa heatmap
      }
    }

    // Function to get marker color based on ekonomi level
    const getMarkerColor = (ekonomi) => {
      const level = ekonomi?.toLowerCase().trim() || ''

      if (level === 'miskin' || level === 'sangat miskin') {
        return { color: '#dc2626', fillColor: '#ef4444' } // Red - Miskin
      } else if (level === 'rentan' || level === 'rentan miskin') {
        return { color: '#f59e0b', fillColor: '#fbbf24' } // Yellow - Rentan
      } else if (level === 'cukup' || level === 'tidak miskin') {
        return { color: '#6b7280', fillColor: '#9ca3af' } // Gray - Cukup/Tidak Miskin
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
        // Backend bisa menggunakan berbagai field names untuk kategori ekonomi
        const ekonomi = p.ekonomi || p.category || p.kategori_ekonomi || p.status_ekonomi
        return L.marker(latlng, {
          icon: createSantriIcon(ekonomi),
          pane: 'santriPane',
        })
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties
        // Backend bisa menggunakan berbagai field names
        const nama = p.nama || p.name || p.nama_lengkap || 'Tidak ada nama'
        const ekonomi = p.ekonomi || p.category || p.kategori_ekonomi || p.status_ekonomi || 'N/A'
        const score = p.score || p.skor || p.total_score || 0

        // NOTE: Jika ekonomi dan score masih "N/A" dan 0,
        // berarti backend API belum mengirim field tersebut.
        // Lihat BACKEND_FIX_NEEDED.md untuk solusi

        layer.bindPopup(
          `
          <div class="santri-popup">
            <strong class="santri-popup__title">${nama}</strong><br/>
            <span class="santri-popup__label">Ekonomi:</span> <strong>${ekonomi}</strong><br/>
            <span class="santri-popup__label">Skor:</span> <strong>${score}</strong>
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
    clusterGroupRef = clusterGroup

    // ===== HEATMAP =====
    if (heat && heat.length > 0) {
      // Normalisasi weight: backend mengirim score (0-100), perlu dinormalisasi ke 0-1
      const maxWeight = Math.max(...heat.map((p) => p.weight))
      const normalizedHeat = heat.map((p) => [p.lat, p.lng, p.weight / maxWeight])

      heatmapLayer = L.heatLayer(normalizedHeat, {
        radius: 30,
        blur: 20,
        maxZoom: 8,
        gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' },
      })

      if (showHeatmap.value) {
        heatmapLayer.addTo(map)
      }
    }

    // ===== CHOROPLETH (Aggregate by Kabupaten) =====
    try {
      // Fetch boundary GeoJSON from public folder
      const boundaryResponse = await fetch('/data/geo/indonesia-kabupaten.geojson')
      if (!boundaryResponse.ok) throw new Error(`Boundary fetch failed: ${boundaryResponse.status}`)
      const boundaryData = await boundaryResponse.json()
      kabupatenBoundaryRef = boundaryData

      const normalizeRegionName = (name) => {
        if (!name || typeof name !== 'string') return 'UNKNOWN'
        return (
          name
            .toLowerCase()
            // Remove prefixes
            .replace(/^kota\s+/g, '')
            .replace(/^kabupaten\s+/g, '')
            .replace(/^kab\.?\s*/g, '')
            .replace(/^kotamadya\s+/g, '')
            .replace(/^administrasi\s+/g, '')
            .replace(/^dki\s+/g, '')
            // Remove suffix variations
            .replace(/\s+selatan$/g, ' selatan')
            .replace(/\s+utara$/g, ' utara')
            .replace(/\s+timur$/g, ' timur')
            .replace(/\s+barat$/g, ' barat')
            .replace(/\s+tengah$/g, ' tengah')
            // General cleanup
            .replace(/\./g, '')
            .replace(/\s+/g, ' ')
            .trim()
        )
      }

      // ===== MAPPING SANTRI NAMES TO BOUNDARY NAMES =====
      // Karena santri data punya nama singkat (bandung, bekasi) tapi boundary punya nama lengkap (Kota Bandung, Kabupaten Bekasi)
      const sanitriToBoundaryMap = {
        solo: 'surakarta',
        bekasi: ['kota bekasi', 'kabupaten bekasi'],
        surabaya: 'kota surabaya',
        sleman: 'kabupaten sleman',
        serang: ['kota serang', 'kabupaten serang'],
        jember: 'kabupaten jember',
        bogor: ['kota bogor', 'kabupaten bogor'],
        bandung: ['kota bandung', 'kabupaten bandung'],
        malang: ['kota malang', 'kabupaten malang'],
        tangerang: ['kota tangerang', 'kabupaten tangerang'],
        semarang: 'kota semarang',
        magelang: ['kota magelang', 'kabupaten magelang'],
        bantul: 'kabupaten bantul',
      }

      // Aggregate santri data by normalized kabupaten name
      const aggregateByKabupaten = (geoData) => {
        const aggregate = {}
        geoData.features?.forEach((feature) => {
          const p = feature.properties || {}
          const rawKab =
            p.kabupaten ||
            p.kabupaten_domisili ||
            p.kab ||
            p.regency ||
            p.kabupaten_name ||
            'Unknown'

          // Normalize kabupaten name
          const key = normalizeRegionName(rawKab)

          if (!aggregate[key]) {
            aggregate[key] = { count: 0, total_score: 0 }
          }
          aggregate[key].count += 1
          const scoreVal = Number(p.score || p.skor || p.total_score || 0)
          aggregate[key].total_score += isFinite(scoreVal) ? scoreVal : 0
        })
        return aggregate
      }

      const santriAggregated = aggregateByKabupaten(santriGeoRef || geo)

      // Helper function untuk lookup santri aggregated data dari boundary name
      // Karena boundary name berbeda dengan santri name, perlu special matching logic
      const lookupSantriData = (boundaryRawName) => {
        const normalized = normalizeRegionName(boundaryRawName).toLowerCase().trim()

        // Direct match dari normalized boundary name
        if (santriAggregated[normalized]) {
          return santriAggregated[normalized]
        }

        // Try all santri keys dan lihat apakah cocok dengan nama ini
        for (const [santriKey, santriData] of Object.entries(santriAggregated)) {
          // Check jika boundary name contains santri key atau sebaliknya
          if (normalized.includes(santriKey) || santriKey.includes(normalized)) {
            return santriData
          }

          // Check jika santri key ada di mapping dan cocok dengan boundary name
          if (sanitriToBoundaryMap[santriKey]) {
            const mappedNames = Array.isArray(sanitriToBoundaryMap[santriKey])
              ? sanitriToBoundaryMap[santriKey]
              : [sanitriToBoundaryMap[santriKey]]

            for (const mappedName of mappedNames) {
              const normalizedMapped = normalizeRegionName(mappedName).toLowerCase().trim()
              if (normalizedMapped === normalized) {
                return santriData
              }
            }
          }
        }

        return null // No match
      }

      // Debug: log aggregated data
      console.log('🔍 Santri Aggregated:', santriAggregated)
      console.log('🔍 Keys dari Santri:', Object.keys(santriAggregated))
      if (geo.features && geo.features.length > 0) {
        console.log('🔍 Sample santri properties:', geo.features[0].properties)
        console.log('🔍 Total santri features:', geo.features.length)
      }

      // Build quantile thresholds for more balanced color bins
      const buildQuantileThresholds = (arr, quantiles = [0.2, 0.4, 0.6, 0.8]) => {
        if (!arr || arr.length === 0) return []
        const sorted = [...arr].sort((a, b) => a - b)
        return quantiles.map((q) => {
          const idx = Math.floor(q * (sorted.length - 1))
          return sorted[idx]
        })
      }

      const metricIsCount = choroplethMetric.value === 'count'
      const valuesForThresholds = Object.values(santriAggregated)
        .map((v) => (metricIsCount ? v.count : v.total_score / (v.count || 1)))
        .filter((v) => isFinite(v) && v > 0)

      const thresholds = buildQuantileThresholds(valuesForThresholds)
      choroplethThresholdsRef = thresholds
      const colors = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444']

      const pickColor = (value) => {
        if (!isFinite(value) || value <= 0) return '#d1d5db' // no data / zero
        if (thresholds.length === 0) return colors[0]
        if (value <= thresholds[0]) return colors[0]
        if (value <= thresholds[1]) return colors[1]
        if (value <= thresholds[2]) return colors[2]
        if (value <= thresholds[3]) return colors[3]
        return colors[4]
      }

      const choroplethLayer = L.geoJSON(kabupatenBoundaryRef || boundaryData, {
        style: (feature) => {
          const rawName =
            feature.properties?.nama ||
            feature.properties?.NAME ||
            feature.properties?.NAME_2 ||
            'Unknown'

          // Gunakan helper function untuk lookup, bukan direct normalize
          const data = lookupSantriData(rawName)
          const value = data
            ? metricIsCount
              ? data.count
              : data.total_score / (data.count || 1)
            : NaN
          const color = pickColor(value)
          return {
            fillColor: color,
            weight: 2,
            opacity: 0.7,
            color: '#333',
            fillOpacity: 0.6,
          }
        },
        onEachFeature: (feature, layer) => {
          const rawName =
            feature.properties?.nama ||
            feature.properties?.NAME ||
            feature.properties?.NAME_2 ||
            'Unknown'

          // Gunakan helper function untuk lookup
          const data = lookupSantriData(rawName)
          const tooltip = data
            ? metricIsCount
              ? `<strong>${rawName}</strong><br>Santri: ${data.count}`
              : `<strong>${rawName}</strong><br>Rata-rata Skor: ${(data.total_score / (data.count || 1)).toFixed(2)}`
            : `<strong>${rawName}</strong><br>Data tidak tersedia`

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
      console.log('✅ Choropleth layer created successfully:', choropletheLayer)
    } catch (err) {
      console.error('❌ Choropleth error:', err?.message || err)
      console.error('❌ Error type:', err?.name)
      console.error('❌ Full error:', err)
      if (err?.stack) console.error('❌ Error stack:', err.stack)
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
            <span style="display: inline-block; width: 10px; height: 10px; background: #ef4444; border-radius: 50%; margin-right: 6px; border: 1px solid #dc2626;"></span>
            <span>Miskin</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 10px; height: 10px; background: #fbbf24; border-radius: 50%; margin-right: 6px; border: 1px solid #f59e0b;"></span>
            <span>Rentan</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 10px; height: 10px; background: #9ca3af; border-radius: 50%; margin-right: 6px; border: 1px solid #6b7280;"></span>
            <span>Cukup</span>
          </div>
          <div style="display: flex; align-items: center;">
            <span style="display: inline-block; width: 10px; height: 10px; background: #d1d5db; border-radius: 50%; margin-right: 6px; border: 1px solid #9ca3af;"></span>
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
    console.error('❌ GLOBAL ERROR in map onMounted:', err?.message || err)
    console.error('❌ Error details:', err)
    if (err?.stack) console.error('❌ Stack:', err.stack)
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
  console.log('🔄 toggleChoropleth called')
  console.log('  map:', map ? 'exists' : 'null')
  console.log('  choropletheLayer:', choropletheLayer ? 'exists' : 'null')
  showChoropleth.value = !showChoropleth.value
  if (!map || !choropletheLayer) {
    console.warn('⚠️ Cannot toggle: map or choropletheLayer is null')
    return
  }

  if (showChoropleth.value) {
    console.log('✅ Adding choropleth to map')
    choropletheLayer.addTo(map)
    if (clusterGroupRef) map.removeLayer(clusterGroupRef)
    if (heatmapLayer && map.hasLayer(heatmapLayer)) map.removeLayer(heatmapLayer)
    displayMode.value = 'choropleth'
  } else {
    console.log('❌ Removing choropleth from map')
    map.removeLayer(choropletheLayer)
    if (clusterGroupRef) clusterGroupRef.addTo(map)
    displayMode.value = 'points'
  }
}

const changeChoroplethMetric = (metric) => {
  choroplethMetric.value = metric
  // Reload choropleth dengan metric baru
  if (choropletheLayer && map.hasLayer(choropletheLayer)) {
    // Rebuild layer based on new metric
    map.removeLayer(choropletheLayer)
    // Recreate choropleth using current data/boundary
    if (kabupatenBoundaryRef && santriGeoRef) {
      // Trigger rebuild by re-running the same block via creating a new layer
      try {
        const boundaryData = kabupatenBoundaryRef
        const geo = santriGeoRef
        // Repeat minimal rebuild steps
        const normalizeRegionName = (name) => {
          if (!name || typeof name !== 'string') return 'UNKNOWN'
          return name
            .toLowerCase()
            .replace(/kabupaten\s+/g, '')
            .replace(/kab\.?\s*/g, '')
            .replace(/kota\s+/g, '')
            .replace(/kotamadya\s+/g, '')
            .replace(/administrasi\s+/g, '')
            .replace(/\./g, '')
            .replace(/\s+/g, ' ')
            .trim()
        }
        const aggregateByKabupaten = (geoData) => {
          const aggregate = {}
          geoData.features?.forEach((feature) => {
            const p = feature.properties || {}
            const rawKab =
              p.kabupaten ||
              p.kabupaten_domisili ||
              p.kab ||
              p.regency ||
              p.kabupaten_name ||
              'Unknown'
            const key = normalizeRegionName(rawKab)
            if (!aggregate[key]) {
              aggregate[key] = { count: 0, total_score: 0 }
            }
            aggregate[key].count += 1
            const scoreVal = Number(p.score || p.skor || p.total_score || 0)
            aggregate[key].total_score += isFinite(scoreVal) ? scoreVal : 0
          })
          return aggregate
        }
        const santriAggregated = aggregateByKabupaten(geo)
        const metricIsCount = choroplethMetric.value === 'count'
        const valuesForThresholds = Object.values(santriAggregated)
          .map((v) => (metricIsCount ? v.count : v.total_score / (v.count || 1)))
          .filter((v) => isFinite(v) && v > 0)
        const sorted = [...valuesForThresholds].sort((a, b) => a - b)
        const qs = [0.2, 0.4, 0.6, 0.8]
        const thresholds = qs.map((q) => {
          const idx = Math.floor(q * (sorted.length - 1))
          return sorted[idx]
        })
        choroplethThresholdsRef = thresholds
        const colors = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444']
        const pickColor = (value) => {
          if (!isFinite(value) || value <= 0) return '#d1d5db'
          if (thresholds.length === 0) return colors[0]
          if (value <= thresholds[0]) return colors[0]
          if (value <= thresholds[1]) return colors[1]
          if (value <= thresholds[2]) return colors[2]
          if (value <= thresholds[3]) return colors[3]
          return colors[4]
        }
        choropletheLayer = L.geoJSON(boundaryData, {
          style: (feature) => {
            const rawName =
              feature.properties?.nama ||
              feature.properties?.NAME ||
              feature.properties?.NAME_2 ||
              'Unknown'
            const key = normalizeRegionName(rawName)
            const data = santriAggregated[key]
            const value = data
              ? metricIsCount
                ? data.count
                : data.total_score / (data.count || 1)
              : NaN
            return {
              fillColor: pickColor(value),
              weight: 2,
              opacity: 0.7,
              color: '#333',
              fillOpacity: 0.6,
            }
          },
          onEachFeature: (feature, layer) => {
            const rawName =
              feature.properties?.nama ||
              feature.properties?.NAME ||
              feature.properties?.NAME_2 ||
              'Unknown'
            const key = normalizeRegionName(rawName)
            const data = santriAggregated[key]
            const tooltip = data
              ? metricIsCount
                ? `<strong>${rawName}</strong><br>Santri: ${data.count}`
                : `<strong>${rawName}</strong><br>Rata-rata Skor: ${(data.total_score / (data.count || 1)).toFixed(2)}`
              : `<strong>${rawName}</strong><br>Data tidak tersedia`
            layer.bindPopup(tooltip)
            layer.on('mouseover', function () {
              this.setStyle({ weight: 3, opacity: 1 })
            })
            layer.on('mouseout', function () {
              this.setStyle({ weight: 2, opacity: 0.7 })
            })
          },
        })
        choropletheLayer.addTo(map)
      } catch (e) {
        console.warn('Gagal rebuild choropleth:', e)
      }
    }
  }
}

// Handle NL2SQL query result and display on map
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
        const ekonomi = p.kategori_kemiskinan || p.ekonomi || p.category

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
        const nama = p.nama_santri || p.nama || p.name || 'Tidak ada nama'
        const ekonomi = p.kategori_kemiskinan || p.ekonomi || p.category || 'Tidak ada data'
        const skor = p.skor_total || p.skor || p.score || 'N/A'
        const provinsi = p.provinsi_domisili || p.provinsi || '-'
        const kabupaten = p.kabupaten_domisili || p.kabupaten || '-'

        const popupContent = `
          <div class="nl2sql-popup">
            <div class="popup-badge">AI Result</div>
            <h4>${nama}</h4>
            <div class="popup-info">
              <p><strong>Kategori:</strong> ${ekonomi}</p>
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
</script>

<template>
  <div class="map-container">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Memuat peta...</p>
    </div>
    <div v-if="error" class="error-message">⚠️ {{ error }}</div>

    <!-- Heatmap Toggle Control -->
    <div class="heatmap-control">
      <button
        @click="toggleHeatmap"
        :class="['heatmap-toggle-btn', { active: showHeatmap }]"
        title="Tampilkan/Sembunyikan Heatmap Kepadatan Santri Berdasarkan Tingkat Kebutuhan Ekonomi"
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
        <p class="info-text">Menampilkan intensitas level ekonomi santri</p>
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
            Jumlah Santri
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
      title="AI Search - Santri"
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
        <h3>AI Search - Santri</h3>
        <button @click="showNL2SQLWidget = false" class="close-btn">×</button>
      </div>
      <div class="panel-content">
        <NL2SQLWidget
          compact
          :suggestedQueries="santriQueries"
          placeholder="Tanyakan tentang data santri..."
          @result="handleNL2SQLResult"
        />
      </div>
    </div>

    <!-- NL2SQL Query Widget Button (Duplicate - will be removed) -->
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

/* NL2SQL Result Markers & Popup */
:global(.nl2sql-cluster) {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.6);
}

:global(.nl2sql-cluster span) {
  color: white;
  font-weight: 700;
  font-size: 14px;
}

:global(.nl2sql-cluster-icon) {
  background: transparent !important;
  border: none !important;
}

:global(.nl2sql-popup) {
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  min-width: 200px;
}

:global(.nl2sql-popup .popup-badge) {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: inline-block;
}

:global(.nl2sql-popup h4) {
  margin: 8px 0;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

:global(.nl2sql-popup .popup-info) {
  margin-top: 8px;
}

:global(.nl2sql-popup .popup-info p) {
  margin: 4px 0;
  font-size: 13px;
  color: #475569;
}

:global(.nl2sql-popup .popup-info strong) {
  color: #1e293b;
  font-weight: 600;
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
    width: 10px;
    height: 10px;
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
