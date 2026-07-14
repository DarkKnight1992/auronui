import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { kbdVariants, type KbdVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface KbdOwnProps {
  variant?: KbdVariants["variant"];
  className?: ClassValue;
  /** Override classes on individual slots */
  classNames?: Partial<{
    base: ClassValue;
    abbr: ClassValue;
    content: ClassValue;
  }>;
  /** Content rendered inside the <abbr> slot (e.g. full key name for screen readers) */
  abbr?: ReactNode;
  children?: ReactNode;
}

export type KbdProps = KbdOwnProps & Omit<ComponentPropsWithoutRef<"kbd">, keyof KbdOwnProps>;

export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { variant = "default", className, classNames, abbr, children, ...rest },
  ref,
) {
  const slotFns = kbdVariants({ variant });

  return (
    <kbd ref={ref} className={composeClassName(slotFns.base(), className, classNames?.base)} {...rest}>
      {abbr !== undefined && (
        <abbr className={composeClassName(slotFns.abbr(), classNames?.abbr)}>{abbr}</abbr>
      )}
      <span className={composeClassName(slotFns.content(), classNames?.content)}>{children}</span>
    </kbd>
  );
});
