import { forwardRef, useMemo, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { editableVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface EditableAreaOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type EditableAreaProps = EditableAreaOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof EditableAreaOwnProps>;

export const EditableArea = forwardRef<HTMLDivElement, EditableAreaProps>(function EditableArea(
  { className, children, ...rest },
  ref,
) {
  const slotFns = useMemo(() => editableVariants(), []);

  return (
    <div {...rest} ref={ref} className={composeClassName(slotFns.area(), className)} data-slot="editable-area">
      {children}
    </div>
  );
});
