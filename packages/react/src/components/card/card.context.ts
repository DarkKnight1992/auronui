import type { CardVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export interface CardContext {
  variant: CardVariants["variant"];
  shadow: CardVariants["shadow"];
  radius: CardVariants["radius"];
  isHoverable: boolean;
  isPressable: boolean;
  isDisabled: boolean;
  fullWidth: boolean;
}

export const DEFAULT_CARD_CONTEXT: CardContext = {
  variant: "default",
  shadow: "sm",
  radius: "lg",
  isHoverable: false,
  isPressable: false,
  isDisabled: false,
  fullWidth: false,
};

export const { Provider: CardProvider, useStrictContext: useCardContext } =
  createStrictContext<CardContext>("Card");
