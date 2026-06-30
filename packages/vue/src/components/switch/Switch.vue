<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { switchVariants, type SwitchVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useSwitchGroupInject } from './switch-group.context'

// Disable Vue attribute fallthrough — we manually forward $attrs to SwitchRoot
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  size?: SwitchVariants['size']
  isInvalid?: boolean
  value?: string
  modelValue?: boolean
  defaultValue?: boolean
  disabled?: boolean
  name?: string
  /** HTML id attribute forwarded to SwitchRoot. */
  id?: string
  /** The value for the checked state. */
  trueValue?: boolean | string | number
  /** The value for the unchecked state. */
  falseValue?: boolean | string | number
  /** Whether SwitchRoot renders as a child element. */
  asChild?: boolean
  /** Element or component to render SwitchRoot as. */
  as?: string
  /** Whether the switch is required. */
  required?: boolean
  /** Whether SwitchThumb renders as a child element. */
  thumbAsChild?: boolean
  /** Element or component to render SwitchThumb as. */
  thumbAs?: string
  class?: ClassValue
  /** Per-slot class overrides. Each key is a slot name (e.g. 'base', 'control', 'thumb', 'content'). */
  classNames?: Partial<{
    base: ClassValue
    control: ClassValue
    thumb: ClassValue
    content: ClassValue
  }>
}>(), {
  size: undefined,
  value: undefined,
  modelValue: undefined,
  defaultValue: false,
  disabled: false,
  name: undefined,
  id: undefined,
  trueValue: undefined,
  falseValue: undefined,
  isInvalid: false,
  asChild: false,
  as: undefined,
  required: false,
  thumbAsChild: false,
  thumbAs: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const attrs = useAttrs()

// Inject SwitchGroup context with fallback defaults (standalone mode)
const groupCtx = useSwitchGroupInject({
  size: ref('md'),
  disabled: ref(false),
  isInvalid: ref(false),
  selectedValues: ref([]),
  toggleValue: () => {},
  name: ref(undefined),
})

// Prop precedence: group disabled wins (D-02)
const isDisabled = computed(() => groupCtx.disabled.value || props.disabled)
const effectiveInvalid = computed(() => groupCtx.isInvalid.value || props.isInvalid)

// Child size wins over group size
const finalSize = computed(() => props.size ?? groupCtx.size.value)

// Determine if inside a group (value prop is the signal)
const isInGroup = computed(() => props.value !== undefined)

// Compute checked state
const checked = computed<boolean>(() => {
  if (isInGroup.value) {
    return groupCtx.selectedValues.value.includes(props.value!)
  }
  return props.modelValue ?? false
})

// Handle Reka UI's update:checked event
function handleUpdate(val: string | number | boolean) {
  if (isInGroup.value) {
    groupCtx.toggleValue(props.value!)
  } else {
    emit('update:modelValue', Boolean(val))
  }
}

const slotFns = computed(() =>
  switchVariants({ size: finalSize.value })
)
</script>

<template>
  <!--
    v-bind="attrs" forwards aria-label and other HTML attributes through to Reka UI's
    SwitchRoot, which then applies them to the inner <button> element.
    inheritAttrs: false prevents double-application on SwitchRoot's root.
  -->
  <SwitchRoot
    v-bind="attrs"
    :model-value="checked"
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
      <SwitchThumb
        :as-child="props.thumbAsChild"
        :as="props.thumbAs"
        :class="composeClassName(slotFns.thumb(), props.classNames?.thumb)"
      />
    </span>
    <span
      v-if="$slots.default"
      :class="composeClassName(slotFns.content(), props.classNames?.content)"
    >
      <slot />
    </span>
  </SwitchRoot>
</template>
