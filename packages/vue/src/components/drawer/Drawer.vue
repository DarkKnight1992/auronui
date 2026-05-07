<script lang="ts">
import { defineComponent, computed, h, toRef } from 'vue'
import { DialogRoot } from 'reka-ui'
import { useDrawerProvide } from './drawer.context'
import type { DrawerPlacement, DrawerSize } from './drawer.context'

/**
 * Drawer root component. Wraps Reka UI's DialogRoot.
 *
 * Uses Options API / render-function style to avoid Vue SFC compiled template
 * from forwarding `open: undefined` to DialogRoot — same pattern as Modal.vue.
 * Reka's `useVModel` checks `props.open === undefined` to choose uncontrolled
 * vs controlled mode.
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
  },
  emits: ['update:open'],
  setup(props, { slots, emit }) {
    // Provide context to all Drawer sub-components
    useDrawerProvide({
      placement: toRef(props, 'placement'),
      size: toRef(props, 'size'),
    })

    const rootProps = computed(() => {
      const p: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        modal: props.modal,
        'onUpdate:open': (val: boolean) => emit('update:open', val),
      }
      // Only include `open` when explicitly controlled — omitting the key lets
      // Reka use `defaultOpen` for uncontrolled behavior.
      if (props.open !== undefined) {
        p.open = props.open
      }
      return p
    })

    return () => h(DialogRoot, rootProps.value, slots)
  },
})
</script>
