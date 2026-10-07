<script setup lang="ts">
import { drawerVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  class?: ClassValue
}>(), {})

const styles = drawerVariants()
</script>

<template>
  <div :class="composeClassName(styles.header(), props.class)">
    <slot />
  </div>
</template>
