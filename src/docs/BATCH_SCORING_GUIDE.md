# Batch Scoring Implementation Guide

## 📋 Overview

Telah diimplementasikan fitur **Batch/Bulk Scoring** untuk menghitung skor kemiskinan semua santri dan pondok pesantren secara bersamaan. Fitur ini dirancang untuk menangani operasi jangka panjang (15-30 detik) dengan UX yang aman dan nyaman bagi pengguna.

---

## 🎯 Fitur yang Ditambahkan

### 1. **Batch Scoring Button**
- **Lokasi**: Action bar di halaman SantriList dan PondokList
- **Warna**: Amber (membedakan dari tombol standar)
- **Icon**: Chart bar icon (📊)
- **Kondisi**: Disabled jika tidak ada data atau sedang proses

### 2. **Progress Modal**
Modal yang menampilkan:
- ⏳ **Saat Proses**:
  - Spinner loading animation
  - Status message yang informatif
  - Progress bar dengan persentase
  - Estimasi waktu: 15-30 detik
  - Peringatan untuk tidak menutup halaman

- ✅ **Saat Berhasil**:
  - Success icon dan message
  - Statistik hasil:
    - Total diproses
    - Total berhasil
    - Total error
    - Distribusi kategori kemiskinan (Sangat Miskin, Miskin, Rentan, Mampu)
  - Tombol Close

- ❌ **Saat Error**:
  - Error icon dan message
  - Detail error untuk debugging
  - Tombol Coba Lagi dan Batal

### 3. **Auto-refresh Data**
- Data otomatis refresh 2 detik setelah batch scoring selesai
- User tetap melihat hasil terbaru tanpa perlu refresh manual

---

## 📁 Files Created/Modified

### ✅ File Baru:

#### 1. `src/services/bulkScoringService.js`
Service untuk batch scoring dengan functions:
- `batchCalculateSantriScores()` - POST `/api/scoring/batch/calculate-all`
- `batchCalculatePesantrenScores()` - POST `/api/pesantren-scoring/batch/calculate-all`
- `getKategoriFromScore(skor)` - Helper untuk mapping skor ke kategori
- `formatBatchResult(result)` - Format hasil untuk display

**Response Format**:
```javascript
{
  success: boolean,
  message: string,
  data: {
    total_processed: number,
    total_errors: number,
    results: Array<{
      santri_id/pesantren_id: string,
      nama: string,
      skor_total: number,
      kategori: string
    }>,
    errors: Array | null
  }
}
```

#### 2. `src/components/ProgressModal.vue`
Reusable modal component dengan props:
- `isVisible` - Kontrol visibility
- `title` - Judul modal
- `isProcessing` - Flag untuk state processing
- `statusMessage` - Pesan status
- `progressPercent` - Persentase progress (0-100)
- `isSuccess` - Flag untuk state sukses
- `isError` - Flag untuk state error
- `errorMessage` - Pesan error
- `errorDetails` - Detail error
- `result` - Hasil batch scoring

**Emits**:
- `@close` - Saat tombol close diklik
- `@retry` - Saat tombol coba lagi diklik

### 📝 File Modified:

#### 1. `src/pages/SantriList.vue`
**Perubahan**:
- Import ProgressModal component
- Import bulkScoringService functions
- Tambah Batch Score button di action bar
- Tambah state variables untuk batch scoring
- Tambah methods:
  - `handleBatchScore()` - Trigger batch scoring
  - `closeBatchScoringModal()` - Close modal dan reset state
- Progress simulation (incremental update dari 0-90%)

#### 2. `src/pages/PondokList.vue`
**Perubahan**:
- Import ProgressModal component
- Import bulkScoringService functions
- Tambah Batch Score button di action bar
- Tambah state variables untuk batch scoring
- Tambah methods:
  - `handleBatchScore()` - Trigger batch scoring
  - `closeBatchScoringModal()` - Close modal dan reset state
- Progress simulation (incremental update dari 0-90%)

---

## 🚀 Cara Menggunakan

### 1. **Klik Tombol "Batch Score"**
![Flow](docs-flow)
```
SantriList/PondokList Page
        ↓
    Click "Batch Score" Button
        ↓
    ProgressModal Open (Processing State)
        ↓
    API Call ke Backend
        ↓
    Progress Simulation (0% → 100%)
        ↓
    Show Result (Success/Error State)
        ↓
    Click "Tutup" → Data Auto-Refresh
```

### 2. **Progress Simulation**
Karena API batch scoring tidak menyediakan real-time progress, implementasi menggunakan:
- Incremental progress dari 0% hingga 90% dengan interval random
- Saat API response selesai, progress langsung ke 100%
- User experience tetap terasa smooth dan responsif

### 3. **Error Handling**
- Jika terjadi error, modal menampilkan pesan error yang user-friendly
- Detail teknis error tersedia untuk debugging
- User dapat retry tanpa perlu refresh halaman

---

## 📊 API Endpoints

### Santri Batch Scoring
```
POST /api/scoring/batch/calculate-all
Content-Type: application/json

Response 200 OK:
{
  "success": true,
  "message": "Scoring selesai: 150 berhasil, 0 gagal",
  "data": {
    "total_processed": 150,
    "total_errors": 0,
    "results": [...],
    "errors": null
  }
}
```

### Pesantren Batch Scoring
```
POST /api/pesantren-scoring/batch/calculate-all
Content-Type: application/json

Response 200 OK:
{
  "success": true,
  "message": "Scoring selesai: 50 berhasil, 0 gagal",
  "data": {
    "total_processed": 50,
    "total_errors": 0,
    "results": [...],
    "errors": null
  }
}
```

---

## ⚙️ State Management

### SantriList/PondokList State Variables:
```javascript
// Batch Scoring State
const showBatchScoringModal = ref(false)           // Visibility modal
const batchScoringInProgress = ref(false)          // Flag processing
const batchScoringSuccess = ref(false)             // Flag sukses
const batchScoringError = ref(false)               // Flag error
const batchScoringStatus = ref('...')              // Status message
const batchScoringProgress = ref(0)                // Progress 0-100
const batchScoringErrorMsg = ref('')               // Error message
const batchScoringErrorDetails = ref('')           // Error details
const batchScoringResult = ref(null)               // Result object
```

---

## 🔄 Kategori Kemiskinan

Berdasarkan Skor Total (0-100):

| Kategori | Skor |
|----------|------|
| Sangat Miskin | ≥ 80 |
| Miskin | 60-79 |
| Rentan | 40-59 |
| Mampu | < 40 |

---

## ⏱️ Estimasi Waktu

- **Batch Santri**: 15-30 detik (tergantung jumlah data, biasanya 400+ santri)
- **Batch Pesantren**: 10-20 detik (tergantung jumlah data)

Modal menampilkan estimasi konservatif: **15-30 detik**

---

## 🛡️ Safety Features

1. ✅ **Modal Backdrop** - Prevent user interaction dengan page di belakang
2. ✅ **Disable Button** - Button disabled saat processing atau tidak ada data
3. ✅ **Warning Message** - Peringatan jangan tutup halaman saat proses
4. ✅ **Progress Visualization** - User bisa lihat progress real-time
5. ✅ **Auto-refresh** - Data refresh otomatis setelah selesai
6. ✅ **Error Recovery** - Retry button untuk handle failure cases

---

## 🎨 UI/UX Features

1. **Dark Mode Support** - Component fully support light/dark theme
2. **Responsive Design** - Modal responsive di semua ukuran screen
3. **Smooth Animations** - Progress bar dengan smooth transition
4. **Clear Messaging** - User-friendly messages dalam bahasa Indonesia
5. **Category Statistics** - Breakdown hasil per kategori kemiskinan
6. **Emoji Icons** - Visual indicators untuk status (⏱️, ✅, ❌)

---

## 📝 Notes

- Modal tidak bisa ditutup saat processing (safety feature)
- Progress bar bersifat simulated (tidak real-time dari backend)
- Data otomatis refresh setelah 2 detik completion
- Error details disimpan di console untuk debugging
- Support untuk retry unlimited jika error terjadi

---

## 🔧 Troubleshooting

### Problem: Button tidak aktif
- ✅ Pastikan ada data di list (santri atau pondok)
- ✅ Pastikan tidak sedang processing batch yang lain

### Problem: Modal tidak muncul
- ✅ Check browser console untuk error
- ✅ Pastikan ProgressModal component import dengan benar

### Problem: API error 
- ✅ Check backend server running di port 8000
- ✅ Check API endpoints: `/api/scoring/batch/calculate-all` dan `/api/pesantren-scoring/batch/calculate-all`
- ✅ Lihat error details di modal untuk info lebih lanjut

---

## 📚 Related Documentation

- See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) untuk API detail
- See [BACKEND_DEBUG_GUIDE.md](./BACKEND_DEBUG_GUIDE.md) untuk backend issues
- See [DASHBOARD_DOCUMENTATION.md](./DASHBOARD_DOCUMENTATION.md) untuk dashboard features
