<script setup lang="ts">
import { NavigationMenuSub } from 'reka-ui'

const props = withDefaults(defineProps<{
  defaultValue?: string
  /** The orientation of the sub-menu. */
  orientation?: 'horizontal' | 'vertical'
}>(), {
  defaultValue: undefined,
  orientation: undefined,
})

const modelValue = defineModel<string>()
</script>

<template>
  <NavigationMenuSub
    v-model="modelValue"
    :default-value="props.defaultValue"
    :orientation="props.orientation"
  >
    <slot />
  </NavigationMenuSub>
</template>
