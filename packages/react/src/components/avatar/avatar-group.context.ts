import type { AvatarVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export interface AvatarGroupContext {
  size: AvatarVariants["size"];
  isBordered: boolean;
  isDisabled: boolean;
  isGrid: boolean;
  isInGroup: boolean;
}

export const DEFAULT_AVATAR_GROUP_CONTEXT: AvatarGroupContext = {
  size: "md",
  isBordered: false,
  isDisabled: false,
  isGrid: false,
  isInGroup: false,
};

export const {
  Provider: AvatarGroupProvider,
  useStrictContext: useAvatarGroupContext,
} = createStrictContext<AvatarGroupContext>("AvatarGroup");
