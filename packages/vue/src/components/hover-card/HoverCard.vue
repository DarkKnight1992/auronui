<script lang="ts">
import { defineComponent, computed, h } from 'vue'
import { HoverCardRoot } from 'reka-ui'

/**
 * HoverCard root component. Wraps Reka UI's HoverCardRoot.
 *
 * Important: we use the Options-API / render-function style here (not `<script setup>`)
 * to avoid Vue SFC's compiled template from forwarding `open: undefined` to HoverCardRoot.
 * Reka's `useVModel` checks `props.open === undefined` to choose uncontrolled vs controlled
 * mode, but a template `:open="props.open"` always provides the key (even as `undefined`),
 * forcing controlled mode and breaking `defaultOpen`. The render function lets us omit the
 * key entirely when `open` is not provided by the consumer. This mirrors Popover.vue.
 */
export default defineComponent({
  name: 'HoverCard',
  props: {
    defaultOpen: { type: Boolean, default: false },
    open: { type: Boolean, default: undefined },
    openDelay: { type: Number, default: 700 },
    closeDelay: { type: Number, default: 300 },
  },
  emits: ['update:open'],
  setup(props, { slots, emit }) {
    const rootProps = computed(() => {
      const p: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        openDelay: props.openDelay,
        closeDelay: props.closeDelay,
        'onUpdate:open': (val: boolean) => emit('update:open', val),
      }
      if (props.open !== undefined) {
        p.open = props.open
      }
      return p
    })

    return () => h(HoverCardRoot, rootProps.value, slots)
  },
})
</script>
