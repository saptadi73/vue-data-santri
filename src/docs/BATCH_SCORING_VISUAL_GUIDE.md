# 🎯 Visual Guide - Batch Scoring Feature

## 📍 Location Map

```
Project Root: vue-bantuan-santri/
│
├── src/
│   ├── services/
│   │   ├── bulkScoringService.js           ✨ NEW - Batch API service
│   │   ├── santriService.js                (existing)
│   │   ├── pondokPesantrenService.js       (existing)
│   │   └── ... (other services)
│   │
│   ├── components/
│   │   ├── ProgressModal.vue               ✨ NEW - Progress modal component
│   │   ├── Navbar.vue                      (existing)
│   │   └── ... (other components)
│   │
│   ├── pages/
│   │   ├── SantriList.vue                  📝 MODIFIED - Added batch score button
│   │   ├── PondokList.vue                  📝 MODIFIED - Added batch score button
│   │   └── ... (other pages)
│   │
│   └── docs/
│       ├── BATCH_SCORING_GUIDE.md          ✨ NEW - Complete guide
│       ├── BATCH_SCORING_IMPLEMENTATION.md ✨ NEW - Code details
│       ├── API_DOCUMENTATION.md            (existing)
│       └── ... (other docs)
│
└── Root Docs/
    ├── BATCH_SCORING_SUMMARY.md            ✨ NEW - Quick summary
    └── ... (other docs)
```

---

## 🎨 UI Layout - SantriList Page

### Before:
```
┌─ Data Santri ────────────────────────────────────────────┐
├─ [Search...] [Filter] [Items] [Tambah Santri] ──────────┤
│                                                           │
│ ┌─ Data Table ─────────────────────────────────────────┐ │
│ │ Foto │ Nama │ NIK │ Gender │ Provinsi │ ... │ Aksi    │ │
│ ├──────┼──────┼─────┼────────┼──────────┼─────┼─────────┤ │
│ │ ... data rows ...                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ Pagination: [< 1 2 3 >]                                 │
└───────────────────────────────────────────────────────────┘
```

### After:
```
┌─ Data Santri ────────────────────────────────────────────┐
├─ [Search...] [Filter] [Items] [🟡 Batch Score] [Tambah] ┤
│                        ↑                   ↑
│                    Warna Amber      New Button
│                                                           │
│ ┌─ Data Table ─────────────────────────────────────────┐ │
│ │ Foto │ Nama │ NIK │ Gender │ Provinsi │ ... │ Aksi    │ │
│ ├──────┼──────┼─────┼────────┼──────────┼─────┼─────────┤ │
│ │ ... data rows ...                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ Pagination: [< 1 2 3 >]                                 │
└───────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow Diagram

### Happy Path:
```
┌─────────────────┐
│ User on Page    │
│ SantriList      │
└────────┬────────┘
         │
         │ Click "Batch Score" Button
         ▼
┌─────────────────────────────┐
│ ProgressModal Opens         │
│ (Processing State)          │
│                             │
│ 🔄 [Spinner]               │
│ Sedang memproses...        │
│ Progress: ░░░░░░░░░░ 45%   │
│                             │
│ ⏱️ Estimasi: 15-30 detik   │
└────────┬────────────────────┘
         │
         │ Wait 15-30 seconds
         ▼
┌─────────────────────────────┐
│ ProgressModal Updates       │
│ (Success State)             │
│                             │
│ ✓ [Success Icon]            │
│ Batch scoring selesai!      │
│                             │
│ Total: 150                  │
│ Sukses: 150                 │
│ Error: 0                    │
│                             │
│ Kategori:                   │
│ - Sangat Miskin: 45         │
│ - Miskin: 60                │
│ - Rentan: 35                │
│ - Mampu: 10                 │
│                             │
│ [    TUTUP    ]             │
└────────┬────────────────────┘
         │
         │ Click "Tutup"
         ▼
┌─────────────────┐
│ Modal Closes    │
└────────┬────────┘
         │
         │ Auto-refresh (2s)
         ▼
┌─────────────────┐
│ Data Refreshed  │
│ & Displayed     │
└─────────────────┘
```

### Error Path:
```
┌─────────────────┐
│ Click Button    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ ProgressModal (Processing)  │
│ 🔄 Sedang memproses...      │
└────────┬────────────────────┘
         │
         │ ❌ API ERROR
         ▼
┌─────────────────────────────┐
│ ProgressModal (Error State) │
│                             │
│ ✗ [Error Icon]              │
│ Terjadi Kesalahan           │
│                             │
│ Network timeout             │
│ (error details)             │
│                             │
│ [ COBA LAGI ] [ BATAL ]    │
└─┬───────────────────────┬───┘
  │                       │
  │ Click "COBA LAGI"    │ Click "BATAL"
  ▼                       ▼
Retry Batch        Modal Closes
  │                  (No Data Refresh)
  └─→ (repeat flow)
```

---

## 🧩 Component Hierarchy

```
App
 └─ Router
     ├─ SantriList.vue
     │   ├─ Input Elements (search, filters)
     │   ├─ Data Table
     │   └─ ProgressModal (imported)
     │       ├─ Processing UI (spinner, progress bar)
     │       ├─ Success UI (stats, categories)
     │       └─ Error UI (message, retry button)
     │
     └─ PondokList.vue
         ├─ Input Elements (search, filters)
         ├─ Data Table
         └─ ProgressModal (imported)
             ├─ Processing UI
             ├─ Success UI
             └─ Error UI
```

---

## 📊 State Management

### SantriList State:
```javascript
// Original state
santriList                    ← Data array
loading                       ← API loading flag
error                         ← API error message
pagination                    ← Pagination state
showDeleteModal              ← Delete modal visibility

// NEW: Batch Scoring State
showBatchScoringModal        ← Modal visibility
batchScoringInProgress       ← Processing flag
batchScoringSuccess          ← Success flag
batchScoringError            ← Error flag
batchScoringStatus           ← Status message
batchScoringProgress         ← Progress 0-100
batchScoringErrorMsg         ← Error message
batchScoringErrorDetails     ← Error details
batchScoringResult           ← Result object with stats
```

### State Transitions:
```
INITIAL
  ▼
showBatchScoringModal = true
batchScoringInProgress = true
  ▼
PROCESSING
  ├─ Progress simulates 0 → 90%
  └─ API in progress
  ▼
API RESPONSE
  ├─ If Success:
  │   ├─ Progress = 100%
  │   ├─ batchScoringSuccess = true
  │   ├─ batchScoringResult = formatted
  │   └─ setState → SUCCESS
  │
  └─ If Error:
      ├─ batchScoringError = true
      ├─ batchScoringErrorMsg = error
      └─ setState → ERROR
  ▼
USER ACTION
  ├─ Click "Tutup" → closeBatchScoringModal() → RESET
  └─ Click "Coba Lagi" → handleBatchScore() → back to PROCESSING
```

---

## 🔗 API Integration

### Request Flow:
```
ProgressModal.vue (Frontend)
         │
         ├─ @click "Batch Score"
         │
         ▼
SantriList.vue
         │
         ├─ handleBatchScore()
         │
         ▼
bulkScoringService.js
         │
         ├─ batchCalculateSantriScores()
         │
         ▼
fetch() to Backend
         │
         ├─ POST /api/scoring/batch/calculate-all
         │
         ▼
Backend FastAPI
         │
         ├─ Process all santri scores
         ├─ Database updates
         │
         ▼
Response (JSON)
         │
         ├─ formatBatchResult()
         │
         ▼
Update State & Modal
         │
         ├─ Display Success/Error
         │
         ▼
Auto-refresh data
         │
         ├─ loadSantriData()
         │
         ▼
Updated Table
```

---

## 🎯 Feature Highlights

### Processing State:
```
┌──────────────────────────────┐
│  🔄 Proses Batch Scoring     │
├──────────────────────────────┤
│                              │
│      ⟳ SPINNER ANIMATION     │
│                              │
│  Sedang memproses data...    │
│                              │
│  Estimasi: 15-30 detik       │
│                              │
│  Progress Bar:               │
│  ████████░░░░░░░░░░░ 45%    │
│                              │
│  ┌──────────────────────┐   │
│  │ ⏱️ Proses sedang      │   │
│  │ berjalan. Jangan     │   │
│  │ tutup halaman ini.   │   │
│  └──────────────────────┘   │
│                              │
└──────────────────────────────┘
```

### Success State:
```
┌──────────────────────────────┐
│  ✓ Batch Scoring Selesai     │
├──────────────────────────────┤
│                              │
│    ✓ [Green Checkmark]       │
│                              │
│ Scoring selesai: 150 berhasil│
│ 0 gagal                      │
│                              │
│ ┌──────────────────────┐    │
│ │ Total Diproses: 150  │    │
│ │ Berhasil: 150        │    │
│ │ Error: 0             │    │
│ │                      │    │
│ │ Distribusi Kategori: │    │
│ │ ├─ Sangat Miskin: 45 │    │
│ │ ├─ Miskin: 60        │    │
│ │ ├─ Rentan: 35        │    │
│ │ └─ Mampu: 10         │    │
│ └──────────────────────┘    │
│                              │
│      [  TUTUP  ]             │
│                              │
└──────────────────────────────┘
```

### Error State:
```
┌──────────────────────────────┐
│  ✗ Terjadi Kesalahan         │
├──────────────────────────────┤
│                              │
│    ✗ [Red Error Icon]        │
│                              │
│ Network timeout              │
│                              │
│ ┌──────────────────────┐    │
│ │ Error Details:       │    │
│ │ Failed to fetch      │    │
│ │ /api/scoring/batch...│    │
│ └──────────────────────┘    │
│                              │
│  [ COBA LAGI ] [ BATAL ]   │
│                              │
└──────────────────────────────┘
```

---

## 🎨 Color Scheme

| Element | Color | Purpose |
|---------|-------|---------|
| Button | Amber-600 | Differentiate from standard buttons |
| Processing | Blue-500 | Primary action color |
| Success | Green-600 | Positive feedback |
| Error | Red-600 | Negative feedback |
| Progress Bar | Blue-600 | Primary progress indicator |
| Disabled | Gray-400 | Unavailable state |
| Dark Mode | All consistent | Full dark theme support |

---

## 📱 Responsive Breakpoints

```
Mobile (< 768px):
┌─────────────────────────┐
│ Batch Score Button ↓     │
│ (Wraps to new line)      │
├─────────────────────────┤
│ Modal appears fullscreen │
│ Touch-friendly buttons   │
└─────────────────────────┘

Tablet (768px - 1024px):
┌──────────────────────────┐
│ [Batch Score] [Add] ─    │
│ Side by side with space  │
├──────────────────────────┤
│ Modal appears centered   │
└──────────────────────────┘

Desktop (> 1024px):
┌────────────────────────────┐
│ [Batch Score] [Filters] [...] │
│ Full horizontal layout       │
├────────────────────────────┤
│ Modal centered & sized well  │
└────────────────────────────┘
```

---

## ✨ Animation States

### Progress Bar:
```
0% ─ 10% ─ 20% ─ 30% ─ 40% ─ 50% ─ 60% ─ 70% ─ 80% ─ 90% ─ 100%
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
[Width animates smoothly]
```

### Spinner:
```
◜ → ◝ → ◞ → ◟ → ◜ ...
(Rotating continuously)
```

### Modal Fade-in:
```
Opacity: 0% → 100% (smooth 300ms transition)
Scale: 0.95 → 1.0 (slight zoom effect)
```

---

## 🧪 QA Test Scenarios

### ✅ Happy Path Test:
1. Open SantriList page
2. Click "Batch Score" button
3. Verify modal appears with processing state
4. Verify progress bar increments smoothly
5. Wait 15-30 seconds
6. Verify modal shows success state with stats
7. Click "Tutup"
8. Verify data refreshes
9. Verify modal closes

### ✅ Error Handling Test:
1. Stop backend server
2. Click "Batch Score" button
3. Modal appears
4. Modal transitions to error state
5. Click "Coba Lagi"
6. Verify retry works (start backend first)

### ✅ Edge Cases:
- Empty data list: Button disabled
- While processing: Button disabled
- Multiple rapid clicks: Only one request sent
- Dark mode: All elements visible and styled correctly
- Mobile: Layout responsive and usable

---

## 📞 Support

For issues or questions:
1. Check BATCH_SCORING_GUIDE.md
2. Check BATCH_SCORING_IMPLEMENTATION.md
3. Check browser console for debug logs
4. Check Network tab for API calls
5. Verify backend server is running

