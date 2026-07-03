<script setup lang="ts">
import type { ClassValue } from '../../utils/composeClassName'

defineProps<{
  hasHelper: boolean
  showError: boolean
  showDescription: boolean
  errorMessage?: string
  description?: string
  errorMessageId: string
  descriptionId: string
  wrapperClass?: ClassValue
  errorClass?: ClassValue
  descriptionClass?: ClassValue
  /**
   * Optional `role` for the error message element (e.g. `"alert"` so
   * assistive tech announces it as a live region). Omitted by default to
   * match components that don't set one.
   */
  errorRole?: string
}>()
</script>

<template>
  <div
    v-if="hasHelper"
    :class="wrapperClass"
  >
    <div
      v-if="showError"
      :id="errorMessageId"
      :class="errorClass"
      :role="errorRole"
    >
      {{ errorMessage }}
    </div>
    <div
      v-else-if="showDescription"
      :id="descriptionId"
      :class="descriptionClass"
    >
      {{ description }}
    </div>
  </div>
</template>
