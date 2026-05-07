<script setup lang="ts">
import { DialogOverlay } from 'reka-ui'
import { modalVariants } from '@auronui/styles/components/modal'
import { composeClassName } from '../../utils/composeClassName'
import { useModalInject } from './Modal.vue'

const props = withDefaults(defineProps<{
  class?: string
}>(), {})

const ctx = useModalInject({ size: 'md', scroll: 'inside', variant: 'opaque', placement: 'auto' })
const styles = modalVariants()
</script>

<template>
  <DialogOverlay :class="composeClassName(styles.backdrop({ variant: ctx.variant }), props.class)" />
</template>
