<script setup lang="ts">
import { DialogTitle, Primitive } from 'reka-ui'
import { drawerVariants } from '@auronui/styles/components/drawer'
import { composeClassName } from '../../utils/composeClassName'
import { useDrawerInject } from './drawer.context'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  class?: string
}>(), {
  as: 'h2',
  asChild: false,
})

const ctx = useDrawerInject()
const styles = drawerVariants()
</script>

<template>
  <!-- dock mode: no DialogRoot context, render a plain heading -->
  <Primitive
    v-if="ctx.dock.value"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(styles.heading(), props.class)"
  >
    <slot />
  </Primitive>

  <!-- default / inline / hideBackdrop modes: Reka provides accessible title -->
  <DialogTitle
    v-else
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(styles.heading(), props.class)"
  >
    <slot />
  </DialogTitle>
</template>
