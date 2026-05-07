<script setup lang="ts">
import { ComboboxEmpty } from 'reka-ui'
</script>

<template>
  <ComboboxEmpty
    class="py-3 text-center text-sm text-default-400"
    data-slot="empty-content"
  >
    <slot />
  </ComboboxEmpty>
</template>
