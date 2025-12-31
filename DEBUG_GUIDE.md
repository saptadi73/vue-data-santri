# Debug Guide - Scoring Error 400

Ketika mendapatkan error 400 saat menghitung scoring santri, ikuti langkah-langkah berikut untuk debug:

## 1. Buka Browser Console

- **Chrome/Edge:** `F12` → Tab "Console"
- **Firefox:** `F12` → Tab "Console"

## 2. Cari Log dengan Format Berikut

Saat mengklik "Hitung Skor Santri", Anda akan melihat log dengan warna:

- 🔵 **BIRU** - Debug info (request details)
- 🟡 **KUNING** - Warnings
- 🟢 **HIJAU** - Success
- 🔴 **MERAH** - Errors

### Contoh Output Log yang Baik:

```
🔵 [DEBUG] Calculating score for santri: 550e8400-e29b-41d4-a716-446655440000
🔵 [DEBUG] URL: http://localhost:8000/api/scoring/550e8400-e29b-41d4-a716-446655440000/calculate
🔵 [DEBUG] Response status: 201
🔵 [DEBUG] Response headers: {content-type: 'application/json', ...}
🔵 [DEBUG] Response body: {success: true, message: "...", data: {...}}
🟢 [DEBUG] Score calculation successful
```

## 3. Error 400 - Apa yang Harus Dilihat?

Jika Anda melihat error 400, lihat section **🔴 BACKEND ERROR DEBUG INFO**

Ini akan menampilkan:

```
🔴 BACKEND ERROR DEBUG INFO
Status Code: 400
Full Response Object: {
  detail: "...",
  message: "...",
  validation_errors: [...]
}

--- Response Fields ---
detail: "Santri data incomplete"
...
```

## 4. Copy-Paste Response Error ke Sini

Jika error 400 muncul, copy-paste output dari console yang menunjukkan:

```
🔴 [DEBUG] Error response received:
🔴 [DEBUG] Status: 400
🔴 [DEBUG] Data: {
  detail: "...",
  validation_errors: [...],
  ...
}
```

## 5. Common Error 400 Issues

### ❌ "Santri data incomplete"

**Solusi:** Periksa apakah santri memiliki data lengkap:

- ✅ Data pribadi (nama, jenis kelamin)
- ✅ Data orangtua (minimal 1 orangtua)
- ✅ Data rumah (status rumah, jenis lantai, dll)
- ✅ Data aset (minimal ada entry)
- ✅ Data kesehatan
- ✅ Data bansos

### ❌ "Invalid field: ..."

**Solusi:** Field memiliki nilai yang tidak sesuai dengan expected format

- Check tipe data (string, number, boolean)
- Check enum values yang diizinkan

### ❌ "Santri not found"

**Solusi:** ID santri tidak ditemukan di database

## 6. Copy Exact Error Details

Jika ada error, berikan informasi berikut:

```
ERROR STATUS: 400
SANTRI ID: [copy dari URL]
ERROR DETAIL: [copy dari "detail" field]
ERROR MESSAGE: [copy dari "message" field]
VALIDATION ERRORS: [copy dari "validation_errors" jika ada]
```

## 7. Contoh Lengkap

Misalkan error muncul, dan console menunjukkan:

```
🔴 [DEBUG] Error response received:
🔴 [DEBUG] Status: 400
🔴 [DEBUG] Data: {
  detail: "Santri has incomplete data",
  validation_errors: [
    {
      field: "skor_aset",
      error: "Missing required asset data"
    }
  ]
}
```

Berarti santri **tidak memiliki data aset** yang lengkap.

**Solusi:**

1. Buka halaman edit santri
2. Tambahkan data aset (minimal 1 aset)
3. Coba hitung score lagi

---

## Debug Checklist

Sebelum menghubungi developer, pastikan:

- [ ] Backend server running (http://localhost:8000)
- [ ] Frontend aplikasi running (http://localhost:5173 atau sesuai)
- [ ] Santri memiliki data pribadi lengkap
- [ ] Santri memiliki minimal 1 orangtua
- [ ] Santri memiliki data rumah
- [ ] Santri memiliki data aset
- [ ] Santri memiliki data kesehatan
- [ ] Santri memiliki data bansos
- [ ] Pembrowseran console sudah dibuka saat klik "Hitung Skor"

---

## Log Messages Reference

| Log                             | Arti                     | Action             |
| ------------------------------- | ------------------------ | ------------------ |
| 🔵 Calculating score            | Request sedang dikirim   | Tunggu response    |
| 🔵 Response status: 201         | Server berhasil hitung   | Ini normal ✅      |
| 🔵 Response status: 200         | Server berhasil retrieve | Ini normal ✅      |
| 🔵 Response status: 400         | Request invalid          | ⚠️ Cek data santri |
| 🔵 Response status: 404         | Resource tidak ada       | ⚠️ Cek ID santri   |
| 🔵 Response status: 500         | Server error             | 🔴 Backend error   |
| 🟢 Score calculation successful | Sukses!                  | Data tersimpan ✅  |
| 🔴 Error calculating score      | Gagal                    | Lihat detail error |

---

**Last Updated:** December 31, 2025
**For Issues:** Lihat console browser (F12) untuk detailed debug info
