<script setup lang="ts">
import { computed, reactive, toRef, useAttrs, useId, useSlots } from 'vue'
import { SelectRoot } from 'reka-ui'
import { selectVariants, type SelectVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useSelectProvide, type SelectItemValue, type SelectItemData } from './Select.context'
import { hasSlotComponent } from '../../utils/hasSlotComponent'
import SelectTrigger from './SelectTrigger.vue'
import SelectValue from './SelectValue.vue'
import SelectContent from './SelectContent.vue'
import SelectItem from './SelectItem.vue'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'
import { useFormField } from '../../composables/useFormField'
import FieldLabel from '../_shared/FieldLabel.vue'
import FormFieldHelper from '../_shared/FormFieldHelper.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Props>(), {
  variant: 'flat',
  size: 'md',
  color: 'default',
  labelPlacement: 'inside',
  fullWidth: false,
  isInvalid: false,
  isDisabled: false,
  isReadOnly: undefined,
  isReadonly: undefined,
  isRequired: false,
  multiple: false,
  modelValue: undefined,
  defaultValue: undefined,
  open: undefined,
  defaultOpen: undefined,
  by: undefined,
  dir: undefined,
  autocomplete: undefined,
  items: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: SelectItemValue | SelectItemValue[]]
  'update:open': [value: boolean]
}>()

const isReadOnly = useDeprecatedBooleanProp(
  'Select', 'isReadOnly', () => props.isReadOnly, 'isReadonly', () => props.isReadonly,
)

type Props = {
  /** Visual style of the field. @default 'flat' */
  variant?: SelectVariants['variant']
  /** Field height. @default 'md' */
  size?: SelectVariants['size']
  /** Accent color applied to focus ring + floating label. @default 'default' */
  color?: SelectVariants['color']
  /**
   * Where the `label` is rendered relative to the field.
   * - `inside`: floats above the trigger (shrinks when focused/filled)
   * - `outside`: sits above the field, static
   * - `outside-left`: sits to the left, horizontal layout
   * @default 'inside'
   */
  labelPlacement?: SelectVariants['labelPlacement']
  /** Stretches root wrapper to 100% width. @default false */
  fullWidth?: boolean
  /** Marks the field as invalid. Triggers danger styling and enables `errorMessage`. @default false */
  isInvalid?: boolean
  /** Disables the field. @default false */
  isDisabled?: boolean
  /** Makes the field read-only. @default false */
  isReadOnly?: boolean
  /** @deprecated Use isReadOnly instead. */
  isReadonly?: boolean
  /** Adds a required asterisk next to the label. @default false */
  isRequired?: boolean
  /** Placeholder shown when no value is selected. */
  placeholder?: string
  /** Form field name, for native form submission. */
  name?: string
  /** Field label. When omitted, the floating-label behavior is skipped. */
  label?: string
  /** Helper text displayed below the field. Suppressed when `isInvalid && errorMessage` is shown. */
  description?: string
  /** Error text displayed below the field. Only rendered when `isInvalid` is also true. */
  errorMessage?: string
  /** Extra classes merged onto the root wrapper via `composeClassName`. */
  class?: ClassValue
  /** Per-slot class name overrides via `composeClassName`. */
  classNames?: Partial<{
    base: ClassValue
    label: ClassValue
    mainWrapper: ClassValue
    helperWrapper: ClassValue
    errorMessage: ClassValue
    description: ClassValue
    item: ClassValue
    indicator: ClassValue
    trigger: ClassValue
    startContent: ClassValue
    /** The chevron/indicator icon inside the trigger (distinct from `indicator`, which styles each item's checkmark). */
    triggerIndicator: ClassValue
    value: ClassValue
    chip: Partial<{
      base: ClassValue
      dot: ClassValue
      startContent: ClassValue
      label: ClassValue
      endContent: ClassValue
      closeButton: ClassValue
    }>
  }>

  /* ─── Select-specific ─────────────────────────────────────── */
  /** Two-way bound selected value. Accepts string or numeric keys. */
  modelValue?: SelectItemValue | SelectItemValue[]
  /** Initial selected value (uncontrolled). Accepts string or numeric keys. */
  defaultValue?: SelectItemValue | SelectItemValue[]
  /** Allow selecting multiple values. modelValue becomes string[]. @default false */
  multiple?: boolean
  /** Controls open state of the dropdown. */
  open?: boolean
  /** Initial open state of the dropdown (uncontrolled). */
  defaultOpen?: boolean
  /** Comparison key or function for value matching. */
  by?: string | ((a: SelectItemValue, b: SelectItemValue) => boolean)
  /** Text direction for the select. */
  dir?: 'ltr' | 'rtl'
  /** Native autocomplete attribute for the hidden input. */
  autocomplete?: string
  /**
   * Data-driven items for the terse API. When provided (and no SelectTrigger /
   * SelectContent is passed as a child), the trigger, value, and popover are
   * rendered internally. Use the `#item` slot to customize per-item rendering.
   */
  items?: SelectItemData[]
}

const attrs = useAttrs()
const generatedId = useId()
const triggerId = computed(() => (attrs.id as string | undefined) ?? generatedId)

const slots = useSlots()
// Tier 3 (advanced): consumer supplied explicit compound chrome → pass through.
// Tier 1/2 (terse): render trigger/value/content internally.
const usesCustomChrome = computed(() =>
  hasSlotComponent(slots.default?.({}), [SelectTrigger, SelectContent]),
)

const {
  descriptionId,
  errorMessageId,
  showError,
  showDescription,
  hasHelper,
  ariaDescribedBy,
  hasLabel,
  showOutsideLabel,
  rootDataAttrs,
} = useFormField({
  fieldId: () => triggerId.value,
  label: () => props.label,
  description: () => props.description,
  errorMessage: () => props.errorMessage,
  isInvalid: () => props.isInvalid,
  isDisabled: () => props.isDisabled,
  isReadOnly: () => isReadOnly.value,
  isRequired: () => props.isRequired,
  labelPlacement: () => props.labelPlacement,
})

const slotFns = computed(() =>
  selectVariants({
    variant: props.variant,
    size: props.size,
    color: props.color,
    fullWidth: props.fullWidth,
    isInvalid: props.isInvalid,
    isDisabled: props.isDisabled,
    isReadonly: isReadOnly.value,
    hasLabel: hasLabel.value,
    labelPlacement: props.labelPlacement,
  }),
)

// Persistent item registry. SelectItem populates on first mount; entries
// survive SelectContent unmount so SelectValue can render the label while
// the popover is closed.
const itemRegistry = reactive(new Map<SelectItemValue, string>())
const registerItem = (value: SelectItemValue, label: string) => {
  itemRegistry.set(value, label)
}
const itemLabel = (value: SelectItemValue | SelectItemValue[] | undefined | null): string => {
  if (value == null) return ''
  if (Array.isArray(value)) {
    // Fall back to the stringified value (handles numeric keys) when no label is
    // registered. Filter empty strings only — never use filter(Boolean), which
    // would drop a registered label for the numeric key 0.
    return value
      .map(v => String(itemRegistry.get(v) ?? v))
      .filter(s => s.length > 0)
      .join(', ')
  }
  return itemRegistry.get(value) ?? String(value)
}

function removeValue(value: SelectItemValue) {
  const current = Array.isArray(props.modelValue) ? props.modelValue : []
  emit('update:modelValue', current.filter(v => v !== value))
}

useSelectProvide({
  isDisabled: toRef(props, 'isDisabled'),
  isInvalid: toRef(props, 'isInvalid'),
  isReadonly: isReadOnly,
  isRequired: toRef(props, 'isRequired'),
  fullWidth: toRef(props, 'fullWidth'),
  hasLabel,
  labelPlacement: toRef(props, 'labelPlacement'),
  triggerId,
  label: toRef(props, 'label'),
  ariaDescribedBy,
  slots: slotFns,
  multiple: toRef(props, 'multiple'),
  registerItem,
  itemLabel,
  removeValue,
})
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    v-bind="rootDataAttrs"
  >
    <FieldLabel
      v-if="showOutsideLabel"
      :for="triggerId"
      :label="label"
      :is-required="isRequired"
      :class="composeClassName(slotFns.label(), props.classNames?.label)"
    />

    <div :class="composeClassName(slotFns.mainWrapper(), props.classNames?.mainWrapper)">
      <SelectRoot
        :model-value="props.modelValue"
        :default-value="props.defaultValue"
        :multiple="props.multiple"
        :open="props.open"
        :default-open="props.defaultOpen"
        :by="props.by"
        :dir="props.dir"
        :autocomplete="props.autocomplete"
        :disabled="props.isDisabled"
        :required="props.isRequired"
        :name="props.name"
        @update:model-value="emit('update:modelValue', $event as SelectItemValue | SelectItemValue[])"
        @update:open="emit('update:open', $event)"
      >
        <!-- Tier 3: consumer-provided compound chrome -->
        <slot v-if="usesCustomChrome" />
        <!-- Tier 1/2: internally rendered chrome -->
        <template v-else>
          <SelectTrigger
            :class-names="{ trigger: props.classNames?.trigger, label: props.classNames?.label, startContent: props.classNames?.startContent, indicator: props.classNames?.triggerIndicator }"
          >
            <SelectValue
              :placeholder="props.placeholder"
              :class-names="{ value: props.classNames?.value, chip: props.classNames?.chip }"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="item in props.items"
              :key="item.value"
              :value="item.value"
              :text-value="item.textValue ?? item.label"
              :is-disabled="item.isDisabled"
              :class-names="{ item: props.classNames?.item, indicator: props.classNames?.indicator }"
            >
              <slot
                name="item"
                :item="item"
              >
                {{ item.label ?? String(item.value) }}
              </slot>
            </SelectItem>
            <slot />
          </SelectContent>
        </template>
      </SelectRoot>

      <FormFieldHelper
        :has-helper="hasHelper"
        :show-error="showError"
        :show-description="showDescription"
        :error-message="errorMessage"
        :description="description"
        :error-message-id="errorMessageId"
        :description-id="descriptionId"
        :wrapper-class="composeClassName(slotFns.helperWrapper(), props.classNames?.helperWrapper)"
        :error-class="composeClassName(slotFns.errorMessage(), props.classNames?.errorMessage)"
        :description-class="composeClassName(slotFns.description(), props.classNames?.description)"
      />
    </div>
  </div>
</template>
