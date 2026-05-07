<script setup lang="ts">
import { DropdownMenuRadioGroup } from 'reka-ui'
import type { AcceptableValue } from 'reka-ui'

const modelValue = defineModel<AcceptableValue>({ default: '' })
</script>

<template>
  <DropdownMenuRadioGroup
    :model-value="modelValue"
    @update:model-value="modelValue = $event"
  >
    <slot />
  </DropdownMenuRadioGroup>
</template>
