import type { SurfaceVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export interface SurfaceContext {
  variant: SurfaceVariants["variant"];
}

export const { Provider: SurfaceProvider, useStrictContext: useSurfaceContext } =
  createStrictContext<SurfaceContext>("Surface");
