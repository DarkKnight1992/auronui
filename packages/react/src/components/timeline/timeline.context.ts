import type { TimelineVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export interface TimelineContext {
  orientation: TimelineVariants["orientation"];
}

export const timelineContextDefaults: TimelineContext = {
  orientation: "vertical",
};

export const { Provider: TimelineProvider, useStrictContext: useTimelineContext } =
  createStrictContext<TimelineContext>("Timeline");
