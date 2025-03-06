import { defu } from 'defu'
import { h, createApp } from 'vue'
import ConfirmDialogV2 from './components/ConfirmDialogV2.vue'
import ConfirmDialogV3 from './components/ConfirmDialogV3.vue'
import { defineNuxtPlugin } from '#app'
// import { useConfirm } from './composables/useConfirm'
// const { confirm, state, onConfirm, onCancel } = useConfirm()
export default defineNuxtPlugin((nuxtApp) => {
  // Initialize the confirm composable with global options
  // const confirmService = useConfirm(nuxtApp.$config.public.confirm)

  const options = defu(nuxtApp.$config.public.confirm || {}, {
    // default applied at plugin level
    autoImport: true,
    version: 2,
  })

  // Auto inject the confirm dialog if autoImport is true
  if (options.autoImport) {
    // Only run on client-side
    if (import.meta.client) {
      const mountPoint = document.createElement('div')
      mountPoint.id = 'confirm-dialog'
      document.body.appendChild(mountPoint)

      // Create and mount the component instance
      createApp({
        render() {
          if (options.version === 2) {
            return h(ConfirmDialogV2)
          }
          else {
            return h(ConfirmDialogV3)
          }
        },
      }).mount(mountPoint)
    }
  }

  // Make options and confirm service available globally
  nuxtApp.provide('confirmOptions', options)
  // nuxtApp.provide('useConfirm', { confirm, state, onConfirm, onCancel })
})
