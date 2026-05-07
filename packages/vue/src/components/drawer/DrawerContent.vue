<script setup lang="ts">
import { DialogPortal, DialogContent } from 'reka-ui'
import { drawerVariants } from '@auronui/styles/components/drawer'
import { composeClassName } from '../../utils/composeClassName'
import { useDrawerInject } from './drawer.context'
import DrawerOverlay from './DrawerOverlay.vue'

const props = withDefaults(defineProps<{
  class?: string
}>(), {})

const emit = defineEmits<{
  'escape-key-down': [event: KeyboardEvent]
  'pointer-down-outside': [event: Event]
  'interact-outside': [event: Event]
  'open-auto-focus': [event: Event]
  'close-auto-focus': [event: Event]
}>()

const ctx = useDrawerInject()
const styles = drawerVariants()
</script>

<template>
  <DialogPortal>
    <DrawerOverlay />
    <DialogContent
      :class="composeClassName(styles.dialog({ placement: ctx.placement.value }), props.class)"
      :data-placement="ctx.placement.value"
      @escape-key-down="emit('escape-key-down', $event)"
      @pointer-down-outside="emit('pointer-down-outside', $event)"
      @interact-outside="emit('interact-outside', $event)"
      @open-auto-focus="emit('open-auto-focus', $event)"
      @close-auto-focus="emit('close-auto-focus', $event)"
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
