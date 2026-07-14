import { useCallback, useState, type FocusEvent } from "react";

export interface UseFieldFocusWithinReturn {
  isFocused: boolean;
  onFocus: (event: FocusEvent<HTMLElement>) => void;
  onBlur: (event: FocusEvent<HTMLElement>) => void;
}

/**
 * Tracks whether any descendant of the element these handlers are attached
 * to currently has focus — a `:focus-within`-with-state polyfill (React's
 * `onFocus`/`onBlur` already bubble like `focusin`/`focusout`).
 *
 * Every field-style component's CSS (input.css, date-input.css, time-field.css,
 * etc.) gates its focused-state border/background on a `[data-focused="true"]`
 * attribute — reka-ui's convention. react-aria-components/plain native inputs
 * never set that attribute on their own, so this hook exists to drive it
 * explicitly: `<div data-focused={dataAttr(isFocused)} onFocus={onFocus}
 * onBlur={onBlur}>`.
 *
 * Blur only clears focus when the newly-focused element (`relatedTarget`) is
 * NOT a descendant of the field — otherwise tabbing between segments of a
 * segmented field (DateInput, TimeField) would flicker the focus ring off
 * and back on between every segment.
 */
export function useFieldFocusWithin(): UseFieldFocusWithinReturn {
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback((event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsFocused(false);
    }
  }, []);

  return { isFocused, onFocus, onBlur };
}
