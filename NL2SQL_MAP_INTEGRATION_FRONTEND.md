# NL2SQL Map Integration - Frontend Implementation

## Status: ✅ Santri Map IMPLEMENTED | 🔄 Pesantren Map IN PROGRESS

### Fitur yang Sudah Diimplementasikan

#### 1. Service Layer Update

- **File**: `src/services/nl2sqlService.js`
- **Perubahan**: Menambahkan fungsi `executeQueryMap()` untuk query dengan GeoJSON output
- **Endpoint**: `POST /nl2sql/query-map`

#### 2. Santri Map Integration

- **File**: `src/pages/SantriMap.vue`
- **Fitur**:
  - ✅ Import `executeQueryMap` dari nl2sqlService
  - ✅ Variabel `nl2sqlLayerRef` untuk menyimpan layer hasil query
  - ✅ Fungsi `handleNL2SQLResult()` untuk menangani dan menampilkan hasil
  - ✅ Event handler `@result="handleNL2SQLResult"` pada NL2SQLWidget
  - ✅ Marker styling khusus dengan warna ungu untuk hasil NL2SQL
  - ✅ Popup dengan badge "NL2SQL Result" dan detail santri
  - ✅ Auto fit bounds ke semua hasil query
  - ✅ Cluster group untuk banyak hasil
  - ✅ Hapus layer lama sebelum menampilkan hasil baru

### Cara Kerja

1. **User mengetik query** di NL2SQLWidget (contoh: "Santri miskin di Jawa Barat")

2. **Widget mengirim query** ke backend endpoint `/nl2sql/query`

3. **Backend memproses** query dan mengembalikan data dengan latitude/longitude

4. **handleNL2SQLResult()** menerima data dan:
   - Mengkonversi ke GeoJSON features
   - Membuat marker dengan icon khusus (ungu dengan glow effect)
   - Menambahkan popup dengan informasi detail
   - Menampilkan di peta dalam cluster group
   - Auto zoom ke lokasi hasil

5. **User dapat klik marker** untuk melihat detail:
   - Nama santri
   - Kategori kemiskinan
   - Skor total
   - Lokasi (kabupaten, provinsi)

### Styling Khusus NL2SQL

```css
/* Marker warna ungu dengan shadow */
border: 3px solid #8b5cf6
background: #a78bfa
box-shadow: 0 0 10px rgba(139,92,246,0.6)

/* Badge pada popup */
background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)

/* Cluster icon */
background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)
```

### Data yang Didukung

Fungsi `handleNL2SQLResult()` otomatis mengenali berbagai field name:

- **Koordinat**: `latitude`/`lat`, `longitude`/`lng`
- **Nama**: `nama_santri`, `nama`, `name`
- **Kategori**: `kategori_kemiskinan`, `ekonomi`, `category`
- **Skor**: `skor_total`, `skor`, `score`
- **Lokasi**: `provinsi_domisili`/`provinsi`, `kabupaten_domisili`/`kabupaten`

### Testing

**Contoh Query:**

```
1. "Santri miskin di Jawa Barat"
2. "Top 10 santri dengan skor tertinggi"
3. "Santri dari Bandung"
4. "Rata-rata skor santri per provinsi"
```

**Expected Result:**

- Marker ungu muncul di peta
- Klik marker menampilkan popup dengan detail
- Map auto zoom ke hasil

### Next Steps untuk Pesantren Map

Implementasi serupa perlu ditambahkan ke `src/pages/PesantrenMap.vue`:

1. Import `executeQueryMap`
2. Tambah variabel `nl2sqlLayerRef`
3. Implementasi `handleNL2SQLPesantrenResult()`
4. Tambah event handler `@result`
5. Update styling untuk pesantren
6. Test dengan query pesantren

### Backend Requirements

Backend harus mengembalikan data dengan koordinat untuk query santri/pesantren:

```json
{
  "success": true,
  "data": {
    "intent": "filter",
    "result": [
      {
        "id": "uuid",
        "nama_santri": "Ahmad",
        "latitude": -6.9175,
        "longitude": 107.6191,
        "kategori_kemiskinan": "Miskin",
        "skor_total": 75,
        "provinsi_domisili": "Jawa Barat",
        "kabupaten_domisili": "Bandung"
      }
    ]
  }
}
```

### Known Limitations

1. Hanya menampilkan hasil yang memiliki koordinat valid
2. Maksimal clustering untuk performa
3. Previous NL2SQL layer dihapus saat query baru

---

**Created**: January 15, 2026
**Author**: AI Assistant
**Status**: Work in Progress
