<script setup lang="ts">
import { computed, ref } from 'vue'
import { Primitive } from 'reka-ui'
import { buttonVariants, type ButtonVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useButtonGroupInject } from './button-group.context'
import Spinner from '../spinner/Spinner.vue'
import { warnDeprecatedVariant } from '../../utils/warnDeprecated'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  /**
   * Visual style of the button. The value `'outline'` is deprecated — use
   * `'bordered'` instead. Deliberately prose, not a JSDoc deprecation tag:
   * that tag marks the whole prop as deprecated, and doc tooling would then
   * drop `variant` entirely. Deprecated *values* are declared by the
   * warnDeprecatedVariant call below.
   */
  variant?: ButtonVariants['variant'] | 'outline'
  color?: ButtonVariants['color']
  size?: ButtonVariants['size']
  radius?: ButtonVariants['radius']
  isIconOnly?: boolean
  fullWidth?: boolean
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  isLoading?: boolean
  as?: string | object
  class?: ClassValue
  /** Override classes for individual slots (base, startContent, label, endContent, spinner) */
  classNames?: Partial<{
    base: ClassValue
    startContent: ClassValue
    label: ClassValue
    endContent: ClassValue
    spinner: ClassValue
  }>
  value?: string | number
}>(), {
  variant: undefined,
  color: undefined,
  size: undefined,
  radius: undefined,
  isIconOnly: false,
  fullWidth: false,
  isDisabled: undefined,
  disabled: undefined,
  isLoading: false,
  as: 'button',
  value: undefined,
})

// Inject ButtonGroup context unconditionally with fallback defaults (D-12)
// When no ButtonGroup is present, inject returns these fallback values (no-op)
const groupCtx = useButtonGroupInject({
  variant: ref('solid'),
  color: ref('primary'),
  size: ref('md'),
  disabled: ref(false),
  fullWidth: ref(false),
  orientation: ref('horizontal'),
  selectionMode: ref('single'),
  selectedValue: ref(null),
  isValueSelected: () => false,
  selectValue: () => {},
})

const isSelected = computed(() => groupCtx.isValueSelected(props.value))

function handleClick() {
  if (props.value !== undefined) groupCtx.selectValue(props.value)
}

// Resolve this button's own isDisabled/disabled prop pair before combining with group state.
const resolvedDisabled = useDeprecatedBooleanProp(
  'Button', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

// Prop precedence rules (D-13):
// - group disabled ALWAYS wins over child prop
// - all other props: child prop wins over group value (child ?? group)
const effectiveDisabled = computed(() => groupCtx.disabled.value || resolvedDisabled.value)
const finalVariant = computed(() => props.variant ?? groupCtx.variant.value)
const finalColor = computed(() => props.color ?? groupCtx.color.value)
const finalSize = computed(() => props.size ?? groupCtx.size.value)
const finalFullWidth = computed(() => props.fullWidth || groupCtx.fullWidth.value)

// Map legacy variant names to new variant+color so old usage keeps working
const LEGACY_VARIANTS: Record<string, { variant: string; color: string }> = {
  primary:       { variant: 'solid',   color: 'primary' },
  secondary:     { variant: 'default', color: 'default' },
  tertiary:      { variant: 'default', color: 'default' },
  danger:        { variant: 'solid',   color: 'danger' },
  'danger-soft': { variant: 'soft',    color: 'danger' },
  success:       { variant: 'solid',   color: 'success' },
  'success-soft':{ variant: 'soft',    color: 'success' },
  warning:       { variant: 'solid',   color: 'warning' },
  'warning-soft':{ variant: 'soft',    color: 'warning' },
}

const resolvedVariant = computed(() => {
  const v = finalVariant.value
  if (!v) return v
  if (v === 'outline') {
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    return 'bordered' as ButtonVariants['variant']
  }
  return (LEGACY_VARIANTS[v]?.variant ?? v) as ButtonVariants['variant']
})

const resolvedColor = computed(() => {
  const v = finalVariant.value
  // If caller explicitly set color, respect it; otherwise infer from legacy variant
  if (props.color === undefined && v && LEGACY_VARIANTS[v]) return LEGACY_VARIANTS[v].color as ButtonVariants['color']
  return finalColor.value
})

const slotFns = computed(() =>
  buttonVariants({
    variant: resolvedVariant.value,
    color: resolvedColor.value,
    size: finalSize.value,
    radius: props.radius,
    isIconOnly: props.isIconOnly,
    fullWidth: finalFullWidth.value,
    isLoading: props.isLoading,
  })
)

// Spinner size scales with button size
const spinnerSize = computed(() => {
  if (finalSize.value === 'xs' || finalSize.value === 'sm') return 'sm' as const
  if (finalSize.value === 'lg' || finalSize.value === 'xl') return 'lg' as const
  return 'md' as const
})
</script>

<template>
  <Primitive
    :as="props.as"
    :type="props.as === 'button' ? 'button' : undefined"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    :disabled="effectiveDisabled || props.isLoading || undefined"
    :data-disabled="effectiveDisabled || undefined"
    :data-loading="props.isLoading || undefined"
    :data-orientation="groupCtx.orientation.value"
    :data-selected="isSelected || undefined"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- startContent named slot -->
    <span
      v-if="$slots.startContent"
      :class="composeClassName(slotFns.startContent(), props.classNames?.startContent)"
    >
      <slot name="startContent" />
    </span>

    <!-- default (label) slot -->
    <span :class="composeClassName(slotFns.label(), props.classNames?.label)">
      <slot />
    </span>

    <!-- endContent named slot -->
    <span
      v-if="$slots.endContent"
      :class="composeClassName(slotFns.endContent(), props.classNames?.endContent)"
    >
      <slot name="endContent" />
    </span>

    <!-- Loading spinner: absolute-centered, only rendered when isLoading=true (D-08, D-09) -->
    <!-- color="current" inherits --button-fg so spinner contrasts with the button background -->
    <span
      v-if="props.isLoading"
      :class="composeClassName(slotFns.spinner(), props.classNames?.spinner)"
      aria-hidden="true"
      data-slot="spinner"
    >
      <Spinner
        :size="spinnerSize"
        color="current"
      />
    </span>
  </Primitive>
</template>
