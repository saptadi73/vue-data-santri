# Code Implementation Details

## 1️⃣ bulkScoringService.js

Melayani API calls untuk batch scoring operations.

### Functions Available:

#### `batchCalculateSantriScores()`
- **Endpoint**: `POST /api/scoring/batch/calculate-all`
- **Purpose**: Calculate scores untuk semua santri
- **Returns**: Formatted response dengan results dan stats

#### `batchCalculatePesantrenScores()`
- **Endpoint**: `POST /api/pesantren-scoring/batch/calculate-all`
- **Purpose**: Calculate scores untuk semua pesantren
- **Returns**: Formatted response dengan results dan stats

#### `formatBatchResult(result)`
Helper untuk format API response untuk display:
- Extract kategori statistics
- Calculate totals
- Format untuk ProgressModal

---

## 2️⃣ ProgressModal.vue

Reusable component untuk menampilkan progress dari long-running operations.

### Props:

```javascript
{
  isVisible: Boolean,              // Show/hide modal
  title: String,                  // Modal title
  isProcessing: Boolean,          // Processing state
  statusMessage: String,          // Status text
  estimatedTime: String,          // Est. time display
  progressPercent: Number,        // Progress 0-100
  isSuccess: Boolean,             // Success state
  isError: Boolean,               // Error state
  errorMessage: String,           // Error text
  errorDetails: String,           // Error details
  result: Object                  // Result data
}
```

### States:

#### Processing State
```
┌─────────────────────────────┐
│  Proses Batch Scoring       │
├─────────────────────────────┤
│  [  ⟳ SPINNER  ]            │
│                             │
│  Sedang memproses data...   │
│  Estimasi: 15-30 detik     │
│                             │
│  Progress: ████████░░░ 67%  │
│                             │
│  ⏱️ Jangan tutup halaman    │
└─────────────────────────────┘
```

#### Success State
```
┌─────────────────────────────┐
│  Proses Batch Scoring       │
├─────────────────────────────┤
│  [  ✓ SUCCESS  ]            │
│                             │
│  Batch scoring telah selesai│
│                             │
│  ├─ Total: 150             │
│  ├─ Berhasil: 150          │
│  └─ Error: 0               │
│                             │
│  Kategori:                 │
│  ├─ Sangat Miskin: 45      │
│  ├─ Miskin: 60             │
│  ├─ Rentan: 35             │
│  └─ Mampu: 10              │
│                             │
│  [      TUTUP      ]        │
└─────────────────────────────┘
```

#### Error State
```
┌─────────────────────────────┐
│  Proses Batch Scoring       │
├─────────────────────────────┤
│  [  ✗ ERROR  ]              │
│                             │
│  Terjadi Kesalahan          │
│  Network timeout            │
│                             │
│  /errors/timeout            │
│                             │
│  [ COBA LAGI ] [ BATAL ]   │
└─────────────────────────────┘
```

### Events:

- `@close` - Modal ditutup
- `@retry` - User klik retry

---

## 3️⃣ SantriList.vue Changes

### New Button:
```vue
<button
  @click="handleBatchScore"
  :disabled="santriList.length === 0 || batchScoringInProgress"
  class="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 
         text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
>
  <svg class="h-5 w-5"><!-- chart icon --></svg>
  Batch Score
</button>
```

### New State Variables:
```javascript
const showBatchScoringModal = ref(false)
const batchScoringInProgress = ref(false)
const batchScoringSuccess = ref(false)
const batchScoringError = ref(false)
const batchScoringStatus = ref('Menghitung score santri...')
const batchScoringProgress = ref(0)
const batchScoringErrorMsg = ref('')
const batchScoringErrorDetails = ref('')
const batchScoringResult = ref(null)
```

### New Methods:
```javascript
const handleBatchScore = async () => {
  showBatchScoringModal.value = true
  batchScoringInProgress.value = true
  
  try {
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (batchScoringProgress.value < 90) {
        batchScoringProgress.value += Math.random() * 20
      }
    }, 500)
    
    // Call API
    const result = await batchCalculateSantriScores()
    
    clearInterval(progressInterval)
    batchScoringProgress.value = 100
    
    const formatted = formatBatchResult(result)
    batchScoringResult.value = formatted
    batchScoringSuccess.value = true
    
    // Auto refresh after 2s
    setTimeout(() => loadSantriData(), 2000)
  } catch (err) {
    batchScoringError.value = true
    batchScoringErrorMsg.value = err.message
  } finally {
    batchScoringInProgress.value = false
  }
}

const closeBatchScoringModal = () => {
  showBatchScoringModal.value = false
  // Reset state...
}
```

### New Modal Component:
```vue
<ProgressModal
  :is-visible="showBatchScoringModal"
  :title="'Batch Scoring Santri'"
  :is-processing="batchScoringInProgress"
  :status-message="batchScoringStatus"
  :progress-percent="batchScoringProgress"
  :is-success="batchScoringSuccess"
  :is-error="batchScoringError"
  :error-message="batchScoringErrorMsg"
  :error-details="batchScoringErrorDetails"
  :result="batchScoringResult"
  @close="closeBatchScoringModal"
  @retry="handleBatchScore"
/>
```

---

## 4️⃣ PondokList.vue Changes

Sama dengan SantriList.vue, tapi untuk pesantren:

### Key Differences:
```javascript
// Title
:title="'Batch Scoring Pondok Pesantren'"

// Status message
batchScoringStatus = ref('Menghitung score pondok pesantren...')

// API call
const result = await batchCalculatePesantrenScores()

// Auto refresh
setTimeout(() => loadPondokData(), 2000)
```

---

## 📊 State Flow Diagram

```
User Clicks "Batch Score"
         ↓
showBatchScoringModal = true
         ↓
   Modal Appears
   (Processing State)
         ↓
Progress Simulation
(0% → 90% incremental)
         ↓
   API Response
   (success/error)
         ↓
   Progress = 100%
         ↓
Display Result
(Success or Error State)
         ↓
User Clicks "Tutup"
         ↓
closeBatchScoringModal()
         ↓
Auto Refresh Data
(setTimeout 2000ms)
         ↓
Modal Hidden
Data Updated
```

---

## 🔄 Lifecycle Sequence

```javascript
// 1. Mount
onMounted(() => {
  loadProvinsiList()
  loadSantriData()
})

// 2. User Action
user.click('Batch Score Button')
  → handleBatchScore()
  → showBatchScoringModal = true

// 3. Processing
progressInterval = setInterval(...)
result = await batchCalculateSantriScores()

// 4. Result
clearInterval(progressInterval)
batchScoringProgress = 100
batchScoringResult = formatBatchResult(result)

// 5. Display
Modal shows Success/Error State

// 6. Cleanup
user.click('Tutup')
  → closeBatchScoringModal()
  → showBatchScoringModal = false
  → reset all state variables

// 7. Auto Refresh
setTimeout(() => loadSantriData(), 2000)
```

---

## 🎯 Error Scenarios Handled

| Scenario | Handling |
|----------|----------|
| Network Error | Catch → Show error message → Retry button |
| API 500 | Catch → Show "Server error" → Retry button |
| API 400 | Catch → Show validation error → Retry button |
| Timeout | Catch → Show "Operation timed out" → Retry button |
| User Closes | Modal backdrop click disabled → Safe |
| User Clicks Retry | Call handleBatchScore() again |

---

## 💾 Data Flow

```
User Input (Click Button)
         ↓
handleBatchScore()
         ↓
API Service (bulkScoringService.js)
         ↓
Backend: POST /api/scoring/batch/calculate-all
         ↓
Backend Response
         ↓
formatBatchResult()
         ↓
Update State Variables
         ↓
Modal Re-render
         ↓
Display to User
         ↓
Modal Auto Close + Data Refresh
         ↓
Component Re-render
         ↓
User Sees Updated Data
```

---

## 🚀 Integration Checklist

- ✅ Service layer created (bulkScoringService.js)
- ✅ Modal component created (ProgressModal.vue)
- ✅ SantriList integrated
- ✅ PondokList integrated
- ✅ State management implemented
- ✅ Error handling comprehensive
- ✅ Progress simulation smooth
- ✅ Auto-refresh after completion
- ✅ Dark mode support
- ✅ Mobile responsive
- ✅ Documentation complete

---

## 🧪 Testing Checklist

- [ ] Click "Batch Score" button appears
- [ ] Modal appears when clicked
- [ ] Progress bar increments smoothly
- [ ] Modal shows success message after ~15-30s
- [ ] Statistics displayed correctly
- [ ] Click "Tutup" closes modal
- [ ] Data refreshes after modal closes
- [ ] Error handling works (simulate network error)
- [ ] Retry button works after error
- [ ] Button disabled when no data
- [ ] Dark mode rendering correct
- [ ] Mobile view responsive

---

## 🔍 Debugging Tips

### Check Console:
```javascript
console.log('🟡 Starting batch scoring...')
console.log('🟢 Batch scoring success:', result)
console.log('🔴 Batch scoring error:', error)
```

### Check Network:
Browser DevTools → Network tab → Look for POST request to:
- `/api/scoring/batch/calculate-all` (Santri)
- `/api/pesantren-scoring/batch/calculate-all` (Pesantren)

### Check State:
Browser DevTools → Vue Devtools → Check:
- showBatchScoringModal value
- batchScoringProgress value
- batchScoringResult value
