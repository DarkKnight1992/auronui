import { SelectValue as RACSelectValue } from "react-aria-components";
import { Chip, type ChipProps } from "../chip";
import { composeClassName, type ClassValue } from "../../utils";
import { useSelectContext, type SelectItemValue } from "./Select.context";

export interface SelectValueProps {
  placeholder?: string;
  className?: ClassValue;
  classNames?: Partial<{
    value: ClassValue;
    chip: Partial<ChipProps["classNames"]>;
  }>;
}

export function SelectValue({ placeholder, className, classNames }: SelectValueProps) {
  const ctx = useSelectContext();

  return (
    <RACSelectValue className={composeClassName(ctx.slots.value(), className, classNames?.value)} data-slot="value">
      {({ selectedItems, selectedText, isPlaceholder }) => {
        if (ctx.multiple) {
          const values = (selectedItems as { id?: SelectItemValue }[] | undefined)
            ?.map((i) => i?.id)
            .filter((v): v is SelectItemValue => v != null);
          if (values && values.length > 0) {
            return (
              <div style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", gap: 4, overflow: "hidden", flex: 1, minWidth: 0 }}>
                {values.map((v) => (
                  <Chip key={v} size="sm" data-chip-item classNames={classNames?.chip}>
                    {ctx.itemLabel(v)}
                  </Chip>
                ))}
              </div>
            );
          }
          return <>{placeholder}</>;
        }
        return <>{isPlaceholder ? placeholder : selectedText}</>;
      }}
    </RACSelectValue>
  );
}
