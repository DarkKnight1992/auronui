import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { radioGroupVariants, type RadioGroupVariants, type RadioVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { RadioGroupProvider, type RadioGroupContext } from "./radio-group.context";
import { Radio } from "./Radio";

type RadioShorthandItem = {
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

export interface RadioGroupOwnProps {
  variant?: RadioGroupVariants["variant"];
  color?: RadioVariants["color"];
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  isInvalid?: boolean;
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial selected value. */
  defaultValue?: string;
  /** Shared `name` for the native radios in this group. Auto-generated when omitted. */
  name?: string;
  orientation?: "horizontal" | "vertical";
  label?: string;
  description?: string;
  errorMessage?: string;
  isRequired?: boolean;
  /** @deprecated Use isRequired instead. */
  required?: boolean;
  className?: ClassValue;
  /** Shorthand API: render radio options from an array instead of children */
  items?: RadioShorthandItem[];
  classNames?: Partial<{
    label: ClassValue;
    wrapper: ClassValue;
    description: ClassValue;
    errorMessage: ClassValue;
    /** Applied to every shorthand-rendered Radio, before any per-item override */
    radio: Partial<{
      base: ClassValue;
      control: ClassValue;
      indicator: ClassValue;
      content: ClassValue;
    }>;
  }>;
  onChange?: (value: string) => void;
  children?: ReactNode;
}

export type RadioGroupProps = RadioGroupOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof RadioGroupOwnProps>;

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
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
    isRequired,
    required,
    className,
    items,
    classNames,
    onChange,
    children,
    ...rest
  },
  ref,
) {
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const currentValue = value ?? internalValue;

  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "RadioGroup",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );
  const resolvedRequired = resolveDeprecatedBooleanProp(
    "RadioGroup",
    "isRequired",
    isRequired,
    "required",
    required,
  );

  const generatedName = useId();
  const groupName = name ?? generatedName;

  const selectValue = useCallback(
    (v: string) => {
      setInternalValue(v);
      onChange?.(v);
    },
    [onChange],
  );

  const labelId = useId();

  const contextValue: RadioGroupContext = useMemo(
    () => ({
      variant,
      color,
      disabled: resolvedDisabled,
      isInvalid,
      name: groupName,
      selectedValue: currentValue,
      selectValue,
    }),
    [variant, color, resolvedDisabled, isInvalid, groupName, currentValue, selectValue],
  );

  const slotFns = useMemo(() => radioGroupVariants({ variant }), [variant]);

  function itemClassNames(item: RadioShorthandItem) {
    return {
      base: composeClassName(classNames?.radio?.base, item.classNames?.base),
      control: composeClassName(classNames?.radio?.control, item.classNames?.control),
      indicator: composeClassName(classNames?.radio?.indicator, item.classNames?.indicator),
      content: composeClassName(classNames?.radio?.content, item.classNames?.content),
    };
  }

  return (
    <RadioGroupProvider value={contextValue}>
      <div
        ref={ref}
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        aria-invalid={isInvalid || undefined}
        aria-required={resolvedRequired || undefined}
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
                <Radio
                  key={item.value}
                  value={item.value}
                  isDisabled={item.disabled}
                  className={item.className}
                  classNames={itemClassNames(item)}
                >
                  {item.label ?? item.value}
                </Radio>
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
    </RadioGroupProvider>
  );
});
