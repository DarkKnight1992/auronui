import { createStrictContext } from "../../utils";

export interface DropdownSubContext {
  openOnHover: boolean;
}

export const DEFAULT_DROPDOWN_SUB_CONTEXT: DropdownSubContext = {
  openOnHover: true,
};

export const {
  Provider: DropdownSubProvider,
  useStrictContext: useDropdownSubContext,
} = createStrictContext<DropdownSubContext>("DropdownSub");
