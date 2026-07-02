<script setup lang="ts">
import { computed } from 'vue'
import { PinInputRoot, PinInputInput } from 'reka-ui'
import { inputOTPVariants, type InputOTPVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  length?: number
  type?: 'text'
  otp?: boolean
  mask?: boolean
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  placeholder?: string
  modelValue?: string
  defaultValue?: string
  name?: string
  variant?: InputOTPVariants['variant']
  /** Text direction forwarded to PinInputRoot. */
  dir?: 'ltr' | 'rtl'
  /** HTML id attribute forwarded to PinInputRoot. */
  id?: string
  /** Whether PinInputRoot renders as a child element. */
  asChild?: boolean
  /** Element or component to render PinInputRoot as. */
  as?: string
  /** Whether the input is required. */
  required?: boolean
  /** Whether each PinInputInput renders as a child element. */
  inputAsChild?: boolean
  /** Element or component to render each PinInputInput as. */
  inputAs?: string
  class?: ClassValue
  /** Optional per-slot class overrides */
  classNames?: Partial<{
    base: ClassValue
    group: ClassValue
    slot: ClassValue
  }>
}>(), {
  length: 6,
  type: 'text',
  otp: true,
  mask: false,
  isDisabled: undefined,
  disabled: undefined,
  placeholder: '',
  modelValue: undefined,
  defaultValue: undefined,
  name: undefined,
  variant: 'primary',
  dir: undefined,
  id: undefined,
  asChild: false,
  as: undefined,
  required: false,
  inputAsChild: false,
  inputAs: undefined,
  class: undefined,
  classNames: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'complete': [value: string]
}>()

const isDisabled = useDeprecatedBooleanProp(
  'InputOTP', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const slotFns = computed(() => inputOTPVariants({ variant: props.variant }))

const modelValueArray = computed(() =>
  (props.modelValue ?? '').split('')
)

const handleUpdate = (arr: string[]) => emit('update:modelValue', arr.join(''))
const handleComplete = (arr: string[]) => emit('complete', arr.join(''))
</script>

<template>
  <PinInputRoot
    :model-value="modelValueArray"
    :disabled="isDisabled"
    :placeholder="placeholder"
    :type="type"
    :otp="otp"
    :mask="mask"
    :name="name"
    :dir="props.dir"
    :id="props.id"
    :as-child="props.asChild"
    :as="props.as"
    :required="props.required"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    @update:model-value="handleUpdate"
    @complete="handleComplete"
  >
    <div :class="composeClassName(slotFns.group(), props.classNames?.group)">
      <PinInputInput
        v-for="i in length"
        :key="i - 1"
        :index="i - 1"
        :as-child="props.inputAsChild"
        :as="props.inputAs"
        :class="composeClassName(slotFns.slot(), props.classNames?.slot)"
      />
    </div>
  </PinInputRoot>
</template>
