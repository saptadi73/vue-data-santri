<script setup></script>

<template>
  <!-- Hero Section -->
  <section
    class="relative overflow-hidden bg-gradient-to-b from-slate-300 via-slate-200 to-slate-100 rounded-lg dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white"
  >
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div
        class="absolute inset-0 bg-linear-to-b from-cyan-600/10 via-transparent to-transparent dark:from-cyan-500/5"
      />
      <div
        class="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-cyan-500/20 dark:bg-cyan-500/10 blur-3xl"
      />
      <div
        class="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-600/20 dark:bg-blue-600/10 blur-3xl"
      />
    </div>

    <div class="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <div class="space-y-6">
        <p
          class="inline-block rounded-full bg-cyan-100 dark:bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-500/20"
        >
          🚀 Teknologi Terdepan untuk Pemberdayaan Santri
        </p>
        <h1
          class="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white"
        >
          GIS & AI: Teknologi untuk Data Santri & Pesantren
        </h1>
        <p class="text-lg leading-relaxed text-slate-700 dark:text-slate-400 max-w-3xl">
          Program Nasional Bantuan Santri mengintegrasikan teknologi Geographic Information System
          (GIS) dan Artificial Intelligence (AI) untuk pendataan, pemetaan, dan analisa data yang
          akurat, berkelanjutan, dan berdampak.
        </p>
      </div>
    </div>
  </section>

  <!-- Main Content -->
  <section class="py-16 sm:py-24">
    <div class="mx-auto max-w-6xl px-4">
      <!-- Video & Article Section -->
      <div class="mb-16 grid md:grid-cols-2 gap-8 items-start">
        <!-- Video -->
        <div class="flex justify-center md:justify-start">
          <video
            autoplay
            muted
            loop
            class="w-full max-w-sm h-auto rounded-2xl overflow-hidden bg-slate-900 shadow-2xl"
          >
            <source src="@/assets/images/santri_ai.mp4" type="video/mp4" />
            Browser Anda tidak mendukung video HTML5.
          </video>
        </div>

        <!-- Article -->
        <div>
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Visi Teknologi Kami
          </h2>
          <p class="text-slate-700 dark:text-slate-400 mb-4 leading-relaxed">
            Program Nasional Bantuan Santri mengintegrasikan teknologi Geographic Information System
            (GIS) dan Artificial Intelligence (AI) untuk pendataan, pemetaan, dan analisa data yang
            akurat, berkelanjutan, dan berdampak.
          </p>
          <p class="text-slate-700 dark:text-slate-400 mb-4 leading-relaxed">
            Dengan memanfaatkan teknologi terdepan, kami memastikan setiap keputusan pemberian
            bantuan didukung oleh data yang akurat dan analisa mendalam untuk mencapai hasil yang
            optimal.
          </p>
          <div class="space-y-3">
            <div class="flex gap-3">
              <span class="text-2xl flex-shrink-0">🎯</span>
              <div>
                <h4 class="font-semibold text-slate-900 dark:text-white">Presisi Targeting</h4>
                <p class="text-sm text-slate-600 dark:text-slate-500">
                  Identifikasi penerima bantuan dengan akurasi tinggi
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <span class="text-2xl flex-shrink-0">⚡</span>
              <div>
                <h4 class="font-semibold text-slate-900 dark:text-white">Kecepatan Analisa</h4>
                <p class="text-sm text-slate-600 dark:text-slate-500">
                  Pemrosesan data real-time untuk respons cepat
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <span class="text-2xl flex-shrink-0">🔄</span>
              <div>
                <h4 class="font-semibold text-slate-900 dark:text-white">
                  Pembelajaran Berkelanjutan
                </h4>
                <p class="text-sm text-slate-600 dark:text-slate-500">
                  Sistem terus berkembang dan meningkat akurasinya
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- GIS Section -->
      <div class="mb-16 scroll-mt-24" id="gis-section">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Geographic Information System (GIS)
            </h2>
            <p class="text-slate-700 dark:text-slate-400 mb-4 leading-relaxed">
              GIS adalah teknologi pemetaan berbasis data geografis yang kami gunakan untuk
              memetakan sebaran santri, pesantren, dan kondisi sosial ekonomi secara akurat di
              seluruh Indonesia.
            </p>
            <div class="space-y-3">
              <div class="flex gap-3">
                <span class="text-2xl">🗺️</span>
                <div>
                  <h4 class="font-semibold text-slate-900 dark:text-white">Pemetaan Spasial</h4>
                  <p class="text-sm text-slate-600 dark:text-slate-500">
                    Visualisasi lokasi pesantren dan santri dalam peta interaktif
                  </p>
                </div>
              </div>
              <div class="flex gap-3">
                <span class="text-2xl">📊</span>
                <div>
                  <h4 class="font-semibold text-slate-900 dark:text-white">Analisa Kluster</h4>
                  <p class="text-sm text-slate-600 dark:text-slate-500">
                    Identifikasi area dengan kebutuhan bantuan tertinggi
                  </p>
                </div>
              </div>
              <div class="flex gap-3">
                <span class="text-2xl">🎯</span>
                <div>
                  <h4 class="font-semibold text-slate-900 dark:text-white">Penetapan Prioritas</h4>
                  <p class="text-sm text-slate-600 dark:text-slate-500">
                    Alokasi sumber daya bantuan yang tepat sasaran
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="@/assets/images/gis_santri.jpg"
              alt="GIS Pemetaan Santri"
              class="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      <!-- AI/ML Section -->
      <div
        class="mb-16 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 md:p-12"
      >
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          Artificial Intelligence & Machine Learning
        </h2>
        <p class="text-slate-700 dark:text-slate-400 mb-8 leading-relaxed">
          AI dan Machine Learning kami gunakan untuk analisa data berkelanjutan, prediksi kebutuhan,
          dan optimalisasi distribusi bantuan santri.
        </p>

        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
            <span class="text-3xl mb-3 block">🤖</span>
            <h3 class="font-semibold text-lg text-slate-900 dark:text-white mb-2">Prediksi Data</h3>
            <p class="text-sm text-slate-600 dark:text-slate-500">
              Model ML memprediksi pola kebutuhan santri berdasarkan data historis
            </p>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
            <span class="text-3xl mb-3 block">📈</span>
            <h3 class="font-semibold text-lg text-slate-900 dark:text-white mb-2">Optimalisasi</h3>
            <p class="text-sm text-slate-600 dark:text-slate-500">
              Algoritma mengoptimalkan alokasi sumber daya untuk dampak maksimal
            </p>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
            <span class="text-3xl mb-3 block">🔄</span>
            <h3 class="font-semibold text-lg text-slate-900 dark:text-white mb-2">
              Pembelajaran Berkelanjutan
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-500">
              Sistem terus belajar dan meningkatkan akurasi dengan data baru
            </p>
          </div>
        </div>
      </div>

      <!-- Integration Section -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Integrasi Teknologi untuk Impact
        </h2>

        <div class="space-y-6">
          <div class="relative pl-8 pb-8">
            <div
              class="absolute left-0 top-1 w-4 h-4 bg-cyan-500 rounded-full border-4 border-white dark:border-slate-900"
            ></div>
            <div class="absolute left-1.5 top-5 bottom-0 w-1 bg-cyan-300 dark:bg-cyan-700"></div>

            <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Pengumpulan Data Terpadu
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              Sistem terintegrasi mengumpulkan data santri, pesantren, dan lingkungan sosial ekonomi
              dengan standar internasional
            </p>
          </div>

          <div class="relative pl-8 pb-8">
            <div
              class="absolute left-0 top-1 w-4 h-4 bg-cyan-500 rounded-full border-4 border-white dark:border-slate-900"
            ></div>
            <div class="absolute left-1.5 top-5 bottom-0 w-1 bg-cyan-300 dark:bg-cyan-700"></div>

            <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Pemetaan Spasial dengan GIS
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              Data divisualisasikan dalam peta interaktif untuk memahami pola distribusi dan
              clustering kebutuhan
            </p>
          </div>

          <div class="relative pl-8 pb-8">
            <div
              class="absolute left-0 top-1 w-4 h-4 bg-cyan-500 rounded-full border-4 border-white dark:border-slate-900"
            ></div>
            <div class="absolute left-1.5 top-5 bottom-0 w-1 bg-cyan-300 dark:bg-cyan-700"></div>

            <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Analisa AI/ML Mendalam
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              Model machine learning menganalisa data untuk mengidentifikasi pola, prediksi
              kebutuhan, dan rekomendasi prioritas
            </p>
          </div>

          <div class="relative pl-8">
            <div
              class="absolute left-0 top-1 w-4 h-4 bg-cyan-500 rounded-full border-4 border-white dark:border-slate-900"
            ></div>

            <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Penyaluran Bantuan Tepat Sasaran
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              Hasil analisa digunakan untuk mengalokasikan bantuan dengan presisi tinggi dan dampak
              sosial maksimal
            </p>
          </div>
        </div>
      </div>

      <!-- Benefits Section -->
      <div
        class="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-8 md:p-12 border border-cyan-300 dark:border-cyan-700"
      >
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Manfaat Teknologi GIS & AI
        </h2>

        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3
              class="font-semibold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2"
            >
              <span>✓</span> Akurasi Data Tinggi
            </h3>
            <p class="text-slate-700 dark:text-slate-400">
              Pengumpulan data terstruktur dan terintegrasi menghasilkan database akurat untuk
              pengambilan keputusan
            </p>
          </div>
          <div>
            <h3
              class="font-semibold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2"
            >
              <span>✓</span> Efisiensi Alokasi Sumber Daya
            </h3>
            <p class="text-slate-700 dark:text-slate-400">
              Identifikasi kebutuhan prioritas memastikan bantuan sampai ke yang paling membutuhkan
            </p>
          </div>
          <div>
            <h3
              class="font-semibold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2"
            >
              <span>✓</span> Pembelajaran Berkelanjutan
            </h3>
            <p class="text-slate-700 dark:text-slate-400">
              Model ML terus berkembang untuk meningkatkan akurasi prediksi dan rekomendasi
            </p>
          </div>
          <div>
            <h3
              class="font-semibold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2"
            >
              <span>✓</span> Transparansi dan Akuntabilitas
            </h3>
            <p class="text-slate-700 dark:text-slate-400">
              Visualisasi data dan laporan detail memastikan transparansi program bantuan
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
