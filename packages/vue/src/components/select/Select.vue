<script setup lang="ts">
import { computed, reactive, toRef, useAttrs, useId, useSlots } from 'vue'
import { SelectRoot } from 'reka-ui'
import { selectVariants, type SelectVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useSelectProvide, type SelectItemValue, type SelectItemData } from './Select.context'
import { hasSlotComponent } from '../../utils/hasSlotComponent'
import SelectTrigger from './SelectTrigger.vue'
import SelectValue from './SelectValue.vue'
import SelectContent from './SelectContent.vue'
import SelectItem from './SelectItem.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Props>(), {
  variant: 'flat',
  size: 'md',
  color: 'default',
  labelPlacement: 'inside',
  fullWidth: false,
  isInvalid: false,
  isDisabled: false,
  isReadonly: false,
  isRequired: false,
  multiple: false,
  modelValue: undefined,
  defaultValue: undefined,
  open: undefined,
  defaultOpen: undefined,
  items: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: SelectItemValue | SelectItemValue[]]
  'update:open': [value: boolean]
}>()

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
  class?: string

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

const hasLabel = computed(() => !!props.label)

const slots = useSlots()
// Tier 3 (advanced): consumer supplied explicit compound chrome → pass through.
// Tier 1/2 (terse): render trigger/value/content internally.
const usesCustomChrome = computed(() =>
  hasSlotComponent(slots.default?.(), [SelectTrigger, SelectContent]),
)

// Helper IDs / aria wiring
const descriptionId = computed(() => `${triggerId.value}-description`)
const errorMessageId = computed(() => `${triggerId.value}-error`)
const showError = computed(() => props.isInvalid && !!props.errorMessage)
const showDescription = computed(() => !!props.description && !showError.value)
const hasHelper = computed(() => showError.value || showDescription.value)
const ariaDescribedBy = computed(() => {
  if (showError.value) return errorMessageId.value
  if (showDescription.value) return descriptionId.value
  return undefined
})

const slotFns = computed(() =>
  selectVariants({
    variant: props.variant,
    size: props.size,
    color: props.color,
    fullWidth: props.fullWidth,
    isInvalid: props.isInvalid,
    isDisabled: props.isDisabled,
    isReadonly: props.isReadonly,
    hasLabel: hasLabel.value,
    labelPlacement: props.labelPlacement,
  }),
)

const showOutsideLabel = computed(
  () => hasLabel.value && props.labelPlacement !== 'inside',
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
  isReadonly: toRef(props, 'isReadonly'),
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
    :class="composeClassName(slotFns.base(), props.class)"
    :data-invalid="isInvalid || undefined"
    :data-disabled="isDisabled || undefined"
    :data-readonly="isReadonly || undefined"
    :data-required="isRequired || undefined"
    :data-has-label="hasLabel || undefined"
    :data-has-helper="hasHelper || undefined"
  >
    <label
      v-if="showOutsideLabel"
      :for="triggerId"
      :class="slotFns.label()"
    >{{ label }}<span
      v-if="isRequired"
      aria-hidden="true"
    > *</span></label>

    <div :class="slotFns.mainWrapper()">
      <SelectRoot
        :model-value="props.modelValue"
        :default-value="props.defaultValue"
        :multiple="props.multiple"
        :open="props.open"
        :default-open="props.defaultOpen"
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
          <SelectTrigger>
            <SelectValue :placeholder="props.placeholder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="item in props.items"
              :key="item.value"
              :value="item.value"
              :text-value="item.textValue"
              :is-disabled="item.isDisabled"
            >
              <slot
                name="item"
                :item="item"
              >{{ item.label ?? String(item.value) }}</slot>
            </SelectItem>
            <slot />
          </SelectContent>
        </template>
      </SelectRoot>

      <div
        v-if="hasHelper"
        :class="slotFns.helperWrapper()"
      >
        <div
          v-if="showError"
          :id="errorMessageId"
          :class="slotFns.errorMessage()"
        >
          {{ errorMessage }}
        </div>
        <div
          v-else-if="showDescription"
          :id="descriptionId"
          :class="slotFns.description()"
        >
          {{ description }}
        </div>
      </div>
    </div>
  </div>
</template>
