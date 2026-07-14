import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { toggleButtonGroupVariants, type ToggleButtonVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { useToolbarContext } from "./toolbar.context";
import { ToolbarToggleItem } from "./ToolbarToggleItem";

type ToolbarToggleShorthandItem = {
  value: string;
  label?: ReactNode;
  variant?: ToggleButtonVariants["variant"];
  size?: ToggleButtonVariants["size"];
  isIconOnly?: boolean;
  disabled?: boolean;
  className?: ClassValue;
};

export interface ToolbarToggleGroupOwnProps {
  type: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  isDetached?: boolean;
  /** Shorthand API: render toggle items from an array instead of the compound slot API */
  items?: ToolbarToggleShorthandItem[];
  /** Whether to use roving focus for keyboard navigation. */
  rovingFocus?: boolean;
  dir?: "ltr" | "rtl";
  loop?: boolean;
  asChild?: boolean;
  className?: ClassValue;
  children?: ReactNode;
}

export type ToolbarToggleGroupProps = ToolbarToggleGroupOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ToolbarToggleGroupOwnProps>;

// NOTE: Radix's ToggleGroup (unlike reka-ui's) has no `name`/`required` form-integration
// props, so the Vue version's `name`/`isRequired` props were dropped here — there is no
// primitive-level equivalent to forward them to.
export const ToolbarToggleGroup = forwardRef<HTMLDivElement, ToolbarToggleGroupProps>(
  function ToolbarToggleGroup(
    {
      type,
      value,
      defaultValue,
      onValueChange,
      isDisabled,
      disabled,
      orientation,
      isDetached = false,
      items,
      rovingFocus,
      dir,
      loop,
      asChild,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const ctx = useToolbarContext({ orientation: "horizontal" });
    const resolvedOrientation = orientation ?? ctx.orientation;

    const resolvedDisabled = resolveDeprecatedBooleanProp(
      "ToolbarToggleGroup",
      "isDisabled",
      isDisabled,
      "disabled",
      disabled,
    );

    const classes = toggleButtonGroupVariants({ orientation: resolvedOrientation, isDetached }).base();

    const content = items
      ? items.map((item) => (
          <ToolbarToggleItem
            key={item.value}
            value={item.value}
            variant={item.variant}
            size={item.size}
            isIconOnly={item.isIconOnly}
            isDisabled={item.disabled}
            className={item.className}
          >
            {item.label}
          </ToolbarToggleItem>
        ))
      : children;

    const sharedProps = {
      ref,
      disabled: resolvedDisabled,
      rovingFocus,
      dir,
      loop,
      orientation: resolvedOrientation,
      asChild,
      className: composeClassName(classes, className),
      ...rest,
    };

    return type === "multiple" ? (
      <ToolbarPrimitive.ToggleGroup
        type="multiple"
        value={value as string[] | undefined}
        defaultValue={defaultValue as string[] | undefined}
        onValueChange={onValueChange as ((value: string[]) => void) | undefined}
        {...sharedProps}
      >
        {content}
      </ToolbarPrimitive.ToggleGroup>
    ) : (
      <ToolbarPrimitive.ToggleGroup
        type="single"
        value={value as string | undefined}
        defaultValue={defaultValue as string | undefined}
        onValueChange={onValueChange as ((value: string) => void) | undefined}
        {...sharedProps}
      >
        {content}
      </ToolbarPrimitive.ToggleGroup>
    );
  },
);
