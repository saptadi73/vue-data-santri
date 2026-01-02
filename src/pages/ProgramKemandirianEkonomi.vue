<script setup>
import { ref } from 'vue'

const expandedSection = ref(null)

const programContent = [
  {
    id: 1,
    title: 'Pelatihan Kewirausahaan',
    description:
      'Program pelatihan mendalam tentang cara memulai, menjalankan, dan mengembangkan usaha sendiri untuk santri yang ingin mandiri ekonomi.',
    image: '/src/assets/images/santri_pesantren_komputer.png',
    details: [
      'Pelatihan dasar kewirausahaan dan bisnis plan',
      'Mentoring dari entrepreneur berpengalaman',
      'Workshop strategi pemasaran dan penjualan',
      'Program inkubasi bisnis untuk ide terbaik',
    ],
  },
  {
    id: 2,
    title: 'Pengembangan Keterampilan Produktif',
    description:
      'Pelatihan keterampilan praktis yang laku di pasar untuk meningkatkan kemampuan santri menghasilkan uang dan mandiri.',
    image: '/src/assets/images/santri_pesantren_mesin.png',
    details: [
      'Keterampilan kerajinan tangan dan handmade',
      'Pelatihan teknologi dan digital skills',
      'Kursus jahit, bordir, dan fashion design',
      'Program peternakan dan pertanian modern',
    ],
  },
  {
    id: 3,
    title: 'Akses Pembiayaan & Modal Usaha',
    description:
      'Memberikan akses kepada santri untuk mendapatkan modal usaha melalui program pinjaman lunak dan investasi dari berbagai pihak.',
    image: '/src/assets/images/santri_berjuang.png',
    details: [
      'Program pinjaman modal usaha dengan bunga ringan',
      'Hibah modal untuk UMKM santri berprestasi',
      'Crowdfunding untuk ide bisnis inovatif',
      'Kerjasama dengan bank dan lembaga keuangan',
    ],
  },
  {
    id: 4,
    title: 'Literasi Finansial & Manajemen Bisnis',
    description:
      'Edukasi tentang pengelolaan keuangan pribadi dan bisnis agar santri dapat mengelola uang dengan bijak dan menguntungkan.',
    image: '/src/assets/images/santri_pesantren_prestasi.png',
    details: [
      'Literasi finansial dan perencanaan keuangan',
      'Akuntansi dasar untuk UMKM dan bisnis kecil',
      'Manajemen kas dan arus uang bisnis',
      'Pajak dan legalitas usaha sederhana',
    ],
  },
]

const impacts = [
  {
    icon: '💼',
    title: 'Kemandirian Finansial',
    description:
      'Santri mampu menghasilkan penghasilan sendiri dan tidak tergantung pada orang lain',
  },
  {
    icon: '🚀',
    title: 'Pengembangan UMKM',
    description: 'Terciptanya ribuan UMKM santri yang berkontribusi pada ekonomi lokal',
  },
  {
    icon: '💡',
    title: 'Inovasi & Kreativitas',
    description: 'Santri mengembangkan ide bisnis kreatif dan inovatif yang relevan dengan pasar',
  },
  {
    icon: '🌟',
    title: 'Kesuksesan Bisnis',
    description: 'Santri mencapai kesuksesan finansial dan menjadi pengusaha sukses di masa depan',
  },
]

const statistics = [
  { label: 'Santri Entrepreneur', value: '8,500+', color: 'from-amber-500 to-amber-600' },
  { label: 'UMKM Aktif', value: '3,200+', color: 'from-orange-500 to-orange-600' },
  { label: 'Modal Terdistribusi', value: 'Rp. 45M+', color: 'from-yellow-500 to-yellow-600' },
  { label: 'Omset Tahunan', value: 'Rp. 200M+', color: 'from-amber-600 to-amber-700' },
]

const testimonials = [
  {
    name: 'Muhammad Rizki',
    role: 'Entrepreneur Muda',
    message:
      'Berkat program ini, saya bisa memulai usaha batik sendiri dan sekarang sudah menghasilkan omset ratusan juta per tahun. Alhamdulillah mandiri!',
    image: '👨‍💼',
  },
  {
    name: 'Siti Nur Azizah',
    role: 'Pemilik Usaha Kue',
    message:
      'Program pelatihan sangat membantu. Dari peserta program, sekarang saya sudah punya usaha kue yang berkembang dan melayani event-event besar.',
    image: '👩‍💼',
  },
  {
    name: 'Pak Santoso',
    role: 'Mentor Bisnis',
    message:
      'Saya kagum melihat dedikasi santri-santri ini. Mereka dengan cepat belajar dan menerapkan ilmu bisnis untuk meraih kesuksesan finansial.',
    image: '👨‍🏫',
  },
]
</script>

<template>
  <div class="program-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">Program Kemandirian Ekonomi Santri</h1>
          <p class="hero-subtitle">
            Memberdayakan santri untuk mandiri secara finansial melalui pelatihan kewirausahaan,
            akses modal, dan dukungan bisnis
          </p>
          <button class="cta-button">Pelajari Lebih Lanjut</button>
        </div>
        <div class="hero-image">
          <img src="@/assets/images/santri_pesantren_prestasi.png" alt="Santri Entrepreneur" />
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section">
      <div class="stats-container">
        <h2 class="section-title">Pencapaian Ekonomi Santri</h2>
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
        <h2 class="section-title">Komponen Program Kemandirian</h2>
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
        <h2 class="section-title">Dampak Kemandirian Ekonomi</h2>
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
        <h2 class="section-title">Kegiatan & Usaha Santri</h2>
        <div class="gallery-grid">
          <div class="gallery-item">
            <img
              src="@/assets/images/santri_pesantren_komputer.png"
              alt="Pelatihan Digital"
              loading="lazy"
            />
            <div class="gallery-caption">Pelatihan Digital & E-Commerce</div>
          </div>
          <div class="gallery-item">
            <img
              src="@/assets/images/santri_pesantren_mesin.png"
              alt="Keterampilan Teknik"
              loading="lazy"
            />
            <div class="gallery-caption">Pelatihan Keterampilan Teknik</div>
          </div>
          <div class="gallery-item">
            <img src="@/assets/images/santri_berjuang.png" alt="Semangat Berjuang" loading="lazy" />
            <div class="gallery-caption">Semangat Santri Berjuang</div>
          </div>
          <div class="gallery-item">
            <img
              src="@/assets/images/santri_pesantren_prestasi.png"
              alt="Pencapaian"
              loading="lazy"
            />
            <div class="gallery-caption">Prestasi & Kesuksesan Usaha</div>
          </div>
          <div class="gallery-item">
            <img
              src="@/assets/images/santri_pesantren_gotong.png"
              alt="Kerja Sama"
              loading="lazy"
            />
            <div class="gallery-caption">Kerja Sama & Networking Bisnis</div>
          </div>
          <div class="gallery-item">
            <img src="@/assets/images/santri_pesantren_lomba.png" alt="Kompetisi" loading="lazy" />
            <div class="gallery-caption">Kompetisi & Event Entrepreneur</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial Section -->
    <section class="testimonial-section">
      <div class="testimonial-container">
        <h2 class="section-title">Testimoni Sukses</h2>
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
        <h2 class="cta-title">Raih Kesuksesan Finansial Bersama Kami</h2>
        <p class="cta-subtitle">
          Jadilah entrepreneur sukses dan mandiri secara ekonomi sejak dini
        </p>
        <div class="cta-buttons">
          <button class="btn-primary">Daftar Program</button>
          <button class="btn-secondary">Hubungi Mentor</button>
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
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
  color: #f59e0b;
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
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 36px rgba(245, 158, 11, 0.15);
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
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
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
  background: #fef3c7;
  color: #d97706;
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
  background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.impact-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 36px rgba(245, 158, 11, 0.1);
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
  background: linear-gradient(135deg, #f9fafb 0%, #fef3c7 100%);
  border-radius: 16px;
  padding: 28px;
  border-left: 4px solid #f59e0b;
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 36px rgba(245, 158, 11, 0.15);
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
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
  color: #f59e0b;
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
  background: linear-gradient(135deg, #3a2f1f 0%, #2e2415 100%);
  border-bottom: 1px solid rgba(245, 158, 11, 0.1);
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
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.08) 100%);
  border: 1px solid rgba(253, 224, 71, 0.2);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
}

:global(.dark) .stat-card:hover {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.12) 100%);
  border-color: rgba(253, 224, 71, 0.4);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.15);
}

:global(.dark) .stat-label {
  color: #cbd5e1;
}

:global(.dark) .program-section {
  background: #0f172a;
}

:global(.dark) .program-card {
  background: linear-gradient(135deg, #1e293b 0%, #3a3226 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(245, 158, 11, 0.1);
}

:global(.dark) .program-card:hover {
  box-shadow: 0 12px 32px rgba(245, 158, 11, 0.25);
  border-color: rgba(245, 158, 11, 0.3);
  background: linear-gradient(135deg, #263449 0%, #3f3a2f 100%);
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
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

:global(.dark) .expand-button {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.8) 0%, rgba(217, 119, 6, 0.8) 100%);
}

:global(.dark) .expand-button:hover {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

:global(.dark) .impact-section {
  background: #1e293b;
}

:global(.dark) .impact-card {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.06) 100%);
  border: 1px solid rgba(253, 224, 71, 0.2);
}

:global(.dark) .impact-card:hover {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.1) 100%);
  border-color: rgba(253, 224, 71, 0.3);
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
  border: 1px solid rgba(245, 158, 11, 0.1);
  background: linear-gradient(135deg, #1a2e4a 0%, #3a3226 100%);
}

:global(.dark) .gallery-item:hover {
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2);
}

:global(.dark) .gallery-caption {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(15, 23, 42, 0.95) 100%);
  color: #f0f9ff;
}

:global(.dark) .testimonial-section {
  background: #1e293b;
}

:global(.dark) .testimonial-card {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.06) 100%);
  border: 1px solid rgba(253, 224, 71, 0.2);
  border-left: 4px solid #f59e0b;
}

:global(.dark) .testimonial-card:hover {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.1) 100%);
  border-color: rgba(253, 224, 71, 0.3);
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2);
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
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.15) 100%);
  border: 2px solid rgba(245, 158, 11, 0.3);
}

:global(.dark) .cta-section {
  background: linear-gradient(135deg, #3a2f1f 0%, #2e2415 100%);
  border-top: 1px solid rgba(245, 158, 11, 0.1);
}

:global(.dark) .cta-title {
  color: #f0f9ff;
}

:global(.dark) .cta-subtitle {
  color: #cbd5e1;
}

:global(.dark) .btn-primary {
  background: white;
  color: #f59e0b;
}

:global(.dark) .btn-secondary {
  background: transparent;
  color: #cbd5e1;
  border: 2px solid rgba(253, 224, 71, 0.5);
}

:global(.dark) .btn-secondary:hover {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(253, 224, 71, 0.8);
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
