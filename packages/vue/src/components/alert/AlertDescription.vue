<script setup lang="ts">
import { alertVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = defineProps<{
  class?: ClassValue
}>()

const styles = alertVariants()
</script>

<template>
  <div :class="composeClassName(styles.description(), props.class)">
    <slot />
  </div>
</template>
