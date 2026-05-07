<script setup lang="ts">
import { ToastTitle as RekaToastTitle } from 'reka-ui'
import { toastVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = defineProps<{ class?: string }>()
const styles = toastVariants()
</script>

<template>
  <RekaToastTitle :class="composeClassName(styles.title(), props.class)">
    <slot />
  </RekaToastTitle>
</template>
