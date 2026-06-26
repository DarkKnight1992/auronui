<script setup lang="ts">
import { DialogTrigger, Primitive } from 'reka-ui'
import { useDrawerInject } from './drawer.context'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
}>(), {
  asChild: false,
})

const ctx = useDrawerInject()
</script>

<template>
  <!-- dock mode: toggle open state directly (no Reka dialog context) -->
  <Primitive
    v-if="ctx.dock.value"
    :as-child="props.asChild"
    :as="props.as ?? 'button'"
    @click="ctx.toggleDock()"
  >
    <slot />
  </Primitive>

  <!-- default / inline / hideBackdrop modes: Reka manages open state -->
  <DialogTrigger v-else :as="props.as" :as-child="props.asChild">
    <slot />
  </DialogTrigger>
</template>
