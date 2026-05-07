<script setup lang="ts">
import { alertDialogVariants } from '@auronui/styles/components/alert-dialog'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  class?: string
}>(), {})

const styles = alertDialogVariants()
</script>

<template>
  <div :class="composeClassName(styles.footer(), props.class)">
    <slot />
  </div>
</template>
