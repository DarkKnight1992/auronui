import type { Ref } from 'vue'
import type { RadioGroupVariants, RadioVariants } from '@auronui/styles'
import { createContext } from '../../utils/context'

/**
 * Radio dual-context (follows CANONICAL DUAL-CONTEXT TEMPLATE
 * from components/checkbox/checkbox-group.context.ts).
 *
 * Note: selection state is owned by Reka UI's RadioGroupRoot,
 * so this context only carries variant + disabled for propagation.
 *
 * Contract:
 * - Group provides a Ref-wrapped context via `useProvide`
 * - Child unconditionally calls `useInject(fallback)` with sensible defaults
 * - Prop precedence: group.disabled wins; child.variant wins over group.variant
 */
export interface RadioGroupContext {
  variant: Ref<RadioGroupVariants['variant']>
  color: Ref<RadioVariants['color']>
  disabled: Ref<boolean>
  isInvalid: Ref<boolean>
}

export const {
  useProvide: useRadioGroupProvide,
  useInject: useRadioGroupInject,
  key: radioGroupContextKey,
} = createContext<RadioGroupContext>('RadioGroup')
