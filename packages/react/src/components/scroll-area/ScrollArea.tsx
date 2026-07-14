import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from "react";
import * as RadixScrollArea from "@radix-ui/react-scroll-area";
import { scrollAreaVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface ScrollAreaOwnProps {
  className?: ClassValue;
  viewportClassName?: ClassValue;
  type?: "auto" | "always" | "scroll" | "hover";
  scrollHideDelay?: number;
  orientation?: "vertical" | "horizontal" | "both";
  /** Text direction for the scroll area */
  dir?: "ltr" | "rtl";
  /** Merge root props onto child element (Radix asChild) */
  asChild?: boolean;
  /** Merge viewport props onto child element */
  viewportAsChild?: boolean;
  /** Keep scrollbar mounted when hidden */
  scrollbarForceMount?: boolean;
  /** Per-slot class overrides */
  classNames?: Partial<{
    root: ClassValue;
    viewport: ClassValue;
    scrollbar: ClassValue;
    thumb: ClassValue;
    corner: ClassValue;
  }>;
  children?: ReactNode;
}

export type ScrollAreaProps = ScrollAreaOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ScrollAreaOwnProps | "dir">;

export const ScrollArea = forwardRef<ElementRef<typeof RadixScrollArea.Root>, ScrollAreaProps>(
  function ScrollArea(
    {
      className,
      viewportClassName,
      type = "hover",
      scrollHideDelay = 600,
      orientation = "vertical",
      dir,
      asChild,
      viewportAsChild,
      scrollbarForceMount,
      classNames,
      children,
      ...rest
    },
    ref,
  ) {
    const slotFns = scrollAreaVariants();

    return (
      <RadixScrollArea.Root
        ref={ref}
        type={type}
        scrollHideDelay={scrollHideDelay}
        dir={dir}
        asChild={asChild}
        className={composeClassName(slotFns.root(), className, classNames?.root)}
        {...rest}
      >
        <RadixScrollArea.Viewport
          asChild={viewportAsChild}
          className={composeClassName(slotFns.viewport(), viewportClassName, classNames?.viewport)}
        >
          {children}
        </RadixScrollArea.Viewport>

        {(orientation === "vertical" || orientation === "both") && (
          <RadixScrollArea.Scrollbar
            orientation="vertical"
            forceMount={scrollbarForceMount || undefined}
            className={composeClassName(
              slotFns.scrollbar(),
              "scroll-area__scrollbar--vertical",
              classNames?.scrollbar,
            )}
          >
            <RadixScrollArea.Thumb className={composeClassName(slotFns.thumb(), classNames?.thumb)} />
          </RadixScrollArea.Scrollbar>
        )}

        {(orientation === "horizontal" || orientation === "both") && (
          <RadixScrollArea.Scrollbar
            orientation="horizontal"
            forceMount={scrollbarForceMount || undefined}
            className={composeClassName(
              slotFns.scrollbar(),
              "scroll-area__scrollbar--horizontal",
              classNames?.scrollbar,
            )}
          >
            <RadixScrollArea.Thumb className={composeClassName(slotFns.thumb(), classNames?.thumb)} />
          </RadixScrollArea.Scrollbar>
        )}

        {orientation === "both" && (
          <RadixScrollArea.Corner className={composeClassName(slotFns.corner(), classNames?.corner)} />
        )}
      </RadixScrollArea.Root>
    );
  },
);
