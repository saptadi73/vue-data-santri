# Testing Guide - GIS Maps (Santri & Pesantren)

## Quick Start Testing

Kedua peta telah dikonfigurasi untuk menggunakan **dummy data** sehingga dapat di-test tanpa memerlukan backend API.

### Enable/Disable Dummy Data

#### PesantrenMap.vue

```javascript
// Line 11
const USE_DUMMY_DATA = true // Set true untuk test dengan dummy data
const USE_DUMMY_DATA = false // Set false untuk gunakan backend API
```

#### SantriMap.vue

```javascript
// Line 12
const USE_DUMMY_DATA = true // Set true untuk test dengan dummy data
const USE_DUMMY_DATA = false // Set false untuk gunakan backend API
```

## Testing Without Backend

### 1. Navigate ke Peta Pesantren

```
URL: http://localhost:5173/peta-pesantren
Navbar: Dashboard → Peta Pesantren
```

### 2. Expected Features

#### Markers (Clustered)

- ✅ 6 pesantren markers ditampilkan
- ✅ Warna berdasarkan akreditasi:
  - 🟢 Akreditasi A (Green) = 3 pesantren
  - 🟠 Akreditasi B (Amber) = 2 pesantren
  - 🔴 Akreditasi C (Red) = 1 pesantren

#### Popup Information

Click pada marker untuk melihat:

```
Pondok Pesantren Al-Ikhlas
Akreditasi: A
Santri: 150
Fasilitas: 12
Skor: 85
```

#### Heatmap

- Visualisasi densitas sebaran pesantren
- Gradient: Blue → Cyan → Lime → Yellow → Red
- Menunjukkan konsentrasi pesantren

#### Legend

Bottom-left corner menampilkan:

- 🟢 A - Sangat Baik
- 🟠 B - Baik
- 🔴 C - Cukup

#### Administrative Boundaries

- Toggle checkboxes: Provinsi, Kabupaten, Kecamatan
- Optional: Tidak harus aktif untuk test

#### Dark Mode

- Toggle dark mode dari theme selector
- Tile layer berubah dari OpenStreetMap ke CartoDB Dark
- Popup styling disesuaikan

#### Zoom & Pan

- Zoom in/out dengan mouse wheel
- Pan dengan drag
- Buttons di top-left corner untuk zoom

### 3. Dummy Data Details

#### Pesantren Pesantren (6 locations)

```javascript
;[
  {
    nama: 'Pondok Pesantren Al-Ikhlas',
    koordinat: [106.8456, -6.2088],
    akreditasi: 'A',
    santri: 150,
    fasilitas: 12,
    score: 85,
  },
  {
    nama: 'Pondok Pesantren As-Sunnah',
    koordinat: [110.3695, -7.7956],
    akreditasi: 'B',
    santri: 200,
    fasilitas: 15,
    score: 78,
  },
  {
    nama: "Pondok Pesantren Nurul Qur'an",
    koordinat: [112.7521, -7.2575],
    akreditasi: 'A',
    santri: 180,
    fasilitas: 18,
    score: 90,
  },
  {
    nama: 'Pondok Pesantren Daarul Hana',
    koordinat: [107.6191, -6.9175],
    akreditasi: 'B',
    santri: 120,
    fasilitas: 10,
    score: 72,
  },
  {
    nama: 'Pondok Pesantren Al-Haramain',
    koordinat: [113.9213, -8.1545],
    akreditasi: 'A',
    santri: 250,
    fasilitas: 20,
    score: 88,
  },
  {
    nama: 'Pondok Pesantren Assalaam',
    koordinat: [109.1402, -6.8748],
    akreditasi: 'C',
    santri: 100,
    fasilitas: 8,
    score: 65,
  },
]
```

#### Heatmap Data (6 points)

```javascript
;[
  { lat: -6.2088, lng: 106.8456, weight: 0.85 },
  { lat: -7.7956, lng: 110.3695, weight: 0.78 },
  { lat: -7.2575, lng: 112.7521, weight: 0.9 },
  { lat: -6.9175, lng: 107.6191, weight: 0.72 },
  { lat: -8.1545, lng: 113.9213, weight: 0.88 },
  { lat: -6.8748, lng: 109.1402, weight: 0.65 },
]
```

## Testing With Backend

### 1. Disable Dummy Data

```javascript
// In PesantrenMap.vue and SantriMap.vue
const USE_DUMMY_DATA = false
```

### 2. API Endpoints Required

#### Pesantren GIS

```
GET /gis/pesantren-points
  → Returns FeatureCollection with pesantren locations
  → Properties: id, nama, akreditasi, provinsi, kabupaten, kecamatan,
               jumlah_santri, jumlah_fasilitas, score

GET /gis/pesantren-heatmap
  → Returns Array with heatmap points
  → Fields: lat, lng, weight
```

#### Santri GIS

```
GET /gis/santri-points
  → Returns FeatureCollection with santri locations
  → Properties: id, nama, provinsi, kabupaten, kecamatan, ekonomi, score

GET /gis/heatmap
  → Returns Array with heatmap points
  → Fields: lat, lng, weight
```

### 3. Response Format

#### /gis/pesantren-points

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
        "nama": "Pondok Pesantren Al-Ikhlas",
        "akreditasi": "A",
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

#### /gis/pesantren-heatmap

```json
[
  {
    "lat": -6.2088,
    "lng": 106.8456,
    "weight": 0.85
  }
]
```

### 4. Error Handling

Jika API tidak dapat diakses dan `USE_DUMMY_DATA = false`:

- Loading spinner ditampilkan
- Error message: "Backend API tidak dapat diakses. Pastikan server berjalan di..."
- Check browser console untuk detail error

## Troubleshooting

### Map tidak muncul

1. ✅ Verifikasi route ada di router/index.js
2. ✅ Verifikasi navbar link mengarah ke `/peta-pesantren` atau `/peta-santri`
3. ✅ Check browser console (F12) untuk error
4. ✅ Pastikan container `.map-container` render dengan height

**Fix:**

```bash
# Hard refresh browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Markers tidak tampil

1. ✅ Pastikan `USE_DUMMY_DATA = true`
2. ✅ Check browser console untuk fetch errors
3. ✅ Verify GeoJSON structure di console:

```javascript
console.log(geo) // Should be FeatureCollection
```

### Heatmap tidak tampil

1. ✅ Verify heatmap data ada di console:

```javascript
console.log(heat) // Should be array dengan lat, lng, weight
```

2. ✅ Check normalization logic (weight normalization bisa 0)
3. ✅ Verify maxZoom setting tidak terlalu tinggi (set ke 8)

### Dark mode tidak work

1. ✅ Toggle theme dari navbar
2. ✅ Check localStorage: `localStorage.getItem('theme-mode')`
3. ✅ Check document.documentElement.classList contains 'dark'

### Marker clustering not working

1. ✅ Verify leaflet.markercluster CSS dan JS import
2. ✅ Check vendor CSS loaded: `leaflet.markercluster/dist/MarkerCluster.css`
3. ✅ Try zoom out untuk trigger clustering

## Performance Testing

### Load Time

```javascript
// Add to console
performance.mark('map-start')
// ... navigate to map
// Open map, wait for load
performance.mark('map-end')
performance.measure('map-load', 'map-start', 'map-end')
performance.getEntriesByName('map-load')[0]
```

### Memory Usage

1. Open DevTools → Performance tab
2. Start recording
3. Navigate to map
4. Let load completely
5. Stop recording
6. Check memory timeline

## Browser Testing

### Tested on:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Chrome/Safari

### Responsive Testing

```
F12 → Toggle Device Toolbar (Ctrl+Shift+M)
Test pada: iPhone 12, iPad, Galaxy S20
```

## Console Debugging

### Enable debug logs

Add to map components:

```javascript
console.log('🗺️ Map initialized')
console.log('📍 Markers count:', pesantrenLayer.getLayers().length)
console.log('🌡️ Heatmap data:', heat)
```

### Check GeoJSON

```javascript
// In browser console
map.eachLayer((layer) => console.log(layer))
```

### Verify Coordinates

```javascript
// Check if coordinates valid (Indonesia)
// Latitude: -11 to 6
// Longitude: 95 to 141
;[107.61, -6.92] // Valid
```

## Next Steps

Once backend is ready:

1. Set `USE_DUMMY_DATA = false` in both map components
2. Implement `/gis/pesantren-points` endpoint
3. Implement `/gis/pesantren-heatmap` endpoint
4. Test with real data
5. Monitor for CORS issues
6. Add error retry logic if needed

---

**Created:** December 31, 2025
**Status:** Ready for testing with dummy data
