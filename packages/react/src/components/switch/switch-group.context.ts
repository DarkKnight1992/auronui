import type { SwitchVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

/**
 * SwitchGroup dual-context (mirrors CANONICAL DUAL-CONTEXT TEMPLATE from
 * components/checkbox/checkbox-group.context.ts).
 *
 * Note: Reka UI has no SwitchGroup primitive, and there is no browser-native
 * grouping mechanism for `role="switch"` buttons either — this is a fully
 * custom group implementation mirroring CheckboxGroup exactly, with the
 * addition of a `size` field (Switch has size variants; Checkbox does not).
 *
 * Contract:
 * - Group provides a context value via `Provider`
 * - Child unconditionally calls `useSwitchGroupContext(fallback)` with
 *   sensible defaults (standalone mode)
 * - Prop precedence: group.disabled wins; child.size wins over group.size
 */
export interface SwitchGroupContext {
  size: SwitchVariants["size"];
  disabled: boolean;
  isInvalid: boolean;
  selectedValues: string[];
  toggleValue: (value: string) => void;
  name: string | undefined;
}

export const DEFAULT_SWITCH_GROUP_CONTEXT: SwitchGroupContext = {
  size: "md",
  disabled: false,
  isInvalid: false,
  selectedValues: [],
  toggleValue: () => {},
  name: undefined,
};

export const {
  Provider: SwitchGroupProvider,
  useStrictContext: useSwitchGroupContext,
} = createStrictContext<SwitchGroupContext>("SwitchGroup");
