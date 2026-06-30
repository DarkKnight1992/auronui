import type { Ref } from 'vue'
import type { CheckboxVariants } from '@auronui/styles'
import { createContext } from '../../utils/context'

/**
 * CANONICAL DUAL-CONTEXT TEMPLATE (Phase 4, D-01)
 *
 * This is the reference implementation for all Phase 4+ group components.
 * Radio/RadioGroup, Switch/SwitchGroup, and ToggleButton/ToggleButtonGroup
 * all follow this exact shape.
 *
 * Contract:
 * - Group provides a Ref-wrapped context via `useProvide`
 * - Child unconditionally calls `useInject(fallback)` with sensible defaults
 * - Prop precedence: group.disabled wins; child.variant/size wins
 */
export interface CheckboxGroupContext {
  variant: Ref<CheckboxVariants['variant']>
  disabled: Ref<boolean>
  isInvalid: Ref<boolean>
  selectedValues: Ref<string[]>
  toggleValue: (value: string) => void
  name: Ref<string | undefined>
}

export const {
  useProvide: useCheckboxGroupProvide,
  useInject: useCheckboxGroupInject,
  key: checkboxGroupContextKey,
} = createContext<CheckboxGroupContext>('CheckboxGroup')
