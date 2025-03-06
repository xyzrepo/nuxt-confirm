# Nuxt Confirm

A customizable confirmation dialog for Nuxt 3 applications.

## Features

- 🎨 Fully customizable UI with Nuxt UI integration
- 🔄 Promise-based API for easy use in async functions
- 🎭 Multiple preset styles (info, warning, danger, success)
- 🔄 Seamless compatibility with both Nuxt UI v2 and v3
- 🌙 Dark mode support
- 🧩 TypeScript support


## Quick Setup

Install the module to your Nuxt application with one command:

```bash
# npx
npx nuxi module add @xyz/nuxt-confirm

# npm
npm install @xyz/nuxt-confirm 

# yarn
yarn add @xyz/nuxt-confirm

# pnpm
pnpm add @xyz/nuxt-confirm

# bun
bun add @xyz/nuxt-confirm
```


## Setup

Add `@xyz/nuxt-confirm` to the `modules` section of your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@xyz/nuxt-confirm'],
  confirm: {
    // Module options
    version: 2, // 2 or 3 depending on your Nuxt UI version
    type: 'danger', // default type for confirmations
    size: 'md', // default size
    autoImport: true, // auto import the composable
    bgClass: 'bg-white dark:bg-black', // background class for the dialog
  }
})
```


## Usage

### Basic Usage


```vue
<template>
  <div>
    <UButton @click="confirmDelete">Delete Item</UButton>
  </div>
</template>

<script setup>
const { confirm } = useConfirm();
const confirmDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?',
      confirm: 'Yes, Delete',
      cancel: 'No, Cancel',
      type: 'danger'
    })

    // User confirmed the action
    if (confirmed) {
      console.log('Item deleted')
    }
    else {
      console.log('Deletion cancelled')
    }
}
</script>
```

### Advanced Usage

```vue
<template>
  <div>
  <UButton @click="confirmAction">Perform Action</UButton>
  </div>
</template>
<script setup>
const { confirm } = useConfirm();
const confirmAction = async () => {
  const confirmed = await confirm({
    title: 'Confirm Action',
    message: 'Are you sure you want to perform this action?',
    type: 'info',
    icon: {
      name: 'i-heroicons-question-mark-circle',
      color: 'blue',
      size: 'md'
    },
    confirm: {
      label: 'Yes, Continue',
      color: 'blue',
      size: 'md',
      variant: 'solid'
    },
    cancel: {
      label: 'Cancel',
      color: 'gray',
      size: 'md',
      variant: 'outline'
    },
  })
  // Action confirmed
  if (confirmed) {
    console.log('Action confirmed')
  }
  else {
    console.log('Action cancelled')
  }
}
</script>
```


## Configuration

### Module Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `version` | `2 \| 3` | `3` | The Nuxt UI version to use |
| `type` | `'info' \| 'warning' \| 'danger' \| 'success'` | `'danger'` | Default type for confirmations |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Default size for the dialog |
| `bgClass` | `string` | `'bg-white dark:bg-black'` | Additional background classes |
| `autoImport` | `boolean` | `true` | Whether to auto-import the composable |

### Dialog Options

| Option | Type | Description |
|--------|------|-------------|
| `type` | `'info' \| 'warning' \| 'danger' \| 'success'` | Dialog type | applies default styles to the dialog |
| `title` | `string` | Dialog title |
| `message` | `string` | Dialog message |
| `icon` | `{ name: string, color: string, size?: string }` | Icon configuration |
| `confirm` | `{ label: string, color: string, size?: string, variant?: string }` | Confirm button configuration |
| `cancel` | `{ label: string, color: string, size?: string, variant?: string } \| false` | Cancel button configuration (set to false to hide) |


That's it! You can now use My Module in your Nuxt app ✨

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/my-module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/my-module

[npm-downloads-src]: https://img.shields.io/npm/dm/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/my-module

[license-src]: https://img.shields.io/npm/l/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/my-module

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
