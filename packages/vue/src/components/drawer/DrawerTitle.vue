<script setup lang="ts">
import { DialogTitle } from 'reka-ui'
import { drawerVariants } from '@auronui/styles/components/drawer'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string
  class?: string
}>(), {
  as: 'h2',
})

const styles = drawerVariants()
</script>

<template>
  <DialogTitle
    :as="props.as"
    :class="composeClassName(styles.heading(), props.class)"
  >
    <slot />
  </DialogTitle>
</template>
