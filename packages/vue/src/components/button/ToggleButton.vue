<script setup lang="ts">
import { computed, ref } from 'vue'
import { Toggle } from 'reka-ui'
import { toggleButtonVariants, type ToggleButtonVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useToggleButtonGroupInject } from './toggle-button-group.context'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  variant?: ToggleButtonVariants['variant']
  size?: ToggleButtonVariants['size']
  isIconOnly?: boolean
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  modelValue?: boolean
  defaultValue?: boolean
  value?: string
  class?: string
  as?: string
  asChild?: boolean
  name?: string
  isRequired?: boolean
  /** @deprecated Use isRequired instead. */
  required?: boolean
}>(), {
  variant: undefined,
  size: undefined,
  isIconOnly: false,
  isDisabled: undefined,
  disabled: undefined,
  modelValue: undefined,
  defaultValue: false,
  value: undefined,
  as: undefined,
  asChild: false,
  name: undefined,
  isRequired: undefined,
  required: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Inject ToggleButtonGroup context with fallback defaults (mirrors Button → ButtonGroup pattern)
const groupCtx = useToggleButtonGroupInject({
  variant: ref('default'),
  size: ref('md'),
  disabled: ref(false),
  fullWidth: ref(false),
  orientation: ref('horizontal'),
  selectionMode: ref('multiple'),
  selectedValues: ref([]),
  toggleValue: () => {},
})

// Resolve this button's own isDisabled/disabled prop pair before combining with group state.
const resolvedDisabled = useDeprecatedBooleanProp(
  'ToggleButton', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const isRequired = useDeprecatedBooleanProp(
  'ToggleButton', 'isRequired', () => props.isRequired, 'required', () => props.required,
)

// Prop precedence: group disabled wins; child prop wins for variant/size
const effectiveDisabled = computed(() => groupCtx.disabled.value || resolvedDisabled.value)
const finalVariant = computed(() => props.variant ?? groupCtx.variant.value)
const finalSize = computed(() => props.size ?? groupCtx.size.value)

// When inside a group with selectionMode and a value prop, derive pressed from group state
const isGroupManaged = computed(() => props.value !== undefined)
const isPressed = computed(() => {
  if (isGroupManaged.value) {
    return groupCtx.selectedValues.value.includes(props.value!)
  }
  return props.modelValue
})

function handleUpdate(val: boolean) {
  if (isGroupManaged.value) {
    groupCtx.toggleValue(props.value!)
  } else {
    emit('update:modelValue', val)
  }
}

const classes = computed(() =>
  toggleButtonVariants({
    variant: finalVariant.value,
    size: finalSize.value,
    isIconOnly: props.isIconOnly,
  })
)
</script>

<template>
  <!--
    Use as-child so Reka's Toggle merges data-state / aria-pressed / onClick directly
    onto OUR <button> element instead of relying on a 2-level inheritAttrs chain
    (Toggle → Primitive → button). This guarantees the toggle-button CSS class and
    data-state="on" are always on the same DOM element, so [data-state="on"] selectors
    apply correctly.
  -->
  <Toggle
    as-child
    :disabled="effectiveDisabled"
    :model-value="isPressed"
    :default-value="props.defaultValue"
    :name="props.name"
    :required="isRequired"
    @update:model-value="handleUpdate"
  >
    <button
      :class="composeClassName(classes, props.class)"
      :disabled="effectiveDisabled || undefined"
      :data-orientation="groupCtx.orientation.value"
      :type="'button'"
    >
      <slot />
    </button>
  </Toggle>
</template>
