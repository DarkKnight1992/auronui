<script setup lang="ts">
import { alertVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = defineProps<{
  class?: string
}>()

const styles = alertVariants()
</script>

<template>
  <div :class="composeClassName(styles.title(), props.class)">
    <slot />
  </div>
</template>
