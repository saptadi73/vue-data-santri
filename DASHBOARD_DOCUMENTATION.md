# Dashboard Analytics - Documentation

## 🎯 Overview

Dashboard analytics yang komprehensif untuk monitoring data santri dan pesantren dengan visualisasi menggunakan ApexCharts.

---

## 📊 Dashboard Components

### 1. **Stats Cards** (4 Cards)

Kartu statistik overview dengan icon dan trend:

| Card            | Value  | Metric | Icon |
| --------------- | ------ | ------ | ---- |
| Total Santri    | 12,458 | +12.5% | 👥   |
| Total Pesantren | 1,247  | +8.2%  | 🏫   |
| Santri Miskin   | 4,892  | +15.3% | 📊   |
| Avg Scoring     | 78.5   | +5.1%  | ⭐   |

**Features**:

- Gradient background per card
- Hover lift effect
- Trend indicator (up/down)
- Animated transitions

---

### 2. **Charts Visualization**

#### 📈 **Tren Pertumbuhan Santri & Pesantren** (Area Chart)

- **Type**: Area Chart (gradient fill)
- **Data**: 12 bulan terakhir
- **Series**:
  - Santri Baru (blue)
  - Pesantren Baru (purple)
- **Insight**: Growth trend sepanjang tahun

#### 🍩 **Kategori Scoring Santri** (Donut Chart)

- **Type**: Donut Chart
- **Categories**:
  - Sangat Layak: 2,456 (19.7%)
  - Layak: 4,892 (39.3%)
  - Cukup Layak: 3,654 (29.3%)
  - Kurang Layak: 1,456 (11.7%)
- **Center Label**: Total Santri count

#### 📊 **Distribusi per Provinsi** (Bar Chart)

- **Type**: Grouped Bar Chart
- **Provinces**: Top 6 (Jawa Barat, Jawa Timur, Jawa Tengah, Banten, Jakarta, Sumatra)
- **Series**: Santri count & Pesantren count
- **Colors**: Green & Orange

#### 🥧 **Status Ekonomi** (Pie Chart)

- **Type**: Pie Chart
- **Categories**:
  - Rendah: 4,892 (39.3%)
  - Menengah: 5,234 (42.0%)
  - Tinggi: 2,332 (18.7%)
- **Colors**: Red, Orange, Green

#### 🎯 **Kualitas Pesantren** (Radial Bar)

- **Type**: Radial Bar Chart
- **Metrics**:
  - Fasilitas: 85%
  - Pendidikan: 78%
  - Kesehatan: 72%
  - Ekonomi: 68%
- **Colors**: Multi-gradient

#### 🏆 **Top 6 Pesantren** (Horizontal Bar)

- **Type**: Horizontal Bar Chart
- **Ranking**:
  1. Pondok Modern Darussalam: 95.5
  2. Pesantren Al-Azhar: 92.3
  3. Pondok Gontor: 89.7
  4. Pesantren Lirboyo: 87.2
  5. Pondok Sidogiri: 85.6
  6. Pesantren Tebuireng: 83.4

#### 💰 **Bantuan Sosial** (Horizontal Bar)

- **Type**: Horizontal Bar Chart
- **Programs**:
  - PKH: 2,456 santri
  - KIP: 1,987 santri
  - BLT: 1,543 santri
  - Sembako: 1,234 santri
  - Beasiswa: 987 santri
  - Lainnya: 543 santri

#### 🔥 **Aktivitas Harian** (Heatmap)

- **Type**: Heatmap Chart
- **Data**: Weekly activity (7 days × 4 weeks)
- **Color Intensity**: Activity level
- **Insight**: Peak activity patterns

#### 📝 **Aktivitas Terkini** (List)

- Recent system updates
- Activity feed dengan icon & timestamp
- 4 latest activities displayed
- Categories: new, update, bansos, pesantren

---

## 🎨 Design Features

### Color Scheme

```css
Primary: #667eea (Purple-Blue)
Blue: #3b82f6
Purple: #8b5cf6
Green: #10b981
Orange: #f59e0b
Red: #ef4444
```

### Card Effects

- **Hover Lift**: translateY(-4px)
- **Shadow**: Soft to prominent on hover
- **Transitions**: 0.3s ease
- **Border Radius**: 16px (consistent)

### Responsive Breakpoints

- **Desktop**: 3-column grid (> 1200px)
- **Tablet**: 2-column grid (768px - 1200px)
- **Mobile**: 1-column stack (< 768px)

---

## 🌙 Dark Mode Support

Semua komponen mendukung dark mode dengan:

- Background: #0f172a (container), #1e293b (cards)
- Text: #e2e8f0 (primary), #94a3b8 (secondary)
- Borders: #334155
- Smooth transitions

---

## 📱 Responsive Design

### Mobile Optimizations

- Stats cards: Full width
- Charts: Stacked vertically
- Reduced padding & font sizes
- Touch-friendly interactions

### Tablet Optimizations

- 2-column chart grid
- Maintained readability
- Optimized chart heights

---

## 🚀 Performance

### Chart Loading

- Lazy initialization
- Smooth animations
- Hardware acceleration
- Debounced resize handlers

### Dummy Data Structure

```javascript
// Stats Cards
statsCards = [{ title, value, change, trend, icon, color }]

// Chart Series
series = [{ name, data: [] }]

// Chart Options
options = { chart, colors, plotOptions, xaxis, tooltip, legend }
```

---

## 🔧 Customization

### Adding New Charts

1. Define chart options (ref)
2. Define chart series (ref)
3. Add to template with VueApexCharts
4. Add to .charts-grid with proper span

### Updating Data

```javascript
// Reactive update
santriTrendSeries.value = newData
scoringKategoriSeries.value = newData
```

### Changing Colors

```javascript
// In chart options
colors: ['#3b82f6', '#8b5cf6', '#10b981']
```

---

## 📍 Navigation

**Access**: Navbar → Dashboard → **Dashboard Analytics**

**Route**: `/dashboard`

---

## 🎯 Use Cases

1. **Executive Overview**: Quick stats glance
2. **Trend Analysis**: Growth patterns over time
3. **Regional Distribution**: Province-wise breakdown
4. **Quality Monitoring**: Pesantren scoring
5. **Social Aid Tracking**: Bantuan distribution
6. **Activity Monitoring**: System usage patterns

---

## 📊 Chart Types Used

| Chart Type  | Count | Purpose               |
| ----------- | ----- | --------------------- |
| Area Chart  | 1     | Trend visualization   |
| Donut Chart | 1     | Category distribution |
| Bar Chart   | 3     | Comparison & ranking  |
| Pie Chart   | 1     | Proportion display    |
| Radial Bar  | 1     | Multi-metric scoring  |
| Heatmap     | 1     | Pattern recognition   |

---

## 🔮 Future Enhancements

### Planned Features

- [ ] Real-time data integration
- [ ] Export dashboard to PDF
- [ ] Custom date range filters
- [ ] Interactive drill-down
- [ ] Comparison mode (year-over-year)
- [ ] Widget customization
- [ ] Email report scheduling
- [ ] Mobile app version

### Data Integration

- [ ] Connect to live API
- [ ] WebSocket for real-time updates
- [ ] Caching strategy
- [ ] Error handling & fallbacks

---

## 💡 Tips

### Best Practices

1. Update dummy data with real API calls
2. Add loading states for charts
3. Implement error boundaries
4. Add data refresh button
5. Cache chart instances
6. Optimize re-renders

### Performance Tips

```javascript
// Use computed for derived data
const totalSantri = computed(() => santriData.value.reduce((sum, item) => sum + item.count, 0))

// Debounce window resize
import { debounce } from 'lodash-es'
window.addEventListener('resize', debounce(handleResize, 200))
```

---

## 📚 Dependencies

```json
{
  "vue3-apexcharts": "^1.4.1",
  "apexcharts": "^3.44.0"
}
```

---

**Created**: January 2, 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready
