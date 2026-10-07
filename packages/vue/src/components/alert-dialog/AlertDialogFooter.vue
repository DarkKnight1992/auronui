<script setup lang="ts">
import { alertDialogVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  class?: ClassValue
}>(), {})

const styles = alertDialogVariants()
</script>

<template>
  <div :class="composeClassName(styles.footer(), props.class)">
    <slot />
  </div>
</template>
