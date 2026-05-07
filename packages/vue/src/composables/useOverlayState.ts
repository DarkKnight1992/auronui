import { ref, computed, type ComputedRef } from "vue";

/**
 * Props accepted by `useOverlayState`.
 *
 * Supports both controlled and uncontrolled usage patterns:
 * - **Controlled**: provide `modelValue` (the parent owns open/close state)
 * - **Uncontrolled**: omit `modelValue`, optionally provide `defaultOpen`
 */
export interface UseOverlayStateProps {
  /**
   * Controlled open state. When provided, `isOpen` reflects this value
   * and calling `setOpen` will NOT mutate internal state — use `onOpenChange`
   * to update the external state instead.
   *
   * Corresponds to Vue's `v-model` binding on overlay components.
   */
  modelValue?: boolean;

  /**
   * Initial open state for uncontrolled mode. Only applied when `modelValue`
   * is not provided. Defaults to `false`.
   */
  defaultOpen?: boolean;

  /**
   * Callback fired whenever `setOpen` is called, regardless of controlled or
   * uncontrolled mode. In controlled mode, this is the primary way for the
   * parent to react to open/close requests and update its state.
   */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * Return value of `useOverlayState`.
 */
export interface UseOverlayStateReturn {
  /** Reactive computed ref reflecting the current open state. */
  isOpen: ComputedRef<boolean>;
  /**
   * Set the open state to an explicit value.
   * Always fires `onOpenChange`. In uncontrolled mode, also updates internal state.
   * In controlled mode (modelValue provided), does NOT mutate internal state.
   */
  setOpen: (next: boolean) => void;
  /** Shorthand: `setOpen(true)` */
  open: () => void;
  /** Shorthand: `setOpen(false)` */
  close: () => void;
  /** Shorthand: `setOpen(!isOpen.value)` */
  toggle: () => void;
}

/**
 * Composable for controlled/uncontrolled overlay open state.
 *
 * This is the central state primitive for all overlay components in Auron
 * (Popover, Modal, Tooltip, Select, Dropdown, etc.). Getting this duality
 * right here prevents rework in 15+ components.
 *
 * **Controlled mode** (modelValue provided):
 * - `isOpen` mirrors `modelValue`
 * - `setOpen` fires `onOpenChange` but does NOT change `internalOpen`
 * - The parent component owns the state; it must update `modelValue` via
 *   its `onOpenChange` handler to reflect the change (T-00-13 mitigation)
 *
 * **Uncontrolled mode** (no modelValue):
 * - `isOpen` mirrors internal `internalOpen` ref
 * - `setOpen(true/false)` mutates `internalOpen` directly
 * - `defaultOpen` sets the initial value (defaults to `false`)
 *
 * @example Uncontrolled
 * ```ts
 * const { isOpen, open, close } = useOverlayState({ defaultOpen: false })
 * ```
 *
 * @example Controlled (v-model)
 * ```ts
 * const props = defineProps<{ modelValue?: boolean }>()
 * const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
 * const { isOpen, setOpen } = useOverlayState({
 *   modelValue: props.modelValue,
 *   onOpenChange: (v) => emit('update:modelValue', v),
 * })
 * ```
 */
export function useOverlayState(props: UseOverlayStateProps = {}): UseOverlayStateReturn {
  const internalOpen = ref(props.defaultOpen ?? false);

  const isOpen = computed(() =>
    props.modelValue !== undefined ? props.modelValue : internalOpen.value
  );

  function setOpen(next: boolean): void {
    props.onOpenChange?.(next);
    if (props.modelValue === undefined) {
      internalOpen.value = next;
    }
  }

  return {
    isOpen,
    setOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(!isOpen.value),
  };
}
