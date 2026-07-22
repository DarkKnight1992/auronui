<script setup lang="ts">
import { computed } from 'vue'
import { DialogPortal, DialogContent, injectDialogRootContext } from 'reka-ui'
import { drawerVariants } from '@auronui/styles/components/drawer'
import { composeClassName } from '../../utils/composeClassName'
import { useOverlayLayer } from '../../composables/useOverlayLayer'
import { useDrawerInject } from './drawer.context'
import DrawerOverlay from './DrawerOverlay.vue'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  forceMount?: boolean
  disableOutsidePointerEvents?: boolean
  to?: string | HTMLElement
  disabled?: boolean
  defer?: boolean
  class?: string
}>(), {
  asChild: false,
  forceMount: false,
  disableOutsidePointerEvents: false,
  disabled: false,
  defer: false,
})

const emit = defineEmits<{
  'escape-key-down': [event: KeyboardEvent]
  'pointer-down-outside': [event: Event]
  'interact-outside': [event: Event]
  'open-auto-focus': [event: Event]
  'close-auto-focus': [event: Event]
  'focus-outside': [event: Event]
}>()

const ctx = useDrawerInject()
const styles = drawerVariants()

// Only the default (teleported, full-overlay) mode shares the global
// backdrop/panel stacking concern with Modal/AlertDialog — dock and inline
// modes render in normal document flow / a local positioned ancestor, not a
// page-level overlay, so they don't need a claimed z-index.
const dialogRootContext = injectDialogRootContext()
const { panelZIndex } = useOverlayLayer(dialogRootContext, dialogRootContext.open)

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
      :as="props.as"
      :as-child="props.asChild"
      :force-mount="props.forceMount"
      :disable-outside-pointer-events="props.disableOutsidePointerEvents"
      :class="composeClassName(styles.dialog({ placement: ctx.placement.value, inline: true }), props.class)"
      :data-placement="ctx.placement.value"
      @pointer-down-outside="handlePointerDownOutside"
      @interact-outside="handleInteractOutside"
      @escape-key-down="handleEscapeKeyDown"
      @open-auto-focus="emit('open-auto-focus', $event)"
      @close-auto-focus="emit('close-auto-focus', $event)"
      @focus-outside="emit('focus-outside', $event)"
    >
      <slot />
    </DialogContent>
  </template>

  <!-- default mode: teleported to <body>, optional backdrop -->
  <DialogPortal
    v-else
    :to="props.to"
    :disabled="props.disabled"
    :defer="props.defer"
    :force-mount="props.forceMount"
  >
    <DrawerOverlay v-if="!ctx.hideBackdrop.value" />
    <DialogContent
      :as="props.as"
      :as-child="props.asChild"
      :force-mount="props.forceMount"
      :disable-outside-pointer-events="props.disableOutsidePointerEvents"
      :class="composeClassName(styles.dialog({ placement: ctx.placement.value }), props.class)"
      :style="{ '--z-modal': panelZIndex }"
      :data-placement="ctx.placement.value"
      @pointer-down-outside="handlePointerDownOutside"
      @interact-outside="handleInteractOutside"
      @escape-key-down="handleEscapeKeyDown"
      @open-auto-focus="emit('open-auto-focus', $event)"
      @close-auto-focus="emit('close-auto-focus', $event)"
      @focus-outside="emit('focus-outside', $event)"
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
