# API Connection & Data Validation Checklist

## Status Actual API Integration

Aplikasi sudah dikonfigurasi untuk menggunakan real API data (bukan dummy):

- ✅ `USE_DUMMY_DATA = false` (Line 14 di SantriMap.vue)
- ✅ Fetch API dari endpoints: `/gis/santri-points` dan `/gis/heatmap`
- ⚠️ Backend belum mengirim field `ekonomi` dan `score` (lihat BACKEND_FIX_NEEDED.md)

## Testing Checklist

### 1. Check Backend Running

```bash
# Terminal
curl http://localhost:8000/
# Expected: Response dari backend (200 OK)
# If: Connection refused → Backend tidak jalan
```

### 2. Check GIS Endpoints

```bash
# Check santri-points
curl http://localhost:8000/gis/santri-points | jq '.' | head -30

# Expected response structure:
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [107.1234, -6.5678]
      },
      "properties": {
        "id": "...",
        "nama": "...",
        "kabupaten": "...",  ← PENTING
        "score": 85,          ← PENTING (currently missing)
        "ekonomi": "Miskin"   ← PENTING (currently missing)
      }
    }
  ]
}
```

### 3. Browser Console Check

Open: http://localhost:5173/peta-santri
Press: F12 (Developer Tools → Console tab)

**If successful, you'll see:**

```
✅ Loaded santri GeoJSON features: XXX
🔍 Santri Aggregated: {kab1: {count: 10, total_score: 850}, ...}
🎨 Thresholds (color breaks): [...]
✅ Choropleth layer created successfully
```

**If API failed, you'll see:**

```
Error fetching santri points: TypeError: fetch failed
❌ Backend API tidak dapat diakses. Pastikan server berjalan di http://localhost:8000
```

**If no ekonomi/score field, you'll see:**

```
🔍 Sample santri properties: {id: "...", nama: "..., kabupaten: "..."}
❌ Missing 'ekonomi' and 'score' fields in API response
```

### 4. Check Choropleth Colors

- Open: http://localhost:5173/peta-santri
- Enable "Tampilkan Choropleth Santri" checkbox
- Expected: Map regions show color gradient (green → yellow → red)
- If all gray: Data not loading or not aggregating properly

### 5. Check Heatmap

- Open: http://localhost:5173/peta-santri
- Enable "Tampilkan Heatmap" checkbox
- Expected: Red heat overlay in areas with high santri concentration
- If empty: Heatmap data not loading

## API Field Requirements

### For Choropleth to Work Correctly:

- ✅ `geometry` with coordinates [longitude, latitude]
- ✅ `properties.kabupaten` or `properties.kabupaten_domisili` (region name)
- ✅ `properties.score` or `properties.skor` (numeric score 0-100)

### For Markers to Work Correctly:

- ✅ `geometry` with coordinates
- ✅ `properties.nama` (santri name)
- ✅ `properties.ekonomi` (Miskin/Rentan/Cukup) - for marker coloring

### For Heatmap to Work Correctly:

- ✅ Endpoint `/gis/heatmap` returns array of points:
  ```json
  [
    { "lat": -6.5, "lng": 107.1, "weight": 85 },
    { "lat": -7.0, "lng": 108.5, "weight": 72 }
  ]
  ```

## Troubleshooting

### Choropleth shows all gray regions

**Cause:** No matching between API region names and boundary GeoJSON
**Check:**

1. Console shows `Match rate: 0/20`
2. Compare boundary names vs API names
3. May need to update `normalizeRegionName()` function in SantriMap.vue

### Choropleth shows all same color

**Cause:** Data aggregation working but thresholds not distributing
**Check:**

1. Console shows aggregated data but all same color?
2. Verify quantile thresholds in console: `🎨 Thresholds (color breaks): [...]`
3. May need to check if score data is missing (all zeros)

### No choropleth layer visible

**Cause 1:** Toggle not enabled → Click "Tampilkan Choropleth Santri"
**Cause 2:** GeoJSON fetch failed → Check console for errors
**Cause 3:** Map pane issue → Check browser console

### Backend connection errors

**Cause:** Backend server not running
**Solution:** Start backend with:

```bash
cd backend
python main.py  # or appropriate run command
```

## Performance Notes

- Choropleth renders ~500 boundary polygons
- With 1000s of santri, aggregation is instant
- Heatmap with 10K+ points may be slow (use layer toggle)
- Canvas renderer optimized with `willReadFrequently: true`

## File References

- **Main component:** [src/pages/SantriMap.vue](src/pages/SantriMap.vue)
- **API configuration:** Check `API_BASE` in file (usually `http://localhost:8000`)
- **Boundary data:** `/data/geo/indonesia-kabupaten.geojson` (local file)
- **Backend requirements:** [BACKEND_FIX_NEEDED.md](BACKEND_FIX_NEEDED.md)
- **Debug utilities:** [src/utils/backendDebug.js](src/utils/backendDebug.js)

## Next Steps

1. **Verify backend is running** at http://localhost:8000
2. **Check API endpoints** respond with proper data structure
3. **Review BACKEND_FIX_NEEDED.md** to ensure all required fields are present
4. **Open browser console** and check for fetch errors or aggregation issues
5. **Enable choropleth toggle** to see visualization
6. **Compare console output** with expected values above
