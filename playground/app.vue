<template>
  <UContainer>
    <div class="p-8 space-y-6">
      <UCard class="bg-white dark:bg-black">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">
              Confirm Dialog Playground
            </h2>
            <UBadge color="primary">
              Testing
            </UBadge>
            <UButtonGroup>
              <UButton
                color="black"
                icon="i-heroicons-sun"
                @click="colorMode.preference = 'light'"
              />
              <UButton
                color="black"
                icon="i-heroicons-moon"
                @click="colorMode.preference = 'dark'"
              />
              <UButton
                color="black"
                icon="i-heroicons-computer-desktop"
                @click="colorMode.preference = 'system'"
              />
            </UButtonGroup>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-gray-500 dark:text-gray-400">
            This playground is for testing the confirm dialog functionality.
          </p>

          <div class="flex gap-2">
            <UButton
              color="red"
              icon="i-heroicons-bell-alert"
              @click="openDangerDialog"
            >
              Open Danger
            </UButton>

            <UButton
              color="yellow"
              icon="i-heroicons-bell-alert"
              @click="openWarningDialog"
            >
              Open Warning
            </UButton>

            <UButton
              color="green"
              icon="i-heroicons-bell-alert"
              @click="openSuccessDialog"
            >
              Open Success
            </UButton>

            <UButton
              color="blue"
              icon="i-heroicons-bell-alert"
              @click="openInfoDialog"
            >
              Open Info
            </UButton>

            <UButton
              color="black"
              icon="i-heroicons-bell-alert"
              @click="openDefaultDialog"
            >
              Open Default
            </UButton>
          </div>

          <UDivider />

          <div
            v-if="result !== null"
            class="p-4 rounded-lg"
            :class="
              result
                ? 'bg-green-50 dark:bg-green-950'
                : 'bg-red-50 dark:bg-red-950'
            "
          >
            <p class="flex items-center gap-2">
              <UIcon
                :name="
                  result ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'
                "
                :class="result ? 'text-green-500' : 'text-red-500'"
              />
              <span>Dialog was {{ result ? "confirmed" : "cancelled" }}</span>
            </p>
          </div>
        </div>

        <template #footer>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Click the button above to test the confirm dialog component.
          </p>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useColorMode, useConfirm } from '#imports'

const colorMode = useColorMode()
const { confirm } = useConfirm()
const result = ref<boolean | null>(null)
const openDangerDialog = async () => {
  const confirmed = await confirm({
    title: 'Danger!! Are you sure?',
    message: 'Are you sure you want to do this?',
    confirm: 'Yes, I am sure',
    cancel: 'No, cancel',
    type: 'danger',
    size: 'xs',
  })
  result.value = confirmed
}

const openWarningDialog = async () => {
  const confirmed = await confirm({
    title: 'Warning!! Are you sure?',
    message: 'Are you sure you want to do this?',
    confirm: 'Yes, I am sure',
    cancel: 'No, cancel',
    type: 'warning',
  })
  result.value = confirmed
}

const openSuccessDialog = async () => {
  const confirmed = await confirm({
    title: 'Success!! Are you sure?',
    message: 'Are you sure you want to do this?',
    confirm: 'Yes, I am sure',
    cancel: 'No, cancel',
    type: 'success',
  })
  result.value = confirmed
}

const openInfoDialog = async () => {
  const confirmed = await confirm({
    title: 'Info!! Are you sure?',
    message: 'Are you sure you want to do this?',
    confirm: 'Yes, I am sure',
    cancel: 'No, cancel',
    type: 'info',
  })
  result.value = confirmed
}

// defaul
const openDefaultDialog = async () => {
  const confirmed = await confirm({
    title: 'Default!! Are you sure?',
    message: 'Are you sure you want to do this?',
  })
  result.value = confirmed
}
</script>
