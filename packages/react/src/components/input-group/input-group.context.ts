import type { InputGroupVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export interface InputGroupContext {
  size: InputGroupVariants["size"];
  isInvalid: boolean;
  isDisabled: boolean;
  /** Generated field id, adopted by InputGroupInput as its own id unless overridden. */
  fieldId: string | undefined;
  /** Points at whichever helper text (error or description) is currently shown, if any. */
  ariaDescribedBy: string | undefined;
}

export const DEFAULT_INPUT_GROUP_CONTEXT: InputGroupContext = {
  size: "md",
  isInvalid: false,
  isDisabled: false,
  fieldId: undefined,
  ariaDescribedBy: undefined,
};

export const {
  Provider: InputGroupProvider,
  useStrictContext: useInputGroupContext,
} = createStrictContext<InputGroupContext>("InputGroup");
