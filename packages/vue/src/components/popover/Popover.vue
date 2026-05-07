<script lang="ts">
import { defineComponent, computed, h } from 'vue'
import { PopoverRoot } from 'reka-ui'

/**
 * Popover root component. Wraps Reka UI's PopoverRoot.
 *
 * Important: we use the Options-API / render-function style here (not `<script setup>`)
 * to avoid Vue SFC's compiled template from forwarding `open: undefined` to PopoverRoot.
 * Reka's `useVModel` checks `props.open === undefined` to choose uncontrolled vs controlled
 * mode, but a template `:open="props.open"` always provides the key (even as `undefined`),
 * forcing controlled mode and breaking `defaultOpen`. The render function lets us omit the
 * key entirely when `open` is not provided by the consumer.
 */
export default defineComponent({
  name: 'Popover',
  props: {
    defaultOpen: { type: Boolean, default: false },
    open: { type: Boolean, default: undefined },
    modal: { type: Boolean, default: false },
  },
  emits: ['update:open'],
  setup(props, { slots, emit }) {
    const rootProps = computed(() => {
      const p: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        modal: props.modal,
        'onUpdate:open': (val: boolean) => emit('update:open', val),
      }
      // Only include `open` when explicitly controlled — omitting the key lets
      // Reka use `defaultOpen` for uncontrolled (toggle) behavior.
      if (props.open !== undefined) {
        p.open = props.open
      }
      return p
    })

    return () => h(PopoverRoot, rootProps.value, slots)
  },
})
</script>
