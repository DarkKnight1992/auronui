<script setup lang="ts">
import { computed, provide } from 'vue'
import { SplitterGroup } from 'reka-ui'
import { splitterVariants, type SplitterVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { splitterContextKey } from './Splitter.context'

const props = withDefaults(defineProps<{
  id?: string
  direction?: SplitterVariants['direction']
  autoSaveId?: string
  class?: string
}>(), {
  id: undefined,
  direction: 'horizontal',
  autoSaveId: undefined,
  class: undefined,
})

const slotFns = computed(() => splitterVariants({ direction: props.direction }))

provide(splitterContextKey, { direction: computed(() => props.direction ?? 'horizontal') })
</script>

<template>
  <SplitterGroup
    :id="id"
    :direction="direction ?? 'horizontal'"
    :auto-save-id="autoSaveId"
    :class="composeClassName(slotFns.group(), props.class)"
    data-slot="splitter-group"
  >
    <slot />
  </SplitterGroup>
</template>
