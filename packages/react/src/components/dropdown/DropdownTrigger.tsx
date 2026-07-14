import { Children, cloneElement, isValidElement, useRef, type ReactElement, type Ref } from "react";
import { mergeProps, mergeRefs, usePress } from "react-aria";
import { resolveDeprecatedBooleanProp } from "../../utils";

export interface DropdownTriggerProps {
  /** Whether the trigger is disabled. */
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  /** Single child element (typically an Auron `<Button>`) that becomes the dropdown's trigger. */
  children: ReactElement;
}

/**
 * Merges react-aria-components' MenuTrigger press/ARIA props onto its single child element —
 * the React equivalent of reka-ui's `asChild` merge-props pattern used by the Vue
 * DropdownTrigger.vue (which defaults `asChild` to true and never renders its own DOM node).
 *
 * Implementation note: react-aria-components' <MenuTrigger> wraps its children in a
 * `PressResponder` (from `react-aria`), which only merges its press/ARIA props into a
 * descendant that itself calls `usePress()` — this is exactly how react-aria-components' own
 * `<Button>` primitive integrates with triggers. Since Auron's `<Button>` is a plain DOM
 * button with no react-aria dependency, DropdownTrigger calls `usePress()` itself and clones
 * that merged result onto the child, so any Auron component (typically `<Button>`) can be used
 * as the trigger without modification.
 */
export function DropdownTrigger({ isDisabled, disabled, children }: DropdownTriggerProps) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "DropdownTrigger",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const localRef = useRef<HTMLElement>(null);
  const { pressProps } = usePress({ ref: localRef, isDisabled: resolvedDisabled });

  const child = Children.only(children);
  if (!isValidElement(child)) return child;

  const childProps = child.props as Record<string, unknown> & { ref?: Ref<HTMLElement> };

  return cloneElement(
    child,
    mergeProps(childProps, pressProps, {
      ref: mergeRefs(localRef, childProps.ref ?? null),
      // Mirrors reka-ui's asChild merge, which forwards `disabled` onto the trigger's child
      // element (e.g. a native <button>). Auron's own `<Button>` reads its canonical
      // `isDisabled` prop for this rather than the deprecated bare `disabled` name.
      isDisabled: resolvedDisabled || undefined,
      "aria-disabled": resolvedDisabled || undefined,
    }),
  );
}
