import type { ReactNode } from "react";
import { Text } from "react-aria-components";
import { composeClassName, type ClassValue } from "../../utils";
import { useModalContext } from "./modal.context";

export interface ModalDescriptionProps {
  children?: ReactNode;
  className?: ClassValue;
}

/**
 * Renders `<Text slot="description">` with the same `id` that `ModalContent`
 * wires as `Dialog`'s `aria-describedby` (via `ModalContext.descriptionId`),
 * so the description is announced the same way reka-ui's `DialogDescription`
 * is in Vue. react-aria-components' `Dialog` only auto-wires `aria-labelledby`
 * from a `Heading slot="title"` — there is no built-in `slot="description"` ->
 * `aria-describedby` wiring, so this component + `ModalContent`'s explicit
 * `aria-describedby={ctx.descriptionId}` reconstruct that association manually.
 */
export function ModalDescription({ children, className }: ModalDescriptionProps) {
  const ctx = useModalContext();
  return (
    <Text id={ctx.descriptionId} slot="description" className={composeClassName("text-sm text-muted", className)}>
      {children}
    </Text>
  );
}
