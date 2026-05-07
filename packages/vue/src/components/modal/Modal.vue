<script lang="ts">
import { defineComponent, computed, h } from 'vue'
import { DialogRoot } from 'reka-ui'
import { createContext } from '../../utils/context'

export interface ModalContext {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'full'
  scroll: 'inside' | 'outside'
  variant: 'opaque' | 'blur' | 'transparent'
  placement: 'auto' | 'top' | 'center' | 'bottom'
}

export const { useProvide: useModalProvide, useInject: useModalInject } =
  createContext<ModalContext>('Modal')

export default defineComponent({
  name: 'Modal',
  props: {
    defaultOpen: { type: Boolean, default: false },
    open: { type: Boolean, default: undefined },
    modal: { type: Boolean, default: true },
    size: {
      type: String as () => 'xs' | 'sm' | 'md' | 'lg' | 'full',
      default: 'md',
    },
    scroll: {
      type: String as () => 'inside' | 'outside',
      default: 'inside',
    },
    variant: {
      type: String as () => 'opaque' | 'blur' | 'transparent',
      default: 'opaque',
    },
    placement: {
      type: String as () => 'auto' | 'top' | 'center' | 'bottom',
      default: 'auto',
    },
  },
  emits: ['update:open'],
  setup(props, { slots, emit }) {
    useModalProvide({
      get size() { return props.size },
      get scroll() { return props.scroll },
      get variant() { return props.variant },
      get placement() { return props.placement },
    })

    const rootProps = computed(() => {
      const p: Record<string, unknown> = {
        defaultOpen: props.defaultOpen,
        modal: props.modal,
        'onUpdate:open': (val: boolean) => emit('update:open', val),
      }
      if (props.open !== undefined) {
        p.open = props.open
      }
      return p
    })

    return () => h(DialogRoot, rootProps.value, slots)
  },
})
</script>
