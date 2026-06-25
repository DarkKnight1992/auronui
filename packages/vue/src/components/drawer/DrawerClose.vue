<script setup lang="ts">
import { DialogClose, Primitive } from 'reka-ui'
import { drawerVariants } from '@auronui/styles/components/drawer'
import { composeClassName } from '../../utils/composeClassName'
import { useDrawerInject } from './drawer.context'

const props = withDefaults(defineProps<{
  asChild?: boolean
  class?: string
}>(), {
  asChild: false,
})

const ctx = useDrawerInject()
const styles = drawerVariants()
</script>

<template>
  <!-- dock mode: close open state directly (no Reka dialog context) -->
  <Primitive
    v-if="ctx.dock.value"
    :as-child="props.asChild"
    as="button"
    :class="composeClassName(styles.closeTrigger(), props.class)"
    @click="ctx.closeDock()"
  >
    <slot />
  </Primitive>

  <!-- default / inline / hideBackdrop modes: Reka manages close -->
  <DialogClose
    v-else
    :as-child="props.asChild"
    :class="composeClassName(styles.closeTrigger(), props.class)"
  >
    <slot />
  </DialogClose>
</template>
