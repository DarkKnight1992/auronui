import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { switchGroupVariants, type SwitchGroupVariants, type SwitchVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { SwitchGroupProvider, type SwitchGroupContext } from "./switch-group.context";
import { Switch } from "./Switch";

type SwitchShorthandItem = {
  value: string;
  label?: string;
  disabled?: boolean;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    control: ClassValue;
    thumb: ClassValue;
    content: ClassValue;
  }>;
};

export interface SwitchGroupOwnProps {
  size?: SwitchVariants["size"];
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  /** Controlled selected values. */
  value?: string[];
  /** Uncontrolled initial selected values. */
  defaultValue?: string[];
  name?: string;
  orientation?: SwitchGroupVariants["orientation"];
  isInvalid?: boolean;
  errorMessage?: string;
  label?: string;
  description?: string;
  className?: ClassValue;
  /** Shorthand API: render switches from an array instead of children */
  items?: SwitchShorthandItem[];
  classNames?: Partial<{
    label: ClassValue;
    items: ClassValue;
    description: ClassValue;
    errorMessage: ClassValue;
    /** Applied to every shorthand-rendered Switch, before any per-item override */
    switch: Partial<{
      base: ClassValue;
      control: ClassValue;
      thumb: ClassValue;
      content: ClassValue;
    }>;
  }>;
  onChange?: (value: string[]) => void;
  children?: ReactNode;
}

export type SwitchGroupProps = SwitchGroupOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof SwitchGroupOwnProps>;

export const SwitchGroup = forwardRef<HTMLDivElement, SwitchGroupProps>(function SwitchGroup(
  {
    size = "md",
    isDisabled,
    disabled,
    value,
    defaultValue,
    name,
    orientation = "vertical",
    isInvalid = false,
    errorMessage,
    label,
    description,
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
    "SwitchGroup",
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

  const contextValue: SwitchGroupContext = useMemo(
    () => ({
      size,
      disabled: resolvedDisabled,
      isInvalid,
      selectedValues: currentValues,
      toggleValue,
      name,
    }),
    [size, resolvedDisabled, isInvalid, currentValues, toggleValue, name],
  );

  const groupSlots = useMemo(() => switchGroupVariants({ orientation }), [orientation]);

  function itemClassNames(item: SwitchShorthandItem) {
    return {
      base: composeClassName(classNames?.switch?.base, item.classNames?.base),
      control: composeClassName(classNames?.switch?.control, item.classNames?.control),
      thumb: composeClassName(classNames?.switch?.thumb, item.classNames?.thumb),
      content: composeClassName(classNames?.switch?.content, item.classNames?.content),
    };
  }

  return (
    <SwitchGroupProvider value={contextValue}>
      <div
        ref={ref}
        role="group"
        aria-labelledby={label ? labelId : undefined}
        aria-invalid={isInvalid || undefined}
        data-orientation={orientation}
        className={composeClassName(groupSlots.base(), className)}
        {...rest}
      >
        {label && (
          <span id={labelId} className={composeClassName(groupSlots.label(), classNames?.label)}>
            {label}
          </span>
        )}
        <div className={composeClassName(groupSlots.items(), classNames?.items)}>
          {items
            ? items.map((item) => (
                <Switch
                  key={item.value}
                  value={item.value}
                  isDisabled={item.disabled}
                  className={item.className}
                  classNames={itemClassNames(item)}
                >
                  {item.label ?? item.value}
                </Switch>
              ))
            : children}
        </div>
        {isInvalid && errorMessage ? (
          <span className={composeClassName(groupSlots.errorMessage(), classNames?.errorMessage)}>
            {errorMessage}
          </span>
        ) : description ? (
          <span className={composeClassName(groupSlots.description(), classNames?.description)}>
            {description}
          </span>
        ) : null}
      </div>
    </SwitchGroupProvider>
  );
});
