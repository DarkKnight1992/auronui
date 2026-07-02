<script setup lang="ts">
import { computed, toRef } from 'vue'
import { RadioGroupRoot } from 'reka-ui'
import { radioGroupVariants, type RadioGroupVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useRadioGroupProvide } from './radio-group.context'
import Radio from './Radio.vue'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

type RadioShorthandItem = { value: string; label?: string; disabled?: boolean }

const props = withDefaults(defineProps<{
  variant?: RadioGroupVariants['variant']
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  isInvalid?: boolean
  modelValue?: string
  defaultValue?: string
  name?: string
  orientation?: 'horizontal' | 'vertical'
  label?: string
  description?: string
  errorMessage?: string
  /** Text direction forwarded to RadioGroupRoot. */
  dir?: 'ltr' | 'rtl'
  /** Whether keyboard navigation loops from last to first item. */
  loop?: boolean
  /** Whether RadioGroupRoot renders as a child element. */
  asChild?: boolean
  /** Element or component to render RadioGroupRoot as. */
  as?: string
  /** Whether the radio group is required. */
  required?: boolean
  class?: string
  /** Shorthand API: render radio options from an array instead of the compound slot API */
  items?: RadioShorthandItem[]
}>(), {
  variant: 'primary',
  isDisabled: undefined,
  disabled: undefined,
  isInvalid: false,
  modelValue: undefined,
  defaultValue: undefined,
  name: undefined,
  orientation: 'vertical',
  label: undefined,
  description: undefined,
  errorMessage: undefined,
  dir: undefined,
  loop: true,
  asChild: false,
  as: undefined,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isDisabled = useDeprecatedBooleanProp(
  'RadioGroup', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

// Provide context to child Radio components
useRadioGroupProvide({
  variant: toRef(props, 'variant'),
  disabled: isDisabled,
  isInvalid: toRef(props, 'isInvalid'),
})

const labelId = `radio-group-label-${Math.random().toString(36).slice(2, 8)}`

const groupClasses = computed(() =>
  radioGroupVariants({ variant: props.variant })
)
</script>

<template>
  <RadioGroupRoot
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    :disabled="isDisabled"
    :aria-invalid="props.isInvalid || undefined"
    :name="props.name"
    :orientation="props.orientation"
    :dir="props.dir"
    :loop="props.loop"
    :as-child="props.asChild"
    :as="props.as"
    :required="props.required"
    :aria-labelledby="props.label ? labelId : undefined"
    :class="composeClassName(groupClasses, props.class)"
    @update:model-value="$event != null && emit('update:modelValue', String($event))"
  >
    <span
      v-if="props.label"
      :id="labelId"
      class="radio-group__label"
    >{{ props.label }}</span>
    <div class="radio-group__wrapper">
      <template v-if="props.items">
        <Radio
          v-for="item in props.items"
          :key="item.value"
          :value="item.value"
          :disabled="item.disabled"
        >{{ item.label ?? item.value }}</Radio>
      </template>
      <slot v-else />
    </div>
    <span
      v-if="props.isInvalid && props.errorMessage"
      class="radio-group__error-message"
    >{{ props.errorMessage }}</span>
    <span
      v-else-if="props.description"
      class="radio-group__description"
    >{{ props.description }}</span>
  </RadioGroupRoot>
</template>
