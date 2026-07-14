import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { checkboxGroupVariants, type CheckboxGroupVariants, type CheckboxVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { CheckboxGroupProvider, type CheckboxGroupContext } from "./checkbox-group.context";
import { Checkbox } from "./Checkbox";

type CheckboxShorthandItem = {
  value: string;
  label?: string;
  disabled?: boolean;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    control: ClassValue;
    indicator: ClassValue;
    content: ClassValue;
  }>;
};

export interface CheckboxGroupOwnProps {
  variant?: CheckboxGroupVariants["variant"];
  color?: CheckboxVariants["color"];
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  isInvalid?: boolean;
  /** Controlled selected values. */
  value?: string[];
  /** Uncontrolled initial selected values. */
  defaultValue?: string[];
  name?: string;
  orientation?: "horizontal" | "vertical";
  label?: string;
  description?: string;
  errorMessage?: string;
  className?: ClassValue;
  /** Shorthand API: render checkboxes from an array instead of children */
  items?: CheckboxShorthandItem[];
  classNames?: Partial<{
    label: ClassValue;
    wrapper: ClassValue;
    description: ClassValue;
    errorMessage: ClassValue;
    /** Applied to every shorthand-rendered Checkbox, before any per-item override */
    checkbox: Partial<{
      base: ClassValue;
      control: ClassValue;
      indicator: ClassValue;
      content: ClassValue;
    }>;
  }>;
  onChange?: (value: string[]) => void;
  children?: ReactNode;
}

export type CheckboxGroupProps = CheckboxGroupOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof CheckboxGroupOwnProps>;

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(
  {
    variant = "primary",
    color = "primary",
    isDisabled,
    disabled,
    isInvalid = false,
    value,
    defaultValue,
    name,
    orientation = "vertical",
    label,
    description,
    errorMessage,
    className,
    items,
    classNames,
    onChange,
    children,
    ...rest
  },
  ref,
) {
  const [internalValues, setInternalValues] = useState<string[]>(defaultValue ?? []);
  const currentValues = value ?? internalValues;

  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "CheckboxGroup",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const toggleValue = useCallback(
    (v: string) => {
      const next = currentValues.includes(v)
        ? currentValues.filter((x) => x !== v)
        : [...currentValues, v];
      setInternalValues(next);
      onChange?.(next);
    },
    [currentValues, onChange],
  );

  const labelId = useId();

  const contextValue: CheckboxGroupContext = useMemo(
    () => ({
      variant,
      color,
      disabled: resolvedDisabled,
      isInvalid,
      selectedValues: currentValues,
      toggleValue,
      name,
    }),
    [variant, color, resolvedDisabled, isInvalid, currentValues, toggleValue, name],
  );

  const slotFns = useMemo(() => checkboxGroupVariants({ variant }), [variant]);

  function itemClassNames(item: CheckboxShorthandItem) {
    return {
      base: composeClassName(classNames?.checkbox?.base, item.classNames?.base),
      control: composeClassName(classNames?.checkbox?.control, item.classNames?.control),
      indicator: composeClassName(classNames?.checkbox?.indicator, item.classNames?.indicator),
      content: composeClassName(classNames?.checkbox?.content, item.classNames?.content),
    };
  }

  return (
    <CheckboxGroupProvider value={contextValue}>
      <div
        ref={ref}
        role="group"
        aria-labelledby={label ? labelId : undefined}
        aria-invalid={isInvalid || undefined}
        data-orientation={orientation}
        className={composeClassName(slotFns.base(), className)}
        {...rest}
      >
        {label && (
          <span id={labelId} className={composeClassName(slotFns.label(), classNames?.label)}>
            {label}
          </span>
        )}
        <div className={composeClassName(slotFns.wrapper(), classNames?.wrapper)}>
          {items
            ? items.map((item) => (
                <Checkbox
                  key={item.value}
                  value={item.value}
                  isDisabled={item.disabled}
                  className={item.className}
                  classNames={itemClassNames(item)}
                >
                  {item.label ?? item.value}
                </Checkbox>
              ))
            : children}
        </div>
        {isInvalid && errorMessage ? (
          <span className={composeClassName(slotFns.errorMessage(), classNames?.errorMessage)}>
            {errorMessage}
          </span>
        ) : description ? (
          <span className={composeClassName(slotFns.description(), classNames?.description)}>
            {description}
          </span>
        ) : null}
      </div>
    </CheckboxGroupProvider>
  );
});
