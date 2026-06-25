<script lang="ts">
import { defineComponent, computed, h, toRef, ref } from 'vue'
import { DialogRoot } from 'reka-ui'
import { drawerVariants } from '@auronui/styles/components/drawer'
import { useDrawerProvide } from './drawer.context'
import type { DrawerPlacement, DrawerSize } from './drawer.context'

/**
 * Drawer root component. Wraps Reka UI's DialogRoot.
 *
 * Uses Options API / render-function style to avoid Vue SFC compiled template
 * from forwarding `open: undefined` to DialogRoot — same pattern as Modal.vue.
 * Reka's `useVModel` checks `props.open === undefined` to choose uncontrolled
 * vs controlled mode.
 *
 * When `dock=true` the component renders a flex container div and manages its
 * own open state without Reka, so the drawer panel shifts content in the DOM
 * rather than overlaying it.
 */
export default defineComponent({
  name: 'Drawer',
  props: {
    defaultOpen: { type: Boolean, default: false },
    open: { type: Boolean, default: undefined },
    modal: { type: Boolean, default: true },
    placement: {
      type: String as () => DrawerPlacement,
      default: 'right',
    },
    size: {
      type: String as () => DrawerSize,
      default: 'md',
    },
    inline: { type: Boolean, default: false },
    hideBackdrop: { type: Boolean, default: false },
    dock: { type: Boolean, default: false },
  },
  emits: ['update:open'],
  setup(props, { slots, emit }) {
    const styles = drawerVariants()

    // Dock mode: open state managed locally (no Reka dialog)
    const localPushOpen = ref(props.defaultOpen ?? false)
    const dockOpen = computed(() =>
      props.open !== undefined ? props.open : localPushOpen.value,
    )

    function toggleDock() {
      const next = !dockOpen.value
      if (props.open === undefined) localPushOpen.value = next
      emit('update:open', next)
    }

    function closeDock() {
      if (props.open === undefined) localPushOpen.value = false
      emit('update:open', false)
    }

    // Provide context to all Drawer sub-components
    useDrawerProvide({
      placement: toRef(props, 'placement'),
      size: toRef(props, 'size'),
      inline: toRef(props, 'inline'),
      hideBackdrop: toRef(props, 'hideBackdrop'),
      dock: toRef(props, 'dock'),
      dockOpen,
      toggleDock,
      closeDock,
    })

    const rootProps = computed(() => {
      const p: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        // inline and hideBackdrop both require non-modal: no scroll lock, no focus trap
        modal: props.inline || props.hideBackdrop ? false : props.modal,
        'onUpdate:open': (val: boolean) => emit('update:open', val),
      }
      // Only include `open` when explicitly controlled — omitting the key lets
      // Reka use `defaultOpen` for uncontrolled behavior.
      if (props.open !== undefined) {
        p.open = props.open
      }
      return p
    })

    return () => {
      // Dock mode: render a flex container that shifts content
      if (props.dock) {
        return h(
          'div',
          { class: styles.dockContainer({ placement: props.placement }) },
          slots.default?.(),
        )
      }
      return h(DialogRoot, rootProps.value, slots)
    }
  },
})
</script>
