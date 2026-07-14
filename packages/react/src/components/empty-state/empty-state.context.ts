import { createStrictContext } from "../../utils";

export interface EmptyStateContext {
  // EmptyState has no visual variants — context exists for compound component structural pattern
  _brand: "EmptyState";
}

export const { Provider: EmptyStateProvider, useStrictContext: useEmptyStateContext } =
  createStrictContext<EmptyStateContext>("EmptyState");
