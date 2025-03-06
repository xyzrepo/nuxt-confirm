<template>
  <UModal
    v-model:open="state.visible"
    :close="false"
    :dismissible="false"
    :ui="modalStyle"
  >
    <template #title>
      <div class="flex items-center gap-4">
        <UIcon
          :name="state.icon.name"
          :class="iconClasses"
          :size="state.icon.size"
        />
        {{ state.title }}
      </div>
    </template>

    <template #description>
      <div :class="descriptionClass">
        {{ state.message }}
      </div>
    </template>

    <template #footer>
      <UButton
        v-if="state.cancel"
        :label="state.cancel.label"
        :size="state.cancel.size"
        :color="state.cancel.color"
        :variant="state.cancel.variant"
        @click="onCancel"
      />
      <UButton
        :label="state.confirm.label"
        :size="state.confirm.size"
        :color="state.confirm.color"
        :variant="state.confirm.variant"
        @click="onConfirm"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { state, onConfirm, onCancel } = useConfirm({ version: 3 })

const iconClasses = computed(() => ({
  'text-error-500': state.value.type === 'danger',
  'text-warning-500': state.value.type === 'warning',
  'text-success-500': state.value.type === 'success',
  'text-info-500': state.value.type === 'info',
  'h-6 w-6': true,
}))
const contentClass = computed(() => [
  'min-h-fit',
  'rounded-lg',
  'divide-y divide-none',
  `text-${state.value.size}`,
  state.value.bgClass,
])
const descriptionClass = computed(() => [
  'pt-2 border-none',
  `text-${state.value.size}`,
])
const footerClass = computed(() => [
  'justify-end border-none',
  `text-${state.value.size}`,
])

const modalStyle = computed(() => ({
  content: contentClass.value,
  description: descriptionClass.value,
  footer: footerClass.value,
}))
</script>
