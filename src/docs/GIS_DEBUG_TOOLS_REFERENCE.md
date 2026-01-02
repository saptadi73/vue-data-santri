# 🗺️ GIS Debugging Tools - Complete Reference

## 📍 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Vue Frontend                             │
│              (http://localhost:5173)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  src/pages/SantriMap.vue      src/pages/PesantrenMap.vue   │
│  ├─ USE_DUMMY_DATA = false     ├─ USE_DUMMY_DATA = false   │
│  ├─ fetch /gis/santri-points   ├─ fetch /gis/pesantren-points
│  └─ fetch /gis/heatmap         └─ fetch /gis/pesantren-heatmap
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                  Debug Tools (NEW!)                         │
│                                                             │
│  src/utils/advancedDebug.js (NEW)    src/pages/BackendDebug.vue
│  ├─ detailedGISDebug()               ├─ 📋 Detailed GIS Debug
│  ├─ checkBackendHealth()             ├─ 🏥 Backend Health Check
│  ├─ checkCORS()                      ├─ 🔐 Check CORS Config
│  ├─ networkTrace()                   └─ (+ Test options)
│  └─ validateResponseFormat()
│                                                             │
└─────────────────────────────────────────────────────────────┘
                             ↓
                    CORS/Network Requests
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                          │
│              (http://localhost:8000)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔴 MISSING ENDPOINTS (404 Not Found):                     │
│  ├─ GET /gis/santri-points                                │
│  ├─ GET /gis/pesantren-points                             │
│  ├─ GET /gis/heatmap                                      │
│  └─ GET /gis/pesantren-heatmap                            │
│                                                             │
│  ✅ WORKING ENDPOINTS:                                     │
│  ├─ GET /api/santri-pribadi                               │
│  ├─ GET /api/scoring/santri/{id}                          │
│  └─ POST /api/scoring/{id}/calculate                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Debug Tools Available

### 1. **detailedGISDebug()** ⭐ PALING DETAIL

**Lokasi:** `src/utils/advancedDebug.js`  
**Akses:** Browser Console atau /backend-debug → "📋 Detailed GIS Debug"

**Output:**

```
🔍 DETAILED GIS DEBUGGING SESSION
============================================================

📍 Testing: Santri Points
Request Info:
  Method: GET
  URL: http://localhost:8000/gis/santri-points
  Expected: FeatureCollection

Response Info:
  Status: 404 Not Found
  Duration: 45.67ms
  Content-Type: application/json
  CORS Allow-Origin: (Not Set)

❌ ERROR
Error Response: {"detail":"Not Found"}

============================================================
✅ Debugging Complete
```

**Fungsi:** Menampilkan detail lengkap untuk setiap endpoint.

---

### 2. **checkBackendHealth()** ✅ VERIFIKASI BACKEND

**Lokasi:** `src/utils/advancedDebug.js`  
**Akses:** Browser Console atau /backend-debug → "🏥 Backend Health Check"

**Output Success:**

```
🏥 Backend Health Check

✅ Backend is responding
Status: 200
Server is running at: http://localhost:8000
Database connection: ✅ OK
Sample response: {...data...}
```

**Output Failure:**

```
❌ Backend is NOT responding
Error: Failed to fetch
Make sure backend is running at: http://localhost:8000
```

**Fungsi:** Memastikan backend running dan accessible.

---

### 3. **checkCORS()** 🔐 CORS CONFIGURATION

**Lokasi:** `src/utils/advancedDebug.js`  
**Akses:** Browser Console atau /backend-debug → "🔐 Check CORS Config"

**Output:**

```
🔐 CORS Configuration Check

CORS Headers:
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 3600
```

**Fungsi:** Verifikasi CORS configuration di backend.

---

### 4. **networkTrace(endpoint)** 🔗 NETWORK DETAIL

**Lokasi:** `src/utils/advancedDebug.js`  
**Akses:** Browser Console only

**Usage:**

```javascript
import { networkTrace } from '@/utils/advancedDebug'
networkTrace('/gis/santri-points')
```

**Output:**

```
📡 Network Trace: /gis/santri-points

1️⃣ Building Request
URL: http://localhost:8000/gis/santri-points
Method: GET

2️⃣ Sending Request

3️⃣ Received Response
Duration: 45.23ms
Status: 404
Status Text: Not Found

4️⃣ Response Headers
content-type: application/json
content-length: 27
...

5️⃣ Response Body
{"detail":"Not Found"}
```

**Fungsi:** Step-by-step trace request dan response.

---

### 5. **validateResponseFormat(endpoint)** ✔️ FORMAT VALIDATION

**Lokasi:** `src/utils/advancedDebug.js`  
**Akses:** Browser Console only

**Usage:**

```javascript
import { validateResponseFormat } from '@/utils/advancedDebug'
validateResponseFormat('/gis/santri-points')
```

**Fungsi:** Verifikasi response format sesuai spec.

---

## 🚀 How to Use

### Cara 1: Via Debug Console (Easy) 🎯

```
1. Buka http://localhost:5173/backend-debug
2. Pilih satu opsi (dropdown atau radio button)
3. Click "Run Test"
4. Buka Browser Console (F12) untuk lihat hasil
5. Expand group untuk lihat detail
```

### Cara 2: Via Browser Console (Advanced) 💻

```javascript
// 1. Import function
import { detailedGISDebug } from '@/utils/advancedDebug'

// 2. Run function
detailedGISDebug()

// 3. Lihat output di console
```

---

## 📊 Expected Results

### ✅ IF Backend Endpoints Implemented

```
Status: 200 OK
Duration: 120ms

✅ SUCCESS
Features Count: 42

Sample Feature:
{
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [107.64, -6.91] },
  "properties": {
    "id": "uuid-123",
    "nama": "Ahmad Sopyan",
    "ekonomi": "miskin",
    "score": 75.5
  }
}
```

**Next Step:** Maps akan menampilkan data dengan benar.

---

### ❌ IF Backend Endpoints NOT Implemented

```
Status: 404 Not Found
Duration: 45ms

❌ ERROR
Error Response: {"detail":"Not Found"}

💡 Possible Issues:
  • Endpoint not found
  • Backend not running
  • Wrong endpoint path
```

**Next Step:** Hubungi backend team untuk implement endpoints.

---

## 🎯 Debugging Workflow

```
START
  ↓
[1] Run "Backend Health Check"
  ├─ ✅ Backend responds
  │  ↓
  │  [2] Run "Detailed GIS Debug"
  │  ├─ ✅ All endpoints 200 OK
  │  │  ↓
  │  │  Maps should work! ✅
  │  │
  │  └─ ❌ All endpoints 404 Not Found
  │     ↓
  │     → Endpoint not implemented
  │     → Inform backend team
  │
  └─ ❌ Backend NOT responding
     ├─ Check: http://localhost:8000 accessible
     ├─ Check: Backend running
     ├─ Check: Firewall/Antivirus blocking port 8000
     └─ Check: Database connection in backend
```

---

## 📚 File Structure

### New Files Created

```
src/
├─ utils/
│  └─ advancedDebug.js (NEW - 189 lines)
│     ├─ detailedGISDebug()
│     ├─ checkBackendHealth()
│     ├─ checkCORS()
│     ├─ networkTrace()
│     └─ validateResponseFormat()
│
└─ pages/
   └─ BackendDebug.vue (UPDATED)
      └─ Added 3 new test options:
         ├─ 📋 Detailed GIS Debug
         ├─ 🏥 Backend Health Check
         └─ 🔐 Check CORS Config

Root/
├─ DEBUGGING_GIS_404.md (NEW - Complete guide)
├─ GIS_404_QUICK_START.md (NEW - Quick reference)
└─ GIS_INTEGRATION.md (EXISTING - API spec)
```

---

## 🔧 Console Commands Reference

```javascript
// Full GIS Debug
import { detailedGISDebug } from '@/utils/advancedDebug'
detailedGISDebug()

// Check if backend running
import { checkBackendHealth } from '@/utils/advancedDebug'
checkBackendHealth()

// Check CORS configuration
import { checkCORS } from '@/utils/advancedDebug'
checkCORS()

// Single endpoint trace
import { networkTrace } from '@/utils/advancedDebug'
networkTrace('/gis/santri-points')
networkTrace('/gis/pesantren-points')
networkTrace('/gis/heatmap')
networkTrace('/gis/pesantren-heatmap')

// Validate response format
import { validateResponseFormat } from '@/utils/advancedDebug'
validateResponseFormat('/gis/santri-points')
validateResponseFormat('/gis/pesantren-points')
```

---

## 🎓 Learn More

| Document                                         | Untuk Apa                         |
| ------------------------------------------------ | --------------------------------- |
| [GIS_404_QUICK_START.md](GIS_404_QUICK_START.md) | Quick reference (5 min read)      |
| [DEBUGGING_GIS_404.md](DEBUGGING_GIS_404.md)     | Complete debugging guide (20 min) |
| [GIS_INTEGRATION.md](GIS_INTEGRATION.md)         | Full API specification            |
| [BACKEND_DEBUG_GUIDE.md](BACKEND_DEBUG_GUIDE.md) | General debugging guide           |

---

## ✅ Success Checklist

- [ ] Backend running at http://localhost:8000
- [ ] Run "Backend Health Check" → ✅ Success
- [ ] Run "Detailed GIS Debug" → ✅ All 4 endpoints return 200
- [ ] Maps display data (Santri & Pesantren)
- [ ] Markers show color-coded (Ekonomi/Akreditasi)
- [ ] Heatmap layer visible
- [ ] Popups work on marker click
- [ ] No console errors

---

**Last Updated:** January 1, 2026  
**Status:** Ready for Debugging  
**Tools Added:** advancedDebug.js + Updated BackendDebug.vue
