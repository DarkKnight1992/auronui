import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { linkVariants, type LinkVariants } from "@auronui/styles";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface LinkOwnProps {
  as?: ElementType;
  href?: string;
  target?: string;
  rel?: string;
  isExternal?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  color?: LinkVariants["color"];
  underline?: LinkVariants["underline"];
  className?: ClassValue;
  /** Override classes for individual slots */
  classNames?: Partial<{
    base: ClassValue;
    icon: ClassValue;
  }>;
  children?: ReactNode;
}

export type LinkProps = LinkOwnProps & Omit<ComponentPropsWithoutRef<"a">, keyof LinkOwnProps>;

export const Link = forwardRef<HTMLElement, LinkProps>(function Link(
  {
    as: As = "a",
    href,
    target,
    rel,
    isExternal = false,
    isDisabled,
    disabled,
    color,
    underline,
    className,
    classNames,
    children,
    ...rest
  },
  ref,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "Link",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const slotFns = linkVariants({ color, underline });

  // isExternal auto-applies target + rel; consumer can override by passing explicit target/rel
  const resolvedTarget = target ?? (isExternal ? "_blank" : undefined);
  const resolvedRel = rel ?? (isExternal ? "noopener noreferrer" : undefined);

  const Comp = As as ElementType;

  return (
    <Comp
      ref={ref}
      href={href}
      target={resolvedTarget}
      rel={resolvedRel}
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      aria-disabled={dataAttr(resolvedDisabled)}
      {...rest}
    >
      {children}
      {isExternal && (
        <span
          className={composeClassName(slotFns.icon(), classNames?.icon)}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </span>
      )}
    </Comp>
  );
});
