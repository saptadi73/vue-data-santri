<script setup>
import { ref } from 'vue'

const expandedSection = ref(null)

const programContent = [
  {
    id: 1,
    title: 'Fasilitas Pendidikan',
    description:
      'Menyediakan fasilitas pendidikan modern dan lengkap untuk mendukung proses pembelajaran santri yang berkualitas dan efektif.',
    image: '/src/assets/images/santri_pesantren_komputer.png',
    details: [
      'Ruang kelas modern dengan teknologi pembelajaran',
      'Laboratorium komputer dan sains yang lengkap',
      'Perpustakaan dengan koleksi buku dan digital resources',
      'Auditorium untuk kegiatan bersama santri',
    ],
  },
  {
    id: 2,
    title: 'Asrama & Hunian Santri',
    description:
      'Menyediakan asrama yang nyaman, bersih, dan aman untuk menjadi rumah kedua bagi santri selama menuntut ilmu di pesantren.',
    image: '/src/assets/images/santri_pesantren_makan.png',
    details: [
      'Asrama bertingkat dengan standar kebersihan tinggi',
      'Fasilitas kamar dengan tempat tidur nyaman',
      'Sistem air bersih dan listrik yang handal',
      'Keamanan 24 jam dengan sistem CCTV',
    ],
  },
  {
    id: 3,
    title: 'Fasilitas Olahraga & Rekreasi',
    description:
      'Menyediakan sarana olahraga dan rekreasi untuk menjaga kesehatan fisik dan kesejahteraan mental santri selama tinggal.',
    image: '/src/assets/images/santri_pesantren_gunung.png',
    details: [
      'Lapangan olahraga lengkap (futsal, bola volley, basket)',
      'Gym dan ruang olahraga modern',
      'Area hijau dan taman untuk rekreasi',
      'Fasilitas olahraga air dan outdoor',
    ],
  },
  {
    id: 4,
    title: 'Fasilitas Ibadah & Rohani',
    description:
      'Menyediakan tempat ibadah yang megah dan nyaman serta mendukung kegiatan rohani dan spiritual santri setiap hari.',
    image: '/src/assets/images/santri_pesantren_ngaji.png',
    details: [
      'Masjid utama dengan desain arsitektur modern',
      'Ruang tahfiz untuk program menghafal Quran',
      'Perpustakaan agama dengan referensi lengkap',
      'Ruang musyawarah untuk kajian keislaman',
    ],
  },
]

const impacts = [
  {
    icon: '🏢',
    title: 'Lingkungan Belajar Optimal',
    description: 'Infrastruktur yang baik menciptakan suasana belajar yang kondusif dan mendukung',
  },
  {
    icon: '🛡️',
    title: 'Keamanan & Kenyamanan',
    description: 'Fasilitas modern memastikan santri merasa aman dan nyaman tinggal di pesantren',
  },
  {
    icon: '🌍',
    title: 'Lingkungan Sehat',
    description: 'Infrastruktur kebersihan dan kesehatan mendukung gaya hidup santri yang sehat',
  },
  {
    icon: '📈',
    title: 'Kemajuan Pesantren',
    description:
      'Investasi infrastruktur meningkatkan kualitas dan reputasi pesantren secara keseluruhan',
  },
]

const statistics = [
  { label: 'Pesantren dengan Infrastruktur', value: '1,420+', color: 'from-blue-500 to-blue-600' },
  { label: 'Total Santri Tertampung', value: '45,000+', color: 'from-cyan-500 to-cyan-600' },
  { label: 'Dana Investasi', value: 'Rp. 500M+', color: 'from-sky-500 to-sky-600' },
  { label: 'Proyek Infrastruktur', value: '85+', color: 'from-indigo-500 to-indigo-600' },
]

const testimonials = [
  {
    name: 'Kyai Ahmad Salim',
    role: 'Pengasuh Pesantren',
    message:
      'Infrastruktur yang baik sangat mendukung proses pendidikan santri. Dengan fasilitas modern, santri dapat fokus belajar dengan optimal.',
    image: '👨‍🎓',
  },
  {
    name: 'Sinta Dewi',
    role: 'Santri',
    message:
      'Fasilitas di pesantren ini sangat baik dan lengkap. Saya merasa nyaman belajar dan tinggal di sini.',
    image: '👩‍🎓',
  },
  {
    name: 'Pak Bambang',
    role: 'Kepala Bagian Infrastruktur',
    message:
      'Kami terus melakukan perbaikan dan peningkatan infrastruktur untuk memberikan yang terbaik bagi santri.',
    image: '👨‍💼',
  },
]
</script>

<template>
  <div class="program-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">Program Infrastruktur Pesantren</h1>
          <p class="hero-subtitle">
            Membangun dan mengembangkan infrastruktur pesantren untuk menciptakan lingkungan belajar
            yang optimal dan berkelanjutan
          </p>
          <button class="cta-button">Pelajari Lebih Lanjut</button>
        </div>
        <div class="hero-image">
          <img src="@/assets/images/santri_pesantren_komputer.png" alt="Infrastruktur Pesantren" />
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section">
      <div class="stats-container">
        <h2 class="section-title">Cakupan Investasi</h2>
        <div class="stats-grid">
          <div v-for="stat in statistics" :key="stat.label" class="stat-card">
            <div class="stat-icon-wrapper">
              <div class="stat-number" :class="`bg-gradient-to-r ${stat.color}`">
                {{ stat.value }}
              </div>
            </div>
            <p class="stat-label">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Program Details Section -->
    <section class="program-section">
      <div class="program-container-inner">
        <h2 class="section-title">Komponen Infrastruktur Utama</h2>
        <div class="program-cards">
          <div v-for="program in programContent" :key="program.id" class="program-card">
            <div class="program-image">
              <img :src="program.image" :alt="program.title" loading="lazy" />
              <div class="program-overlay"></div>
            </div>

            <div class="program-info">
              <h3 class="program-title">{{ program.title }}</h3>
              <p class="program-desc">{{ program.description }}</p>

              <button
                class="expand-button"
                @click="expandedSection = expandedSection === program.id ? null : program.id"
              >
                <span>{{ expandedSection === program.id ? 'Tutup Detail' : 'Lihat Detail' }}</span>
                <svg
                  class="expand-icon"
                  :class="{ expanded: expandedSection === program.id }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              <Transition
                enter-active-class="transition-all duration-300"
                enter-from-class="max-h-0 opacity-0"
                enter-to-class="max-h-96 opacity-100"
                leave-active-class="transition-all duration-300"
                leave-from-class="max-h-96 opacity-100"
                leave-to-class="max-h-0 opacity-0"
              >
                <div v-if="expandedSection === program.id" class="program-details">
                  <ul class="details-list">
                    <li v-for="(detail, idx) in program.details" :key="idx" class="detail-item">
                      <span class="detail-icon">✓</span>
                      {{ detail }}
                    </li>
                  </ul>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Section -->
    <section class="impact-section">
      <div class="impact-container">
        <h2 class="section-title">Dampak Infrastruktur</h2>
        <div class="impact-grid">
          <div v-for="impact in impacts" :key="impact.title" class="impact-card">
            <div class="impact-icon">{{ impact.icon }}</div>
            <h3 class="impact-title">{{ impact.title }}</h3>
            <p class="impact-desc">{{ impact.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="gallery-section">
      <div class="gallery-container">
        <h2 class="section-title">Fasilitas Pesantren</h2>
        <div class="gallery-grid">
          <div class="gallery-item">
            <img
              src="@/assets/images/santri_pesantren_komputer.png"
              alt="Komputer"
              loading="lazy"
            />
            <div class="gallery-caption">Lab Komputer Modern</div>
          </div>
          <div class="gallery-item">
            <img
              src="@/assets/images/santri_pesantren_makan.png"
              alt="Ruang Makan"
              loading="lazy"
            />
            <div class="gallery-caption">Ruang Makan & Dapur</div>
          </div>
          <div class="gallery-item">
            <img src="@/assets/images/santri_pesantren_mesin.png" alt="Workshop" loading="lazy" />
            <div class="gallery-caption">Workshop & Laboratorium</div>
          </div>
          <div class="gallery-item">
            <img
              src="@/assets/images/santri_pesantren_gunung.png"
              alt="Lapangan Olahraga"
              loading="lazy"
            />
            <div class="gallery-caption">Lapangan Olahraga</div>
          </div>
          <div class="gallery-item">
            <img src="@/assets/images/santri_pesantren_ngaji.png" alt="Masjid" loading="lazy" />
            <div class="gallery-caption">Masjid & Ruang Ibadah</div>
          </div>
          <div class="gallery-item">
            <img
              src="@/assets/images/santri_pesantren_prestasi.png"
              alt="Ruang Kelas"
              loading="lazy"
            />
            <div class="gallery-caption">Ruang Kelas Nyaman</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial Section -->
    <section class="testimonial-section">
      <div class="testimonial-container">
        <h2 class="section-title">Testimoni Pengguna</h2>
        <div class="testimonial-grid">
          <div v-for="testimonial in testimonials" :key="testimonial.name" class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-avatar">{{ testimonial.image }}</div>
              <div>
                <h4 class="testimonial-name">{{ testimonial.name }}</h4>
                <p class="testimonial-role">{{ testimonial.role }}</p>
              </div>
            </div>
            <p class="testimonial-message">{{ testimonial.message }}</p>
            <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2 class="cta-title">Wujudkan Pesantren Masa Depan</h2>
        <p class="cta-subtitle">
          Infrastruktur yang baik adalah investasi terbaik untuk pendidikan santri
        </p>
        <div class="cta-buttons">
          <button class="btn-primary">Lihat Proyek</button>
          <button class="btn-secondary">Jadilah Donatur</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.program-container {
  min-height: 100vh;
  background: #f8fafc;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  padding: 80px 24px;
}

.hero-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-text {
  animation: slideInLeft 0.8s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 18px;
  margin: 0 0 32px 0;
  opacity: 0.95;
  line-height: 1.6;
}

.cta-button {
  padding: 14px 36px;
  font-size: 16px;
  font-weight: 600;
  background: white;
  color: #3b82f6;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}

.hero-image {
  animation: slideInRight 0.8s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.hero-image img {
  width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Statistics Section */
.stats-section {
  background: white;
  padding: 60px 24px;
}

.stats-container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  margin: 0 0 48px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.stat-card {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 36px rgba(59, 130, 246, 0.15);
}

.stat-icon-wrapper {
  margin-bottom: 16px;
}

.stat-number {
  display: inline-block;
  font-size: 32px;
  font-weight: 800;
  bg-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Program Section */
.program-section {
  padding: 60px 24px;
  background: #f8fafc;
}

.program-container-inner {
  max-width: 1400px;
  margin: 0 auto;
}

.program-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
}

.program-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.program-card:nth-child(1) {
  animation-delay: 0.1s;
}
.program-card:nth-child(2) {
  animation-delay: 0.2s;
}
.program-card:nth-child(3) {
  animation-delay: 0.3s;
}
.program-card:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.program-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.program-image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.program-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.program-card:hover .program-image img {
  transform: scale(1.1);
}

.program-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%);
}

.program-info {
  padding: 24px;
}

.program-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.program-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.expand-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 12px;
}

.expand-button:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.expand-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.program-details {
  margin-top: 16px;
}

.details-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #475569;
}

.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1e40af;
  font-weight: bold;
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Impact Section */
.impact-section {
  background: white;
  padding: 60px 24px;
}

.impact-container {
  max-width: 1400px;
  margin: 0 auto;
}

.impact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
}

.impact-card {
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.impact-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 36px rgba(59, 130, 246, 0.1);
}

.impact-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: inline-block;
}

.impact-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.impact-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

/* Gallery Section */
.gallery-section {
  background: #f8fafc;
  padding: 60px 24px;
}

.gallery-container {
  max-width: 1400px;
  margin: 0 auto;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.gallery-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  height: 280px;
  cursor: pointer;
  group: hover;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.gallery-item:hover img {
  transform: scale(1.15);
}

.gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
  color: white;
  padding: 24px 16px 16px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  transform: translateY(20px);
  opacity: 0;
}

.gallery-item:hover .gallery-caption {
  transform: translateY(0);
  opacity: 1;
}

/* Testimonial Section */
.testimonial-section {
  background: white;
  padding: 60px 24px;
}

.testimonial-container {
  max-width: 1400px;
  margin: 0 auto;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
}

.testimonial-card {
  background: linear-gradient(135deg, #f9fafb 0%, #dbeafe 100%);
  border-radius: 16px;
  padding: 28px;
  border-left: 4px solid #3b82f6;
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 36px rgba(59, 130, 246, 0.15);
}

.testimonial-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.testimonial-avatar {
  font-size: 48px;
  flex-shrink: 0;
}

.testimonial-name {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.testimonial-role {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0 0;
}

.testimonial-message {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 12px 0;
  font-style: italic;
}

.testimonial-stars {
  font-size: 16px;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  padding: 80px 24px;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.cta-title {
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.cta-subtitle {
  font-size: 18px;
  margin: 0 0 40px 0;
  opacity: 0.95;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 14px 36px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: white;
  color: #3b82f6;
}

.btn-primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-4px);
}

/* Dark Mode */
:global(.dark) .program-container {
  background: #0f172a;
}

:global(.dark) .hero-section {
  background: linear-gradient(135deg, #1f2d42 0%, #1a2540 100%);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
}

:global(.dark) .hero-title {
  color: #f0f9ff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

:global(.dark) .hero-subtitle {
  color: #cbd5e1;
}

:global(.dark) .stats-section {
  background: #1e293b;
}

:global(.dark) .section-title {
  color: #f0f9ff;
}

:global(.dark) .stat-card {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(30, 144, 255, 0.08) 100%);
  border: 1px solid rgba(147, 197, 253, 0.2);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

:global(.dark) .stat-card:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(30, 144, 255, 0.12) 100%);
  border-color: rgba(147, 197, 253, 0.4);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
}

:global(.dark) .stat-label {
  color: #cbd5e1;
}

:global(.dark) .program-section {
  background: #0f172a;
}

:global(.dark) .program-card {
  background: linear-gradient(135deg, #1e293b 0%, #1a3a4c 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(59, 130, 246, 0.1);
}

:global(.dark) .program-card:hover {
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.3);
  background: linear-gradient(135deg, #263449 0%, #1f445c 100%);
}

:global(.dark) .program-title {
  color: #f0f9ff;
}

:global(.dark) .program-desc {
  color: #cbd5e1;
}

:global(.dark) .detail-item {
  color: #cbd5e1;
}

:global(.dark) .detail-icon {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

:global(.dark) .expand-button {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(30, 144, 255, 0.8) 100%);
}

:global(.dark) .expand-button:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #1e90ff 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

:global(.dark) .impact-section {
  background: #1e293b;
}

:global(.dark) .impact-card {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(30, 144, 255, 0.06) 100%);
  border: 1px solid rgba(147, 197, 253, 0.2);
}

:global(.dark) .impact-card:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(30, 144, 255, 0.1) 100%);
  border-color: rgba(147, 197, 253, 0.3);
}

:global(.dark) .impact-title {
  color: #f0f9ff;
}

:global(.dark) .impact-desc {
  color: #cbd5e1;
}

:global(.dark) .gallery-section {
  background: #0f172a;
}

:global(.dark) .gallery-item {
  border: 1px solid rgba(59, 130, 246, 0.1);
  background: linear-gradient(135deg, #1a2e4a 0%, #1a3a4c 100%);
}

:global(.dark) .gallery-item:hover {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
}

:global(.dark) .gallery-caption {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(15, 23, 42, 0.95) 100%);
  color: #f0f9ff;
}

:global(.dark) .testimonial-section {
  background: #1e293b;
}

:global(.dark) .testimonial-card {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(30, 144, 255, 0.06) 100%);
  border: 1px solid rgba(147, 197, 253, 0.2);
  border-left: 4px solid #3b82f6;
}

:global(.dark) .testimonial-card:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(30, 144, 255, 0.1) 100%);
  border-color: rgba(147, 197, 253, 0.3);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
}

:global(.dark) .testimonial-name {
  color: #f0f9ff;
}

:global(.dark) .testimonial-role {
  color: #94a3b8;
}

:global(.dark) .testimonial-message {
  color: #cbd5e1;
}

:global(.dark) .testimonial-avatar {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(30, 144, 255, 0.15) 100%);
  border: 2px solid rgba(59, 130, 246, 0.3);
}

:global(.dark) .cta-section {
  background: linear-gradient(135deg, #1f2d42 0%, #1a2540 100%);
  border-top: 1px solid rgba(59, 130, 246, 0.1);
}

:global(.dark) .cta-title {
  color: #f0f9ff;
}

:global(.dark) .cta-subtitle {
  color: #cbd5e1;
}

:global(.dark) .btn-primary {
  background: white;
  color: #3b82f6;
}

:global(.dark) .btn-secondary {
  background: transparent;
  color: #cbd5e1;
  border: 2px solid rgba(147, 197, 253, 0.5);
}

:global(.dark) .btn-secondary:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(147, 197, 253, 0.8);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .section-title {
    font-size: 28px;
    margin-bottom: 32px;
  }

  .cta-title {
    font-size: 28px;
  }

  .cta-subtitle {
    font-size: 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .program-cards {
    grid-template-columns: 1fr;
  }

  .impact-grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .gallery-item {
    height: 200px;
  }

  .testimonial-grid {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 50px 16px;
  }

  .hero-title {
    font-size: 24px;
  }

  .section-title {
    font-size: 22px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .gallery-item {
    height: 240px;
  }

  .stats-section,
  .program-section,
  .impact-section,
  .gallery-section,
  .testimonial-section,
  .cta-section {
    padding: 40px 16px;
  }
}
</style>
