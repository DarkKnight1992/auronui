<script setup lang="ts">
import { ToastDescription as RekaToastDescription } from 'reka-ui'
import { toastVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = defineProps<{ class?: string }>()
const styles = toastVariants()
</script>

<template>
  <RekaToastDescription :class="composeClassName(styles.description(), props.class)">
    <slot />
  </RekaToastDescription>
</template>
