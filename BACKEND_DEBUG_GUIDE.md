# Backend Debug Guide

## 🔧 Overview

Aplikasi telah dilengkapi dengan comprehensive backend debugging tools untuk memudahkan troubleshooting error dan testing endpoint API.

## 📍 Akses Backend Debug Console

### Via Browser

**URL:** `http://localhost:5173/backend-debug`

atau

**Via Navbar:** Tidak ada di navbar (direct URL saja untuk development)

## 🧪 Testing Tools

### 1. Test Backend Connection

Mengecek apakah backend running dan accessible.

**Apa yang ditest:**

- Backend API dapat diakses
- Response status code
- CORS headers
- Sample response format

**Expected Output:**

```
✅ Backend is accessible
📊 Status: 200 OK
📋 Response headers:
  - content-type: application/json
  - access-control-allow-origin: *
📦 Sample response: { success: true, ... }
```

### 2. Test Scoring Endpoints

Mengecek scoring API endpoints.

**Endpoints yang ditest:**

- `GET /api/scoring/santri/{id}` - Ambil score santri
- `POST /api/scoring/{id}/calculate` - Hitung score santri

**Expected Output:**

```
✅ Success
📊 Score data: { score: 85, detail: {...} }
```

**Common Errors:**

```
❌ 404 Not Found - Santri tidak ada atau belum pernah di-score
❌ 400 Bad Request - Data santri incomplete
❌ 500 Internal Server Error - Backend error
```

### 3. Test GIS Endpoints

Mengecek GIS/mapping endpoints.

**Endpoints yang ditest:**

- `GET /gis/santri-points` - GeoJSON santri locations
- `GET /gis/pesantren-points` - GeoJSON pesantren locations
- `GET /gis/heatmap` - Santri heatmap data
- `GET /gis/pesantren-heatmap` - Pesantren heatmap data

**Expected Output:**

```
✅ Success - Features count: 120
Sample feature: {
  type: "Feature",
  geometry: { type: "Point", coordinates: [...] },
  properties: { id, nama, ... }
}
```

### 4. Test Santri API

Mengecek santri data endpoints.

**Endpoints yang ditest:**

- `GET /api/santri-pribadi` - List santri
- `GET /api/santri-pribadi/{id}` - Detail santri
- `POST /api/santri-pribadi` - Create santri

**Expected Output:**

```
✅ Success
Total data: 150
Sample santri: {
  id: "...",
  nama: "Ahmad Hidayat",
  nik: "327109...",
  ...
}
```

### 5. Run Full Diagnostics

Menjalankan semua test sekaligus dan membuat comprehensive report.

**Waktu:** ~5-10 detik

**Output:** Detailed console report dengan semua hasil test

## 💻 Console Commands

### Langsung di Browser Console

#### 1. Full Diagnostics

```javascript
import { runFullBackendDiagnostics } from '@/utils/backendDebug'
runFullBackendDiagnostics()
```

#### 2. Test Connection

```javascript
import { testBackendConnection } from '@/utils/backendDebug'
testBackendConnection()
```

#### 3. Test Scoring

```javascript
import { testScoringEndpoints } from '@/utils/backendDebug'
testScoringEndpoints()
```

#### 4. Test GIS

```javascript
import { testGISEndpoints } from '@/utils/backendDebug'
testGISEndpoints()
```

#### 5. Test Santri API

```javascript
import { testSantriEndpoints } from '@/utils/backendDebug'
testSantriEndpoints()
```

## 📊 Understanding Debug Output

### Color Coding

```
🔵 [DEBUG]     - Debug information
🟡 [WARNING]   - Warning message
🟢 [SUCCESS]   - Success message
🔴 [ERROR]     - Error message
```

### Log Levels

1. **Connection Info** - API URL, status, headers
2. **Request Info** - Method, endpoint, parameters
3. **Response Info** - Status, data, errors
4. **Performance** - Response time, data size

### Example Debug Output

```
🔵 [DEBUG] Calculating score for santri: 550e8400-e29b-41d4-a716-446655440000
🔵 [DEBUG] URL: http://localhost:8000/api/scoring/550e8400-e29b-41d4-a716-446655440000/calculate
🔵 [DEBUG] Response status: 400
🔵 [DEBUG] Response headers: {
  content-type: "application/json",
  content-length: "256"
}
🔴 [DEBUG] Error response received:
🔴 [DEBUG] Status: 400
🔴 [DEBUG] Data: {
  detail: "Santri data incomplete",
  validation_errors: [
    "field_rumah: Missing required house data"
  ]
}
```

## 🐛 Troubleshooting Common Errors

### Error 400: Bad Request

**Artinya:** Request format salah atau data tidak valid

**Kemungkinan Penyebab:**

- Santri data incomplete (rumah, aset, orangtua belum lengkap)
- Field value invalid (enum value, type mismatch)
- Required field missing

**Solusi:**

```
1. Check payload di console
2. Verify field values match backend schema
3. Ensure all required data sections exist
4. Check API documentation untuk field format
```

### Error 404: Not Found

**Artinya:** Resource tidak ditemukan

**Kemungkinan Penyebab:**

- Santri ID tidak valid
- Endpoint typo
- Santri belum pernah di-score

**Solusi:**

```
1. Verify santri ID correct
2. Check URL endpoint spelling
3. Try calculate score dulu sebelum get
```

### Error 500: Internal Server Error

**Artinya:** Backend crash atau database error

**Kemungkinan Penyebab:**

- Backend code error
- Database connection issue
- Unhandled exception

**Solusi:**

```
1. Check backend logs/console
2. Restart backend server
3. Verify database connection
4. Report error dengan full stack trace
```

### Error: CORS (Cross-Origin Request Blocked)

**Artinya:** Browser blocking request due to CORS policy

**Kemungkinan Penyebab:**

- Backend CORS not configured
- Origin not whitelisted
- Missing Access-Control headers

**Solusi:**

```
1. Verify backend has CORS middleware
2. Check allowed origins in backend config
3. Add to whitelist: http://localhost:5173
4. Restart backend
```

### Error: Network Timeout

**Artinya:** Backend tidak respond dalam waktu tertentu

**Kemungkinan Penyebab:**

- Backend tidak running
- API slow/expensive query
- Network issue

**Solusi:**

```
1. Verify backend running on correct port
2. Check backend logs untuk slow queries
3. Increase timeout threshold
4. Test network connectivity
```

## 📈 Performance Monitoring

### Check Response Time

```javascript
console.time('api-call')
// Make API request
console.timeEnd('api-call')
// Output: api-call: 234ms
```

### Monitor Network

1. Open DevTools → Network tab
2. Make API request
3. Check response time, size, status

### Check Console for Warnings

```
🟡 [DEBUG] Could not parse response as JSON
// Berarti response body bukan JSON valid
```

## 🔍 Debug Workflow

### Saat Terjadi Error:

**Step 1: Buka Backend Debug Console**

```
http://localhost:5173/backend-debug
```

**Step 2: Run Test yang Sesuai**

- Santri error? → Test Santri API
- Scoring error? → Test Scoring Endpoints
- Map error? → Test GIS Endpoints

**Step 3: Check Console Output**

- Buka F12 → Console tab
- Cari error message & details
- Note status code dan error response

**Step 4: Konsultasikan Troubleshooting**

- Cocokkan dengan error codes di atas
- Follow solution steps
- Test again

**Step 5: Jika Masih Error**

- Run Full Diagnostics
- Collect console log output
- Check backend logs
- Report dengan detail

## 📋 Sample Test Scenarios

### Scenario 1: Score Calculation Error

```javascript
// 1. Buka backend debug
// 2. Pilih "Test Scoring Endpoints"
// 3. Run test
// 4. Lihat output di console
// 5. Jika error, check:
//    - Santri ID correct?
//    - Santri data complete?
//    - Backend running?
```

### Scenario 2: Map Not Showing

```javascript
// 1. Run "Test GIS Endpoints"
// 2. Check if /gis/santri-points returns data
// 3. If 404, endpoint tidak ada di backend
// 4. If 500, backend error
// 5. If data kosong, no santri data yet
```

### Scenario 3: Complete Backend Check

```javascript
// 1. Click "Run Full Diagnostics"
// 2. Read report untuk summary
// 3. Identify which endpoint failing
// 4. Focus on troubleshooting that endpoint
// 5. Test fix with specific test
```

## 🚀 Melihat Backend Code

Jika perlu debug backend kode sendiri:

1. **Backend Logs**

```bash
# Terminal where backend running
# Check console output untuk error messages
```

2. **Enable Debug Mode**

```python
# In backend FastAPI
app = FastAPI(debug=True)
```

3. **Add Logging**

```python
import logging
logger = logging.getLogger(__name__)
logger.debug(f"Calculation for {santri_id}: {result}")
```

## 📞 Support

Jika debug tidak bisa resolve error:

1. **Kumpulkan informasi:**
   - Full console output dari debug tools
   - Backend logs/error messages
   - Exact steps untuk reproduce
   - API endpoint yang error

2. **Share dengan developer:**
   - Paste console output
   - Include backend error log
   - Describe expected vs actual behavior

## 🔐 Security Notes

- Backend debug tools untuk development saja
- Jangan expose di production
- Pastikan API keys tidak di-log
- Sanitize sensitive data di output

---

**Last Updated:** December 31, 2025
**Version:** 1.0
**Status:** Ready for development & testing
