<script setup lang="ts">
import { computed } from 'vue'
import { TagsInputInput } from 'reka-ui'
import { useTagGroupInject } from './TagGroup.context'

const props = withDefaults(defineProps<{
  placeholder?: string
  class?: string
}>(), {
  placeholder: undefined,
  class: undefined,
})

// Inject group context to get disabled state
const ctx = useTagGroupInject({ variant: computed(() => 'default'), size: computed(() => 'md'), isDisabled: computed(() => false), readOnly: computed(() => false) })

const isDisabled = computed(() => ctx.isDisabled.value)
</script>

<template>
  <TagsInputInput
    :placeholder="placeholder"
    :disabled="isDisabled || undefined"
    :class="props.class"
    data-slot="input"
  />
</template>
