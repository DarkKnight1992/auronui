<script setup lang="ts">
import { computed } from 'vue'
import { ToolbarSeparator as RekaToolbarSeparator } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'
import { useToolbarInject } from './toolbar.context'

const props = defineProps<{ class?: string }>()

const ctx = useToolbarInject({ orientation: computed(() => 'horizontal' as const) })

const separatorClass = computed(() =>
  ctx.orientation.value === 'vertical' ? 'separator separator--horizontal' : 'separator separator--vertical'
)
</script>

<template>
  <RekaToolbarSeparator :class="composeClassName(separatorClass, props.class)" />
</template>
