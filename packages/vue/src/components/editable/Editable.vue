<script setup lang="ts">
import { computed } from 'vue'
import { EditableRoot } from 'reka-ui'
import { editableVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  defaultValue?: string
  placeholder?: string | { edit: string; preview: string }
  dir?: 'ltr' | 'rtl'
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  readonly?: boolean
  activationMode?: 'focus' | 'dblclick' | 'none'
  selectOnFocus?: boolean
  submitMode?: 'blur' | 'enter' | 'none' | 'both'
  startWithEditMode?: boolean
  maxLength?: number
  autoResize?: boolean
  id?: string
  name?: string
  required?: boolean
  as?: string
  asChild?: boolean
  class?: ClassValue
}>(), {
  isDisabled: undefined,
  disabled: undefined,
  activationMode: 'focus',
  selectOnFocus: false,
  submitMode: 'blur',
  startWithEditMode: false,
  autoResize: false,
})

const emit = defineEmits<{
  submit: [value: string | null | undefined]
  'update:state': [state: 'edit' | 'submit' | 'cancel']
}>()

const modelValue = defineModel<string | null>()

const isDisabled = useDeprecatedBooleanProp(
  'Editable', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const slotFns = computed(() => editableVariants())
</script>

<template>
  <EditableRoot
    v-model="modelValue"
    :default-value="defaultValue"
    :placeholder="placeholder"
    :dir="dir"
    :disabled="isDisabled"
    :readonly="readonly"
    :activation-mode="activationMode"
    :select-on-focus="selectOnFocus"
    :submit-mode="submitMode"
    :start-with-edit-mode="startWithEditMode"
    :max-length="maxLength"
    :auto-resize="autoResize"
    :id="id"
    :name="name"
    :required="required"
    :as="as"
    :as-child="asChild"
    :class="composeClassName(slotFns.base(), props.class)"
    @submit="emit('submit', $event)"
    @update:state="emit('update:state', $event)"
  >
    <slot />
  </EditableRoot>
</template>
