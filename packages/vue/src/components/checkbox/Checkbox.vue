<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { CheckboxRoot, CheckboxIndicator } from 'reka-ui'
import { checkboxVariants, type CheckboxVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useCheckboxGroupInject } from './checkbox-group.context'

// Disable Vue attribute fallthrough — we manually forward $attrs to CheckboxRoot
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  variant?: CheckboxVariants['variant']
  value?: string
  modelValue?: boolean
  defaultValue?: boolean
  disabled?: boolean
  isIndeterminate?: boolean
  name?: string
  class?: string
  /** Per-slot class overrides for any slot in this component. */
  classNames?: Partial<{
    base: string
    control: string
    indicator: string
    content: string
  }>
}>(), {
  variant: undefined,
  value: undefined,
  modelValue: undefined,
  defaultValue: false,
  disabled: false,
  isIndeterminate: false,
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const attrs = useAttrs()

// Inject CheckboxGroup context with fallback defaults (standalone mode)
const groupCtx = useCheckboxGroupInject({
  variant: ref('primary'),
  disabled: ref(false),
  selectedValues: ref([]),
  toggleValue: () => {},
  name: ref(undefined),
})

// Prop precedence: group disabled wins (D-02)
const isDisabled = computed(() => groupCtx.disabled.value || props.disabled)

// Child variant wins over group variant
const finalVariant = computed(() => props.variant ?? groupCtx.variant.value)

// Determine if inside a group (value prop is the signal)
const isInGroup = computed(() => props.value !== undefined)

// Compute modelValue for Reka UI CheckboxRoot
// Reka UI uses modelValue: boolean | 'indeterminate' to control state
const checkedState = computed<boolean | 'indeterminate'>(() => {
  if (props.isIndeterminate) return 'indeterminate'
  if (isInGroup.value) {
    return groupCtx.selectedValues.value.includes(props.value!)
  }
  return props.modelValue ?? false
})

// Handle Reka UI's update:modelValue event
function handleUpdate(val: boolean | 'indeterminate') {
  if (isInGroup.value) {
    groupCtx.toggleValue(props.value!)
  } else {
    if (val !== 'indeterminate') {
      emit('update:modelValue', val)
    }
  }
}

const slotFns = computed(() =>
  checkboxVariants({ variant: finalVariant.value })
)
</script>

<template>
  <!--
    v-bind="attrs" forwards aria-label and other HTML attributes through to Reka UI's
    CheckboxRoot, which then applies them to the inner <button> element.
    inheritAttrs: false prevents double-application on CheckboxRoot's root.
  -->
  <CheckboxRoot
    v-bind="attrs"
    :model-value="checkedState"
    :disabled="isDisabled"
    :name="props.name ?? groupCtx.name.value"
    :value="props.value"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    @update:model-value="handleUpdate"
  >
    <span :class="composeClassName(slotFns.control(), props.classNames?.control)">
      <CheckboxIndicator :class="composeClassName(slotFns.indicator(), props.classNames?.indicator)">
        <!-- Indeterminate: dash icon -->
        <svg
          v-if="props.isIndeterminate"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <line
            x1="5"
            y1="12"
            x2="19"
            y2="12"
          />
        </svg>
        <!-- Checked: check icon -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </CheckboxIndicator>
    </span>
    <span :class="composeClassName(slotFns.content(), props.classNames?.content)">
      <slot />
    </span>
  </CheckboxRoot>
</template>
