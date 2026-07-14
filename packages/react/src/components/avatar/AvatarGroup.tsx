import { Children, useMemo, type ReactNode } from "react";
import { avatarVariants, type AvatarVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { AvatarGroupProvider, type AvatarGroupContext } from "./avatar-group.context";
import { Avatar } from "./Avatar";

export interface AvatarShorthandItem {
  src?: string;
  alt?: string;
  name?: string;
  color?: AvatarVariants["color"];
  variant?: AvatarVariants["variant"];
  isBordered?: boolean;
  isDisabled?: boolean;
  showFallback?: boolean;
}

export interface AvatarGroupProps {
  size?: AvatarVariants["size"];
  isBordered?: boolean;
  isDisabled?: boolean;
  isGrid?: boolean;
  max?: number;
  total?: number;
  renderCount?: (count: number) => string;
  className?: ClassValue;
  /** Shorthand API: render avatars from an array instead of passing <Avatar> children. */
  avatars?: AvatarShorthandItem[];
  /** Class overrides forwarded to each shorthand-rendered Avatar's own classNames slots. */
  classNames?: Partial<{
    base: ClassValue;
    image: ClassValue;
    fallback: ClassValue;
    icon: ClassValue;
    name: ClassValue;
  }>;
  children?: ReactNode;
}

export function AvatarGroup({
  size = "md",
  isBordered = false,
  isDisabled = false,
  isGrid = false,
  max,
  total,
  renderCount,
  className,
  avatars,
  classNames,
  children,
}: AvatarGroupProps) {
  const contextValue: AvatarGroupContext = {
    size,
    isBordered,
    isDisabled,
    isGrid,
    isInGroup: true,
  };

  const nameSlotClass = useMemo(
    () => composeClassName(avatarVariants({ size }).name(), "text-xs font-medium leading-none"),
    [size],
  );

  const containerClass = composeClassName("flex items-center flex-row", className);

  let content: ReactNode;

  if (avatars) {
    const visibleAvatars = max !== undefined ? avatars.slice(0, max) : avatars;
    const overflowCount = max !== undefined ? (total ?? avatars.length) - max : 0;
    const overflowLabel = overflowCount > 0 ? (renderCount ? renderCount(overflowCount) : `+${overflowCount}`) : "";

    content = (
      <>
        {visibleAvatars.map((avatar, idx) => (
          <Avatar key={idx} {...avatar} classNames={classNames} />
        ))}
        {overflowCount > 0 && (
          <Avatar classNames={classNames} fallback={<span className={nameSlotClass}>{overflowLabel}</span>} />
        )}
      </>
    );
  } else if (max !== undefined) {
    const allNodes = Children.toArray(children);
    const visibleNodes = allNodes.slice(0, max);
    const totalCount = total ?? allNodes.length;
    const overflowCount = totalCount - max;

    if (overflowCount > 0) {
      const overflowLabel = renderCount ? renderCount(overflowCount) : `+${overflowCount}`;
      content = (
        <>
          {visibleNodes}
          <Avatar classNames={classNames} fallback={<span className={nameSlotClass}>{overflowLabel}</span>} />
        </>
      );
    } else {
      content = visibleNodes;
    }
  } else {
    content = children;
  }

  return (
    <AvatarGroupProvider value={contextValue}>
      <div role="group" className={containerClass}>
        {content}
      </div>
    </AvatarGroupProvider>
  );
}
