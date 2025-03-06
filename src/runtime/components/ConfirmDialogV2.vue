<template>
  <UModal
    v-model="state.visible"
    :prevent-close="true"
  >
    <UBadge :color="state.confirm.color">
      v2
    </UBadge>
    <div
      :class="[
        'p-4 space-y-4',
        `rounded-${state.size}`,
        `shadow-${state.size}`,
        state.bgClass,
      ]"
    >
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <UIcon
            v-if="state.icon?.name"
            :name="state.icon.name || ''"
            :class="[`text-${state.icon.color}-500`, `h-6 w-6`]"
          />
          <h3 :class="['font-semibold', `text-${state.size}`]">
            {{ state.title }}
          </h3>
        </div>
      </div>

      <p class="text-black dark:text-white">
        {{ state.message }}
      </p>

      <div class="flex justify-end gap-3 pt-2">
        <UButton
          v-if="state.cancel"
          :label="state.cancel.label"
          :color="state.cancel.color"
          :size="state.cancel.size"
          :variant="state.cancel.variant"
          @click="onCancel"
        />
        <UButton
          :label="state.confirm.label"
          :color="state.confirm.color"
          :size="state.confirm.size"
          :variant="state.confirm.variant"
          @click="onConfirm"
        />
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
const { $confirmOptions } = useNuxtApp()
const { state, onConfirm, onCancel } = useConfirm($confirmOptions as ConfirmOptions)
</script>
