import type { PointerEvent, ReactElement } from "react";
import { Slot } from "@radix-ui/react-slot";
import { useHoverCardContext } from "./hover-card.context";

export interface HoverCardTriggerProps {
  /** A single element (any Auron component that forwards its ref to a DOM node). */
  children: ReactElement;
}

/**
 * Wraps the trigger element with Radix's `Slot`, which merges hover/focus
 * handlers, `data-state`, and the shared `triggerRef` onto the child via
 * `cloneElement` — same "asChild" mechanism Reka UI's `HoverCardTrigger`
 * uses, built on `@radix-ui/react-slot` (already a dependency) since
 * react-aria-components has no equivalent context to piggyback on here
 * (this whole family is hand-rolled, unlike Tooltip).
 */
export function HoverCardTrigger({ children }: HoverCardTriggerProps) {
  const ctx = useHoverCardContext();

  function handlePointerEnter(event: PointerEvent) {
    if (event.pointerType === "touch") return;
    ctx.scheduleOpen();
  }

  function handlePointerLeave(event: PointerEvent) {
    if (event.pointerType === "touch") return;
    ctx.scheduleClose();
  }

  return (
    <Slot
      ref={ctx.triggerRef}
      data-state={ctx.isOpen ? "open" : "closed"}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={() => ctx.scheduleOpen(true)}
      onBlur={() => ctx.scheduleClose(true)}
    >
      {children}
    </Slot>
  );
}
