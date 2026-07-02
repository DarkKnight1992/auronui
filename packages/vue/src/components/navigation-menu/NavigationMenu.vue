<script setup lang="ts">
import { computed } from 'vue'
import { NavigationMenuRoot } from 'reka-ui'
import { navigationMenuVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  defaultValue?: string
  dir?: 'ltr' | 'rtl'
  /** The orientation of the menu. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical'
  /** Duration (ms) from pointer entering a trigger until its flyout opens. @default 200 */
  delayDuration?: number
  /** How much time (ms) a user has to enter another trigger without incurring the delay again. @default 300 */
  skipDelayDuration?: number
  /** When true, a trigger's flyout cannot be opened by clicking it. @default false */
  disableClickTrigger?: boolean
  /** When true, a trigger's flyout cannot be opened by hovering it. @default false */
  disableHoverTrigger?: boolean
  /** When true, the flyout will not close on pointer leave. @default false */
  disablePointerLeaveClose?: boolean
  /** When true, closed content is unmounted from the DOM rather than hidden. @default true */
  unmountOnHide?: boolean
  class?: ClassValue
}>(), {
  defaultValue: undefined,
  dir: undefined,
  orientation: undefined,
  delayDuration: undefined,
  skipDelayDuration: undefined,
  disableClickTrigger: undefined,
  disableHoverTrigger: undefined,
  disablePointerLeaveClose: undefined,
  unmountOnHide: undefined,
  class: undefined,
})

const modelValue = defineModel<string>()

const slotFns = computed(() => navigationMenuVariants())
</script>

<template>
  <NavigationMenuRoot
    v-model="modelValue"
    :default-value="defaultValue"
    :dir="props.dir"
    :orientation="props.orientation"
    :delay-duration="props.delayDuration"
    :skip-delay-duration="props.skipDelayDuration"
    :disable-click-trigger="props.disableClickTrigger"
    :disable-hover-trigger="props.disableHoverTrigger"
    :disable-pointer-leave-close="props.disablePointerLeaveClose"
    :unmount-on-hide="props.unmountOnHide"
    :class="composeClassName(slotFns.root(), props.class)"
  >
    <slot />
  </NavigationMenuRoot>
</template>
