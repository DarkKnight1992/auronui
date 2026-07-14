import type { ReactNode } from "react";
import type { breadcrumbsVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export type BreadcrumbsSlotFns = ReturnType<typeof breadcrumbsVariants>;

export interface BreadcrumbsContext {
  slotFns: BreadcrumbsSlotFns;
  /** Custom separator content (undefined = use the default chevron icon) */
  separator: ReactNode | undefined;
}

export const { Provider: BreadcrumbsProvider, useStrictContext: useBreadcrumbsContext } =
  createStrictContext<BreadcrumbsContext>("Breadcrumbs");
