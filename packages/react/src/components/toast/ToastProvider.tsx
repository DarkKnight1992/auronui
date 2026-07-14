/**
 * ToastProvider — mount once near the app root.
 *
 * The Vue port wraps reka-ui's Toast primitives (ToastProvider/ToastRoot/
 * ToastViewport/...). react-aria-components' Toast/ToastQueue API isn't a
 * drop-in fit here without pulling in its `Toast`/`UNSTABLE_ToastRegion`
 * surface, so — per the porting brief — this is built directly on the
 * already-ported `useToast` hook (a module-level store shared across every
 * `useToast()` call) plus a plain positioned region per screen corner.
 *
 * Each toast is `role="status"`/`aria-live="polite"` (or `role="alert"`/
 * `aria-live="assertive"` for the `danger` variant, since those are
 * typically time-sensitive/blocking messages) — the Vue port's mocked
 * ToastRoot sets `aria-live="off"` because reka-ui maintains its own
 * separate hidden live-region announcer; without that primitive here,
 * marking each toast itself as a live region is the direct equivalent.
 */
import { useEffect, useRef } from "react";
import { toastVariants, type ToastVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useToast, type ToastInstance, type ToastPosition } from "../../hooks";
import { Button } from "../button";

const POSITION_TO_PLACEMENT: Record<ToastPosition, NonNullable<ToastVariants["placement"]>> = {
  "top-right": "top end",
  "top-center": "top",
  "top-left": "top start",
  "bottom-right": "bottom end",
  "bottom-center": "bottom",
  "bottom-left": "bottom start",
};

const POSITIONS: ToastPosition[] = [
  "top-right",
  "top-center",
  "top-left",
  "bottom-right",
  "bottom-center",
  "bottom-left",
];

export interface ToastProviderClassNames {
  region: ClassValue;
  toast: ClassValue;
  content: ClassValue;
  title: ClassValue;
  description: ClassValue;
  actions: ClassValue;
  action: ClassValue;
  close: ClassValue;
}

export interface ToastProviderProps {
  className?: ClassValue;
  classNames?: Partial<ToastProviderClassNames>;
}

export function ToastProvider({ className, classNames }: ToastProviderProps = {}) {
  const { toasts, dismiss, remove } = useToast();

  const groups = POSITIONS.map((position) => ({
    position,
    items: toasts.filter((t) => (t.position ?? "bottom-right") === position),
  })).filter((group) => group.items.length > 0);

  if (!groups.length) return null;

  return (
    <>
      {groups.map(({ position, items }) => {
        const styles = toastVariants({ placement: POSITION_TO_PLACEMENT[position] });
        return (
          <ol
            key={position}
            className={composeClassName(styles.region(), className, classNames?.region)}
            data-slot="toast-region"
            aria-label="Notifications"
            tabIndex={-1}
          >
            {items.map((toast) => (
              <ToastItem key={toast.id} toast={toast} dismiss={dismiss} remove={remove} classNames={classNames} />
            ))}
          </ol>
        );
      })}
    </>
  );
}

interface ToastItemProps {
  toast: ToastInstance;
  dismiss: (id: string) => void;
  remove: (id: string) => void;
  classNames?: Partial<ToastProviderClassNames>;
}

function ToastItem({ toast, dismiss, remove, classNames }: ToastItemProps) {
  const styles = toastVariants({
    placement: POSITION_TO_PLACEMENT[toast.position ?? "bottom-right"],
    variant: toast.variant,
  });
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const removeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!toast.open || !(toast.duration > 0)) return;
    dismissTimer.current = setTimeout(() => dismiss(toast.id), toast.duration);
    return () => clearTimeout(dismissTimer.current);
  }, [toast.id, toast.open, toast.duration, dismiss]);

  useEffect(() => {
    if (toast.open) return;
    // Give the exit animation time to run before unmounting — this is the
    // ENTIRE point of keeping the toast rendered post-dismiss (see the removed
    // `if (!toast.open) return null` below, which used to unmount instantly,
    // one render ahead of this timer, so the exit animation never had a chance
    // to actually play regardless of what CSS drove it).
    removeTimer.current = setTimeout(() => remove(toast.id), 250);
    return () => clearTimeout(removeTimer.current);
  }, [toast.open, toast.id, remove]);

  const isAssertive = toast.variant === "danger";

  return (
    <li
      className={composeClassName(styles.toast(), classNames?.toast)}
      data-slot="toast"
      data-state={toast.open ? "open" : "closed"}
    >
      {/*
        The live-region role/aria-live live on this inner wrapper, not the
        <li> itself — axe's "list"/"aria-allowed-role" rules reject an <li>
        whose role is overridden away from the implicit `listitem` inside an
        <ol>, since that breaks the list's accessible structure.

        flex layout is repeated here (matching .toast's own flex/items-start/
        gap-3) because this wrapper sits BETWEEN the <li> and .toast__content/
        the actions wrapper — without it, those two ended up as unstyled block
        siblings and stacked vertically (close button below the content)
        instead of side-by-side with the close button pinned top-right.
      */}
      <div
        className="flex w-full items-start gap-3"
        role={isAssertive ? "alert" : "status"}
        aria-live={isAssertive ? "assertive" : "polite"}
        aria-atomic="true"
      >
        <div className={composeClassName(styles.content(), classNames?.content)} data-slot="toast-content">
          <p className={composeClassName(styles.title(), classNames?.title)} data-slot="toast-title">
            {toast.title}
          </p>
          {toast.description && (
            <p className={composeClassName(styles.description(), classNames?.description)} data-slot="toast-description">
              {toast.description}
            </p>
          )}
        </div>
        <div className={composeClassName("flex shrink-0 items-center gap-1 ml-auto", classNames?.actions)}>
          {toast.action && (
            <Button size="sm" variant="ghost" className={composeClassName(classNames?.action)} onClick={toast.action.onClick}>
              {toast.action.label}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            isIconOnly
            aria-label="Close notification"
            className={composeClassName(styles.close(), classNames?.close)}
            onClick={() => dismiss(toast.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </li>
  );
}
