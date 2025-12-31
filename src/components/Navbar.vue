<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { RouterLink } from 'vue-router'

const mobileOpen = ref(false)
const openDropdown = ref(null)
const theme = ref('light')

const applyTheme = (mode) => {
  theme.value = mode
  const root = document.documentElement
  const body = document.body

  root.classList.remove('dark')
  body.classList.remove('dark')
  if (mode === 'dark') {
    root.classList.add('dark')
    body.classList.add('dark')
  }

  root.style.colorScheme = mode
  localStorage.setItem('theme-mode', mode)
}

const toggleTheme = () => {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark')
}

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const closeAll = () => {
  mobileOpen.value = false
  openDropdown.value = null
}

const handleEscape = (e) => {
  if (e.key === 'Escape') closeAll()
}

const handleResize = () => {
  if (window.innerWidth >= 1024) mobileOpen.value = false
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
  window.addEventListener('resize', handleResize)

  const saved = localStorage.getItem('theme-mode')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(saved ?? (prefersDark ? 'dark' : 'light'))
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b bg-white/90 text-slate-800 backdrop-blur-lg shadow-[0_6px_30px_-16px_rgba(0,0,0,0.25)] dark:border-slate-800 dark:bg-slate-950/85 dark:text-slate-100 dark:shadow-[0_6px_30px_-16px_rgba(0,0,0,0.75)]"
  >
    <nav
      class="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-3 lg:py-4"
      @mouseleave="openDropdown = null"
    >
      <!-- Logo & Brand -->
      <div class="flex items-center gap-3 min-w-45">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/50 bg-cyan-500/10 text-cyan-300 shadow-inner shadow-cyan-500/20"
        >
          <span class="icon text-2xl">workspace_premium</span>
        </div>
        <div class="leading-tight">
          <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Program Sosial
          </p>
          <p class="font-roboto text-lg font-semibold text-slate-900 dark:text-white">
            Bantuan Santri
          </p>
        </div>
      </div>

      <!-- Desktop Links -->
      <div
        class="hidden flex-1 items-center justify-start gap-1 text-sm font-medium text-slate-800 dark:text-slate-100 lg:flex"
      >
        <RouterLink
          class="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-cyan-600 dark:hover:bg-slate-800/70 dark:hover:text-cyan-200"
          to="/"
        >
          <span class="icon text-base lg:hidden">home</span>
          <span>Beranda</span>
        </RouterLink>
        <RouterLink
          class="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-cyan-600 dark:hover:bg-slate-800/70 dark:hover:text-cyan-200"
          to="/beranda#artikel"
        >
          <span class="icon text-base lg:hidden">article</span>
          <span>Tujuan</span>
        </RouterLink>

        <!-- Program Dropdown -->
        <div class="relative">
          <button
            class="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-cyan-600 dark:hover:bg-slate-800/70 dark:hover:text-cyan-200"
            @click="toggleDropdown('program')"
          >
            <span class="icon text-base lg:hidden">category</span>
            <span>Program</span>
            <span
              class="icon text-sm lg:hidden"
              :class="openDropdown === 'program' ? 'rotate-180' : ''"
              >expand_more</span
            >
          </button>
          <Transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0 -translate-y-2 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition ease-in duration-120"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 -translate-y-2 scale-95"
          >
            <div
              v-if="openDropdown === 'program'"
              class="absolute left-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white/95 text-slate-800 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100"
            >
              <RouterLink
                class="block px-4 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/70"
                to="/beranda#program-1"
                >Program 1</RouterLink
              >
              <RouterLink
                class="block px-4 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/70"
                to="/beranda#program-2"
                >Program 2</RouterLink
              >
              <RouterLink
                class="block px-4 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/70"
                to="/beranda#program-3"
                >Program 3</RouterLink
              >
            </div>
          </Transition>
        </div>

        <RouterLink
          class="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-cyan-600 dark:hover:bg-slate-800/70 dark:hover:text-cyan-200"
          to="/beranda#galeri"
        >
          <span class="icon text-base lg:hidden">photo_library</span>
          <span>Galeri</span>
        </RouterLink>

        <!-- Formulir Dropdown -->
        <div class="relative">
          <button
            class="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-cyan-600 dark:hover:bg-slate-800/70 dark:hover:text-cyan-200"
            @click="toggleDropdown('formulir')"
          >
            <span class="icon text-base lg:hidden">description</span>
            <span>Formulir</span>
            <span
              class="icon text-sm lg:hidden"
              :class="openDropdown === 'formulir' ? 'rotate-180' : ''"
              >expand_more</span
            >
          </button>
          <Transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0 -translate-y-2 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition ease-in duration-120"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 -translate-y-2 scale-95"
          >
            <div
              v-if="openDropdown === 'formulir'"
              class="absolute left-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white/95 text-slate-800 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100"
            >
              <RouterLink
                class="block px-4 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/70"
                to="/pondok"
                >Data Pondok</RouterLink
              >
              <RouterLink
                class="block px-4 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/70"
                to="/santri"
                >Data Santri</RouterLink
              >
            </div>
          </Transition>
        </div>

        <!-- Dashboard Dropdown -->
        <div class="relative">
          <button
            class="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-cyan-600 dark:hover:bg-slate-800/70 dark:hover:text-cyan-200"
            @click="toggleDropdown('dashboard')"
          >
            <span class="icon text-base lg:hidden">dashboard</span>
            <span>Dashboard</span>
            <span
              class="icon text-sm lg:hidden"
              :class="openDropdown === 'dashboard' ? 'rotate-180' : ''"
              >expand_more</span
            >
          </button>
          <Transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0 -translate-y-2 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition ease-in duration-120"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 -translate-y-2 scale-95"
          >
            <div
              v-if="openDropdown === 'dashboard'"
              class="absolute left-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white/95 text-slate-800 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100"
            >
              <RouterLink
                class="block px-4 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/70"
                to="/peta-santri"
                >Peta Santri</RouterLink
              >
              <RouterLink
                class="block px-4 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/70"
                to="/peta-pesantren"
                >Peta Pesantren</RouterLink
              >
              <RouterLink
                class="block px-4 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/70"
                to="/beranda#sebaran-santri"
                >Sebaran Santri</RouterLink
              >
              <RouterLink
                class="block px-4 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/70"
                to="/beranda#data-donatur"
                >Data Donatur</RouterLink
              >
              <RouterLink
                class="block px-4 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/70"
                to="/beranda#distribusi-bantuan"
                >Distribusi Bantuan</RouterLink
              >
              <RouterLink
                class="block px-4 py-2 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/70"
                to="/beranda#klasifikasi-bantuan"
                >Klasifikasi Bantuan</RouterLink
              >
            </div>
          </Transition>
        </div>
      </div>

      <!-- Right actions -->
      <div class="ml-auto flex items-center gap-2">
        <form class="relative hidden w-56 lg:block" role="search" @submit.prevent>
          <span
            class="icon pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 lg:hidden"
            >search</span
          >
          <input
            class="w-full rounded-xl border border-slate-200 bg-white px-10 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
            placeholder="Cari konten"
            type="search"
          />
        </form>
        <button
          class="hidden h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 transition hover:border-cyan-500/80 hover:text-cyan-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:text-cyan-200 lg:flex"
          @click="toggleTheme"
          aria-label="Toggle theme"
        >
          <span class="icon text-xl">{{ theme === 'dark' ? 'dark_mode' : 'light_mode' }}</span>
        </button>
        <button
          class="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-cyan-500/80 hover:text-cyan-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:text-cyan-200 lg:flex"
        >
          <span class="icon text-base lg:hidden">login</span>
          Login
        </button>
        <button
          class="hidden items-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:translate-y-px hover:shadow-none lg:flex"
        >
          <span class="icon text-base lg:hidden">person_add</span>
          Daftar
        </button>
        <button
          class="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 transition hover:border-cyan-500/70 hover:text-cyan-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 lg:hidden"
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
        >
          <span class="icon text-2xl">{{ mobileOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-120"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileOpen"
        class="lg:hidden border-t border-slate-200 bg-white/95 text-slate-800 backdrop-blur px-4 pb-4 shadow-lg dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-100"
      >
        <form class="relative mt-4" role="search" @submit.prevent>
          <span
            class="icon pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            >search</span
          >
          <input
            class="w-full rounded-xl border border-slate-200 bg-white px-10 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
            placeholder="Cari konten"
            type="search"
          />
        </form>
        <div class="mt-3 space-y-1">
          <button
            class="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-cyan-500/80 hover:text-cyan-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:text-cyan-200"
            @click="toggleTheme"
          >
            <span class="icon text-base">{{ theme === 'dark' ? 'dark_mode' : 'light_mode' }}</span>
            <span>Mode {{ theme === 'dark' ? 'Dark' : 'Light' }}</span>
          </button>
          <a
            class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
            href="#beranda"
          >
            <span class="icon text-base">home</span>
            Beranda
          </a>
          <a
            class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
            href="#tujuan"
          >
            <span class="icon text-base">article</span>
            Tujuan
          </a>

          <div
            class="rounded-lg border border-slate-200 bg-slate-50/90 dark:border-slate-800/60 dark:bg-slate-900/60"
          >
            <button
              class="flex w-full items-center justify-between px-3 py-2 text-left font-medium"
              @click="toggleDropdown('program')"
            >
              <span class="flex items-center gap-2"
                ><span class="icon text-base">category</span> Program</span
              >
              <span class="icon text-sm" :class="openDropdown === 'program' ? 'rotate-180' : ''"
                >expand_more</span
              >
            </button>
            <div v-if="openDropdown === 'program'" class="space-y-1 px-3 pb-3">
              <a
                class="block rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                href="#program-1"
                >Program 1</a
              >
              <a
                class="block rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                href="#program-2"
                >Program 2</a
              >
              <a
                class="block rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                href="#program-3"
                >Program 3</a
              >
            </div>
          </div>

          <a
            class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
            href="#galeri"
          >
            <span class="icon text-base">photo_library</span>
            Galeri
          </a>

          <div
            class="rounded-lg border border-slate-200 bg-slate-50/90 dark:border-slate-800/60 dark:bg-slate-900/60"
          >
            <button
              class="flex w-full items-center justify-between px-3 py-2 text-left font-medium"
              @click="toggleDropdown('formulir')"
            >
              <span class="flex items-center gap-2"
                ><span class="icon text-base">description</span> Formulir</span
              >
              <span class="icon text-sm" :class="openDropdown === 'formulir' ? 'rotate-180' : ''"
                >expand_more</span
              >
            </button>
            <div v-if="openDropdown === 'formulir'" class="space-y-1 px-3 pb-3">
              <RouterLink
                class="block rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                to="/pondok"
                @click="closeAll"
                >Data Pondok</RouterLink
              >
              <RouterLink
                class="block rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                to="/santri"
                @click="closeAll"
                >Data Santri</RouterLink
              >
            </div>
          </div>

          <div
            class="rounded-lg border border-slate-200 bg-slate-50/90 dark:border-slate-800/60 dark:bg-slate-900/60"
          >
            <button
              class="flex w-full items-center justify-between px-3 py-2 text-left font-medium"
              @click="toggleDropdown('dashboard')"
            >
              <span class="flex items-center gap-2"
                ><span class="icon text-base">dashboard</span> Dashboard</span
              >
              <span class="icon text-sm" :class="openDropdown === 'dashboard' ? 'rotate-180' : ''"
                >expand_more</span
              >
            </button>
            <div v-if="openDropdown === 'dashboard'" class="space-y-1 px-3 pb-3">
              <RouterLink
                class="block rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                to="/peta-santri"
                @click="closeAll"
                >Peta Santri</RouterLink
              >
              <RouterLink
                class="block rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                to="/peta-pesantren"
                @click="closeAll"
                >Peta Pesantren</RouterLink
              >
              <a
                class="block rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                href="#sebaran-santri"
                >Sebaran Santri</a
              >
              <a
                class="block rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                href="#data-donatur"
                >Data Donatur</a
              >
              <a
                class="block rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                href="#distribusi-bantuan"
                >Distribusi Bantuan</a
              >
              <a
                class="block rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                href="#klasifikasi-bantuan"
                >Klasifikasi Bantuan</a
              >
            </div>
          </div>

          <div class="flex gap-2 pt-2">
            <button
              class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-cyan-500/80 hover:text-cyan-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:text-cyan-200"
            >
              <span class="icon text-base">login</span>
              Login
            </button>
            <button
              class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:translate-y-px hover:shadow-none"
            >
              <span class="icon text-base">person_add</span>
              Daftar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
