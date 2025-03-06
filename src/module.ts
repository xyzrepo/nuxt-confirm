import { fileURLToPath } from 'node:url'
import { defineNuxtModule, addPlugin, createResolver, addComponent } from '@nuxt/kit'
import { defu } from 'defu'

export interface ModuleOptions {
  /**
   * Default options for the confirm dialog
   */
  type?: 'info' | 'warning' | 'danger' | 'success'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  bgClass?: string
  /**
   * Auto-import the composable
   * @default true
   */
  autoImport?: boolean
  /**
   * Version of the confirm dialog
   * @default 2
   */
  version?: 2 | 3
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-confirm',
    configKey: 'confirm',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    version: 2,
    autoImport: true,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.runtimeConfig.public.confirm = defu(
      nuxt.options.runtimeConfig.public.confirm || {},
      {
        ...options,
      },
    )

    // Add composable
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'))
    })

    // Add plugin to inject default options
    addPlugin({
      src: resolve(runtimeDir, 'plugin'),
    })

    if (!options.version) {
      // throw an error
      throw new Error('[Nuxt-Confirm]: version is required in the module options')
    }
    // Add the ConfirmDialog component
    addComponent({
      name: `ConfirmDialogV${options.version}`,
      export: `ConfirmDialogV${options.version}`,
      filePath: resolve(runtimeDir, `components/ConfirmDialogV${options.version}.vue`),
    })
    // if (options.version) {
    //   // Add the ConfirmDialogV2 component
    //   addComponent({
    //     name: 'ConfirmDialog',
    //     filePath: resolve(runtimeDir, 'components/ConfirmDialogV2.vue')
    //   })
    // } else {
    //   // Add the ConfirmDialogV3 component
    //   addComponent({
    //     name: 'ConfirmDialog',
    //     filePath: resolve(runtimeDir, 'components/ConfirmDialogV3.vue')
    //   })
    // }

    // Add types
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: 'nuxt-confirm' })
    })
  },
})
