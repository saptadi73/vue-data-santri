# 🔍 GIS 404 Debugging - Quick Start Guide

Anda mengalami error 404 pada endpoint GIS. Berikut cara mendebug secara detail:

## ⚡ Quick Start (5 Menit)

### Step 1: Buka Debug Console

```
http://localhost:5173/backend-debug
```

### Step 2: Pilih "📋 Detailed GIS Debug"

1. Click radio button "📋 Detailed GIS Debug"
2. Click "Run Test"
3. Buka Browser Console (F12)

### Step 3: Lihat Hasil

```
🔍 DETAILED GIS DEBUGGING SESSION

📍 Testing: Santri Points
Response Info:
  Status: 404 Not Found      ← MASALAH DI SINI

❌ ERROR
Error Response: {"detail":"Not Found"}
```

**Artinya:** Endpoint `/gis/santri-points` tidak ada/tidak implemented di backend.

---

## 🔧 Tools Yang Tersedia

### Di Debug Console (http://localhost:5173/backend-debug)

| Pilihan                 | Fungsi                                | Kapan Gunakan                 |
| ----------------------- | ------------------------------------- | ----------------------------- |
| 🏥 Backend Health Check | Cek apakah backend running            | Pertama kali untuk verifikasi |
| 📋 Detailed GIS Debug   | Lihat detail response setiap endpoint | Debugging 404 error           |
| 🔐 Check CORS Config    | Cek CORS configuration                | Jika ada CORS error           |
| 🗺️ Test GIS Endpoints   | Test cepat semua endpoint             | Quick check                   |

### Di Browser Console (F12)

```javascript
// Full debug dengan informasi detail
import { detailedGISDebug } from '@/utils/advancedDebug'
detailedGISDebug()

// Cek backend running
import { checkBackendHealth } from '@/utils/advancedDebug'
checkBackendHealth()

// Cek CORS
import { checkCORS } from '@/utils/advancedDebug'
checkCORS()

// Network trace satu endpoint
import { networkTrace } from '@/utils/advancedDebug'
networkTrace('/gis/santri-points')
```

---

## 📋 Hasil Yang Diharapkan

### ✅ SUCCESS (Endpoint OK)

```
Status: 200 OK
Duration: 123.45ms

✅ SUCCESS
Features Count: 42
Sample Feature: {
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [...] },
  "properties": { "id": "...", "nama": "..." }
}
```

**Aksi:** Maps seharusnya menampilkan data. Cek peta santri/pesantren.

### ❌ FAILURE (Endpoint Not Found)

```
Status: 404 Not Found
Duration: 45.67ms

❌ ERROR
Raw Response: {"detail":"Not Found"}
```

**Aksi:** Endpoint belum diimplementasi di backend. Hubungi backend team.

---

## 🎯 Troubleshooting

### 1. Backend Tidak Respond

**Gejala:**

```
❌ Backend is NOT responding
Error: Failed to fetch
```

**Solusi:**

1. Pastikan backend running: `python -m uvicorn app:app --reload`
2. Check URL: http://localhost:8000 (sesuaikan jika beda port)
3. Update `.env` jika URL berbeda: `VITE_API_URL=http://localhost:8000`

### 2. Semua Endpoint Return 404

**Gejala:**

```
📍 Testing: Santri Points → Status: 404
📍 Testing: Pesantren Points → Status: 404
📍 Testing: Santri Heatmap → Status: 404
📍 Testing: Pesantren Heatmap → Status: 404
```

**Solusi:**
Informasikan backend team bahwa 4 endpoint GIS belum diimplementasi:

- `GET /gis/santri-points`
- `GET /gis/pesantren-points`
- `GET /gis/heatmap`
- `GET /gis/pesantren-heatmap`

Lihat [GIS_INTEGRATION.md](GIS_INTEGRATION.md) untuk detail API spec.

### 3. CORS Error

**Gejala:**

```
Access to XMLHttpRequest at 'http://localhost:8000/gis/santri-points'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solusi:**

1. Run "🔐 Check CORS Config" test
2. Lihat apakah header CORS di-set dengan benar
3. Informasikan backend team untuk configure CORS dengan origin `http://localhost:5173`

---

## 📊 API Spec untuk Backend

Saat implement endpoint, gunakan format ini:

### GET /gis/santri-points

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [107.6417, -6.9175]
      },
      "properties": {
        "id": "uuid",
        "nama": "Ahmad Sopyan",
        "ekonomi": "miskin",
        "score": 75.5,
        "provinsi": "Jawa Barat",
        "kabupaten": "Bandung",
        "kecamatan": "Bandung Kota"
      }
    }
  ]
}
```

### GET /gis/pesantren-points

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [107.6417, -6.9175]
      },
      "properties": {
        "id": "uuid",
        "nama": "Pesantren Al-Azhar",
        "akreditasi": "A",
        "score": 85.5,
        "jumlah_santri": 150,
        "jumlah_fasilitas": 8,
        "provinsi": "Jawa Barat",
        "kabupaten": "Bandung",
        "kecamatan": "Bandung Kota"
      }
    }
  ]
}
```

### GET /gis/heatmap

```json
[
  { "lat": -6.9175, "lng": 107.6417, "weight": 0.8 },
  { "lat": -6.92, "lng": 107.645, "weight": 0.6 }
]
```

### GET /gis/pesantren-heatmap

Sama format dengan `/gis/heatmap`.

---

## 🆘 Perlu Bantuan?

### Untuk Debugging Lebih Detail

Baca: [DEBUGGING_GIS_404.md](DEBUGGING_GIS_404.md)

### Untuk Dokumentasi Lengkap

Baca: [GIS_INTEGRATION.md](GIS_INTEGRATION.md)

### Untuk Testing dengan Dummy Data (Sementara)

Ubah di `src/pages/SantriMap.vue` line 12:

```javascript
const USE_DUMMY_DATA = true // Dari false → true
```

Dan di `src/pages/PesantrenMap.vue` line 11:

```javascript
const USE_DUMMY_DATA = true // Dari false → true
```

Setelah ini maps akan menampilkan data dummy untuk testing.

---

**Last Updated:** January 1, 2026  
**Status:** 🔴 Debugging GIS 404 Errors  
**Next:** Tunggu backend team implement endpoints
