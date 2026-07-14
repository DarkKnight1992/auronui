import { createStrictContext } from "../../utils";

export interface ToolbarContextValue {
  orientation: "horizontal" | "vertical";
}

export const { Provider: ToolbarProvider, useStrictContext: useToolbarContext } =
  createStrictContext<ToolbarContextValue>("Toolbar");
