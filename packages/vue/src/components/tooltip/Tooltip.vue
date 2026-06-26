<script lang="ts">
import { defineComponent, computed, h } from 'vue'
import { TooltipRoot } from 'reka-ui'

/**
 * Tooltip root component. Wraps Reka UI's TooltipRoot.
 *
 * Uses Options API / render-function style to avoid Vue SFC compiled template
 * from forwarding `open: undefined` to TooltipRoot — same pattern as Popover.vue.
 * Reka's `useVModel` checks `props.open === undefined` to choose uncontrolled
 * vs controlled mode.
 */
export default defineComponent({
  name: 'Tooltip',
  props: {
    defaultOpen: { type: Boolean, default: false },
    open: { type: Boolean, default: undefined },
    delayDuration: { type: Number, default: undefined },
    disableHoverableContent: { type: Boolean, default: undefined },
    disableClosingTrigger: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: undefined },
    ignoreNonKeyboardFocus: { type: Boolean, default: undefined },
  },
  emits: ['update:open'],
  setup(props, { slots, emit }) {
    const rootProps = computed(() => {
      const p: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        'onUpdate:open': (val: boolean) => emit('update:open', val),
      }
      if (props.open !== undefined) {
        p.open = props.open
      }
      if (props.delayDuration !== undefined) {
        p.delayDuration = props.delayDuration
      }
      if (props.disableHoverableContent !== undefined) {
        p.disableHoverableContent = props.disableHoverableContent
      }
      if (props.disableClosingTrigger !== undefined) {
        p.disableClosingTrigger = props.disableClosingTrigger
      }
      if (props.disabled !== undefined) {
        p.disabled = props.disabled
      }
      if (props.ignoreNonKeyboardFocus !== undefined) {
        p.ignoreNonKeyboardFocus = props.ignoreNonKeyboardFocus
      }
      return p
    })

    return () => h(TooltipRoot, rootProps.value, slots)
  },
})
</script>
