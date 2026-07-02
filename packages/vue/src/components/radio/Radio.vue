<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { RadioGroupItem, RadioGroupIndicator } from 'reka-ui'
import { radioVariants, type RadioGroupVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useRadioGroupInject } from './radio-group.context'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

// Disable Vue attribute fallthrough — we manually forward $attrs to RadioGroupItem
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  value: string
  variant?: RadioGroupVariants['variant']
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  isInvalid?: boolean
  /** HTML id attribute forwarded to RadioGroupItem. */
  id?: string
  /** Whether RadioGroupItem renders as a child element. */
  asChild?: boolean
  /** Element or component to render RadioGroupItem as. */
  as?: string
  /** HTML name attribute forwarded to RadioGroupItem. */
  name?: string
  /** Whether the radio item is required. */
  required?: boolean
  /** Whether RadioGroupIndicator should force-mount even when unselected. */
  indicatorForceMount?: boolean
  /** Whether RadioGroupIndicator renders as a child element. */
  indicatorAsChild?: boolean
  /** Element or component to render RadioGroupIndicator as. */
  indicatorAs?: string
  class?: ClassValue
  /** Override classNames for individual slots */
  classNames?: Partial<{
    base: ClassValue
    control: ClassValue
    indicator: ClassValue
    content: ClassValue
  }>
}>(), {
  variant: undefined,
  isDisabled: undefined,
  disabled: undefined,
  isInvalid: false,
  id: undefined,
  asChild: false,
  as: undefined,
  name: undefined,
  required: false,
  indicatorForceMount: undefined,
  indicatorAsChild: false,
  indicatorAs: undefined,
  class: undefined,
  classNames: undefined,
})

const emit = defineEmits<{
  'select': [event: Event]
}>()

const attrs = useAttrs()

// Inject RadioGroup context with fallback defaults (standalone mode)
const groupCtx = useRadioGroupInject({
  variant: ref(undefined),
  disabled: ref(false),
  isInvalid: ref(false),
})

// Resolve this radio's own isDisabled/disabled prop pair before combining with group state.
const resolvedDisabled = useDeprecatedBooleanProp(
  'Radio', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

// Prop precedence: group disabled wins (D-02)
const isDisabled = computed(() => groupCtx.disabled.value || resolvedDisabled.value)
// Group invalid overrides item; item prop allows standalone invalid
const effectiveInvalid = computed(() => groupCtx.isInvalid.value || props.isInvalid)

// Child variant wins over group variant (used for data-variant attribute propagation)
const finalVariant = computed(() => props.variant ?? groupCtx.variant.value)

const slotFns = computed(() => radioVariants())
</script>

<template>
  <RadioGroupItem
    v-bind="attrs"
    :value="props.value"
    :disabled="isDisabled"
    :aria-invalid="effectiveInvalid || undefined"
    :id="props.id"
    :as-child="props.asChild"
    :as="props.as"
    :name="props.name"
    :required="props.required"
    :data-variant="finalVariant"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    @select="emit('select', $event)"
  >
    <span :class="composeClassName(slotFns.control(), props.classNames?.control)">
      <RadioGroupIndicator
        :force-mount="props.indicatorForceMount"
        :as-child="props.indicatorAsChild"
        :as="props.indicatorAs"
        :class="composeClassName(slotFns.indicator(), props.classNames?.indicator)"
      />
    </span>
    <span :class="composeClassName(slotFns.content(), props.classNames?.content)">
      <slot />
    </span>
  </RadioGroupItem>
</template>
