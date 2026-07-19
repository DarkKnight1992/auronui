<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { colorToString, type Color, type ColorFormat } from 'reka-ui'
import { colorPickerInputVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import Popover from '../popover/Popover.vue'
import PopoverTrigger from '../popover/PopoverTrigger.vue'
import PopoverContent from '../popover/PopoverContent.vue'
import ColorField from '../color-field/ColorField.vue'
import ColorSwatch from '../color-swatch/ColorSwatch.vue'
import ColorPicker from '../color-picker/ColorPicker.vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  defaultValue?: string
  format?: ColorFormat
  label?: string
  description?: string
  errorMessage?: string
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  fullWidth?: boolean
  placeholder?: string
  name?: string
  defaultOpen?: boolean
  open?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  modal?: boolean
  class?: ClassValue
  classNames?: Partial<{
    base: ClassValue
    trigger: ClassValue
    swatch: ClassValue
    popover: ClassValue
  }>
}>(), {
  format: 'hex',
  defaultValue: '#000000',
  isDisabled: false,
  isReadOnly: false,
  isRequired: false,
  fullWidth: false,
  defaultOpen: false,
  // Explicit `undefined` default (not omitted) — Vue silently defaults
  // Boolean-typed props to `false` when absent unless a default is given,
  // which would make `props.open` indistinguishable from "explicitly false"
  // and permanently short-circuit `effectiveOpen`'s `??` fallback to `isOpen`.
  open: undefined,
  side: 'bottom',
  align: 'start',
  sideOffset: 8,
  modal: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:open': [value: boolean]
}>()

// Single shared string bridges ColorField (trigger) and ColorPicker (dropdown) —
// mirrors DatePicker's rekaModelValue computed, since both children are
// independently-controlled instances that need one source of truth to stay in sync.
// Plain ref + explicit read/write, not a writable computed bound via v-model —
// same shape as Cascader's own isOpen handling below, kept consistent throughout.
const localValue = ref<string>(props.modelValue ?? props.defaultValue!)

watch(() => props.modelValue, (next) => {
  if (next !== undefined) localValue.value = next
})

const sharedValue = computed(() => props.modelValue ?? localValue.value)

function handleValueUpdate(next: string) {
  localValue.value = next
  emit('update:modelValue', next)
}

// ColorField emits a Color object (its own `update:modelValue` contract),
// while ColorPicker emits an already-serialized string — normalize both
// through the same string-based sharedValue.
function handleColorFieldUpdate(next: Color) {
  handleValueUpdate(colorToString(next, props.format ?? 'hex'))
}

// Local open state, mirroring Cascader's own isOpen ref — always a concrete
// boolean fed straight to Popover, kept in sync with a controlled `open` prop.
const isOpen = ref(props.defaultOpen)

watch(() => props.open, (next) => {
  if (next !== undefined) isOpen.value = next
})

const effectiveOpen = computed(() => props.open ?? isOpen.value)

function handleOpenUpdate(next: boolean) {
  isOpen.value = next
  emit('update:open', next)
}

const styles = computed(() => colorPickerInputVariants())
</script>

<template>
  <div
    :class="composeClassName(styles.base(), props.class, props.classNames?.base)"
    data-slot="color-picker-input"
  >
    <Popover
      :open="effectiveOpen"
      :modal="modal"
      @update:open="handleOpenUpdate"
    >
      <ColorField
        :model-value="sharedValue"
        @update:model-value="handleColorFieldUpdate"
        :label="label"
        :description="description"
        :error-message="errorMessage"
        :is-disabled="isDisabled"
        :is-read-only="isReadOnly"
        :is-required="isRequired"
        :full-width="fullWidth"
        :placeholder="placeholder"
        :name="name"
      >
        <template #endContent>
          <PopoverTrigger as-child>
            <button
              type="button"
              :class="composeClassName(styles.trigger(), props.classNames?.trigger)"
              :disabled="isDisabled"
              aria-label="Open color picker"
              @mousedown.prevent
            >
              <ColorSwatch
                :color="sharedValue"
                shape="circle"
                size="xs"
                :class="composeClassName(styles.swatch(), props.classNames?.swatch)"
              />
            </button>
          </PopoverTrigger>
        </template>
      </ColorField>

      <PopoverContent
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :class="composeClassName(styles.popover(), props.classNames?.popover)"
      >
        <ColorPicker
          :model-value="sharedValue"
          @update:model-value="handleValueUpdate"
          :format="format"
          :is-disabled="isDisabled"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
