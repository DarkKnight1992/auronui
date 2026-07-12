<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { switchGroupVariants, type SwitchGroupVariants, type SwitchVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useSwitchGroupProvide } from './switch-group.context'
import SwitchInput from './Switch.vue'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

type SwitchShorthandItem = {
  value: string
  label?: string
  disabled?: boolean
  class?: ClassValue
  classNames?: Partial<{
    base: ClassValue
    control: ClassValue
    thumb: ClassValue
    content: ClassValue
  }>
}

const props = withDefaults(defineProps<{
  size?: SwitchVariants['size']
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  modelValue?: string[]
  defaultValue?: string[]
  name?: string
  orientation?: SwitchGroupVariants['orientation']
  isInvalid?: boolean
  errorMessage?: string
  label?: string
  description?: string
  class?: string
  /** Shorthand API: render switches from an array instead of the compound slot API */
  items?: SwitchShorthandItem[]
  /** Per-slot class overrides */
  classNames?: Partial<{
    label: ClassValue
    items: ClassValue
    description: ClassValue
    errorMessage: ClassValue
    /** Applied to every shorthand-rendered Switch, before any per-item override */
    switch: Partial<{
      base: ClassValue
      control: ClassValue
      thumb: ClassValue
      content: ClassValue
    }>
  }>
}>(), {
  size: 'md',
  isDisabled: undefined,
  disabled: undefined,
  isInvalid: false,
  errorMessage: undefined,
  modelValue: undefined,
  defaultValue: undefined,
  name: undefined,
  orientation: 'vertical',
  label: undefined,
  description: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

// Internal state for uncontrolled mode
const internalValues = ref<string[]>(props.defaultValue ?? [])

// Current values: controlled (modelValue) or uncontrolled (internalValues)
const currentValues = computed(() => props.modelValue ?? internalValues.value)

// Toggle value in the selection list
function toggleValue(value: string) {
  const next = currentValues.value.includes(value)
    ? currentValues.value.filter(v => v !== value)
    : [...currentValues.value, value]
  internalValues.value = next
  emit('update:modelValue', next)
}

const isDisabled = useDeprecatedBooleanProp(
  'SwitchGroup', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

// Provide context to child Switches
useSwitchGroupProvide({
  size: toRef(props, 'size'),
  disabled: isDisabled,
  isInvalid: toRef(props, 'isInvalid'),
  selectedValues: currentValues,
  toggleValue,
  name: toRef(props, 'name'),
})

const labelId = `switch-group-label-${Math.random().toString(36).slice(2, 8)}`

const groupSlots = computed(() =>
  switchGroupVariants({ orientation: props.orientation })
)

// Group-wide switch classNames apply first; per-item classNames win on conflict.
function itemClassNames(item: SwitchShorthandItem) {
  return {
    base: composeClassName(props.classNames?.switch?.base, item.classNames?.base),
    control: composeClassName(props.classNames?.switch?.control, item.classNames?.control),
    thumb: composeClassName(props.classNames?.switch?.thumb, item.classNames?.thumb),
    content: composeClassName(props.classNames?.switch?.content, item.classNames?.content),
  }
}
</script>

<template>
  <div
    role="group"
    :aria-labelledby="props.label ? labelId : undefined"
    :aria-invalid="props.isInvalid || undefined"
    :data-orientation="props.orientation"
    :class="composeClassName(groupSlots.base(), props.class)"
  >
    <span
      v-if="props.label"
      :id="labelId"
      :class="composeClassName(groupSlots.label(), props.classNames?.label)"
    >{{ props.label }}</span>
    <div :class="composeClassName(groupSlots.items(), props.classNames?.items)">
      <template v-if="props.items">
        <SwitchInput
          v-for="item in props.items"
          :key="item.value"
          :value="item.value"
          :is-disabled="item.disabled"
          :class="item.class"
          :class-names="itemClassNames(item)"
        >
          {{ item.label ?? item.value }}
        </SwitchInput>
      </template>
      <slot v-else />
    </div>
    <span
      v-if="props.isInvalid && props.errorMessage"
      :class="composeClassName(groupSlots.errorMessage(), props.classNames?.errorMessage)"
    >{{ props.errorMessage }}</span>
    <span
      v-else-if="props.description"
      :class="composeClassName(groupSlots.description(), props.classNames?.description)"
    >{{ props.description }}</span>
  </div>
</template>
