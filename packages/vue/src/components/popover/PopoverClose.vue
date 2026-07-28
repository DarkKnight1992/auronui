<script setup lang="ts">
import { Primitive, injectPopoverRootContext } from 'reka-ui'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  as?: string | object
  asChild?: boolean
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  class?: string
}>(), {
  isDisabled: undefined,
  disabled: undefined,
})

const isDisabled = useDeprecatedBooleanProp(
  'PopoverClose', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const rootContext = injectPopoverRootContext()

// With as-child, Reka's Slot merges our onClick and the wrapped child's own
// onClick onto the same element, and OUR handler runs first — so deferring
// the actual close to a microtask lets the child's handler (which still
// runs synchronously within the same click dispatch, right after ours) call
// event.preventDefault() first if it wants to keep the popover open (e.g.
// while an async action is in flight); the caller then closes it manually
// once that async work resolves.
function handleClick(event: Event) {
  queueMicrotask(() => {
    if (event.defaultPrevented) return
    rootContext.onOpenChange(false)
  })
}

const resolvedAs = () => props.as ?? 'button'
</script>

<template>
  <Primitive
    :as-child="props.asChild"
    :as="resolvedAs()"
    :type="resolvedAs() === 'button' ? 'button' : undefined"
    :disabled="isDisabled"
    :class="props.class"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot />
  </Primitive>
</template>
