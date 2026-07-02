<script setup lang="ts">
import { MenubarMenu } from 'reka-ui'

const props = defineProps<{
  /** A unique value that associates this menu with the Root's active value. Managed automatically when uncontrolled. */
  value?: string
}>()
</script>

<template>
  <MenubarMenu :value="props.value">
    <slot />
  </MenubarMenu>
</template>
