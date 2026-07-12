<script setup lang="ts">
import { computed, toRef } from 'vue'
import { RadioGroupRoot } from 'reka-ui'
import { radioGroupVariants, type RadioGroupVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useRadioGroupProvide } from './radio-group.context'
import Radio from './Radio.vue'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

type RadioShorthandItem = {
  value: string
  label?: string
  disabled?: boolean
  class?: ClassValue
  classNames?: Partial<{
    base: ClassValue
    control: ClassValue
    indicator: ClassValue
    content: ClassValue
  }>
}

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
  isRequired?: boolean
  /**
   * Whether the radio group is required.
   * @deprecated Use isRequired instead.
   */
  required?: boolean
  class?: string
  /** Shorthand API: render radio options from an array instead of the compound slot API */
  items?: RadioShorthandItem[]
  /** Per-slot class overrides */
  classNames?: Partial<{
    label: ClassValue
    wrapper: ClassValue
    description: ClassValue
    errorMessage: ClassValue
    /** Applied to every shorthand-rendered Radio, before any per-item override */
    radio: Partial<{
      base: ClassValue
      control: ClassValue
      indicator: ClassValue
      content: ClassValue
    }>
  }>
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
  isRequired: undefined,
  required: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isDisabled = useDeprecatedBooleanProp(
  'RadioGroup', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const isRequired = useDeprecatedBooleanProp(
  'RadioGroup', 'isRequired', () => props.isRequired, 'required', () => props.required,
)

// Provide context to child Radio components
useRadioGroupProvide({
  variant: toRef(props, 'variant'),
  disabled: isDisabled,
  isInvalid: toRef(props, 'isInvalid'),
})

const labelId = `radio-group-label-${Math.random().toString(36).slice(2, 8)}`

const slotFns = computed(() =>
  radioGroupVariants({ variant: props.variant })
)

// Group-wide radio classNames apply first; per-item classNames win on conflict.
function itemClassNames(item: RadioShorthandItem) {
  return {
    base: composeClassName(props.classNames?.radio?.base, item.classNames?.base),
    control: composeClassName(props.classNames?.radio?.control, item.classNames?.control),
    indicator: composeClassName(props.classNames?.radio?.indicator, item.classNames?.indicator),
    content: composeClassName(props.classNames?.radio?.content, item.classNames?.content),
  }
}
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
    :required="isRequired"
    :aria-labelledby="props.label ? labelId : undefined"
    :class="composeClassName(slotFns.base(), props.class)"
    @update:model-value="$event != null && emit('update:modelValue', String($event))"
  >
    <span
      v-if="props.label"
      :id="labelId"
      :class="composeClassName(slotFns.label(), props.classNames?.label)"
    >{{ props.label }}</span>
    <div :class="composeClassName(slotFns.wrapper(), props.classNames?.wrapper)">
      <template v-if="props.items">
        <Radio
          v-for="item in props.items"
          :key="item.value"
          :value="item.value"
          :is-disabled="item.disabled"
          :class="item.class"
          :class-names="itemClassNames(item)"
        >
          {{ item.label ?? item.value }}
        </Radio>
      </template>
      <slot v-else />
    </div>
    <span
      v-if="props.isInvalid && props.errorMessage"
      :class="composeClassName(slotFns.errorMessage(), props.classNames?.errorMessage)"
    >{{ props.errorMessage }}</span>
    <span
      v-else-if="props.description"
      :class="composeClassName(slotFns.description(), props.classNames?.description)"
    >{{ props.description }}</span>
  </RadioGroupRoot>
</template>
