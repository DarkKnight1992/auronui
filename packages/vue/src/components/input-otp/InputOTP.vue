<script setup lang="ts">
import { computed } from 'vue'
import { PinInputRoot, PinInputInput } from 'reka-ui'
import { inputOTPVariants, type InputOTPVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  length?: number
  type?: 'text'
  otp?: boolean
  mask?: boolean
  disabled?: boolean
  placeholder?: string
  modelValue?: string
  defaultValue?: string
  name?: string
  variant?: InputOTPVariants['variant']
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
  disabled: false,
  placeholder: '',
  modelValue: undefined,
  defaultValue: undefined,
  name: undefined,
  variant: 'primary',
  class: undefined,
  classNames: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'complete': [value: string]
}>()

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
    :disabled="disabled"
    :placeholder="placeholder"
    :type="type"
    :otp="otp"
    :mask="mask"
    :name="name"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    @update:model-value="handleUpdate"
    @complete="handleComplete"
  >
    <div :class="composeClassName(slotFns.group(), props.classNames?.group)">
      <PinInputInput
        v-for="i in length"
        :key="i - 1"
        :index="i - 1"
        :class="composeClassName(slotFns.slot(), props.classNames?.slot)"
      />
    </div>
  </PinInputRoot>
</template>
