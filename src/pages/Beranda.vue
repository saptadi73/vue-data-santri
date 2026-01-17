<script setup>
import { ref } from 'vue'
import NL2SQLWidget from '@/components/NL2SQLWidget.vue'
import articleRaw from '@/docs/ArtikelBeranda.txt?raw'

const paras = articleRaw
  .replace(/\r\n/g, '\n')
  .split(/\n\s*\n/)
  .map((p) => p.trim())

const stats = [
  { label: 'Jumlah Pesantren', value: '≈ 39.000 – 40.000' },
  { label: 'Santri Mukim', value: '≈ 4,8 juta jiwa' },
  { label: 'Total Santri', value: '≈ 18 juta jiwa' },
]

const showNL2SQLWidget = ref(false)

const quickQueries = [
  'Berapa jumlah santri?',
  'Top 5 pesantren',
  'Statistik kemiskinan santri',
  'Santri dari Jawa Barat',
]
</script>

<template>
  <!-- Program Nasional Opening Narrative -->
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
      <!-- Opening Section -->
      <div class="mb-16 space-y-8">
        <div class="space-y-4">
          <p
            class="inline-block rounded-full bg-cyan-100 dark:bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-500/20"
          >
            📋 Program Nasional Bantuan Santri
          </p>
          <h1
            class="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white"
          >
            Memberdayakan Santri, Membangun Masa Depan Bangsa
          </h1>
        </div>

        <p class="text-lg leading-relaxed text-slate-700 dark:text-slate-400 max-w-3xl">
          Indonesia memiliki aset spiritual dan intelektual yang luar biasa dalam bentuk pesantren
          dan santri. Dengan lebih dari 39.000 pesantren dan 18 juta santri di seluruh nusantara,
          lembaga pendidikan Islam ini menjadi tulang punggung pendidikan karakter, nilai-nilai
          spiritual, dan pengembangan sumber daya manusia berkualitas tinggi.
        </p>

        <div class="grid gap-6 sm:grid-cols-2 mt-8">
          <div
            class="rounded-xl bg-white dark:bg-white/5 border-2 border-cyan-300 dark:border-cyan-500/20 p-6 shadow-md hover:shadow-lg dark:hover:bg-white/10 transition"
          >
            <h3 class="font-semibold text-lg text-cyan-900 dark:text-cyan-200 mb-2">
              🎯 Visi Program
            </h3>
            <p class="text-slate-700 dark:text-slate-400 text-sm leading-relaxed">
              Menciptakan ekosistem pemberdayaan santri yang komprehensif meliputi pendidikan,
              kesehatan, kesejahteraan, infrastruktur, dan kemandirian ekonomi untuk mencetak
              generasi pemimpin yang berkualitas.
            </p>
          </div>
          <div
            class="rounded-xl bg-white dark:bg-white/5 border-2 border-blue-300 dark:border-blue-500/20 p-6 shadow-md hover:shadow-lg dark:hover:bg-white/10 transition"
          >
            <h3 class="font-semibold text-lg text-blue-900 dark:text-blue-200 mb-2">
              💪 Misi Utama
            </h3>
            <p class="text-slate-700 dark:text-slate-400 text-sm leading-relaxed">
              Memberikan akses pendidikan berkualitas, dukungan kesehatan menyeluruh, bantuan
              ekonomi berkelanjutan, dan infrastruktur modern untuk memastikan setiap santri
              berkembang secara optimal.
            </p>
          </div>
        </div>

        <div class="space-y-4 mt-10">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
            Tahap-tahap Program Bantuan Santri
          </h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div
              class="rounded-lg bg-white dark:from-purple-500/10 border-2 border-purple-300 dark:border-purple-500/20 p-4 text-center shadow-md hover:shadow-lg dark:hover:from-purple-500/15 transition"
            >
              <div class="text-3xl mb-2">📋</div>
              <h3 class="font-semibold text-sm text-purple-900 dark:text-purple-300">
                Pengumpulan Data
              </h3>
              <p class="text-xs text-slate-700 dark:text-slate-400 mt-1">
                Pengumpulan Data dan Survey Lapangan untuk pemetaan santri maupun lingkungan
                pendidikan pesantren
              </p>
            </div>
            <div
              class="rounded-lg bg-white dark:from-green-500/10 border-2 border-green-300 dark:border-green-500/20 p-4 text-center shadow-md hover:shadow-lg dark:hover:from-green-500/15 transition"
            >
              <div class="text-3xl mb-2">🛡️</div>
              <h3 class="font-semibold text-sm text-green-900 dark:text-green-300">
                Scoring dan Klasifikasi
              </h3>
              <p class="text-xs text-slate-700 dark:text-slate-400 mt-1">
                Melakukan scoring atas semua data parameter yang telah dikumpulkan
              </p>
            </div>
            <div
              class="rounded-lg bg-white dark:from-red-500/10 border-2 border-red-300 dark:border-red-500/20 p-4 text-center shadow-md hover:shadow-lg dark:hover:from-red-500/15 transition"
            >
              <div class="text-3xl mb-2">🗺️</div>
              <h3 class="font-semibold text-sm text-red-900 dark:text-red-300">Pemetaan</h3>
              <p class="text-xs text-slate-700 dark:text-slate-400 mt-1">
                Pemetaan kondisi sosial ekonomi santri berdasarkan hasil scoring melalui Metoda GIS
                (Gegraphical Information System)
              </p>
            </div>
            <div
              class="rounded-lg bg-white dark:from-blue-500/10 border-2 border-blue-300 dark:border-blue-500/20 p-4 text-center shadow-md hover:shadow-lg dark:hover:from-blue-500/15 transition"
            >
              <div class="text-3xl mb-2">📊</div>
              <h3 class="font-semibold text-sm text-blue-900 dark:text-blue-300">Analisa Data</h3>
              <p class="text-xs text-slate-700 dark:text-slate-400 mt-1">
                Analisa untuk menentukan prioritas bantuan guna tepat sasaran serta berdampak
                signifikan.
              </p>
            </div>
            <div
              class="rounded-lg bg-white dark:from-amber-500/10 border-2 border-amber-300 dark:border-amber-500/20 p-4 text-center shadow-md hover:shadow-lg dark:hover:from-amber-500/15 transition"
            >
              <div class="text-3xl mb-2">🤝</div>
              <h3 class="font-semibold text-sm text-amber-900 dark:text-amber-300">
                Penyaluran Bantuan
              </h3>
              <p class="text-xs text-slate-700 dark:text-slate-400 mt-1">
                Penyaluran bantuan langsung ke santri dan pesantren yang membutuhkan.
              </p>
            </div>
          </div>
        </div>

        <div class="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700/50">
          <p class="text-slate-700 dark:text-slate-400 leading-relaxed">
            Program Nasional Bantuan Santri adalah komitmen nyata untuk mendukung transformasi
            pendidikan di pesantren-pesantren Indonesia. Melalui integrasi lima pilar
            utama—pendidikan, kesejahteraan, kesehatan, infrastruktur, dan kemandirian ekonomi—kami
            membangun ekosistem holistik yang memberdayakan santri menjadi generasi yang cerdas,
            sehat, mandiri, dan bermoral tinggi.
          </p>
          <p class="text-slate-700 dark:text-slate-400 leading-relaxed mt-4">
            Setiap santri berhak mendapatkan kesempatan yang sama untuk berkembang, tidak peduli
            dari mana mereka berasal atau kondisi ekonomi keluarganya. Melalui program ini,
            pesantren diperkuat untuk menjadi pusat pengembangan ilmu, pembentukan karakter, dan
            pemberdayaan ekonomi masyarakat.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section
    id="beranda"
    class="relative overflow-hidden pt-24 scroll-mt-24 sm:pt-28 sm:scroll-mt-28"
  >
    <!-- Background gradient -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div
        class="absolute inset-0 bg-linear-to-b from-cyan-600/10 via-transparent to-transparent dark:from-cyan-500/15"
      />
      <div class="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div class="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
    </div>

    <!-- Hero -->
    <div class="mx-auto max-w-7xl px-4 pt-8 sm:pt-12">
      <div class="flex flex-col items-start gap-6 md:flex-row md:items-center">
        <div
          class="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/50 dark:border-cyan-400/40 bg-cyan-500/10 dark:bg-cyan-500/5 text-cyan-300 dark:text-cyan-400 shadow-inner shadow-cyan-500/20 dark:shadow-cyan-500/10 animate-[subtle-float_6s_ease_infinite]"
        >
          <span class="icon text-3xl">workspace_premium</span>
        </div>
        <div class="fade-in-up">
          <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Program Sosial
          </p>
          <h1
            class="font-roboto text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            Pesantren: Pilar Pendidikan Karakter & Pengentasan Kemiskinan
          </h1>
          <p class="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
            Pendidikan berkualitas di akar rumput, membangun kemandirian santri dan ekonomi umat.
          </p>
          <div class="mt-5 flex gap-3">
            <a
              href="#artikel"
              class="rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 dark:shadow-cyan-600/20 transition hover:translate-y-[1px] hover:shadow-none dark:hover:shadow-none"
              >Baca Artikel</a
            >
            <a
              href="#galeri"
              class="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 transition hover:border-cyan-500/80 hover:text-cyan-600 dark:hover:border-cyan-400/60 dark:hover:text-cyan-400 bg-white dark:bg-slate-900/50"
              >Lihat Galeri</a
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="mx-auto mt-8 max-w-7xl px-4">
      <div class="grid gap-4 sm:grid-cols-3">
        <div
          v-for="s in stats"
          :key="s.label"
          class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4 text-center shadow-sm dark:shadow-md backdrop-blur hover:bg-white/90 dark:hover:bg-slate-800/70 hover-zoom dark:text-slate-100 transition"
        >
          <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {{ s.label }}
          </p>
          <p class="mt-1 text-lg font-bold text-slate-900 dark:text-white">{{ s.value }}</p>
        </div>
      </div>
    </div>

    <!-- Article -->
    <div id="artikel" class="mx-auto max-w-3xl px-4 py-10">
      <div
        class="relative mb-8 overflow-hidden rounded-3xl bg-fixed bg-center bg-cover shadow-lg ring-1 ring-slate-200/60 dark:ring-slate-800/60"
        style="
          background-image:
            linear-gradient(135deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.25)),
            url('/images/santri_pesantren_gunung2.png');
          min-height: 220px;
        "
      >
        <div class="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/50" />
        <div class="relative z-10 flex h-full items-center justify-start px-6 py-8 sm:px-8">
          <div class="max-w-xl space-y-2 text-white drop-shadow">
            <p class="text-xs uppercase tracking-[0.2em] text-cyan-100 dark:text-cyan-200">
              Dari Pendidikan Agama ke Kemandirian Ekonomi dan Sosial
            </p>
            <h2 class="text-2xl font-bold sm:text-3xl text-white dark:text-white">
              Dari Santri untuk Negeri
            </h2>
            <p class="text-sm text-slate-100/90 dark:text-slate-200/90">
              Pengentasan Kemiskinan di Lingkungan Pesantren bagian dari Misi Besar Pembangunan
              Bangsa
            </p>
          </div>
        </div>
      </div>

      <article class="prose max-w-none fade-in-up light-mode-article dark:prose-invert">
        <template v-for="(p, i) in paras" :key="i">
          <p
            v-if="!p.startsWith('*') && !p.includes('Kategori') && !p.includes('Jumlah Estimasi')"
            class="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            {{ p }}
          </p>
        </template>
        <h2
          class="mt-8 text-xl font-semibold text-slate-800 dark:text-white border-l-4 border-cyan-500 dark:border-cyan-400 pl-4"
        >
          Pokok Kontribusi
        </h2>
        <ul class="mt-4 list-disc space-y-2 pl-6 text-slate-600 dark:text-slate-300">
          <li class="text-slate-600 dark:text-slate-300">
            Demokratisasi Akses pendidikan untuk yatim & dhuafa
          </li>
          <li class="text-slate-600 dark:text-slate-300">
            Kemandirian Vokasi: pertanian, IT, kewirausahaan
          </li>
          <li class="text-slate-600 dark:text-slate-300">Ekosistem ekonomi berbasis pesantren</li>
          <li class="text-slate-600 dark:text-slate-300">Pendidikan karakter asrama 24 jam</li>
          <li class="text-slate-600 dark:text-slate-300">Ketahanan mental dan integritas</li>
          <li class="text-slate-600 dark:text-slate-300">
            Harmonisasi ilmu: intelektual dan spiritual
          </li>
        </ul>
      </article>
    </div>

    <!-- NL2SQL Quick Query -->
    <div class="mx-auto max-w-3xl px-4 py-8">
      <div
        class="rounded-2xl border border-cyan-200 dark:border-cyan-900/50 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-900/80 dark:to-slate-800/80 p-6 shadow-lg dark:shadow-xl dark:shadow-slate-900/20 backdrop-blur-sm"
      >
        <div class="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h3
              class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 text-cyan-600 dark:text-cyan-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                />
              </svg>
              Quick Query AI
            </h3>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Tanyakan data santri & pesantren dengan bahasa natural
            </p>
          </div>
          <button
            @click="showNL2SQLWidget = !showNL2SQLWidget"
            class="rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-600 dark:to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 dark:shadow-cyan-600/10 transition hover:shadow-lg dark:hover:shadow-cyan-600/20 whitespace-nowrap"
          >
            {{ showNL2SQLWidget ? 'Tutup' : 'Coba Sekarang' }}
          </button>
        </div>

        <div v-if="showNL2SQLWidget" class="mt-6">
          <NL2SQLWidget
            compact
            :suggestedQueries="quickQueries"
            placeholder="Tanyakan tentang data..."
          />
        </div>

        <div v-else class="mt-4 flex flex-wrap gap-2">
          <span class="text-xs text-slate-500 dark:text-slate-400">Contoh:</span>
          <span
            v-for="query in quickQueries"
            :key="query"
            class="rounded-full bg-white dark:bg-slate-800/60 px-3 py-1 text-xs text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-md hover:bg-cyan-100 dark:hover:bg-slate-700 transition cursor-default"
          >
            {{ query }}
          </span>
          <router-link
            to="/nl2sql"
            class="rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-700 dark:to-blue-800 px-3 py-1 text-xs font-semibold text-white transition hover:shadow-md dark:hover:shadow-cyan-600/20"
          >
            Lihat Semua →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Gallery -->
    <div id="galeri" class="mx-auto max-w-7xl px-4 pb-12">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Galeri Pesantren</h2>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Letakkan file foto di folder
        <code
          class="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-slate-900 dark:text-slate-100"
          >public/images</code
        >
        dengan nama di bawah.
      </p>
      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <figure
          class="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 shadow-sm dark:shadow-md hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all"
        >
          <img
            src="../assets/images/santri_pesantren_cium.png"
            alt="Santri mengaji bersama"
            class="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <figcaption
            class="p-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-gradient-to-r from-transparent to-white dark:to-slate-900/50"
          >
            🕌 Adab santri kepada guru
          </figcaption>
        </figure>
        <figure
          class="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 shadow-sm dark:shadow-md hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all"
        >
          <img
            src="/images/santri_pesantren_gotong.png"
            alt="Gotong royong di halaman pesantren"
            class="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <figcaption
            class="p-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-gradient-to-r from-transparent to-white dark:to-slate-900/50"
          >
            Kemandirian & gotong royong
          </figcaption>
        </figure>
        <figure
          class="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 shadow-sm dark:shadow-md hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all"
        >
          <img
            src="../assets/images/santri_berjuang.png"
            alt="Sejarah santri dan kemerdekaan"
            class="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <figcaption
            class="p-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-gradient-to-r from-transparent to-white dark:to-slate-900/50"
          >
            Sejarah kontribusi Santri dalam Kemerdekaan
          </figcaption>
        </figure>
        <figure
          class="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 shadow-sm dark:shadow-md hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all"
        >
          <img
            src="../assets/images/santri_pesantren_makan.png"
            alt="Santri mengaji bersama"
            class="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <figcaption
            class="p-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-gradient-to-r from-transparent to-white dark:to-slate-900/50"
          >
            Program MBG Santri
          </figcaption>
        </figure>
        <figure
          class="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 shadow-sm dark:shadow-md hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all"
        >
          <img
            src="../assets/images/santri_pesantren_lomba.jpg"
            alt="Santri mengaji bersama"
            class="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <figcaption
            class="p-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-gradient-to-r from-transparent to-white dark:to-slate-900/50"
          >
            Santri Selalu Mencintai Tanah Air
          </figcaption>
        </figure>
        <figure
          class="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 shadow-sm dark:shadow-md hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all"
        >
          <img
            src="../assets/images/santri_pesantren_prihatin.png"
            alt="Santri mengaji bersama"
            class="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <figcaption
            class="p-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-gradient-to-r from-transparent to-white dark:to-slate-900/50"
          >
            Santri yang Memerlukan Bantuan Kita
          </figcaption>
        </figure>
        <figure
          class="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 shadow-sm dark:shadow-md hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all"
        >
          <img
            src="../assets/images/santri_pesantren_komputer.png"
            alt="Santri mengaji bersama"
            class="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <figcaption
            class="p-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-gradient-to-r from-transparent to-white dark:to-slate-900/50"
          >
            Santri dan Teknologi Informasi
          </figcaption>
        </figure>
        <figure
          class="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 shadow-sm dark:shadow-md hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all"
        >
          <img
            src="../assets/images/santri_pesantren_mesin.png"
            alt="Santri mengaji bersama"
            class="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <figcaption
            class="p-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-gradient-to-r from-transparent to-white dark:to-slate-900/50"
          >
            Vokasi/BLK untuk Keterampilan Santri
          </figcaption>
        </figure>
        <figure
          class="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 shadow-sm dark:shadow-md hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all"
        >
          <img
            src="../assets/images/santri_pesantren_hadrah.png"
            alt="Santri mengaji bersama"
            class="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <figcaption
            class="p-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-gradient-to-r from-transparent to-white dark:to-slate-900/50"
          >
            Seni & Budaya Pesantren
          </figcaption>
        </figure>
      </div>
      <div
        class="mt-4 text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800"
      >
        Program Bantuan Santri Nasional dikoordinasi oleh Kementerian Koordinator Bidang
        Pemberdayaan Masyarakat
        <code
          class="bg-white dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-slate-100"
          >(Humas Kemenko PM)</code
        >.
      </div>
    </div>
  </section>
</template>

<style scoped>
.prose-invert\:dark :where(h1, h2, h3, h4, p, li) {
  color: inherit;
}

.light-mode-article :where(h1, h2, h3, h4, h5, h6) {
  color: #334155;
}

.light-mode-article :where(p, li, strong) {
  color: #475569;
}

.light-mode-article :where(a) {
  color: #0891b2;
  text-decoration: underline;
}

.light-mode-article :where(a):hover {
  color: #0369a1;
}

.light-mode-article :where(blockquote) {
  border-left-color: #cbd5e1;
  color: #475569;
}

.light-mode-article :where(code) {
  background-color: #f1f5f9;
  color: #1e293b;
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
}

.light-mode-article :where(pre) {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #1e293b;
}
</style>
