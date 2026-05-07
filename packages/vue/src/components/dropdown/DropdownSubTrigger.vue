<script setup lang="ts">
import { useTemplateRef, watchEffect, onUnmounted } from 'vue'
import { DropdownMenuSubTrigger } from 'reka-ui'
import { menuItemVariants } from '@auronui/styles'
import { useDropdownSubInject } from './DropdownSub.context'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  textValue?: string
  class?: string
}>(), {
  isDisabled: false,
  textValue: undefined,
  class: undefined,
})

const subCtx = useDropdownSubInject()
const slots = menuItemVariants({ variant: 'default' })
const triggerRef = useTemplateRef<InstanceType<typeof DropdownMenuSubTrigger>>('trigger')

function blockHover(e: Event) {
  e.stopImmediatePropagation()
}

let cleanup: (() => void) | null = null

watchEffect(() => {
  cleanup?.()
  cleanup = null
  if (!subCtx.openOnHover.value) {
    const el = (triggerRef.value as { $el?: HTMLElement } | null)?.$el ?? triggerRef.value
    if (el) {
      (el as HTMLButtonElement).addEventListener('pointermove', blockHover, true)
      cleanup = () => (el as HTMLButtonElement).removeEventListener('pointermove', blockHover, true)
    }
  }
})

onUnmounted(() => cleanup?.())

function handleClick() {
  if (!subCtx.openOnHover.value) subCtx.setOpen(!subCtx.open.value)
}
</script>

<template>
  <DropdownMenuSubTrigger
    ref="trigger"
    :disabled="props.isDisabled"
    :text-value="props.textValue"
    :class="[slots.item(), props.class]"
    @click="handleClick"
  >
    <slot />
    <span
      :class="slots.submenuIndicator()"
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        data-slot="submenu-indicator"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </span>
  </DropdownMenuSubTrigger>
</template>
