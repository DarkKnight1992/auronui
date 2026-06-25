<script setup lang="ts">
import { computed } from 'vue'
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

const isHorizontal = computed(() =>
  ctx.placement.value === 'left' || ctx.placement.value === 'right',
)
const dockTransitionName = computed(() =>
  isHorizontal.value ? 'drawer-dock-h' : 'drawer-dock-v',
)

function handlePointerDownOutside(event: Event) {
  if (ctx.hideBackdrop.value) {
    // Prevent close — user must use the close icon
    event.preventDefault()
    return
  }
  emit('pointer-down-outside', event)
}

function handleInteractOutside(event: Event) {
  if (ctx.hideBackdrop.value) {
    // Prevent close — user must use the close icon
    event.preventDefault()
    return
  }
  emit('interact-outside', event)
}

function handleEscapeKeyDown(event: KeyboardEvent) {
  if (ctx.hideBackdrop.value) {
    // Prevent close — user must use the close icon
    event.preventDefault()
    return
  }
  emit('escape-key-down', event)
}
</script>

<template>
  <!--
    dock mode: DOM-flow panel that pushes adjacent content aside.
    The parent Drawer renders a flex container; this panel is a flex item.
    Requires DrawerMain to wrap the main content area.
  -->
  <template v-if="ctx.dock.value">
    <Transition :name="dockTransitionName">
      <div
        v-show="ctx.dockOpen.value"
        :class="composeClassName(styles.dialog({ placement: ctx.placement.value, dock: true }), props.class)"
        :data-placement="ctx.placement.value"
        :data-state="ctx.dockOpen.value ? 'open' : 'closed'"
      >
        <slot />
      </div>
    </Transition>
  </template>

  <!--
    inline mode: renders position:absolute within the nearest positioned container.
    The parent element must have position:relative and overflow:hidden.
  -->
  <template v-else-if="ctx.inline.value">
    <DialogContent
      :class="composeClassName(styles.dialog({ placement: ctx.placement.value, inline: true }), props.class)"
      :data-placement="ctx.placement.value"
      @pointer-down-outside="handlePointerDownOutside"
      @interact-outside="handleInteractOutside"
      @escape-key-down="handleEscapeKeyDown"
      @open-auto-focus="emit('open-auto-focus', $event)"
      @close-auto-focus="emit('close-auto-focus', $event)"
    >
      <slot />
    </DialogContent>
  </template>

  <!-- default mode: teleported to <body>, optional backdrop -->
  <DialogPortal v-else>
    <DrawerOverlay v-if="!ctx.hideBackdrop.value" />
    <DialogContent
      :class="composeClassName(styles.dialog({ placement: ctx.placement.value }), props.class)"
      :data-placement="ctx.placement.value"
      @pointer-down-outside="handlePointerDownOutside"
      @interact-outside="handleInteractOutside"
      @escape-key-down="handleEscapeKeyDown"
      @open-auto-focus="emit('open-auto-focus', $event)"
      @close-auto-focus="emit('close-auto-focus', $event)"
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
