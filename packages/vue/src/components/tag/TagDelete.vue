<script setup lang="ts">
import { TagsInputItemDelete } from 'reka-ui'
import { tagVariants } from '@auronui/styles'

const emit = defineEmits<{
  remove: []
}>()

const slots = tagVariants()

function handleClick() {
  emit('remove')
}
</script>

<template>
  <TagsInputItemDelete
    :class="slots.removeButton()"
    aria-label="Remove tag"
    @click="handleClick"
  >
    <slot>
      <!-- Default X icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <line
          x1="18"
          y1="6"
          x2="6"
          y2="18"
        />
        <line
          x1="6"
          y1="6"
          x2="18"
          y2="18"
        />
      </svg>
    </slot>
  </TagsInputItemDelete>
</template>
