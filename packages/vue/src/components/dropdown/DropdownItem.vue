<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui'
import { menuItemVariants, type MenuItemVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  textValue?: string
  isDisabled?: boolean
  variant?: MenuItemVariants['variant']
  shortcut?: string
  description?: string
  class?: string
}>(), {
  textValue: undefined,
  isDisabled: false,
  variant: 'default',
  shortcut: undefined,
  description: undefined,
  class: undefined,
})

const emit = defineEmits<{
  select: [event: Event]
}>()

const slots = menuItemVariants({ variant: props.variant })
</script>

<template>
  <DropdownMenuItem
    :text-value="props.textValue"
    :disabled="props.isDisabled"
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

    <kbd
      v-if="props.shortcut"
      data-slot="shortcut"
      class="ml-auto text-xs text-muted font-mono"
    >
      {{ props.shortcut }}
    </kbd>

    <slot name="endContent" />
  </DropdownMenuItem>
</template>
