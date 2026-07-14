import type { ReactNode } from "react";
import { ListBoxSection as RACListBoxSection, Header } from "react-aria-components";
import { listboxSectionVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface ListBoxSectionProps {
  title?: string;
  showDivider?: boolean;
  className?: ClassValue;
  children?: ReactNode;
}

export function ListBoxSection({ title, showDivider = false, className, children }: ListBoxSectionProps) {
  const slotFns = listboxSectionVariants();

  return (
    <RACListBoxSection className={composeClassName(slotFns.base(), className)}>
      {title && <Header className={slotFns.label()}>{title}</Header>}
      {children}
      {showDivider && (
        <div
          role="separator"
          aria-orientation="horizontal"
          data-slot="separator"
          data-orientation="horizontal"
          className={slotFns.separator()}
        />
      )}
    </RACListBoxSection>
  );
}
