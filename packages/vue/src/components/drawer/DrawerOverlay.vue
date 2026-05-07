<script setup lang="ts">
import { DialogOverlay } from 'reka-ui'
import { drawerVariants } from '@auronui/styles/components/drawer'

const styles = drawerVariants()
</script>

<template>
  <DialogOverlay :class="styles.backdrop()" />
</template>
