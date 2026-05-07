<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { switchVariants, type SwitchVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useSwitchGroupInject } from './switch-group.context'

// Disable Vue attribute fallthrough — we manually forward $attrs to SwitchRoot
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  size?: SwitchVariants['size']
  value?: string
  modelValue?: boolean
  defaultValue?: boolean
  disabled?: boolean
  name?: string
  class?: string
}>(), {
  size: undefined,
  value: undefined,
  modelValue: undefined,
  defaultValue: false,
  disabled: false,
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const attrs = useAttrs()

// Inject SwitchGroup context with fallback defaults (standalone mode)
const groupCtx = useSwitchGroupInject({
  size: ref('md'),
  disabled: ref(false),
  selectedValues: ref([]),
  toggleValue: () => {},
  name: ref(undefined),
})

// Prop precedence: group disabled wins (D-02)
const isDisabled = computed(() => groupCtx.disabled.value || props.disabled)

// Child size wins over group size
const finalSize = computed(() => props.size ?? groupCtx.size.value)

// Determine if inside a group (value prop is the signal)
const isInGroup = computed(() => props.value !== undefined)

// Compute checked state
const checked = computed<boolean>(() => {
  if (isInGroup.value) {
    return groupCtx.selectedValues.value.includes(props.value!)
  }
  return props.modelValue ?? false
})

// Handle Reka UI's update:checked event
function handleUpdate(val: boolean) {
  if (isInGroup.value) {
    groupCtx.toggleValue(props.value!)
  } else {
    emit('update:modelValue', val)
  }
}

const slotFns = computed(() =>
  switchVariants({ size: finalSize.value })
)
</script>

<template>
  <!--
    v-bind="attrs" forwards aria-label and other HTML attributes through to Reka UI's
    SwitchRoot, which then applies them to the inner <button> element.
    inheritAttrs: false prevents double-application on SwitchRoot's root.
  -->
  <SwitchRoot
    v-bind="attrs"
    :model-value="checked"
    :disabled="isDisabled"
    :name="props.name ?? groupCtx.name.value"
    :value="props.value"
    :class="composeClassName(slotFns.base(), props.class)"
    @update:model-value="handleUpdate"
  >
    <span :class="slotFns.control()">
      <SwitchThumb :class="slotFns.thumb()" />
    </span>
    <span
      v-if="$slots.default"
      :class="slotFns.content()"
    >
      <slot />
    </span>
  </SwitchRoot>
</template>
