<script setup>
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
</script>

<template>
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
          class="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/50 bg-cyan-500/10 text-cyan-300 shadow-inner shadow-cyan-500/20 animate-[subtle-float_6s_ease_infinite]"
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
              class="rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:translate-y-[1px] hover:shadow-none"
              >Baca Artikel</a
            >
            <a
              href="#galeri"
              class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-cyan-500/80 hover:text-cyan-600 dark:border-slate-700 dark:text-slate-100"
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
          class="rounded-2xl border border-slate-200 bg-white/70 p-4 text-center shadow-sm backdrop-blur hover-zoom dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100"
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
            <p class="text-xs uppercase tracking-[0.2em] text-cyan-100">Panorama Pesantren</p>
            <h2 class="text-2xl font-bold sm:text-3xl">Napak tilas jejak santri</h2>
            <p class="text-sm text-slate-100/90">
              Parallax pembuka artikel menampilkan suasana pesantren untuk membawa pembaca masuk ke
              cerita.
            </p>
          </div>
        </div>
      </div>

      <article class="prose prose-slate prose-invert:dark fade-in-up">
        <template v-for="(p, i) in paras" :key="i">
          <p
            v-if="!p.startsWith('*') && !p.includes('Kategori') && !p.includes('Jumlah Estimasi')"
            class="mb-4 text-slate-700 dark:text-slate-200"
          >
            {{ p }}
          </p>
        </template>
        <h2 class="mt-8 text-xl font-semibold text-slate-900 dark:text-white">Pokok Kontribusi</h2>
        <ul class="mt-2 list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-200">
          <li>Demokratisasi Akses pendidikan untuk yatim & dhuafa</li>
          <li>Kemandirian Vokasi: pertanian, IT, kewirausahaan</li>
          <li>Ekosistem ekonomi berbasis pesantren</li>
          <li>Pendidikan karakter asrama 24 jam</li>
          <li>Ketahanan mental dan integritas</li>
          <li>Harmonisasi ilmu: intelektual dan spiritual</li>
        </ul>
      </article>
    </div>

    <!-- Gallery -->
    <div id="galeri" class="mx-auto max-w-7xl px-4 pb-12">
      <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Galeri Pesantren</h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Letakkan file foto di folder <code>public/images</code> dengan nama di bawah.
      </p>
      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <figure
          class="group overflow-hidden rounded-2xl border border-slate-200 bg-white/60 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
        >
          <img
            src="/images/santri_pesantren_ngaji.png"
            alt="Santri mengaji bersama"
            class="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <figcaption class="p-3 text-sm text-slate-700 dark:text-slate-300">
            Adab santri kepada guru
          </figcaption>
        </figure>
        <figure
          class="group overflow-hidden rounded-2xl border border-slate-200 bg-white/60 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
        >
          <img
            src="/images/santri_pesantren_gotong.png"
            alt="Gotong royong di halaman pesantren"
            class="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <figcaption class="p-3 text-sm text-slate-700 dark:text-slate-300">
            Kemandirian & gotong royong
          </figcaption>
        </figure>
        <figure
          class="group overflow-hidden rounded-2xl border border-slate-200 bg-white/60 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
        >
          <img
            src="/images/santri_pesantren_lomba.jpg"
            alt="Sejarah santri dan kemerdekaan"
            class="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <figcaption class="p-3 text-sm text-slate-700 dark:text-slate-300">
            Sejarah kontribusi santri
          </figcaption>
        </figure>
      </div>
      <div class="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Jika gambar belum tampil, pastikan nama file sesuai dan diletakkan di
        <code>public/images</code>.
      </div>
    </div>
  </section>
</template>

<style scoped>
.prose-invert\:dark :where(h1, h2, h3, h4, p, li) {
  color: inherit;
}
</style>
