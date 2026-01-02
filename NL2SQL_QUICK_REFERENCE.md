# NL2SQL Integration - Quick Reference

## 🚀 Access Points

| Location           | Path                | Integration Type  | Toggle State       |
| ------------------ | ------------------- | ----------------- | ------------------ |
| **Dedicated Page** | `/nl2sql`           | Full Page         | Always visible     |
| **Beranda**        | `/` atau `/beranda` | Collapsible Panel | `showNL2SQLWidget` |
| **Santri Map**     | `/peta-santri`      | Floating Panel    | `showNL2SQLWidget` |
| **Pesantren Map**  | `/peta-pesantren`   | Floating Panel    | `showNL2SQLWidget` |

---

## 🎯 Context-Specific Queries

### Beranda (Quick Queries)

```
- Berapa jumlah santri?
- Top 5 pesantren
- Statistik kemiskinan santri
- Santri dari Jawa Barat
```

### Santri Map

```
- Santri miskin di Jawa Barat
- Top 10 santri dengan skor tertinggi
- Jumlah santri per kategori
- Rata-rata skor santri
- Santri dari Bandung
- Distribusi santri per provinsi
```

### Pesantren Map

```
- Top 10 pesantren terbaik
- Pesantren berkategori sangat layak
- Jumlah pesantren per provinsi
- Rata-rata skor pesantren
- Pesantren di Jawa Timur
- Pesantren dengan fasilitas lengkap
```

### NL2SQL Page (Full)

**Tab: Santri** - Same as Santri Map queries
**Tab: Pesantren** - Same as Pesantren Map queries
**Tab: General**:

```
- Berapa total santri dan pesantren?
- Pesantren dengan santri terbanyak
- Statistik kemiskinan santri
- Tren skor pesantren tahun ini
- Peta distribusi santri
- Heatmap pesantren
```

---

## 🧩 Component Usage

### Basic Implementation

```vue
<script setup>
import { ref } from 'vue'
import NL2SQLWidget from '@/components/NL2SQLWidget.vue'

const showWidget = ref(false)
const queries = ['Query 1', 'Query 2']
</script>

<template>
  <NL2SQLWidget compact :suggestedQueries="queries" placeholder="Your placeholder..." />
</template>
```

### With Event Handlers

```vue
<script setup>
const handleResult = (data) => {
  console.log('Query result:', data)
}

const handleError = (error) => {
  console.error('Query error:', error)
}
</script>

<template>
  <NL2SQLWidget :suggestedQueries="queries" @result="handleResult" @error="handleError" />
</template>
```

---

## 🔧 Backend Setup

### 1. Environment Variable

```bash
# .env file
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

### 2. Start Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 3. Test Endpoint

```bash
curl -X GET http://localhost:8000/nl2sql/intents
```

---

## 📱 UI Patterns

### Floating Button (Maps)

```css
Position: bottom: 20px; right: 20px;
Size: Flexible padding with icon + text
Colors: Gradient purple-blue (#667eea → #764ba2)
Hover: translateY(-2px) with shadow increase
```

### Collapsible Panel (Beranda)

```css
Border: Gradient cyan-blue
Background: Light cyan gradient (light mode)
Toggle: "Coba Sekarang" / "Tutup" button
```

### Full Page (NL2SQL)

```css
Layout: 2-column grid (main + sidebar)
Tabs: Sticky at top
Cards: White with shadow, rounded-2xl
```

---

## 🎨 Styling Variables

### Colors

```css
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  --gradient-accent: linear-gradient(135deg, #764ba2 0%, #667eea 100%) --shadow-default: 0 4px 12px
  rgba(102, 126, 234, 0.4) --shadow-hover: 0 6px 16px rgba(102, 126, 234, 0.5);
```

### Intent Colors

```javascript
{
  LIST: '#3b82f6', FILTER: '#8b5cf6', COUNT: '#10b981',
  STATISTICS: '#f59e0b', TREND: '#06b6d4', RANKING: '#ec4899',
  LOCATION: '#14b8a6', DISTANCE: '#84cc16', HEATMAP: '#ef4444'
}
```

---

## 🐛 Quick Debug

### Widget not visible?

```javascript
// Check ref initialization
console.log(showNL2SQLWidget.value) // Should be true when open

// Check import
import NL2SQLWidget from '@/components/NL2SQLWidget.vue'
```

### Backend error?

```bash
# Check backend logs
tail -f backend/logs/*.log

# Test connection
curl http://localhost:8000/health
```

### Query fails?

```javascript
// Check service
import { executeQuery } from '@/services/nl2sqlService'
executeQuery('test query').then(console.log).catch(console.error)
```

---

## 📋 Integration Checklist

- [x] NL2SQLWidget component created
- [x] nl2sqlService implemented
- [x] Integrated into Beranda (collapsible)
- [x] Integrated into SantriMap (floating)
- [x] Integrated into PesantrenMap (floating)
- [x] Created dedicated NL2SQL page
- [x] Added Navbar link
- [x] Dark mode support
- [x] Responsive design
- [x] Documentation complete

---

## 🔗 Navigation Flow

```
User Journey:
├── Beranda → Quick query → Link to full page
├── Navbar → Dashboard → AI Query → Full page
├── SantriMap → Floating button → Santri queries
└── PesantrenMap → Floating button → Pesantren queries
```

---

## 💡 Example Queries

### Data Exploration

```
"Tunjukkan 10 santri terbaru"
"Berapa jumlah pesantren di Jawa Timur?"
"Rata-rata skor santri per provinsi"
```

### Filtering

```
"Santri miskin dari Bandung"
"Pesantren dengan kategori sangat layak"
"Santri yang menerima bantuan"
```

### Analytics

```
"Top 5 pesantren dengan skor tertinggi"
"Distribusi santri per kategori ekonomi"
"Statistik kesehatan santri"
```

---

**Last Updated**: January 2, 2026
**Version**: 1.0.0
