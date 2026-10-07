<script setup lang="ts">
import { drawerVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

/**
 * DrawerMain wraps the main content area inside a dock Drawer.
 * It fills the remaining flex space and stays visible while the drawer
 * panel slides in alongside it.
 *
 * Usage:
 *   <Drawer dock placement="right">
 *     <DrawerMain>
 *       <YourPageContent />
 *     </DrawerMain>
 *     <DrawerContent>...</DrawerContent>
 *   </Drawer>
 */
const props = withDefaults(defineProps<{
  class?: ClassValue
}>(), {})

const styles = drawerVariants()
</script>

<template>
  <div :class="composeClassName(styles.main(), props.class)">
    <slot />
  </div>
</template>
