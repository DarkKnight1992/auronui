<script setup lang="ts">
import { computed } from 'vue'
import { MenubarRoot } from 'reka-ui'
import { menubarVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  defaultValue?: string
  dir?: 'ltr' | 'rtl'
  /** When true, keyboard navigation loops from last item to first, and vice versa. */
  loop?: boolean
  class?: ClassValue
}>(), {
  defaultValue: undefined,
  dir: undefined,
  loop: undefined,
  class: undefined,
})

const modelValue = defineModel<string>()

const slots = computed(() => menubarVariants())
</script>

<template>
  <MenubarRoot
    v-model="modelValue"
    :default-value="defaultValue"
    :dir="props.dir"
    :loop="props.loop"
    :class="composeClassName(slots.value.root(), props.class)"
  >
    <slot />
  </MenubarRoot>
</template>
