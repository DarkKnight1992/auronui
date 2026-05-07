<script setup lang="ts">
import { AlertDialogOverlay } from 'reka-ui'
import { alertDialogVariants } from '@auronui/styles/components/alert-dialog'
import { composeClassName } from '../../utils/composeClassName'
import { useAlertDialogInject } from './AlertDialog.vue'

const props = withDefaults(defineProps<{
  class?: string
}>(), {})

const ctx = useAlertDialogInject({ size: 'md', variant: 'opaque', placement: 'center', status: 'danger' })
const styles = alertDialogVariants()
</script>

<template>
  <AlertDialogOverlay :class="composeClassName(styles.backdrop({ variant: ctx.variant }), props.class)" />
</template>
