import type { SplitterVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

/**
 * Ambient direction context — lets a SplitterResizeHandle rendered outside
 * the direct child-cloning wire-up (see SplitterGroup.tsx) still resolve the
 * group's direction for its own CSS variant classes. SplitterGroup provides
 * this in addition to (not instead of) cloning direct children with
 * direction/drag-callback props, mirroring the Vue package's
 * provide/inject-based Splitter.context.ts.
 */
export interface SplitterGroupContext {
  direction: SplitterVariants["direction"];
}

export const { Provider: SplitterGroupProvider, useStrictContext: useSplitterGroupContext } =
  createStrictContext<SplitterGroupContext>("SplitterGroup");
