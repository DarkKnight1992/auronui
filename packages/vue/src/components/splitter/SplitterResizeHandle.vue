<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref } from 'vue'
import { SplitterResizeHandle } from 'reka-ui'
import { splitterVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { splitterContextKey } from './Splitter.context'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  id?: string
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  class?: ClassValue
  /** Per-slot class overrides */
  classNames?: Partial<{
    handle: ClassValue
    handleBar: ClassValue
  }>
  /** Hit area margins for easier grabbing */
  hitAreaMargins?: object
  /** Tab index for keyboard focus */
  tabindex?: number
  /** Nonce for inline styles */
  nonce?: string
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>(), {
  id: undefined,
  isDisabled: undefined,
  disabled: undefined,
  class: undefined,
  classNames: undefined,
  hitAreaMargins: undefined,
  tabindex: undefined,
  nonce: undefined,
})

defineEmits<{
  dragging: [isDragging: boolean]
}>()

const groupCtx = inject(splitterContextKey, null)
const slotFns = computed(() =>
  splitterVariants({ direction: groupCtx?.direction.value ?? 'horizontal' }),
)

const isDisabled = useDeprecatedBooleanProp(
  'SplitterResizeHandle', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

// Workaround for a reka-ui bug that leaves late-mounted handles keyboard-dead.
//
// reka-ui attaches the Arrow/Home/End keydown listener inside a watchEffect that
// bails out when it cannot find the handle's own DOM node inside the group element.
// That effect first runs during setup, before this handle has rendered. On a
// handle's *first* mount the group element is still null too, so the effect
// re-runs when the group mounts — by then the handle is in the DOM and everything
// wires up. But a handle mounted *later* (a conditionally rendered panel and its
// handle being toggled back on) sees a group element that already exists and a
// handle element that does not: the effect returns early, none of its reactive
// deps ever change again, and it never re-runs. The handle stays draggable but
// stops responding to the keyboard entirely.
//
// `disabled` is the only reactive input to that effect we control from here, so
// flip it across two render passes after mount to force the effect to run again
// with the element in place. It has to be two passes: the value reaches reka-ui as
// a prop, and a prop only re-triggers when the *rendered* value changes, so a
// same-tick flip would collapse into a single no-op render. Both flushes happen in
// microtasks before the browser paints, so the intermediate `data-disabled` never
// reaches the screen.
const remountNudge = ref(false)
const effectiveDisabled = computed(() => isDisabled.value || remountNudge.value)

onMounted(async () => {
  if (isDisabled.value) return
  remountNudge.value = true
  await nextTick()
  remountNudge.value = false
})
</script>

<template>
  <SplitterResizeHandle
    :id="id"
    :disabled="effectiveDisabled"
    :hit-area-margins="(props.hitAreaMargins as any)"
    :tabindex="props.tabindex"
    :nonce="props.nonce"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.handle(), props.class, props.classNames?.handle)"
    data-slot="splitter-handle"
    @dragging="$emit('dragging', $event)"
  >
    <slot>
      <div :class="composeClassName(slotFns.handleBar(), props.classNames?.handleBar)" />
    </slot>
  </SplitterResizeHandle>
</template>
