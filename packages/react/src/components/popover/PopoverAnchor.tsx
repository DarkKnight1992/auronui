import { cloneElement, isValidElement, type ReactElement, type Ref } from "react";
import { usePopoverContext } from "./popover.context";

export interface PopoverAnchorProps {
  /** A single element to anchor the popover to, instead of the trigger element. */
  children: ReactElement;
}

// Local ref-merging helper — mirrors what `@radix-ui/react-slot` does internally, scoped to this
// file since PopoverTrigger/PopoverClose use plain `cloneElement` (matching ModalTrigger/
// ModalClose) rather than Slot, and this is the only place in this component that needs to merge
// two refs onto one child.
function mergeRefs<T>(...refs: Array<Ref<T> | undefined | null>) {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as { current: T | null }).current = node;
    }
  };
}

/**
 * Lets the popover anchor to a different element than its trigger — mirrors reka-ui's
 * `PopoverAnchor`. react-aria-components' `Popover` has no dedicated anchor primitive, but its
 * `triggerRef` prop ("only required when used standalone" per its docs) lets `PopoverContent`
 * point positioning at `anchorRef` instead of `triggerRef` once this component has attached it to
 * an element.
 */
export function PopoverAnchor({ children }: PopoverAnchorProps) {
  const { anchorRef } = usePopoverContext();

  if (!isValidElement(children)) return children;

  // React 19 exposes `ref` as a regular prop (`props.ref`), not `element.ref`.
  const existingRef = (children.props as { ref?: Ref<HTMLElement> }).ref ?? null;

  return cloneElement(children, {
    ref: mergeRefs(anchorRef, existingRef),
  } as Partial<unknown>);
}
