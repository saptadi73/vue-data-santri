# 📋 Backend Implementation Checklist for GIS Endpoints

Dokumen ini untuk Backend Team yang perlu implement 4 GIS endpoints.

---

## 🎯 Endpoints to Implement

### ✅ Checklist

- [ ] **Endpoint 1:** `GET /gis/santri-points`
- [ ] **Endpoint 2:** `GET /gis/pesantren-points`
- [ ] **Endpoint 3:** `GET /gis/heatmap`
- [ ] **Endpoint 4:** `GET /gis/pesantren-heatmap`

---

## 📌 Endpoint 1: GET /gis/santri-points

### Requirements

- [ ] Query database table `santri`
- [ ] Filter berdasarkan query parameters (optional)
- [ ] Return GeoJSON FeatureCollection

### Query Parameters (Optional)

```
?provinsi=Jawa%20Barat
?kabupaten=Bandung
?kecamatan=Bandung%20Kota
```

### Response Format

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
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "nama": "Ahmad Sopyan",
        "ekonomi": "miskin",
        "score": 75.5,
        "provinsi": "Jawa Barat",
        "kabupaten": "Bandung",
        "kecamatan": "Bandung Kota"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [107.645, -6.92]
      },
      "properties": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "nama": "Budi Santoso",
        "ekonomi": "rentan",
        "score": 65.0,
        "provinsi": "Jawa Barat",
        "kabupaten": "Bandung",
        "kecamatan": "Bandung Kota"
      }
    }
  ]
}
```

### Property Details

| Field     | Type   | Example                                | Mapping                                              |
| --------- | ------ | -------------------------------------- | ---------------------------------------------------- |
| id        | UUID   | "550e8400-e29b-41d4-a716-446655440000" | santri.id                                            |
| nama      | string | "Ahmad Sopyan"                         | santri.nama                                          |
| ekonomi   | enum   | "miskin"                               | santri.ekonomi → one of: "miskin", "rentan", "cukup" |
| score     | float  | 75.5                                   | santri.score                                         |
| provinsi  | string | "Jawa Barat"                           | santri.provinsi                                      |
| kabupaten | string | "Bandung"                              | santri.kabupaten                                     |
| kecamatan | string | "Bandung Kota"                         | santri.kecamatan                                     |
| latitude  | float  | -6.9175                                | santri.latitude (for coordinates)                    |
| longitude | float  | 107.6417                               | santri.longitude (for coordinates)                   |

### Example Code (FastAPI/Python)

```python
from fastapi import APIRouter, Query
from typing import Optional
from pydantic import BaseModel

router = APIRouter(prefix="/gis", tags=["GIS"])

@router.get("/santri-points")
async def get_santri_points(
    provinsi: Optional[str] = Query(None),
    kabupaten: Optional[str] = Query(None),
    kecamatan: Optional[str] = Query(None)
):
    """Return santri locations as GeoJSON FeatureCollection"""

    # Build query
    query = db.query(Santri).filter(Santri.latitude.isnot(None))

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
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [santri.longitude, santri.latitude]
            },
            "properties": {
                "id": str(santri.id),
                "nama": santri.nama,
                "ekonomi": santri.ekonomi,
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

### Testing

```bash
# Test endpoint
curl http://localhost:8000/gis/santri-points

# With filter
curl "http://localhost:8000/gis/santri-points?provinsi=Jawa%20Barat"
curl "http://localhost:8000/gis/santri-points?kabupaten=Bandung"
```

---

## 📌 Endpoint 2: GET /gis/pesantren-points

### Requirements

- [ ] Query database table `pesantren_pesantren`
- [ ] Filter berdasarkan query parameters (optional)
- [ ] Return GeoJSON FeatureCollection

### Query Parameters (Optional)

```
?provinsi=Jawa%20Barat
?kabupaten=Bandung
?akreditasi=A
```

### Response Format

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
        "id": "550e8400-e29b-41d4-a716-446655440000",
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

### Property Details

| Field            | Type   | Example                                | Mapping                                                |
| ---------------- | ------ | -------------------------------------- | ------------------------------------------------------ |
| id               | UUID   | "550e8400-e29b-41d4-a716-446655440000" | pesantren_pesantren.id                                 |
| nama             | string | "Pesantren Al-Azhar"                   | pesantren_pesantren.nama                               |
| akreditasi       | enum   | "A"                                    | pesantren_pesantren.akreditasi → one of: "A", "B", "C" |
| score            | float  | 85.5                                   | pesantren_pesantren.score                              |
| jumlah_santri    | int    | 150                                    | COUNT(santri) WHERE pesantren_id = id                  |
| jumlah_fasilitas | int    | 8                                      | COUNT(fasilitas) WHERE pesantren_id = id               |
| provinsi         | string | "Jawa Barat"                           | pesantren_pesantren.provinsi                           |
| kabupaten        | string | "Bandung"                              | pesantren_pesantren.kabupaten                          |
| kecamatan        | string | "Bandung Kota"                         | pesantren_pesantren.kecamatan                          |
| latitude         | float  | -6.9175                                | pesantren_pesantren.latitude                           |
| longitude        | float  | 107.6417                               | pesantren_pesantren.longitude                          |

### Example Code (FastAPI/Python)

```python
from sqlalchemy import func

@router.get("/pesantren-points")
async def get_pesantren_points(
    provinsi: Optional[str] = Query(None),
    kabupaten: Optional[str] = Query(None),
    akreditasi: Optional[str] = Query(None)
):
    """Return pesantren locations as GeoJSON FeatureCollection"""

    # Build query
    query = db.query(
        PesantrenPesantren,
        func.count(Santri.id).label('santri_count'),
        func.count(PesantrenFasilitas.id).label('fasilitas_count')
    ).outerjoin(
        Santri, Santri.pesantren_id == PesantrenPesantren.id
    ).outerjoin(
        PesantrenFasilitas, PesantrenFasilitas.pesantren_id == PesantrenPesantren.id
    ).filter(
        PesantrenPesantren.latitude.isnot(None)
    ).group_by(PesantrenPesantren.id)

    if provinsi:
        query = query.filter(PesantrenPesantren.provinsi == provinsi)
    if kabupaten:
        query = query.filter(PesantrenPesantren.kabupaten == kabupaten)
    if akreditasi:
        query = query.filter(PesantrenPesantren.akreditasi == akreditasi)

    results = query.all()

    # Build GeoJSON
    features = []
    for pesantren, santri_count, fasilitas_count in results:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [pesantren.longitude, pesantren.latitude]
            },
            "properties": {
                "id": str(pesantren.id),
                "nama": pesantren.nama,
                "akreditasi": pesantren.akreditasi,
                "score": pesantren.score,
                "jumlah_santri": santri_count or 0,
                "jumlah_fasilitas": fasilitas_count or 0,
                "provinsi": pesantren.provinsi,
                "kabupaten": pesantren.kabupaten,
                "kecamatan": pesantren.kecamatan
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }
```

---

## 📌 Endpoint 3: GET /gis/heatmap

### Requirements

- [ ] Query database table `santri`
- [ ] Return array of heatmap points
- [ ] Weight normalization: nilai 0-1 based on score

### Query Parameters (Optional)

```
?ekonomi=miskin
?provinsi=Jawa%20Barat
?min_score=50
?max_score=100
```

### Response Format

```json
[
  { "lat": -6.9175, "lng": 107.6417, "weight": 0.8 },
  { "lat": -6.92, "lng": 107.645, "weight": 0.6 },
  { "lat": -6.915, "lng": 107.64, "weight": 0.9 },
  { "lat": -6.922, "lng": 107.638, "weight": 0.4 }
]
```

### Weight Calculation

Weight harus range 0-1:

```python
# Option 1: Normalize by score (0-100)
weight = santri.score / 100.0

# Option 2: Normalize by min/max
min_score = 0
max_score = 100
weight = (santri.score - min_score) / (max_score - min_score)

# Option 3: Custom weighting
# Higher score = higher weight
# Can add economic consideration
if santri.ekonomi == "miskin":
    weight = 0.9  # Prioritize economically vulnerable
elif santri.ekonomi == "rentan":
    weight = 0.6
else:
    weight = 0.3
```

### Example Code (FastAPI/Python)

```python
@router.get("/heatmap")
async def get_heatmap(
    ekonomi: Optional[str] = Query(None),
    provinsi: Optional[str] = Query(None),
    min_score: Optional[float] = Query(None),
    max_score: Optional[float] = Query(None)
):
    """Return santri heatmap data"""

    query = db.query(Santri).filter(
        Santri.latitude.isnot(None),
        Santri.longitude.isnot(None)
    )

    if ekonomi:
        query = query.filter(Santri.ekonomi == ekonomi)
    if provinsi:
        query = query.filter(Santri.provinsi == provinsi)
    if min_score:
        query = query.filter(Santri.score >= min_score)
    if max_score:
        query = query.filter(Santri.score <= max_score)

    santris = query.all()

    # Build heatmap
    heatmap = []
    for santri in santris:
        weight = min(max(santri.score / 100.0, 0), 1)  # 0-1 range
        heatmap.append({
            "lat": santri.latitude,
            "lng": santri.longitude,
            "weight": round(weight, 2)
        })

    return heatmap
```

### Testing

```bash
curl http://localhost:8000/gis/heatmap
curl "http://localhost:8000/gis/heatmap?ekonomi=miskin"
curl "http://localhost:8000/gis/heatmap?min_score=70&max_score=100"
```

---

## 📌 Endpoint 4: GET /gis/pesantren-heatmap

### Requirements

- [ ] Query database table `pesantren_pesantren`
- [ ] Return array of heatmap points
- [ ] Weight based on score or other metrics

### Query Parameters (Optional)

```
?akreditasi=A
?provinsi=Jawa%20Barat
?min_score=80
```

### Response Format

Same as `/gis/heatmap`:

```json
[
  { "lat": -6.9175, "lng": 107.6417, "weight": 0.9 },
  { "lat": -6.92, "lng": 107.645, "weight": 0.7 }
]
```

### Weight Calculation

```python
# Normalize pesantren score
weight = pesantren.score / 100.0

# Or: based on jumlah_santri
max_santri = db.query(func.max(Pesantren.jumlah_santri)).scalar()
weight = pesantren.jumlah_santri / max_santri if max_santri else 0.5
```

### Example Code (FastAPI/Python)

```python
@router.get("/pesantren-heatmap")
async def get_pesantren_heatmap(
    akreditasi: Optional[str] = Query(None),
    provinsi: Optional[str] = Query(None),
    min_score: Optional[float] = Query(None)
):
    """Return pesantren heatmap data"""

    query = db.query(PesantrenPesantren).filter(
        PesantrenPesantren.latitude.isnot(None),
        PesantrenPesantren.longitude.isnot(None)
    )

    if akreditasi:
        query = query.filter(PesantrenPesantren.akreditasi == akreditasi)
    if provinsi:
        query = query.filter(PesantrenPesantren.provinsi == provinsi)
    if min_score:
        query = query.filter(PesantrenPesantren.score >= min_score)

    pesantrens = query.all()

    # Build heatmap
    heatmap = []
    for pesantren in pesantrens:
        weight = min(max(pesantren.score / 100.0, 0), 1)
        heatmap.append({
            "lat": pesantren.latitude,
            "lng": pesantren.longitude,
            "weight": round(weight, 2)
        })

    return heatmap
```

---

## 🔧 CORS Configuration

### ⚠️ IMPORTANT

Add CORS middleware to allow frontend access:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Frontend dev server
        "http://localhost:3000",   # Alternative
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    expose_headers=["*"],
    allow_headers=["*"],
)
```

### OR

Configure untuk production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_methods=["GET"],
    allow_headers=["Content-Type"],
)
```

---

## ✅ Testing Checklist

### Before Deployment

- [ ] All 4 endpoints implemented
- [ ] All endpoints return 200 status
- [ ] Response format matches spec (GeoJSON or array)
- [ ] CORS configured for http://localhost:5173
- [ ] Database queries optimized
- [ ] No N+1 query problems
- [ ] Null coordinates filtered out
- [ ] Coordinates in correct format [longitude, latitude]
- [ ] Tested with filters (provinsi, kabupaten, etc.)
- [ ] Error handling for bad requests

### Frontend Testing

```
1. Open http://localhost:5173/backend-debug
2. Select "📋 Detailed GIS Debug"
3. Click "Run Test"
4. Check Browser Console (F12)
5. All 4 should show Status: 200
```

### Manual Testing

```bash
# Test each endpoint
curl http://localhost:8000/gis/santri-points | jq
curl http://localhost:8000/gis/pesantren-points | jq
curl http://localhost:8000/gis/heatmap | jq
curl http://localhost:8000/gis/pesantren-heatmap | jq
```

---

## 📞 Questions?

Lihat dokumentasi lengkap:

- [GIS_INTEGRATION.md](GIS_INTEGRATION.md) - API Specification
- [GIS_DEBUG_TOOLS_REFERENCE.md](GIS_DEBUG_TOOLS_REFERENCE.md) - Debug Tools
- [DEBUGGING_GIS_404.md](DEBUGGING_GIS_404.md) - Debugging Guide

---

**Status:** 🔴 Waiting for Implementation  
**Priority:** High  
**Estimated Effort:** 2-3 hours (including testing)
