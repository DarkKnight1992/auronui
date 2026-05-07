import type {VariantProps} from "../../utils";
import { tv } from "tailwind-variants";

export const splitterVariants = tv({
  slots: {
    group: "splitter-group",
    panel: "splitter-panel",
    handle: "splitter-handle",
    handleBar: "splitter-handle__bar",
  },
  variants: {
    direction: {
      horizontal: {
        group: "splitter-group--horizontal",
        handle: "splitter-handle--horizontal",
      },
      vertical: {
        group: "splitter-group--vertical",
        handle: "splitter-handle--vertical",
      },
    },
  },
  defaultVariants: {
    direction: "horizontal",
  },
});

export type SplitterVariants = VariantProps<typeof splitterVariants>;
