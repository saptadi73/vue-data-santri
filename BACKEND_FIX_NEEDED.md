# Backend API Fix Required

## Issue

Frontend Peta Santri tidak menampilkan data ekonomi dan score karena API `/gis/santri-points` tidak mengirimkan field tersebut.

## Current API Response

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [107.1234, -6.5678]
  },
  "properties": {
    "id": "ae739ebe-2f19-43e1-9244-580bfb8a9acf",
    "nama": "Aji Pangestu",
    "provinsi": "Jawa Barat",
    "kabupaten": "Bekasi",
    "kecamatan": "Tarumajaya"
  }
}
```

## Required API Response

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [107.1234, -6.5678]
  },
  "properties": {
    "id": "ae739ebe-2f19-43e1-9244-580bfb8a9acf",
    "nama": "Aji Pangestu",
    "provinsi": "Jawa Barat",
    "kabupaten": "Bekasi",
    "kecamatan": "Tarumajaya",
    "ekonomi": "Miskin", // ← TAMBAHKAN INI
    "score": 85, // ← TAMBAHKAN INI
    "kategori": "Yatim Piatu" // ← TAMBAHKAN INI (optional)
  }
}
```

## Backend Changes Needed

### Endpoint: GET `/gis/santri-points`

**File:** `backend/app/routers/gis.py` (atau lokasi endpoint GIS)

**Tambahkan field ke properties:**

```python
# Dalam fungsi get_santri_points
for santri in santri_list:
    feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [santri.longitude, santri.latitude]
        },
        "properties": {
            "id": str(santri.id),
            "nama": santri.nama_lengkap,
            "provinsi": santri.provinsi,
            "kabupaten": santri.kabupaten,
            "kecamatan": santri.kecamatan,
            # TAMBAHKAN INI:
            "ekonomi": santri.orangtua.status_ekonomi if santri.orangtua else "N/A",
            "score": santri.scoring.total_score if santri.scoring else 0,
            "kategori": santri.kategori if hasattr(santri, 'kategori') else None
        }
    }
```

## Impact

Tanpa fix ini:

- ❌ Marker color tidak sesuai kategori ekonomi (semua abu-abu)
- ❌ Popup menampilkan "Ekonomi: N/A" dan "Skor: 0"
- ❌ Heatmap tidak akurat karena tidak ada data score
- ❌ Filter ekonomi tidak berfungsi

Setelah fix:

- ✅ Marker berwarna sesuai kategori (Merah=Miskin, Kuning=Rentan, Abu=Cukup)
- ✅ Popup menampilkan data ekonomi dan score yang benar
- ✅ Heatmap akurat berdasarkan score
- ✅ Filter ekonomi berfungsi dengan baik

## Testing

Setelah backend diupdate, test dengan:

```bash
curl https://api-santri.gagakrimang.web.id/gis/santri-points | jq '.features[0].properties'
```

Expected output harus include field `ekonomi` dan `score`.
