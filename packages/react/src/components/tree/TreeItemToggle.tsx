import type { ReactNode } from "react";
import { treeVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface TreeItemToggleProps {
  isExpanded?: boolean;
  hasChildren?: boolean;
  className?: ClassValue;
  classNames?: Partial<{
    itemToggle: ClassValue;
  }>;
  children?: ReactNode;
}

const slotFns = treeVariants();

export function TreeItemToggle({
  isExpanded = false,
  hasChildren = true,
  className,
  classNames,
  children,
}: TreeItemToggleProps) {
  return (
    <button
      type="button"
      className={composeClassName(slotFns.itemToggle(), className, classNames?.itemToggle)}
      data-expanded={isExpanded || undefined}
      data-no-children={!hasChildren || undefined}
      tabIndex={-1}
      aria-hidden="true"
    >
      {children ?? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </button>
  );
}
