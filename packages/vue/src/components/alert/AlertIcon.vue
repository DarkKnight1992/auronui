<script setup lang="ts">
import { alertVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = defineProps<{
  class?: ClassValue
}>()

const styles = alertVariants()
</script>

<template>
  <span
    :class="composeClassName(styles.indicator(), props.class)"
    aria-hidden="true"
  >
    <slot />
  </span>
</template>
