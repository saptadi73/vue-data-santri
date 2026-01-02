# NL2SQL Frontend Integration - Complete Implementation

## 📋 Overview

NL2SQL (Natural Language to SQL) telah diintegrasikan ke seluruh aplikasi untuk memungkinkan user melakukan query data menggunakan bahasa natural (Indonesia/Inggris). Sistem ini memanfaatkan OpenAI ChatGPT di backend untuk menerjemahkan natural language menjadi SQL query.

---

## 🎯 Integration Points

### 1. **Halaman Dedicated: `/nl2sql`**

**File**: `src/pages/NL2SQLPage.vue`

Halaman khusus untuk NL2SQL dengan fitur lengkap:

- **3 Tab Categories**: Santri, Pesantren, General
- **Context-Aware Suggestions**: Query suggestions berubah sesuai tab aktif
- **Query History**: Tracking 20 query terakhir dengan timestamp
- **Help Section**: Panduan penggunaan dan contoh query
- **Examples Card**: Contoh query per intent type

**Features**:

```vue
- Tabs untuk kategori query berbeda - Widget component dengan full functionality - Info cards
(History, Help, Examples) - Responsive grid layout - Dark mode support
```

**Access**: Navbar → Dashboard → AI Query

---

### 2. **Beranda/Homepage**

**File**: `src/pages/Beranda.vue`

**Integration Type**: Quick Query Panel (Collapsible)

**Location**: Setelah artikel, sebelum galeri

**Features**:

```vue
- Collapsible panel (Show/Hide toggle) - Compact widget mode - 4 suggested queries (quick access) -
Direct link to full NL2SQL page - Gradient border styling (cyan to blue)
```

**Suggested Queries**:

- "Berapa jumlah santri?"
- "Top 5 pesantren"
- "Statistik kemiskinan santri"
- "Santri dari Jawa Barat"

**State**:

```javascript
const showNL2SQLWidget = ref(false)
const quickQueries = [...]
```

---

### 3. **Santri Map: `/peta-santri`**

**File**: `src/pages/SantriMap.vue`

**Integration Type**: Floating Panel (Bottom-Right)

**Features**:

```vue
- Floating toggle button dengan gradient background - Slide-up panel (450px width, 70vh max-height)
- Context-specific queries untuk santri - Close button dengan smooth animation
```

**Suggested Queries**:

- "Santri miskin di Jawa Barat"
- "Top 10 santri dengan skor tertinggi"
- "Jumlah santri per kategori"
- "Rata-rata skor santri"
- "Santri dari Bandung"
- "Distribusi santri per provinsi"

**Button Position**: `bottom: 20px; right: 20px`

**State**:

```javascript
const showNL2SQLWidget = ref(false)
const santriQueries = [...]
```

---

### 4. **Pesantren Map: `/peta-pesantren`**

**File**: `src/pages/PesantrenMap.vue`

**Integration Type**: Floating Panel (Bottom-Right)

**Features**:

- Identical UI/UX to SantriMap
- Context-specific queries untuk pesantren
- Same button & panel styling

**Suggested Queries**:

- "Top 10 pesantren terbaik"
- "Pesantren berkategori sangat layak"
- "Jumlah pesantren per provinsi"
- "Rata-rata skor pesantren"
- "Pesantren di Jawa Timur"
- "Pesantren dengan fasilitas lengkap"

**Button Position**: `bottom: 20px; right: 20px`

**State**:

```javascript
const showNL2SQLWidget = ref(false)
const pesantrenQueries = [...]
```

---

## 🧩 Component Architecture

### **NL2SQLWidget.vue**

**Location**: `src/components/NL2SQLWidget.vue`

**Props**:

```javascript
{
  compact: Boolean,           // Compact mode untuk integration
  placeholder: String,        // Custom placeholder text
  suggestedQueries: Array    // Context-specific suggested queries
}
```

**Events**:

```javascript
@result  // Emitted saat query berhasil
@error   // Emitted saat terjadi error
```

**Features**:

- Query input dengan submit button
- Suggested queries chips
- Loading state dengan spinner
- Error display dengan styling
- Result display (table untuk array, key-value untuk object)
- Query history tracking (last 10)
- Intent badges dengan color mapping
- Execution time display
- SQL explanation section (optional)
- Dark mode support

---

## 🔌 Service Layer

### **nl2sqlService.js**

**Location**: `src/services/nl2sqlService.js`

**Functions**:

1. **detectIntent(query)**
   - Endpoint: `POST /nl2sql/detect-intent`
   - Returns: `{ intent, confidence, keywords }`
   - Use case: Preview intent tanpa eksekusi

2. **executeQuery(query, explain = false)**
   - Endpoint: `POST /nl2sql/query`
   - Returns: Full query result dengan data, intent, SQL, dll
   - Main function untuk eksekusi query

3. **getIntents()**
   - Endpoint: `GET /nl2sql/intents`
   - Returns: List of available intent types
   - Use case: Documentation, help section

4. **runTests()**
   - Endpoint: `POST /nl2sql/test`
   - Returns: Test results
   - Use case: Debugging, validation

---

## 🎨 Styling Highlights

### Gradient Theme

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Button Hover Effect

```css
.nl2sql-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}
```

### Panel Styling

```css
.nl2sql-panel {
  width: 450px;
  max-height: 70vh;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}
```

### Intent Badge Colors

```javascript
LIST: '#3b82f6' // Blue
FILTER: '#8b5cf6' // Purple
COUNT: '#10b981' // Green
STATISTICS: '#f59e0b' // Orange
TREND: '#06b6d4' // Cyan
RANKING: '#ec4899' // Pink
LOCATION: '#14b8a6' // Teal
DISTANCE: '#84cc16' // Lime
HEATMAP: '#ef4444' // Red
```

---

## 📱 Responsive Behavior

### Desktop (> 1024px)

- NL2SQL Page: 2-column grid (widget + info sidebar)
- Maps: Floating panel 450px width
- Beranda: Full-width panel

### Tablet (768px - 1024px)

- NL2SQL Page: Single column, info cards in row
- Maps: Panel width 400px
- Beranda: Slightly narrower panel

### Mobile (< 768px)

- NL2SQL Page: Stacked layout
- Maps: Panel full-width minus 20px padding
- Beranda: Full-width panel
- Tabs: Scrollable horizontal

---

## 🚀 Usage Examples

### In Beranda

```vue
<NL2SQLWidget compact :suggestedQueries="quickQueries" placeholder="Tanyakan tentang data..." />
```

### In SantriMap

```vue
<NL2SQLWidget
  compact
  :suggestedQueries="santriQueries"
  placeholder="Tanyakan tentang data santri..."
/>
```

### In NL2SQLPage (Full Mode)

```vue
<NL2SQLWidget
  :suggestedQueries="currentSuggestions"
  :placeholder="`Tanyakan tentang ${activeTab}...`"
  @result="handleResult"
  @error="handleError"
/>
```

---

## 🔍 Backend Requirements

### Environment Variable

```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

### API Endpoints

- `GET /nl2sql/intents` - List available intents
- `POST /nl2sql/detect-intent` - Detect query intent
- `POST /nl2sql/query` - Execute NL2SQL query
- `POST /nl2sql/test` - Run predefined tests

### CORS Configuration

```python
allow_origins=["http://localhost:5173", "http://localhost:8080"]
```

---

## ✅ Testing Checklist

### Widget Functionality

- [ ] Query submission works
- [ ] Loading state displays correctly
- [ ] Results render properly (table/key-value)
- [ ] Error handling works
- [ ] Suggested queries clickable
- [ ] Query history tracking

### Integration Points

- [ ] Beranda: Toggle shows/hides widget
- [ ] SantriMap: Floating panel opens/closes
- [ ] PesantrenMap: Floating panel opens/closes
- [ ] NL2SQL Page: Tabs switch suggestions
- [ ] Navbar: AI Query link works

### Responsive Design

- [ ] Desktop layout correct
- [ ] Tablet layout adapts
- [ ] Mobile layout stacks properly
- [ ] Scrolling works on small screens

### Dark Mode

- [ ] All panels support dark mode
- [ ] Text contrast sufficient
- [ ] Buttons styled correctly
- [ ] Transitions smooth

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch"

**Cause**: Backend not running or CORS issue
**Fix**:

1. Start backend: `uvicorn main:app --reload`
2. Check CORS settings in `main.py`
3. Verify `VITE_API_URL` in `.env`

### Issue: "OpenAI API Error"

**Cause**: Missing or invalid API key
**Fix**:

1. Check `.env` for `OPENAI_API_KEY`
2. Verify key is valid on OpenAI dashboard
3. Check backend logs for error details

### Issue: Widget not showing

**Cause**: Import or ref() error
**Fix**:

1. Verify import path: `@/components/NL2SQLWidget.vue`
2. Check ref initialization: `const showNL2SQLWidget = ref(false)`
3. Look for console errors

### Issue: Results not displaying

**Cause**: Data format mismatch
**Fix**:

1. Check API response structure
2. Verify `formattedResult` computed property
3. Add console.log in widget for debugging

---

## 📈 Future Enhancements

### Planned Features

1. **Voice Input**: Speech-to-text untuk query
2. **Query Templates**: Save frequently used queries
3. **Export Results**: Download as CSV/Excel
4. **Query Builder**: Visual query constructor
5. **Advanced Filters**: Post-query filtering
6. **Visualization**: Charts untuk statistical queries
7. **Multi-Language**: Support untuk bahasa daerah
8. **Query Sharing**: Share query dengan URL
9. **Favorites**: Bookmark useful queries
10. **Scheduled Queries**: Automated periodic queries

### Performance Optimization

- Query result caching
- Debounced query submission
- Lazy loading for large datasets
- Virtual scrolling for long tables

---

## 📚 Related Documentation

- [NL2SQL Backend Documentation](./API_DOCUMENTATION.md#nl2sql-endpoints)
- [NL2SQL Quick Start](./NL2SQL_QUICK_START.md)
- [OpenAI Setup Guide](./OPENAI_SETUP.md)
- [Widget Component API](../components/NL2SQLWidget.vue)

---

## 👥 Contributors

**Frontend Integration**: GitHub Copilot
**Backend API**: Saptadi73
**Date**: January 2, 2026

---

## 📝 Changelog

### v1.0.0 (2026-01-02)

- ✅ Initial NL2SQL integration
- ✅ Created NL2SQLWidget component
- ✅ Integrated into Beranda
- ✅ Integrated into SantriMap
- ✅ Integrated into PesantrenMap
- ✅ Created dedicated NL2SQL page
- ✅ Added Navbar link
- ✅ Implemented nl2sqlService
- ✅ Added dark mode support
- ✅ Responsive design completed

---

**🎉 Integration Complete! All 4 locations now support NL2SQL querying.**
