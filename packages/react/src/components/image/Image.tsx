import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { imageVariants, type ImageVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { Modal, ModalContent, ModalClose } from "../modal";

export type ImageLoadingStatus = "idle" | "loading" | "loaded" | "error";

export interface ImageOwnProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  isLazy?: boolean;
  isZoomable?: boolean;
  fit?: ImageVariants["fit"];
  radius?: ImageVariants["radius"];
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    img: ClassValue;
    fallback: ClassValue;
    zoomTrigger: ClassValue;
  }>;
  /** Custom fallback content, rendered instead of the default broken-image icon. */
  fallback?: ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

export type ImageProps = ImageOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ImageOwnProps | "onLoad" | "onError">;

function DefaultFallbackIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

/**
 * Image — content <img> replacement with lazy-loading, load-error
 * fallback, and optional click-to-zoom lightbox. Distinct from Avatar
 * (identity-photo-specific, fixed circular/square crop) — Image is for
 * general content (product photos, article images, galleries).
 *
 * Deviation from Image.vue: the Vue version composes reka-ui's
 * AvatarRoot/AvatarImage/AvatarFallback for load-state tracking and
 * @vueuse/core's useIntersectionObserver for lazy-loading. @auronui/react
 * has no reka-ui/@vueuse dependency, so load-state uses the same plain
 * useState+onLoad/onError idiom as Avatar.tsx, and lazy-loading combines
 * the native `loading="lazy"` attribute with a plain IntersectionObserver
 * (gating when `src` is even set, since browsers may ignore `loading=lazy`
 * for above-the-fold heuristics). The zoom lightbox reuses the real Modal
 * component (now ported to @auronui/react) exactly as Image.vue does.
 */
export function Image({
  src,
  alt,
  fallbackSrc,
  isLazy = true,
  isZoomable = false,
  fit = "cover",
  radius = "md",
  className,
  classNames,
  fallback,
  onLoad,
  onError,
  ...rest
}: ImageProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(!isLazy);
  const [hasErrored, setHasErrored] = useState(false);
  const [status, setStatus] = useState<ImageLoadingStatus>("idle");
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    setHasErrored(false);
    setStatus("idle");
  }, [src]);

  useEffect(() => {
    if (!isLazy) {
      setIsVisible(true);
      return;
    }
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [isLazy]);

  const activeSrc = hasErrored ? fallbackSrc : src;
  const showImage = isVisible && !!activeSrc;
  const isLoaded = status === "loaded";

  function handleLoad() {
    setStatus("loaded");
    onLoad?.();
  }

  function handleError() {
    setStatus("error");
    setHasErrored(true);
    onError?.();
  }

  const styles = imageVariants({ fit, radius });

  return (
    <>
      <div
        ref={rootRef}
        className={composeClassName(styles.base(), className, classNames?.base)}
        data-slot="image"
        {...rest}
      >
        {showImage && (
          <img
            src={activeSrc}
            alt={alt}
            loading={isLazy ? "lazy" : undefined}
            className={composeClassName(styles.img(), classNames?.img)}
            style={isLoaded ? undefined : { display: "none" }}
            data-slot="image-img"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
        {!isLoaded && (
          <div className={composeClassName(styles.fallback(), classNames?.fallback)} data-slot="image-fallback">
            {fallback ?? <DefaultFallbackIcon />}
          </div>
        )}
        {isZoomable && showImage && isLoaded && (
          <button
            type="button"
            className={composeClassName(styles.zoomTrigger(), classNames?.zoomTrigger)}
            data-slot="image-zoom-trigger"
            aria-label={`Zoom in on ${alt}`}
            onClick={() => setIsZoomOpen(true)}
          />
        )}
      </div>

      {isZoomable && (
        <Modal open={isZoomOpen} onOpenChange={setIsZoomOpen} size="lg" variant="blur">
          <ModalContent>
            <ModalClose>
              <button
                type="button"
                aria-label="Close zoomed image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </ModalClose>
            {activeSrc && (
              <img
                src={activeSrc}
                alt={alt}
                style={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  margin: "0 auto",
                  objectFit: "contain",
                }}
              />
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
