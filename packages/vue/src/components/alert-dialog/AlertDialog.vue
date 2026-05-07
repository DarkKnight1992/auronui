<script lang="ts">
import { defineComponent, computed, h } from 'vue'
import { AlertDialogRoot } from 'reka-ui'
import { createContext } from '../../utils/context'

export interface AlertDialogContext {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'cover'
  variant: 'opaque' | 'blur' | 'transparent'
  placement: 'auto' | 'top' | 'center' | 'bottom'
  status: 'default' | 'accent' | 'danger' | 'success' | 'warning'
}

export const { useProvide: useAlertDialogProvide, useInject: useAlertDialogInject } =
  createContext<AlertDialogContext>('AlertDialog')

export default defineComponent({
  name: 'AlertDialog',
  props: {
    defaultOpen: { type: Boolean, default: false },
    open: { type: Boolean, default: undefined },
    size: {
      type: String as () => 'xs' | 'sm' | 'md' | 'lg' | 'cover',
      default: 'md',
    },
    variant: {
      type: String as () => 'opaque' | 'blur' | 'transparent',
      default: 'opaque',
    },
    placement: {
      type: String as () => 'auto' | 'top' | 'center' | 'bottom',
      default: 'center',
    },
    status: {
      type: String as () => 'default' | 'accent' | 'danger' | 'success' | 'warning',
      default: 'danger',
    },
  },
  emits: ['update:open'],
  setup(props, { slots, emit }) {
    useAlertDialogProvide({
      get size() { return props.size },
      get variant() { return props.variant },
      get placement() { return props.placement },
      get status() { return props.status },
    })

    const rootProps = computed(() => {
      const p: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        'onUpdate:open': (val: boolean) => emit('update:open', val),
      }
      if (props.open !== undefined) {
        p.open = props.open
      }
      return p
    })

    return () => h(AlertDialogRoot, rootProps.value, slots)
  },
})
</script>
