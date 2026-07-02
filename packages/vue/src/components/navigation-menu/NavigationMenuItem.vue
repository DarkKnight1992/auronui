<script setup lang="ts">
import { NavigationMenuItem } from 'reka-ui'

const props = defineProps<{
  /** A unique value that associates the item with the active value when the menu is controlled. Managed automatically when uncontrolled. */
  value?: string
}>()
</script>

<template>
  <NavigationMenuItem :value="props.value">
    <slot />
  </NavigationMenuItem>
</template>
