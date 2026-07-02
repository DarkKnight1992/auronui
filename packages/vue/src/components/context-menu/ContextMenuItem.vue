<script setup lang="ts">
import { ContextMenuItem } from 'reka-ui'
import { menuItemVariants, type MenuItemVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  textValue?: string
  isDisabled?: boolean
  variant?: MenuItemVariants['variant']
  shortcut?: string
  description?: string
  class?: string
  /** Whether this item is disabled. */
  disabled?: boolean
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>(), {
  textValue: undefined,
  isDisabled: false,
  variant: 'default',
  shortcut: undefined,
  description: undefined,
  class: undefined,
  disabled: undefined,
  as: undefined,
  asChild: false,
})

const emit = defineEmits<{
  select: [event: Event]
}>()

const slots = menuItemVariants({ variant: props.variant })
</script>

<template>
  <ContextMenuItem
    :text-value="props.textValue"
    :disabled="props.disabled ?? props.isDisabled"
    :as="props.as"
    :as-child="props.asChild"
    :class="[slots.item(), props.class]"
    @select="emit('select', $event)"
  >
    <slot name="startContent" />

    <div class="flex flex-1 flex-col">
      <span data-slot="label">
        <slot />
      </span>
      <span
        v-if="props.description"
        data-slot="description"
      >
        {{ props.description }}
      </span>
    </div>

    <!-- Raw <kbd> (not <Kbd>): a menu shortcut renders as plain muted text; <Kbd> applies a
         boxed keycap style that would break visual parity with HeroUI's menu shortcuts. -->
    <kbd
      v-if="props.shortcut"
      data-slot="shortcut"
      class="ml-auto text-xs text-muted font-mono"
    >
      {{ props.shortcut }}
    </kbd>

    <slot name="endContent" />
  </ContextMenuItem>
</template>
