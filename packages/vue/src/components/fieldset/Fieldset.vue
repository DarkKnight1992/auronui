<script setup lang="ts">
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { computed } from 'vue'
import { fieldsetVariants } from '@auronui/styles'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

/**
 * Fieldset component — semantic HTML grouping for related form controls.
 *
 * Renders a <fieldset> with an optional <legend> for labeling the group.
 * Fieldset is purely structural and does not participate in VeeValidate
 * validation directly (per D-09). Its primary purpose is to group related
 * form controls with correct ARIA semantics for screen readers.
 *
 * Accessibility: <fieldset> + <legend> is the canonical HTML way to associate
 * a group label with its contained controls. Screen readers announce the
 * legend when entering the group.
 *
 * @example
 * <Fieldset legend="Personal Information">
 *   <Input name="firstName" label="First Name" />
 *   <Input name="lastName" label="Last Name" />
 * </Fieldset>
 */
const props = withDefaults(
  defineProps<{
    /** Text content for the <legend> element; omit to render fieldset without a legend */
    legend?: string
    /** When true, disables all form controls inside this fieldset */
    isDisabled?: boolean
    /** @deprecated Use isDisabled instead. */
    disabled?: boolean
    /** Additional CSS classes applied to the <fieldset> element */
    class?: ClassValue
  }>(),
  {
    legend: undefined,
    isDisabled: undefined,
    disabled: undefined,
    class: undefined,
  }
)

const isDisabled = useDeprecatedBooleanProp(
  'Fieldset', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const styles = fieldsetVariants()

const baseClass = computed(() => composeClassName(styles.base(), props.class))
</script>

<template>
  <fieldset
    :class="baseClass"
    :disabled="isDisabled || undefined"
  >
    <legend
      v-if="props.legend"
      :class="styles.legend()"
    >
      {{ props.legend }}
    </legend>
    <slot />
  </fieldset>
</template>
