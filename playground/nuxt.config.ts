// Import defineNuxtConfig from nuxt/config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/ui'],
  devtools: { enabled: true },
  compatibilityDate: '2025-03-05',
  // // Prevent warnings from causing build failures
  // vite: {
  //   build: {
  //     rollupOptions: {
  //       external: ['defu'],
  //     },
  //   },
  //   // Ignore warnings in Vite
  //   logLevel: 'error',
  //   optimizeDeps: {
  //     include: ['defu'],
  //   },
  // },
})
