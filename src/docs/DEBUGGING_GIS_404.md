# Debugging GIS 404 Error - Step by Step Guide

## 🔴 Current Error

```
Failed to load resource: the server responded with a status of 404 (Not Found)
GET http://localhost:8000/gis/santri-points → 404
GET http://localhost:8000/gis/pesantren-points → 404
GET http://localhost:8000/gis/heatmap → 404
GET http://localhost:8000/gis/pesantren-heatmap → 404
```

---

## 🔍 Debugging Process

### Step 1: Check Backend Health

**Action:**

1. Open http://localhost:5173/backend-debug
2. Select "🏥 Backend Health Check"
3. Click "Run Test"
4. Open Browser Console (F12)

**Expected Output - Success:**

```
✅ Backend is responding
Status: 200
Server is running at: http://localhost:8000
Database connection: ✅ OK
```

**Expected Output - Failure:**

```
❌ Backend is NOT responding
Error: Failed to fetch
Make sure backend is running at: http://localhost:8000
```

**What it tells you:**

- ✅ **Success:** Backend is running, database connected
- ❌ **Failure:** Backend not running or not accessible

---

### Step 2: Test GIS Endpoints with Detailed Debug

**Action:**

1. Open http://localhost:5173/backend-debug
2. Select "📋 Detailed GIS Debug"
3. Click "Run Test"
4. Open Browser Console (F12) - Clear view of detailed output
5. Expand each test group to see details

**Expected Output - Success:**

```
🔍 DETAILED GIS DEBUGGING SESSION

📍 Testing: Santri Points
Request Info:
  Method: GET
  URL: http://localhost:8000/gis/santri-points
  Expected: FeatureCollection

Response Info:
  Status: 200 OK
  Duration: 123.45ms
  Content-Type: application/json

✅ SUCCESS
Features Count: 42
Sample Feature: { id: "...", geometry: {...}, properties: {...} }
```

**Expected Output - Failure:**

```
📍 Testing: Santri Points
Response Info:
  Status: 404 Not Found
  Duration: 45.67ms

❌ ERROR
Could not parse error response as JSON
Raw Response: {"detail":"Not Found"}
```

**What it tells you:**

- ✅ **Status 200:** Endpoint exists and working
- ❌ **Status 404:** Endpoint not found/not implemented
- ❌ **Status 403:** Permission denied
- ❌ **Status 500:** Server error
- ❌ **CORS Error:** Check CORS configuration (Step 4)

---

### Step 3: Check CORS Configuration

**Action:**

1. Open http://localhost:5173/backend-debug
2. Select "🔐 Check CORS Config"
3. Click "Run Test"
4. Check Browser Console

**Expected Output - Success:**

```
🔐 CORS Configuration Check

CORS Headers:
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 3600
```

**Expected Output - Failure:**

```
CORS Headers:
Access-Control-Allow-Origin: (empty/undefined)
Access-Control-Allow-Methods: (empty/undefined)
```

**What it tells you:**

- ✅ **CORS configured:** Frontend can access backend
- ❌ **CORS not configured:** Backend blocking frontend requests
- ❌ **Wrong origin:** Check frontend URL matches CORS whitelist

---

### Step 4: Inspect Network Requests

**Action:**

1. Open Browser DevTools (F12)
2. Go to "Network" tab
3. Open http://localhost:5173/peta-santri or http://localhost:5173/peta-pesantren
4. Wait for page to load
5. Look for requests starting with `/gis/`

**What to look for:**

| Request                  | Status | Analysis                      |
| ------------------------ | ------ | ----------------------------- |
| `/gis/santri-points`     | 404    | Endpoint not found on backend |
| `/gis/pesantren-points`  | 404    | Endpoint not found on backend |
| `/gis/heatmap`           | 404    | Endpoint not found on backend |
| `/gis/pesantren-heatmap` | 404    | Endpoint not found on backend |

**For each 404 request:**

1. Click the request
2. Check "Headers" tab:
   - Request URL should be correct
   - Method should be GET
   - Headers look normal
3. Check "Response" tab:
   - Usually shows `{"detail":"Not Found"}` or similar
4. Check "Preview" tab:
   - Shows parsed response

---

## 🚀 Solution Steps

### Option A: Backend Implementation (Recommended)

The backend needs to implement these 4 endpoints:

#### 1. GET /gis/santri-points

**Backend Code Example (FastAPI):**

```python
@app.get("/gis/santri-points")
async def get_santri_points(
    provinsi: Optional[str] = None,
    kabupaten: Optional[str] = None,
    kecamatan: Optional[str] = None
):
    """Return santri locations as GeoJSON FeatureCollection"""

    # Query santri from database
    query = db.query(Santri)

    if provinsi:
        query = query.filter(Santri.provinsi == provinsi)
    if kabupaten:
        query = query.filter(Santri.kabupaten == kabupaten)
    if kecamatan:
        query = query.filter(Santri.kecamatan == kecamatan)

    santris = query.all()

    # Build GeoJSON
    features = []
    for santri in santris:
        if santri.latitude and santri.longitude:
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [santri.longitude, santri.latitude]
                },
                "properties": {
                    "id": str(santri.id),
                    "nama": santri.nama,
                    "ekonomi": santri.ekonomi,  # "miskin", "rentan", "cukup"
                    "score": santri.score,
                    "provinsi": santri.provinsi,
                    "kabupaten": santri.kabupaten,
                    "kecamatan": santri.kecamatan
                }
            })

    return {
        "type": "FeatureCollection",
        "features": features
    }
```

#### 2. GET /gis/pesantren-points

**Expected Response Format:**

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
        "id": "uuid-here",
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

#### 3. GET /gis/heatmap

**Expected Response Format:**

```json
[
  { "lat": -6.9175, "lng": 107.6417, "weight": 0.8 },
  { "lat": -6.92, "lng": 107.645, "weight": 0.6 },
  { "lat": -6.915, "lng": 107.64, "weight": 0.9 }
]
```

Weight range: 0-1, higher = more intense

#### 4. GET /gis/pesantren-heatmap

Same format as heatmap, but for pesantren locations.

---

### Option B: Enable Dummy Data (Temporary)

While backend is being implemented:

**In src/pages/SantriMap.vue, Line 12:**

```javascript
const USE_DUMMY_DATA = true // Change from false to true
```

**In src/pages/PesantrenMap.vue, Line 11:**

```javascript
const USE_DUMMY_DATA = true // Change from false to true
```

**Result:** Maps will display sample data immediately.

---

## 🔧 Advanced Debugging Commands

Run these in Browser Console (F12):

### Check Backend Connection

```javascript
import { checkBackendHealth } from '@/utils/advancedDebug'
checkBackendHealth()
```

### Full GIS Debug

```javascript
import { detailedGISDebug } from '@/utils/advancedDebug'
detailedGISDebug()
```

### Check CORS

```javascript
import { checkCORS } from '@/utils/advancedDebug'
checkCORS()
```

### Network Trace (Single Endpoint)

```javascript
import { networkTrace } from '@/utils/advancedDebug'
networkTrace('/gis/santri-points')
```

### Validate Response Format

```javascript
import { validateResponseFormat } from '@/utils/advancedDebug'
validateResponseFormat('/gis/santri-points')
```

---

## 📋 Troubleshooting Decision Tree

```
Start
  ↓
Run "Backend Health Check"
  ├─ ✅ Backend responds
  │  ↓
  │  Run "Detailed GIS Debug"
  │  ├─ ✅ All endpoints return 200
  │  │  └─ Maps should work now! (Check maps page)
  │  │
  │  └─ ❌ All endpoints return 404
  │     └─ Endpoints not implemented in backend
  │        (Inform backend team to implement endpoints)
  │
  └─ ❌ Backend NOT responding
     ├─ Check backend URL: http://localhost:8000
     ├─ Verify backend running: `python -m uvicorn app:app --reload`
     ├─ Check firewall/antivirus blocking port 8000
     └─ Verify database connection in backend

```

---

## 🎯 Success Criteria

✅ **Maps Working Correctly When:**

1. Network requests show 200 status for all /gis/\* endpoints
2. Browser console shows no 404 errors
3. Maps display markers on the page
4. Markers are color-coded correctly:
   - SantriMap: Red (Miskin), Yellow (Rentan), Gray (Cukup)
   - PesantrenMap: Green (A), Amber (B), Red (C)
5. Heatmap layer shows intensity visualization
6. Popups appear when clicking markers
7. No CORS errors in console

---

## 📞 Quick Checklist

- [ ] Backend is running at http://localhost:8000
- [ ] Frontend is running at http://localhost:5173
- [ ] Ran "Backend Health Check" - ✅ Success
- [ ] Ran "Detailed GIS Debug" - ✅ All 4 endpoints return 200
- [ ] Network tab shows requests with 200 status
- [ ] Maps display correctly with data
- [ ] No console errors
- [ ] CORS configured properly
- [ ] Database has data (Santri and Pesantren records)

---

## 📞 Contact Backend Team

When reporting to backend team, include:

```
❌ GIS Endpoints Missing (404)

Status:
- GET /gis/santri-points → 404 Not Found
- GET /gis/pesantren-points → 404 Not Found
- GET /gis/heatmap → 404 Not Found
- GET /gis/pesantren-heatmap → 404 Not Found

Required Implementation:
1. Create 4 GIS endpoints
2. Return GeoJSON for point endpoints
3. Return heatmap array format for heatmap endpoints
4. Configure CORS to allow http://localhost:5173

Reference:
- Full API spec: See GIS_INTEGRATION.md
- Response examples: See this document (Solution Steps section)
- Debugging: Use /backend-debug page for testing
```

---

## 📚 Related Documentation

- [GIS_INTEGRATION.md](./GIS_INTEGRATION.md) - Complete API specification
- [BACKEND_DEBUG_GUIDE.md](./BACKEND_DEBUG_GUIDE.md) - General debugging guide
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing with dummy data

---

**Last Updated:** January 1, 2026
**Status:** 🔴 Debugging GIS 404 Errors
