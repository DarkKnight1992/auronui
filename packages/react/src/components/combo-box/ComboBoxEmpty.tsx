import type { ReactNode } from "react";
import { composeClassName, type ClassValue } from "../../utils";

export interface ComboBoxEmptyProps {
  className?: ClassValue;
  children?: ReactNode;
}

export function ComboBoxEmpty({ className, children }: ComboBoxEmptyProps) {
  return (
    <div className={composeClassName("py-3 text-center text-sm text-default-400", className)} data-slot="empty-content">
      {children}
    </div>
  );
}
