<script setup lang="ts">
import { modalVariants } from '@auronui/styles/components/modal'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  class?: string
}>(), {})

const styles = modalVariants()
</script>

<template>
  <div :class="composeClassName(styles.footer(), props.class)">
    <slot />
  </div>
</template>
