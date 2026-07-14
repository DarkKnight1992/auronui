import { useCallback, useState } from "react";

export type AccordionType = "single" | "multiple";
export type AccordionValue = string | string[] | undefined;

export interface UseAccordionOptions {
  /** Whether to allow only one item open at a time ('single') or multiple ('multiple'). Defaults to 'single'. */
  type?: AccordionType;
  /** Initial expanded item(s). String for single mode, string[] for multiple mode. */
  defaultExpanded?: AccordionValue;
  /** In single mode, whether all items can be collapsed. Defaults to false. */
  collapsible?: boolean;
}

export interface UseAccordionReturn {
  /** Currently expanded item(s). String in single mode, string[] in multiple mode. */
  expanded: AccordionValue;
  /** Whether a given item is currently expanded. */
  isExpanded: (key: string) => boolean;
  /** Expand a specific item. */
  expand: (key: string) => void;
  /** Collapse a specific item. No-op in single non-collapsible mode. */
  collapse: (key: string) => void;
  /** Toggle a specific item open or closed. */
  toggle: (key: string) => void;
  /** Collapse all items. Only fully effective in multiple or collapsible-single mode. */
  collapseAll: () => void;
  /**
   * Pass as the `onValueChange` handler on the Accordion component.
   * Keeps `expanded` in sync when the component changes state internally.
   */
  onValueChange: (value: AccordionValue) => void;
}

/**
 * Manages expanded item state for the Accordion component.
 *
 * @example
 * ```tsx
 * const accordion = useAccordion({ type: 'single', collapsible: true })
 * ```
 * ```tsx
 * <Accordion type="single" value={accordion.expanded} onValueChange={accordion.onValueChange}>
 *   ...
 * </Accordion>
 * ```
 */
export function useAccordion(options: UseAccordionOptions = {}): UseAccordionReturn {
  const type = options.type ?? "single";
  const collapsible = options.collapsible ?? false;

  const [expanded, setExpanded] = useState<AccordionValue>(
    options.defaultExpanded ?? (type === "multiple" ? [] : undefined),
  );

  const isExpanded = useCallback(
    (key: string): boolean => {
      if (type === "multiple") return (expanded as string[]).includes(key);
      return expanded === key;
    },
    [type, expanded],
  );

  const expand = useCallback(
    (key: string): void => {
      if (type === "multiple") {
        setExpanded((prev) => {
          const current = prev as string[];
          return current.includes(key) ? current : [...current, key];
        });
      } else {
        setExpanded(key);
      }
    },
    [type],
  );

  const collapse = useCallback(
    (key: string): void => {
      if (type === "multiple") {
        setExpanded((prev) => (prev as string[]).filter((k) => k !== key));
      } else if (collapsible) {
        setExpanded((prev) => (prev === key ? undefined : prev));
      }
    },
    [type, collapsible],
  );

  const toggle = useCallback(
    (key: string): void => {
      if (isExpanded(key)) collapse(key);
      else expand(key);
    },
    [isExpanded, collapse, expand],
  );

  const collapseAll = useCallback((): void => {
    if (type === "multiple") {
      setExpanded([]);
    } else if (collapsible) {
      setExpanded(undefined);
    }
  }, [type, collapsible]);

  const onValueChange = useCallback((value: AccordionValue): void => {
    setExpanded(value);
  }, []);

  return { expanded, isExpanded, expand, collapse, toggle, collapseAll, onValueChange };
}
