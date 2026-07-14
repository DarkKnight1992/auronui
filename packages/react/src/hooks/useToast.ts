/**
 * useToast — imperative API for programmatic toast creation.
 *
 * Architecture:
 *   - A module-level array + subscriber set acts as an external store,
 *     shared across every `useToast()` call in the app (mirrors the Vue
 *     version's module-level `ref` — plain component state wouldn't be
 *     shared across independent call sites, so this needs to live outside
 *     React state and be read via `useSyncExternalStore`).
 *   - A `<ToastProvider>` component (implemented elsewhere) reads `toasts`
 *     via this same hook to render the viewport.
 *   - Example:
 *       const { toast, dismiss, toasts } = useToast()
 *       toast({ title: 'Done', description: 'Saved!', duration: 3000 })
 *
 * Toast limit: Max 5 concurrent toasts; oldest is dismissed on overflow.
 */

import { useCallback, useSyncExternalStore } from "react";

export type ToastPosition =
  | "top-right"
  | "top-center"
  | "top-left"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left";

export type ToastVariant = "default" | "success" | "warning" | "danger" | "accent";

export interface ToastOptions {
  /** Toast title text */
  title: string;
  /** Toast description text */
  description?: string;
  /** Auto-dismiss duration in ms (default: 5000ms) */
  duration?: number;
  /** Viewport position for this toast */
  position?: ToastPosition;
  /** Visual style variant */
  variant?: ToastVariant;
  /** Action button config */
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastInstance extends Required<Omit<ToastOptions, "action">> {
  id: string;
  open: boolean;
  action?: ToastOptions["action"];
}

/** Max concurrent toasts (DoS mitigation) */
const MAX_TOASTS = 5;

/** Minimum duration clamp (ms) */
const MIN_DURATION = 100;

/** Maximum duration clamp (ms) */
const MAX_DURATION = 30_000;

/** Shared external store state — module-level singleton shared across all useToast() calls */
let toasts: ToastInstance[] = [];
const listeners = new Set<() => void>();

let idCounter = 0;

function generateId(): string {
  return `toast-${++idCounter}-${Date.now()}`;
}

function clampDuration(duration: number): number {
  return Math.min(Math.max(duration, MIN_DURATION), MAX_DURATION);
}

function setToasts(next: ToastInstance[]): void {
  toasts = next;
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getSnapshot(): ToastInstance[] {
  return toasts;
}

function getServerSnapshot(): ToastInstance[] {
  return toasts;
}

/**
 * Programmatically dismiss a toast by its ID.
 * Sets `open = false` which triggers exit animation in the Toast component.
 */
function dismiss(id: string): void {
  setToasts(toasts.map((t) => (t.id === id ? { ...t, open: false } : t)));
}

/**
 * Create a new toast. If the MAX_TOASTS limit is reached, the oldest toast
 * is dismissed first.
 */
function toast(options: ToastOptions): string {
  const id = generateId();

  if (toasts.length >= MAX_TOASTS) {
    const oldest = toasts[0];
    if (oldest) dismiss(oldest.id);
  }

  const instance: ToastInstance = {
    id,
    title: options.title,
    description: options.description ?? "",
    duration: clampDuration(options.duration ?? 5000),
    position: options.position ?? "bottom-right",
    variant: options.variant ?? "default",
    open: true,
    action: options.action,
  };

  setToasts([...toasts, instance]);
  return id;
}

/**
 * Remove a toast from the list entirely (called after exit animation completes).
 */
function remove(id: string): void {
  setToasts(toasts.filter((t) => t.id !== id));
}

export interface UseToastReturn {
  /** Reactive list of active toast instances */
  toasts: ToastInstance[];
  /** Create a new toast and return its ID */
  toast: (options: ToastOptions) => string;
  /** Dismiss a toast by ID (triggers exit animation) */
  dismiss: (id: string) => void;
  /** Remove a toast from the list after animation completes */
  remove: (id: string) => void;
}

/**
 * Returns the imperative toast control API.
 *
 * Mount `<ToastProvider>` once at app root before calling `toast()`.
 */
export function useToast(): UseToastReturn {
  const activeToasts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toastCb = useCallback(toast, []);
  const dismissCb = useCallback(dismiss, []);
  const removeCb = useCallback(remove, []);

  return { toasts: activeToasts, toast: toastCb, dismiss: dismissCb, remove: removeCb };
}
