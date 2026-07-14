import {
  forwardRef,
  useEffect,
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { collapsibleVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { CollapsibleProvider } from "./collapsible.context";
import { useCollapsibleGroupContext } from "./collapsible-group.context";

export interface CollapsibleOwnProps {
  /** Controlled open state. Omit for uncontrolled mode (use defaultOpen). */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  className?: ClassValue;
  /** Override classes for individual slots */
  classNames?: Partial<{ base: ClassValue }>;
  children?: ReactNode;
}

export type CollapsibleProps = CollapsibleOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof CollapsibleOwnProps>;

export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  {
    open,
    defaultOpen = false,
    onOpenChange,
    isDisabled,
    disabled,
    className,
    classNames,
    children,
    ...rest
  },
  ref,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "Collapsible",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  // Inside a CollapsibleGroup, this Collapsible must be controllable externally
  // (the group force-closes siblings on single-open), so it always tracks its
  // own internal mirror of `open`, synced from the `open` prop when controlled.
  const group = useCollapsibleGroupContext();
  const id = useId();
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(open ?? defaultOpen);

  useEffect(() => {
    if (isControlled && open !== internalOpen) setInternalOpen(open as boolean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!group) return;
    group.register({ id, close: () => setInternalOpen(false) });
    return () => group.unregister(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, id]);

  function toggle(): void {
    if (resolvedDisabled) return;
    const next = !internalOpen;
    setInternalOpen(next);
    onOpenChange?.(next);
    if (next && group) group.notifyOpen(id);
  }

  const slotFns = collapsibleVariants({});

  return (
    <CollapsibleProvider value={{ slotFns, isOpen: internalOpen, isDisabled: resolvedDisabled, toggle }}>
      <div
        ref={ref}
        data-state={internalOpen ? "open" : "closed"}
        data-disabled={resolvedDisabled ? "true" : undefined}
        className={composeClassName(slotFns.base(), className, classNames?.base)}
        {...rest}
      >
        {children}
      </div>
    </CollapsibleProvider>
  );
});
