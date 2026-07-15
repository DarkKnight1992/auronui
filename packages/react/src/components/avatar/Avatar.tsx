import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { avatarVariants, type AvatarVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { DEFAULT_AVATAR_GROUP_CONTEXT, useAvatarGroupContext } from "./avatar-group.context";

export type AvatarLoadingStatus = "idle" | "loading" | "loaded" | "error";

export interface AvatarOwnProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarVariants["size"];
  color?: AvatarVariants["color"];
  variant?: AvatarVariants["variant"];
  isBordered?: boolean;
  isDisabled?: boolean;
  showFallback?: boolean;
  as?: ElementType;
  /** Milliseconds to wait before rendering the fallback, avoiding a flash while the image loads. */
  delayMs?: number;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    image: ClassValue;
    fallback: ClassValue;
    icon: ClassValue;
    name: ClassValue;
  }>;
  /** Custom fallback content, rendered instead of the computed initials/icon. */
  fallback?: ReactNode;
  onLoadingStatusChange?: (status: AvatarLoadingStatus) => void;
}

export type AvatarProps = AvatarOwnProps &
  Omit<ComponentPropsWithoutRef<"span">, keyof AvatarOwnProps | "children">;

function getInitials(name: string | undefined): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export const Avatar = forwardRef<HTMLElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    name,
    size,
    color,
    variant,
    isBordered = false,
    isDisabled = false,
    showFallback = false,
    as: As = "span",
    delayMs,
    className,
    classNames,
    fallback,
    onLoadingStatusChange,
    ...rest
  },
  ref,
) {
  const groupCtx = useAvatarGroupContext(DEFAULT_AVATAR_GROUP_CONTEXT);

  const finalSize = size ?? groupCtx.size;
  const finalIsBordered = isBordered || groupCtx.isBordered;
  const effectiveDisabled = groupCtx.isDisabled || isDisabled;
  const isInGroup = groupCtx.isInGroup;

  const hasImage = Boolean(src) && !showFallback;

  const [status, setStatus] = useState<AvatarLoadingStatus>(hasImage ? "loading" : "idle");

  useEffect(() => {
    setStatus(hasImage ? "loading" : "idle");
     
  }, [src, hasImage]);

  useEffect(() => {
    onLoadingStatusChange?.(status);
  }, [status, onLoadingStatusChange]);

  // Mirrors Reka UI's AvatarFallback delayMs — only render the fallback once
  // the delay elapses, avoiding a flash of initials before the image loads.
  const effectiveDelay = delayMs ?? (hasImage ? 600 : 0);
  const [canShowFallback, setCanShowFallback] = useState(effectiveDelay === 0);

  useEffect(() => {
    if (effectiveDelay === 0) {
      setCanShowFallback(true);
      return;
    }
    setCanShowFallback(false);
    const timer = setTimeout(() => setCanShowFallback(true), effectiveDelay);
    return () => clearTimeout(timer);
     
  }, [effectiveDelay, src]);

  const initials = useMemo(() => getInitials(name), [name]);

  const slotFns = useMemo(
    () => avatarVariants({ size: finalSize, color, variant }),
    [finalSize, color, variant],
  );

  const borderedClass = finalIsBordered ? "ring-2 ring-offset-2 ring-default" : undefined;
  const inGroupClass = isInGroup ? "-me-2" : undefined;

  const showImage = hasImage && status === "loaded";
  const showFallbackContent = !showImage && canShowFallback;

  const Comp = As as ElementType;

  return (
    <Comp
      ref={ref}
      className={composeClassName(slotFns.base(), borderedClass, inGroupClass, className, classNames?.base)}
      data-disabled={dataAttr(effectiveDisabled)}
      data-bordered={dataAttr(finalIsBordered)}
      {...rest}
    >
      {hasImage && (
        <img
          src={src}
          alt={alt ?? name ?? ""}
          className={composeClassName(slotFns.image(), classNames?.image)}
          style={showImage ? undefined : { display: "none" }}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      )}

      {showFallbackContent &&
        (fallback ? (
          fallback
        ) : initials ? (
          <span className={composeClassName(slotFns.name(), "text-xs font-medium leading-none", classNames?.name)}>
            {initials}
          </span>
        ) : (
          <svg
            className={composeClassName(slotFns.icon(), "size-4/5", classNames?.icon)}
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        ))}
    </Comp>
  );
});
