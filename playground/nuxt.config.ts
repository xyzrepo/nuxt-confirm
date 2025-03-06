// Import defineNuxtConfig from nuxt/config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/ui'],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      confirm: {
        version: 2,
        autoImport: true,
        bgClass: 'bg-white dark:bg-black',
        size: 'xl',
      },
    },
  },
  compatibilityDate: '2025-03-05',
  // Prevent warnings from causing build failures
  typescript: {
    typeCheck: true,
    strict: true,
    shim: false, // Ignore type errors during build
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['defu'],
      },
    },
    // Ignore warnings in Vite
    logLevel: 'error',
    optimizeDeps: {
      include: ['ohash'],
    },
  },
  nitro: {
    // Configure Nitro options
    externals: {
      inline: ['ohash'],
    },
    // Prevent warnings from causing build failures
    typescript: {
      generateTsConfig: true,
    },
    // Set this option in the root of nitro config
    logLevel: 'error', // This will prevent warnings from causing build failures
  },
  build: {
    // Prevent warnings from causing build failures
    transpile: ['ohash'],
  },
})
