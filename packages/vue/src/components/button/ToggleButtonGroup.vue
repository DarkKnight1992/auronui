<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { toggleButtonGroupVariants, type ToggleButtonVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useToggleButtonGroupProvide } from './toggle-button-group.context'

const props = withDefaults(defineProps<{
  variant?: ToggleButtonVariants['variant']
  size?: ToggleButtonVariants['size']
  disabled?: boolean
  fullWidth?: boolean
  orientation?: 'horizontal' | 'vertical'
  isDetached?: boolean
  selectionMode?: 'single' | 'multiple'
  modelValue?: string | string[]
  defaultValue?: string | string[]
  class?: ClassValue
  /** Additional class names to apply to component slots */
  classNames?: Partial<{
    base: ClassValue
  }>
}>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  fullWidth: false,
  orientation: 'horizontal',
  isDetached: false,
  selectionMode: 'multiple',
  modelValue: undefined,
  defaultValue: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

// Normalize modelValue / defaultValue to string[] for internal use
const internalSelected = ref<string[]>(
  props.modelValue !== undefined
    ? (Array.isArray(props.modelValue) ? [...props.modelValue] : [props.modelValue])
    : props.defaultValue !== undefined
      ? (Array.isArray(props.defaultValue) ? [...props.defaultValue] : [props.defaultValue])
      : []
)

// Keep internalSelected in sync when modelValue changes from outside (controlled mode)
import { watch } from 'vue'
watch(
  () => props.modelValue,
  (val) => {
    if (val === undefined) return
    internalSelected.value = Array.isArray(val) ? [...val] : [val]
  },
)

// The selectedValues exposed to children (always string[])
const selectedValues = computed(() => internalSelected.value)

function toggleValue(value: string) {
  if (props.selectionMode === 'single') {
    const next = internalSelected.value.includes(value) ? [] : [value]
    internalSelected.value = next
    emit('update:modelValue', next[0] ?? '')
  } else {
    // multiple
    const idx = internalSelected.value.indexOf(value)
    const next = idx === -1
      ? [...internalSelected.value, value]
      : internalSelected.value.filter((v) => v !== value)
    internalSelected.value = next
    emit('update:modelValue', next)
  }
}

// Provide context to child ToggleButtons via toRef() for live reactivity
useToggleButtonGroupProvide({
  variant: toRef(props, 'variant'),
  size: toRef(props, 'size'),
  disabled: toRef(props, 'disabled'),
  fullWidth: toRef(props, 'fullWidth'),
  orientation: toRef(props, 'orientation'),
  selectionMode: toRef(props, 'selectionMode'),
  selectedValues,
  toggleValue,
})

const slotFns = computed(() =>
  toggleButtonGroupVariants({
    fullWidth: props.fullWidth,
    orientation: props.orientation,
    isDetached: props.isDetached,
  })
)
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    :data-orientation="props.orientation"
    role="group"
  >
    <slot />
  </div>
</template>
