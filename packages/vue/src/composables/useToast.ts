/**
 * useToast — imperative API for programmatic toast creation (D-12).
 *
 * Architecture:
 *   - Reka UI Toast requires components to be in the template.
 *   - This composable provides a reactive store of toast instances that
 *     ToastViewport reads via inject/provide (or shared module state).
 *   - ToastProvider.vue must be mounted once at app root (D-13).
 *   - Example:
 *       const { toast, dismiss, toasts } = useToast()
 *       toast({ title: 'Done', description: 'Saved!', duration: 3000 })
 *
 * Toast limit (T-06-03): Max 5 concurrent toasts; oldest is dismissed on overflow.
 */

import { ref, readonly } from 'vue'

export type ToastPosition =
  | 'top-right'
  | 'top-center'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left'

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'accent'

export interface ToastOptions {
  /** Toast title text */
  title: string
  /** Toast description text */
  description?: string
  /** Auto-dismiss duration in ms (default: 5000ms) */
  duration?: number
  /** Viewport position for this toast */
  position?: ToastPosition
  /** Visual style variant */
  variant?: ToastVariant
  /** Action button config */
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ToastInstance extends Required<Omit<ToastOptions, 'action'>> {
  id: string
  open: boolean
  action?: ToastOptions['action']
}

/** Max concurrent toasts (T-06-03: DoS mitigation) */
const MAX_TOASTS = 5

/** Minimum duration clamp (ms) */
const MIN_DURATION = 100

/** Maximum duration clamp (ms) */
const MAX_DURATION = 30_000

/** Shared reactive state — module-level singleton shared across all useToast() calls */
const toasts = ref<ToastInstance[]>([])

let idCounter = 0

function generateId(): string {
  return `toast-${++idCounter}-${Date.now()}`
}

function clampDuration(duration: number): number {
  return Math.min(Math.max(duration, MIN_DURATION), MAX_DURATION)
}

/**
 * Returns the imperative toast control API.
 *
 * Mount `<ToastProvider>` once at app root before calling `toast()`.
 */
export function useToast() {
  /**
   * Create a new toast. If the MAX_TOASTS limit is reached, the oldest toast
   * is dismissed first (T-06-03).
   */
  function toast(options: ToastOptions): string {
    const id = generateId()

    // Enforce max concurrent toast limit (T-06-03)
    if (toasts.value.length >= MAX_TOASTS) {
      const oldest = toasts.value[0]
      if (oldest) {
        dismiss(oldest.id)
      }
    }

    const instance: ToastInstance = {
      id,
      title: options.title,
      description: options.description ?? '',
      duration: clampDuration(options.duration ?? 5000),
      position: options.position ?? 'bottom-right',
      variant: options.variant ?? 'default',
      open: true,
      action: options.action,
    }

    toasts.value = [...toasts.value, instance]
    return id
  }

  /**
   * Programmatically dismiss a toast by its ID.
   * Sets `open = false` which triggers exit animation in Toast.vue.
   */
  function dismiss(id: string): void {
    toasts.value = toasts.value.map((t) =>
      t.id === id ? { ...t, open: false } : t,
    )
  }

  /**
   * Remove a toast from the list entirely (called after exit animation completes).
   */
  function remove(id: string): void {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    /** Reactive list of active toast instances */
    toasts: readonly(toasts),
    /** Create a new toast and return its ID */
    toast,
    /** Dismiss a toast by ID (triggers exit animation) */
    dismiss,
    /** Remove a toast from the list after animation completes */
    remove,
  }
}
