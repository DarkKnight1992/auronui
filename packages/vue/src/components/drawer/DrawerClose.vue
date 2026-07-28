<script setup lang="ts">
import { Primitive, injectDialogRootContext } from 'reka-ui'
import { drawerVariants } from '@auronui/styles/components/drawer'
import { composeClassName } from '../../utils/composeClassName'
import { useDrawerInject } from './drawer.context'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  class?: string
}>(), {
  asChild: false,
})

const ctx = useDrawerInject()
const styles = drawerVariants()

// Non-dock modes only: dock mode manages its own open state and never
// mounts Reka's DialogRoot, so this context wouldn't exist there.
const dialogRootContext = ctx.dock.value ? null : injectDialogRootContext()

// With as-child, Reka's Slot merges our onClick and the wrapped child's own
// onClick onto the same element — and OUR handler runs first (confirmed via
// a direct probe: checking event.defaultPrevented synchronously inside our
// handler sees `false` even when the child's handler calls preventDefault()).
// Deferring the actual close to a microtask lets the child's handler — which
// still runs synchronously within the same click dispatch, right after ours
// — call event.preventDefault() first if it wants to keep the drawer open
// (e.g. while an async save is in flight); the caller then closes it
// manually (via v-model/emit) once that async work resolves. Without this,
// an async handler would race the close: the drawer starts closing before
// the promise it kicked off ever settles.
function handleClick(event: Event) {
  queueMicrotask(() => {
    if (event.defaultPrevented) return
    if (ctx.dock.value) ctx.closeDock()
    else dialogRootContext?.onOpenChange(false)
  })
}

const resolvedAs = () => props.as ?? 'button'
</script>

<template>
  <Primitive
    :as-child="props.asChild"
    :as="resolvedAs()"
    :type="resolvedAs() === 'button' ? 'button' : undefined"
    :class="composeClassName(styles.closeTrigger(), props.class)"
    @click="handleClick"
  >
    <slot />
  </Primitive>
</template>
