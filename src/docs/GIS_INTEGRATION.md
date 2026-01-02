# GIS Integration Documentation

## Overview

Aplikasi Bantuan Santri mengintegrasikan Geographic Information System (GIS) untuk visualisasi lokasi Santri dan Pesantren Pesantren menggunakan peta interaktif berbasis Leaflet.

## Features

### 1. Santri Map (`/peta-santri`)

Menampilkan lokasi semua santri dengan fitur:

- **Clustered Markers**: Pengelompokan otomatis marker berdasarkan zoom level
- **Color-coded by Ekonomi Level**:
  - 🔴 **Miskin** (Red): `#dc2626`
  - 🟡 **Rentan** (Yellow): `#f59e0b`
  - ⚫ **Cukup** (Gray): `#6b7280`
- **Heatmap**: Visualisasi densitas santri berdasarkan lokasi
- **Administrative Boundaries**: Overlay batas provinsi, kabupaten, kecamatan
- **Dark Mode Support**: Tema otomatis sesuai pengaturan sistem
- **Responsive Design**: Tampilan optimal untuk desktop dan mobile

### 2. Pesantren Map (`/peta-pesantren`)

Menampilkan lokasi semua pesantren dengan fitur:

- **Clustered Markers**: Pengelompokan otomatis marker
- **Color-coded by Akreditasi**:
  - 🟢 **A - Sangat Baik** (Green): `#059669`
  - 🟠 **B - Baik** (Amber): `#d97706`
  - 🔴 **C - Cukup** (Red): `#dc2626`
- **Heatmap**: Visualisasi distribusi pesantren
- **Administrative Boundaries**: Overlay batas administratif
- **Dark Mode Support**: Tema responsif
- **Responsive Design**: Mobile-friendly

## API Endpoints

### Santri GIS

#### Get Santri Points (GeoJSON)

```
GET /gis/santri-points?provinsi=...&kabupaten=...&kecamatan=...
```

**Response Format:**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      },
      "properties": {
        "id": "UUID",
        "nama": "Nama Santri",
        "provinsi": "Jawa Barat",
        "kabupaten": "Bandung",
        "kecamatan": "Bandung Kota",
        "ekonomi": "miskin|rentan|cukup",
        "score": 85
      }
    }
  ]
}
```

#### Get Santri Heatmap

```
GET /gis/heatmap
```

**Response Format:**

```json
[
  {
    "lat": -6.92,
    "lng": 107.61,
    "weight": 1.0
  }
]
```

### Pesantren GIS

#### Get Pesantren Points (GeoJSON)

```
GET /gis/pesantren-points?provinsi=...&kabupaten=...&kecamatan=...
```

**Response Format:**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      },
      "properties": {
        "id": "UUID",
        "nama": "Nama Pondok Pesantren",
        "akreditasi": "A|B|C",
        "provinsi": "Jawa Barat",
        "kabupaten": "Bandung",
        "kecamatan": "Bandung Kota",
        "jumlah_santri": 150,
        "jumlah_fasilitas": 12,
        "score": 85
      }
    }
  ]
}
```

#### Get Pesantren Heatmap

```
GET /gis/pesantren-heatmap
```

**Response Format:**

```json
[
  {
    "lat": -6.92,
    "lng": 107.61,
    "weight": 0.85
  }
]
```

## Component Structure

### SantriMap.vue

**Path:** `src/pages/SantriMap.vue`

**Key Features:**

- GeoJSON parsing dan rendering
- Marker clustering dengan leaflet.markercluster
- Heatmap visualization dengan leaflet.heat
- Administrative boundary layers (AdminBoundaryLayers.vue)
- Legend dengan kategori ekonomi
- Error handling dan loading state
- Theme observer untuk dark mode
- Responsive map container

**Props:** None

**Emits:** None

**State Variables:**

- `map`: Leaflet map instance
- `baseTileLayer`: Background tile layer
- `theme`: Current theme (light/dark)
- `isLoading`: Loading state
- `error`: Error message

### PesantrenMap.vue

**Path:** `src/pages/PesantrenMap.vue`

**Key Features:**

- Sama seperti SantriMap.vue namun untuk pesantren
- Color-coding berdasarkan akreditasi (A, B, C)
- Detail popup menampilkan jumlah santri dan fasilitas
- Score visualization di heatmap

**Props:** None

**Emits:** None

**State Variables:**

- `map`: Leaflet map instance
- `baseTileLayer`: Background tile layer
- `theme`: Current theme (light/dark)
- `isLoading`: Loading state
- `error`: Error message

### AdminBoundaryLayers.vue

**Path:** `src/pages/AdminBoundaryLayers.vue`

**Purpose:** Mengatur tampilan batas administratif (Provinsi, Kabupaten, Kecamatan)

**Features:**

- Toggle checkboxes untuk setiap level administratif
- GeoJSON loading dari public folder
- Style dan popup interaktif
- Hover effects

## Routing

### Routes

```javascript
{
  path: '/peta-santri',
  name: 'peta-santri',
  component: () => import('@/pages/SantriMap.vue'),
},
{
  path: '/peta-pesantren',
  name: 'peta-pesantren',
  component: () => import('@/pages/PesantrenMap.vue'),
}
```

### Navigation

Akses melalui navbar → Dashboard dropdown:

- **Peta Santri**: `/peta-santri`
- **Peta Pesantren**: `/peta-pesantren`

## Data Sources

### GeoJSON Files

Located in `public/data/geo/`:

- `indonesia-provinsi.geojson`: Batas provinsi Indonesia
- `indonesia-kabupaten.geojson`: Batas kabupaten Indonesia
- `indonesia-kecamatan.geojson`: Batas kecamatan Indonesia

## Styling & Theme

### Color Schemes

#### Santri Map - Ekonomi Level

```
Miskin:  #dc2626 (border), #ef4444 (fill)
Rentan:  #f59e0b (border), #fbbf24 (fill)
Cukup:   #6b7280 (border), #9ca3af (fill)
```

#### Pesantren Map - Akreditasi

```
A:       #059669 (border), #10b981 (fill)
B:       #d97706 (border), #f59e0b (fill)
C:       #dc2626 (border), #ef4444 (fill)
```

### Dark Mode

- Menggunakan CSS `:global(.dark)` selector
- Tile layer berubah dari OpenStreetMap ke CartoDB Dark
- Popup background dan text color disesuaikan
- Legend background tetap visible

## Configuration

### Environment Variables

```
VITE_API_URL=http://localhost:8000 (default)
```

### Map Settings

```javascript
// Center & initial zoom
map.setView([-2.5, 118], 5)

// Marker clustering
{
  maxClusterRadius: 50,
  disableClusteringAtZoom: 15,
  spiderfyDistanceMultiplier: 1.2
}

// Heatmap
{
  radius: 30-40,
  blur: 20-25,
  maxZoom: 8,
  gradient: { 0.4: 'blue', ..., 1.0: 'red' }
}
```

## Performance Optimization

1. **Lazy Loading**: Components dimuat on-demand via router
2. **Tile Caching**: OpenStreetMap/CartoDB handle caching
3. **Marker Clustering**: Mengurangi DOM nodes pada zoom out
4. **Z-index Management**: Custom panes untuk optimal layering
5. **Theme Observer**: Efficient mutation observer pattern

## Error Handling

### Network Errors

- Failed API calls menampilkan error message
- Fallback ke dummy data jika `USE_DUMMY_DATA = true`
- User-friendly error messages

### Map Errors

- Loading overlay selama inisialisasi
- Error boundary dengan error state
- Graceful degradation jika boundary layers fail

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Dependencies

```json
{
  "leaflet": "^1.9.0",
  "leaflet.heat": "^0.2.0",
  "leaflet.markercluster": "^1.4.1",
  "vue": "^3.3.0",
  "vue-router": "^4.2.0"
}
```

## Troubleshooting

### Map tidak muncul

- Pastikan container `.map-container` memiliki height
- Check browser console untuk error messages
- Verify `VITE_API_URL` configuration

### Markers tidak muncul

- Check API endpoint `/gis/santri-points` atau `/gis/pesantren-points`
- Verify GeoJSON response format (FeatureCollection)
- Check coordinate format (longitude, latitude)

### Heatmap tidak tampil

- Verify heatmap API response memiliki minimal data
- Check weight normalization logic
- Ensure maxZoom settings tidak terlalu tinggi

### Dark mode tidak berubah

- Check localStorage untuk 'theme-mode' key
- Verify document.documentElement.classList contains 'dark'
- Check theme observer console logs

## Future Enhancements

1. **Filtering**: Real-time filter by kabupaten/kecamatan
2. **Search**: Cari santri/pesantren by nama
3. **Export**: Export map as image/PDF
4. **Statistics**: Embedded charts dengan data aggregation
5. **Clustering**: Custom cluster styling
6. **Popups**: Expandable detail cards dengan detail informasi
7. **Routing**: Integrasi routing untuk pencarian rute terdekat
8. **Time-based**: Animation untuk temporal data
