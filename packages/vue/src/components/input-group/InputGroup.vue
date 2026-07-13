<!--
  InputGroup — generic bordered box that visually merges arbitrary content
  (icons, buttons, an InputGroupInput) into a single field-styled unit.

  Unlike Input (which owns a single native <input> plus label/clear/
  password-toggle machinery), InputGroup is agnostic about its children —
  it just provides the shared box + size/invalid/disabled context that
  InputGroupAddon and InputGroupInput read from. It does own label/
  description/errorMessage, though (via the same useFormField machinery
  Input uses) — aria-describedby and the generated field id are exposed
  through context so a contained InputGroupInput wires itself up
  automatically, the same way Input's own <input> does internally.

  Label is always rendered outside (above the box) — there's no "inside
  floating label" mode, since that only makes sense for a single owned
  <input>, not an arbitrary collection of addons/inputs.

  ─── Usage ──────────────────────────────────────────────────────────────
    <InputGroup label="Amount" error-message="Required" :is-invalid="!amount">
      <InputGroupAddon aria-hidden="true">$</InputGroupAddon>
      <InputGroupInput v-model="amount" placeholder="0.00" />
    </InputGroup>
-->
<script setup lang="ts">
import { computed, useId } from 'vue'
import { inputGroupVariants, type InputGroupVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useFormField } from '../../composables/useFormField'
import FieldLabel from '../_shared/FieldLabel.vue'
import FormFieldHelper from '../_shared/FormFieldHelper.vue'
import { useInputGroupProvide } from './input-group.context'

const props = withDefaults(
  defineProps<{
    /** Visual style of the group. @default 'flat' */
    variant?: InputGroupVariants['variant']
    /** Field height. @default 'md' */
    size?: InputGroupVariants['size']
    /** Accent color applied to the focus ring. @default 'default' */
    color?: InputGroupVariants['color']
    /** Marks the group as invalid. Triggers danger styling and enables `errorMessage`. @default false */
    isInvalid?: boolean
    /** Disables the group and everything inside it. @default false */
    isDisabled?: boolean
    /** Adds a required asterisk next to the label. @default false */
    isRequired?: boolean
    /** Stretches the group to 100% width. @default false */
    fullWidth?: boolean
    /** Label rendered above the box. */
    label?: string
    /** Helper text displayed below the box. Suppressed when `isInvalid && errorMessage` is shown. */
    description?: string
    /** Error text displayed below the box. Only rendered when `isInvalid` is also true. Takes precedence over `description`. */
    errorMessage?: string
    /** Extra classes merged onto the box. */
    class?: ClassValue
    /** Per-slot class overrides. */
    classNames?: Partial<{
      root: ClassValue
      base: ClassValue
      label: ClassValue
      helperWrapper: ClassValue
      description: ClassValue
      errorMessage: ClassValue
    }>
  }>(),
  {
    variant: 'flat',
    size: 'md',
    color: 'default',
    isInvalid: false,
    isDisabled: false,
    isRequired: false,
    fullWidth: false,
    label: undefined,
    description: undefined,
    errorMessage: undefined,
    class: undefined,
    classNames: undefined,
  },
)

const generatedId = useId()

const {
  descriptionId,
  errorMessageId,
  showError,
  showDescription,
  hasHelper,
  ariaDescribedBy,
  hasLabel,
  rootDataAttrs,
} = useFormField({
  fieldId: () => generatedId,
  label: () => props.label,
  description: () => props.description,
  errorMessage: () => props.errorMessage,
  isInvalid: () => props.isInvalid,
  isDisabled: () => props.isDisabled,
  isReadOnly: () => false,
  isRequired: () => props.isRequired,
  labelPlacement: () => 'outside',
})

useInputGroupProvide({
  size: computed(() => props.size),
  isInvalid: computed(() => props.isInvalid),
  isDisabled: computed(() => props.isDisabled),
  fieldId: computed(() => generatedId),
  ariaDescribedBy,
})

const slotFns = computed(() =>
  inputGroupVariants({ variant: props.variant, size: props.size, color: props.color, fullWidth: props.fullWidth }),
)
</script>

<template>
  <div
    :class="composeClassName(slotFns.root(), props.classNames?.root)"
    data-slot="input-group-root"
    v-bind="rootDataAttrs"
  >
    <FieldLabel
      v-if="hasLabel"
      :for="generatedId"
      :label="label"
      :is-required="isRequired"
      :class="composeClassName(slotFns.label(), props.classNames?.label)"
    />
    <div
      :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
      data-slot="input-group"
      :data-invalid="isInvalid || undefined"
      :data-disabled="isDisabled || undefined"
    >
      <slot />
    </div>
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
</template>
