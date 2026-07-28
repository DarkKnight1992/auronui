<script setup lang="ts">
import { Primitive, injectDialogRootContext } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  class?: string
}>(), {
  asChild: false,
})

const rootContext = injectDialogRootContext()

// With as-child, Reka's Slot merges our onClick and the wrapped child's own
// onClick onto the same element, and OUR handler runs first — so deferring
// the actual close to a microtask lets the child's handler (which still
// runs synchronously within the same click dispatch, right after ours) call
// event.preventDefault() first if it wants to keep the modal open (e.g.
// while an async save is in flight); the caller then closes it manually
// (via v-model/emit) once that async work resolves. Without this, an async
// handler would race the close: the modal starts closing before the
// promise it kicked off ever settles.
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
    :class="composeClassName(props.class)"
    @click="handleClick"
  >
    <slot />
  </Primitive>
</template>
