<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { CheckboxRoot, CheckboxIndicator } from 'reka-ui'
import { checkboxVariants, type CheckboxVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useCheckboxGroupInject } from './checkbox-group.context'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

// Disable Vue attribute fallthrough — we manually forward $attrs to CheckboxRoot
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  variant?: CheckboxVariants['variant']
  value?: string
  modelValue?: boolean
  defaultValue?: boolean
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  isInvalid?: boolean
  isIndeterminate?: boolean
  name?: string
  /** HTML id attribute forwarded to CheckboxRoot. */
  id?: string
  /** The value for the checked state (forwarded to CheckboxRoot). */
  trueValue?: boolean | string | number
  /** The value for the unchecked state (forwarded to CheckboxRoot). */
  falseValue?: boolean | string | number
  /** Whether CheckboxRoot should render as a child element. */
  asChild?: boolean
  /** Element or component to render CheckboxRoot as. */
  as?: string
  /** Whether the checkbox is required. */
  required?: boolean
  /** Whether CheckboxIndicator should force-mount even when unchecked. */
  indicatorForceMount?: boolean
  /** Whether CheckboxIndicator renders as a child element. */
  indicatorAsChild?: boolean
  /** Element or component to render CheckboxIndicator as. */
  indicatorAs?: string
  class?: ClassValue
  /** Per-slot class overrides for any slot in this component. */
  classNames?: Partial<{
    base: ClassValue
    control: ClassValue
    indicator: ClassValue
    content: ClassValue
  }>
}>(), {
  variant: undefined,
  value: undefined,
  modelValue: undefined,
  defaultValue: false,
  isDisabled: undefined,
  disabled: undefined,
  isInvalid: false,
  isIndeterminate: false,
  name: undefined,
  id: undefined,
  trueValue: undefined,
  falseValue: undefined,
  asChild: false,
  as: undefined,
  required: false,
  indicatorForceMount: undefined,
  indicatorAsChild: false,
  indicatorAs: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const attrs = useAttrs()

// Inject CheckboxGroup context with fallback defaults (standalone mode)
const groupCtx = useCheckboxGroupInject({
  variant: ref('primary'),
  disabled: ref(false),
  isInvalid: ref(false),
  selectedValues: ref([]),
  toggleValue: () => {},
  name: ref(undefined),
})

// Resolve this checkbox's own isDisabled/disabled prop pair before combining with group state.
const resolvedDisabled = useDeprecatedBooleanProp(
  'Checkbox', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

// Prop precedence: group disabled wins (D-02)
const isDisabled = computed(() => groupCtx.disabled.value || resolvedDisabled.value)
// Group invalid overrides item; item prop allows standalone invalid
const effectiveInvalid = computed(() => groupCtx.isInvalid.value || props.isInvalid)

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
function handleUpdate(val: string | number | boolean) {
  if (isInGroup.value) {
    groupCtx.toggleValue(props.value!)
  } else {
    if (val !== 'indeterminate') {
      emit('update:modelValue', Boolean(val))
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
    :aria-invalid="effectiveInvalid || undefined"
    :name="props.name ?? groupCtx.name.value"
    :value="props.value"
    :id="props.id"
    :true-value="props.trueValue"
    :false-value="props.falseValue"
    :as-child="props.asChild"
    :as="props.as"
    :required="props.required"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    @update:model-value="handleUpdate"
  >
    <span :class="composeClassName(slotFns.control(), props.classNames?.control)">
      <CheckboxIndicator
        :force-mount="props.indicatorForceMount"
        :as-child="props.indicatorAsChild"
        :as="props.indicatorAs"
        :class="composeClassName(slotFns.indicator(), props.classNames?.indicator)"
      >
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
