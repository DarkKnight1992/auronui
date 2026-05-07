<script setup lang="ts">
import { computed } from 'vue'
import { fieldsetVariants } from '@auronui/styles'

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
    disabled?: boolean
    /** Additional CSS classes applied to the <fieldset> element */
    class?: string
  }>(),
  {
    legend: undefined,
    disabled: false,
    class: undefined,
  }
)

const styles = fieldsetVariants()

const baseClass = computed(() => {
  const classes = [styles.base()]
  if (props.class) classes.push(props.class)
  return classes.join(' ')
})
</script>

<template>
  <fieldset
    :class="baseClass"
    :disabled="props.disabled || undefined"
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
