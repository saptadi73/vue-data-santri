# AI Vision Analytics - Implementation Guide

## Deskripsi

Modul **AI Vision Analytics** merupakan fitur terbaru di aplikasi Bantuan Santri yang mengintegrasikan Google Gemini AI untuk analisis gambar dan video. Dengan fitur ini, pengguna dapat:

- ✅ Menganalisis gambar tunggal dengan prompt kustom
- ✅ Menganalisis multiple gambar sekaligus (hingga 10 gambar)
- ✅ Menganalisis video (MP4, MOV, AVI, WEBM)
- ✅ Ekstrak teks dari gambar (OCR)
- ✅ Analisis khusus fasilitas pesantren
- ✅ Analisis khusus kondisi rumah santri

## Struktur Implementasi

### 1. Service Layer (`src/services/geminiService.js`)

Service yang menangani semua komunikasi dengan backend Gemini API:

```javascript
;-analyzeImage(file, prompt) - // Analisis gambar tunggal
  analyzeVideo(file, prompt) - // Analisis video
  analyzeMultipleImages(files, prompt) - // Analisis multiple gambar
  extractTextFromImage(file) - // OCR dari gambar
  analyzePesantrenFacility(file) - // Analisis fasilitas pesantren
  analyzeSantriHousing(file) - // Analisis rumah santri
  healthCheck() // Cek status Gemini AI
```

### 2. Component (`src/components/AIVisionAnalytics.vue`)

Komponen utama yang menyediakan UI untuk semua fitur AI Vision:

**Features:**

- Mode selector (6 mode analisis berbeda)
- Upload area dengan drag-drop support
- Preview gambar/video
- Custom prompt input
- Result display dengan formatting yang baik
- JSON result viewer
- Copy to clipboard functionality

### 3. Page (`src/pages/AIVisionPage.vue`)

Halaman yang membungkus komponen AIVisionAnalytics

### 4. Router Integration (`src/router/index.js`)

Route baru telah ditambahkan:

```
/ai-vision → AIVisionPage.vue
```

### 5. Navbar Integration (`src/components/Navbar.vue`)

Menu baru ditambahkan di Dashboard dropdown:

```
🤖 AI Vision Analytics
```

## Cara Menggunakan

### Di Browser

1. Navigasi ke Dashboard → AI Vision Analytics (atau langsung ke `/ai-vision`)
2. Pilih mode analisis yang diinginkan:
   - **Analisis Gambar**: Upload 1 gambar + opsional custom prompt
   - **Multiple Gambar**: Upload hingga 10 gambar + opsional custom prompt
   - **Analisis Video**: Upload video + opsional custom prompt
   - **Ekstrak Teks (OCR)**: Upload gambar untuk ekstrak teks
   - **Fasilitas Pesantren**: Upload gambar fasilitas (auto-prompt)
   - **Kondisi Rumah Santri**: Upload gambar rumah (auto-prompt)
3. Klik tombol "Analisis"
4. Tunggu hasil dan review output

### Modes Penjelasan

#### 1. Analisis Gambar (Single Image)

- Upload 1 gambar (JPG, PNG, GIF, WEBP, BMP)
- Opsional: masukkan custom prompt
- Contoh prompt: "Jelaskan kondisi bangunan ini secara detail"
- Hasil: Analisis tekstual dari Gemini AI

#### 2. Multiple Gambar

- Upload hingga 10 gambar sekaligus
- Opsional: masukkan custom prompt
- Contoh prompt: "Bandingkan kondisi ketiga fasilitas ini"
- Hasil: Analisis komparativ dari Gemini AI

#### 3. Analisis Video

- Upload video (MP4, MOV, AVI, WEBM) max 20MB
- Opsional: masukkan custom prompt
- Contoh prompt: "Apa yang terjadi dalam video ini?"
- Hasil: Analisis kejadian dalam video

#### 4. Ekstrak Teks (OCR)

- Upload gambar yang mengandung teks
- Automated: ekstrak teks menggunakan OCR
- Contoh: Sertifikat, dokumen, poster
- Hasil: Teks terdeteksi dari gambar

#### 5. Fasilitas Pesantren (Specialized)

- Upload gambar fasilitas pesantren
- Automated: analisis dengan template standar penilaian
- Fokus: Kondisi bangunan, kelayakan fasilitas
- Hasil: Penilaian detail dengan assessment

#### 6. Kondisi Rumah Santri (Specialized)

- Upload gambar rumah santri
- Automated: analisis dengan fokus indikator sosio-ekonomi
- Fokus: Kondisi hidup, potensi kemiskinan
- Hasil: Penilaian kondisi dengan assessment

## Backend Requirements

Pastikan backend sudah memiliki endpoint:

```
POST /gemini/analyze/image
POST /gemini/analyze/video
POST /gemini/analyze/multiple-images
POST /gemini/ocr
POST /gemini/analyze/pesantren-facility
POST /gemini/analyze/santri-housing
GET  /gemini/health
```

Referensi: [GEMINI_INTEGRATION_GUIDE.md](./GEMINI_INTEGRATION_GUIDE.md)

## Environment Configuration

Pastikan `.env` sudah dikonfigurasi:

```env
VITE_API_URL=http://localhost:8000
GEMINI_API_KEY=your-gemini-api-key
```

## File Structure

```
src/
├── components/
│   ├── AIVisionAnalytics.vue      (Main component)
│   └── Navbar.vue                 (Updated)
├── pages/
│   └── AIVisionPage.vue           (Page wrapper)
├── services/
│   └── geminiService.js           (API service)
└── router/
    └── index.js                   (Updated with /ai-vision route)
```

## CSS Features

Component menggunakan Tailwind CSS compatible styling dengan fitur:

- Light/Dark mode support
- Responsive design (mobile-first)
- Smooth transitions dan animations
- Gradient backgrounds
- Custom color scheme sesuai brand

## Error Handling

Component menangani beberapa error cases:

- File tidak dipilih
- Format file tidak valid
- Upload failed
- API timeout
- Network error
- Custom error messages dari backend

## Future Enhancements

Potential improvements:

1. Batch processing untuk multiple files
2. History/cache hasil analisis
3. Export hasil ke PDF/CSV
4. Real-time progress bar untuk upload besar
5. Advanced filtering & sorting hasil
6. Integration dengan Santri database untuk auto-fill
7. Template library untuk common prompts
8. Comparison view untuk multiple analyses

## Troubleshooting

### "VITE_API_URL not configured"

```
→ Pastikan .env memiliki VITE_API_URL
→ Restart dev server setelah update .env
```

### "File too large" atau "Network error"

```
→ Untuk video: max 20MB (kompres jika perlu)
→ Untuk gambar: auto-resize, biasanya tidak ada masalah
→ Check internet connection
```

### "Invalid file type"

```
→ Gambar: JPG, PNG, GIF, WEBP, BMP
→ Video: MP4, MOV, AVI, WEBM
→ Jangan mix format
```

### Result tidak ditampilkan

```
→ Check browser console (F12)
→ Pastikan backend /gemini/health berstatus OK
→ Review response format dari API
```

## Support & Documentation

- Google Gemini API Docs: https://ai.google.dev/
- Vue 3 Docs: https://vuejs.org/
- Component mengikuti design pattern dari NL2SQLWidget.vue

---

**Last Updated**: January 16, 2026
**Version**: 1.0.0
**Status**: Production Ready
