import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type FocusEvent,
  type ReactNode,
} from "react";
import { radioVariants, type RadioGroupVariants, type RadioVariants } from "@auronui/styles";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { DEFAULT_RADIO_GROUP_CONTEXT, useRadioGroupContext } from "./radio-group.context";

export interface RadioOwnProps {
  value: string;
  variant?: RadioGroupVariants["variant"];
  color?: RadioVariants["color"];
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  isInvalid?: boolean;
  name?: string;
  isRequired?: boolean;
  /** @deprecated Use isRequired instead. */
  required?: boolean;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    control: ClassValue;
    indicator: ClassValue;
    content: ClassValue;
  }>;
  onSelect?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
}

export type RadioProps = RadioOwnProps &
  Omit<ComponentPropsWithoutRef<"input">, keyof RadioOwnProps | "type" | "checked" | "defaultChecked">;

/**
 * Native `<input type="radio">`-based radio item (same accessible-custom-input
 * pattern as Checkbox — see the deviation note there for why `:focus-visible`
 * is approximated via a JS-driven `status-focused` class rather than relying
 * on the shared CSS's `.radio:focus-visible` selector, which can't match an
 * ancestor `<label>`). Always expects a RadioGroup ancestor to supply
 * selection state — same as the Vue port, where a standalone
 * `<RadioGroupItem>` outside `<RadioGroupRoot>` has nothing to bind to.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    value,
    variant,
    color,
    isDisabled,
    disabled,
    isInvalid = false,
    name,
    isRequired,
    required,
    className,
    classNames,
    onSelect,
    id,
    children,
    ...rest
  },
  ref,
) {
  const groupCtx = useRadioGroupContext(DEFAULT_RADIO_GROUP_CONTEXT);
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "Radio",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );
  const resolvedRequired = resolveDeprecatedBooleanProp(
    "Radio",
    "isRequired",
    isRequired,
    "required",
    required,
  );

  // group disabled ALWAYS wins over child prop; all other props: child prop wins over group value
  const effectiveDisabled = groupCtx.disabled || resolvedDisabled;
  const effectiveInvalid = groupCtx.isInvalid || isInvalid;
  const finalVariant = variant ?? groupCtx.variant;
  const finalColor = color ?? groupCtx.color;

  const checked = groupCtx.selectedValue === value;
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      groupCtx.selectValue(value);
      onSelect?.(event);
    }
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    setIsFocusVisible(event.target.matches(":focus-visible"));
  }

  function handleBlur() {
    setIsFocusVisible(false);
  }

  const slotFns = useMemo(() => radioVariants({ color: finalColor }), [finalColor]);

  return (
    <label
      htmlFor={inputId}
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      data-disabled={dataAttr(effectiveDisabled)}
      data-state={checked ? "checked" : "unchecked"}
      data-variant={finalVariant}
      aria-invalid={effectiveInvalid || undefined}
    >
      <input
        ref={ref}
        id={inputId}
        type="radio"
        className="sr-only"
        value={value}
        checked={checked}
        disabled={effectiveDisabled}
        required={resolvedRequired}
        name={name ?? groupCtx.name}
        aria-invalid={effectiveInvalid || undefined}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
      <span
        className={composeClassName(
          slotFns.control(),
          isFocusVisible && "status-focused",
          classNames?.control,
        )}
        data-slot="radio-control"
      >
        <span
          className={composeClassName(slotFns.indicator(), classNames?.indicator)}
          data-slot="radio-indicator"
        />
      </span>
      <span className={composeClassName(slotFns.content(), classNames?.content)}>{children}</span>
    </label>
  );
});
