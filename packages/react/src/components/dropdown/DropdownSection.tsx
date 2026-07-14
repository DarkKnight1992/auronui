import type { ReactNode } from "react";
import { Header, MenuSection, Separator } from "react-aria-components";
import { menuSectionVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface DropdownSectionProps {
  title?: string;
  showDivider?: boolean;
  className?: ClassValue;
  children?: ReactNode;
}

/**
 * Maps to react-aria-components' <MenuSection> + <Header> + <Separator> — the RAC equivalents
 * of reka-ui's DropdownMenuGroup + DropdownMenuLabel + DropdownMenuSeparator used by
 * DropdownSection.vue. There is no literal "DropdownSection" primitive in RAC; MenuSection is
 * the closest/only fit.
 */
export function DropdownSection({ title, showDivider = false, className, children }: DropdownSectionProps) {
  const sectionClass = menuSectionVariants();

  return (
    <MenuSection className={composeClassName(sectionClass.base(), className)}>
      {title && (
        <Header
          className={composeClassName(
            sectionClass.label(),
            "px-2 py-1 text-[10px] font-semibold tracking-widest text-default-200 uppercase",
          )}
        >
          {title}
        </Header>
      )}
      {children}
      {showDivider && <Separator className={sectionClass.separator()} />}
    </MenuSection>
  );
}
