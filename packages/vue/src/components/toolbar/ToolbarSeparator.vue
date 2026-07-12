<script setup lang="ts">
import { computed } from 'vue'
import { ToolbarSeparator as RekaToolbarSeparator } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'
import { useToolbarInject } from './toolbar.context'

const props = defineProps<{
  class?: string
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>()

const ctx = useToolbarInject({ orientation: computed(() => 'horizontal' as const) })

const separatorClass = computed(() =>
  ctx.orientation.value === 'vertical' ? 'separator separator--horizontal' : 'separator separator--vertical'
)
</script>

<template>
  <RekaToolbarSeparator
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(separatorClass, props.class)"
  />
</template>
