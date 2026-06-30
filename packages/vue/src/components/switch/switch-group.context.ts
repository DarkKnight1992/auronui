import type { Ref } from 'vue'
import type { SwitchVariants } from '@auronui/styles'
import { createContext } from '../../utils/context'

/**
 * SwitchGroup dual-context (follows CANONICAL DUAL-CONTEXT TEMPLATE
 * from components/checkbox/checkbox-group.context.ts).
 *
 * Note: Reka UI has NO SwitchGroup primitive. This is a fully custom
 * group implementation mirroring CheckboxGroup exactly, with the addition
 * of a `size` ref (Switch has size variants; Checkbox does not).
 *
 * Contract:
 * - Group provides a Ref-wrapped context via `useProvide`
 * - Child unconditionally calls `useInject(fallback)` with sensible defaults
 * - Prop precedence: group.disabled wins; child.variant/size wins over group.variant/size
 */
export interface SwitchGroupContext {
  size: Ref<SwitchVariants['size']>
  disabled: Ref<boolean>
  isInvalid: Ref<boolean>
  selectedValues: Ref<string[]>
  toggleValue: (value: string) => void
  name: Ref<string | undefined>
}

export const {
  useProvide: useSwitchGroupProvide,
  useInject: useSwitchGroupInject,
  key: switchGroupContextKey,
} = createContext<SwitchGroupContext>('SwitchGroup')
