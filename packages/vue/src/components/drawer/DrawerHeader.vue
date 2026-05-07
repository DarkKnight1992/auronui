<script setup lang="ts">
import { drawerVariants } from '@auronui/styles/components/drawer'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  class?: string
}>(), {})

const styles = drawerVariants()
</script>

<template>
  <div :class="composeClassName(styles.header(), props.class)">
    <slot />
  </div>
</template>
