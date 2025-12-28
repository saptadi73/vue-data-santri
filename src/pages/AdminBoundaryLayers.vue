<template>
  <div class="boundary-controls">
    <div class="control-group">
      <h3>Administrative Boundaries</h3>

      <label class="checkbox-label">
        <input v-model="showProvinsi" type="checkbox" @change="handleToggle" />
        <span class="label-text">Provinsi</span>
        <span class="color-badge" style="background: #2563eb"></span>
      </label>

      <label class="checkbox-label">
        <input v-model="showKabupaten" type="checkbox" @change="handleToggle" />
        <span class="label-text">Kabupaten</span>
        <span class="color-badge" style="background: #dc2626"></span>
      </label>

      <label class="checkbox-label">
        <input v-model="showKecamatan" type="checkbox" @change="handleToggle" />
        <span class="label-text">Kecamatan</span>
        <span class="color-badge" style="background: #f59e0b"></span>
      </label>

      <div v-if="error" class="error-message">⚠️ {{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'

const showProvinsi = ref(true)
const showKabupaten = ref(false)
const showKecamatan = ref(false)
const error = ref(null)

let map = null
let provLayer = null
let kabLayer = null
let kecLayer = null
let highlightedLayer = null

// Data GeoJSON
const provinsiGeo = ref(null)
const kabupatenGeo = ref(null)
const kecamatanGeo = ref(null)

// Import GeoJSON files
const loadGeoJSON = async () => {
  try {
    // Fetch GeoJSON files dari public/data
    const [provResponse, kabResponse, kecResponse] = await Promise.all([
      fetch('/data/geo/indonesia-provinsi.geojson'),
      fetch('/data/geo/indonesia-kabupaten.geojson'),
      fetch('/data/geo/indonesia-kecamatan.geojson'),
    ])

    if (!provResponse.ok || !kabResponse.ok || !kecResponse.ok) {
      throw new Error('Gagal mengunduh file GeoJSON')
    }

    provinsiGeo.value = await provResponse.json()
    kabupatenGeo.value = await kabResponse.json()
    kecamatanGeo.value = await kecResponse.json()

    console.log('GeoJSON loaded successfully')
  } catch (err) {
    console.error('Error loading GeoJSON:', err)
    error.value = 'Gagal memuat data batas administratif. File GeoJSON tidak ditemukan.'
  }
}

const createProvinsiLayer = () => {
  if (!provinsiGeo.value) return null

  return L.geoJSON(provinsiGeo.value, {
    style: {
      color: '#2563eb',
      weight: 2,
      fillOpacity: 0,
      dashArray: '5, 5',
    },
    onEachFeature: (feature, layer) => {
      const props = feature.properties

      layer.bindPopup(`
        <div class="popup-content">
          <h4>Provinsi</h4>
          <strong>${props.NAME_1 || 'N/A'}</strong>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #e5e7eb;">
          <small style="color: #64748b;">
            <strong>Tipe:</strong> ${props.TYPE_1 || props.ENGTYPE_1 || 'N/A'}
          </small>
        </div>
      `)

      // Hover effect
      layer.on('mouseover', function () {
        this.setStyle({
          weight: 3,
          color: '#1e40af',
        })
        highlightedLayer = this
      })

      layer.on('mouseout', function () {
        if (!this.isPopupOpen()) {
          this.setStyle({
            weight: 2,
            color: '#2563eb',
          })
          highlightedLayer = null
        }
      })
    },
  })
}

const createKabupatenLayer = () => {
  if (!kabupatenGeo.value) return null

  return L.geoJSON(kabupatenGeo.value, {
    style: (feature) => {
      // Styling dinamis berdasarkan zoom level
      return {
        color: '#DC2626',
        weight: window.innerWidth < 768 ? 0.5 : 0.8,
        fillOpacity: 0,
      }
    },
    onEachFeature: (feature, layer) => {
      const props = feature.properties

      layer.bindPopup(`
        <div class="popup-content">
          <h4>${props.NAME_2 || 'Kabupaten'}</h4>
          <small style="color: #475569;">
            <strong>Provinsi:</strong> ${props.NAME_1 || 'N/A'}<br/>
            <strong>Tipe:</strong> ${props.TYPE_2 || props.ENGTYPE_2 || 'N/A'}
          </small>
        </div>
      `)

      // Hover effect
      layer.on('mouseover', function () {
        this.setStyle({
          weight: 1.2,
          color: '#991B1B',
        })
        highlightedLayer = this
      })

      layer.on('mouseout', function () {
        if (!this.isPopupOpen()) {
          this.setStyle({
            weight: 0.8,
            color: '#DC2626',
          })
          highlightedLayer = null
        }
      })
    },
    maxZoom: 14, // Layer detail hanya tampil sampai zoom 14
  })
}

const createKecamatanLayer = () => {
  if (!kecamatanGeo.value) return null

  return L.geoJSON(kecamatanGeo.value, {
    style: () => ({
      color: '#f59e0b',
      weight: window.innerWidth < 768 ? 0.3 : 0.5,
      fillOpacity: 0,
    }),
    onEachFeature: (feature, layer) => {
      const props = feature.properties

      layer.bindPopup(`
        <div class="popup-content">
          <h4>${props.NAME_3 || 'Kecamatan'}</h4>
          <small style="color: #475569;">
            <strong>Kabupaten:</strong> ${props.NAME_2 || 'N/A'}<br/>
            <strong>Provinsi:</strong> ${props.NAME_1 || 'N/A'}
          </small>
        </div>
      `)

      layer.on('mouseover', function () {
        this.setStyle({
          weight: 0.8,
          color: '#d97706',
        })
        highlightedLayer = this
      })

      layer.on('mouseout', function () {
        if (!this.isPopupOpen()) {
          this.setStyle({
            weight: 0.5,
            color: '#f59e0b',
          })
          highlightedLayer = null
        }
      })
    },
    maxZoom: 16,
  })
}

const addLayers = (mapInstance) => {
  if (!mapInstance) return

  map = mapInstance

  // Tunggu GeoJSON selesai load, dengan max 5 detik timeout
  const checkAndAdd = (retries = 0) => {
    if (provinsiGeo.value && kabupatenGeo.value && kecamatanGeo.value) {
      try {
        if (!provLayer) {
          provLayer = createProvinsiLayer()
        }

        if (!kabLayer) {
          kabLayer = createKabupatenLayer()
        }

        if (!kecLayer) {
          kecLayer = createKecamatanLayer()
        }

        // Initial add
        if (showProvinsi.value && provLayer && !map.hasLayer(provLayer)) {
          provLayer.addTo(map)
        }

        if (showKabupaten.value && kabLayer && !map.hasLayer(kabLayer)) {
          kabLayer.addTo(map)
        }

        if (showKecamatan.value && kecLayer && !map.hasLayer(kecLayer)) {
          kecLayer.addTo(map)
        }

        error.value = null
      } catch (err) {
        console.error('Error adding layers:', err)
        error.value = 'Gagal menambahkan layer ke peta'
      }
    } else if (retries < 10) {
      // Retry setiap 300ms sampai 3 detik
      setTimeout(() => checkAndAdd(retries + 1), 300)
    } else {
      error.value = 'Gagal memuat data batas administratif'
    }
  }

  checkAndAdd()
}

const handleToggle = () => {
  if (!map) {
    error.value = 'Peta belum diinisialisasi'
    return
  }

  // Tunggu hingga GeoJSON loaded
  if (!provinsiGeo.value || !kabupatenGeo.value || !kecamatanGeo.value) {
    error.value = 'Data batas administratif masih dimuat...'
    setTimeout(handleToggle, 500) // Retry setelah 500ms
    return
  }

  try {
    // Handle Provinsi
    if (showProvinsi.value) {
      if (!provLayer) {
        provLayer = createProvinsiLayer()
      }
      if (provLayer && map && !map.hasLayer(provLayer)) {
        provLayer.addTo(map)
        error.value = null
      }
    } else {
      if (provLayer && map && map.hasLayer(provLayer)) {
        map.removeLayer(provLayer)
      }
    }

    // Handle Kabupaten
    if (showKabupaten.value) {
      if (!kabLayer) {
        kabLayer = createKabupatenLayer()
      }
      if (kabLayer && map && !map.hasLayer(kabLayer)) {
        kabLayer.addTo(map)
        error.value = null
      }
    } else {
      if (kabLayer && map && map.hasLayer(kabLayer)) {
        map.removeLayer(kabLayer)
      }
    }

    // Handle Kecamatan
    if (showKecamatan.value) {
      if (!kecLayer) {
        kecLayer = createKecamatanLayer()
      }
      if (kecLayer && map && !map.hasLayer(kecLayer)) {
        kecLayer.addTo(map)
        error.value = null
      }
    } else {
      if (kecLayer && map && map.hasLayer(kecLayer)) {
        map.removeLayer(kecLayer)
      }
    }
  } catch (err) {
    console.error('Error toggling layers:', err)
    error.value = 'Gagal menampilkan/menyembunyikan layer: ' + err.message
  }
}

const toggleLayers = (mapInstance) => {
  map = mapInstance
  handleToggle()
}

onMounted(async () => {
  await loadGeoJSON()
})

defineExpose({ addLayers, toggleLayers, showProvinsi, showKabupaten, showKecamatan })
</script>

<style lang="scss" scoped>
.boundary-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  min-width: 250px;
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    min-width: auto;
  }
}

.control-group {
  h3 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f5f9;
  }

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #2563eb;
  }

  .label-text {
    flex: 1;
    font-size: 13px;
    color: #475569;
    font-weight: 500;
  }

  .color-badge {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1px solid #e2e8f0;
  }
}

.error-message {
  margin-top: 12px;
  padding: 8px 12px;
  background-color: #fee2e2;
  color: #991b1b;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid #fecaca;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .boundary-controls {
    background: #1e293b;
    border-color: #334155;
    color: #e2e8f0;

    h3 {
      color: #f1f5f9;
    }
  }

  .checkbox-label {
    &:hover {
      background-color: #334155;
    }

    .label-text {
      color: #cbd5e1;
    }
  }
}

/* Popup styling */
:deep(.leaflet-popup-content) {
  font-family: system-ui, sans-serif;

  .popup-content {
    padding: 4px 0;

    h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1e40af;
    }

    small {
      display: block;
      line-height: 1.6;
    }
  }
}
</style>
