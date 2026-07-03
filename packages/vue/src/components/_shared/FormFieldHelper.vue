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
