<script setup lang="ts">
import { modalVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  class?: ClassValue
}>(), {})

const styles = modalVariants()
</script>

<template>
  <div :class="composeClassName(styles.header(), props.class)">
    <slot />
  </div>
</template>
