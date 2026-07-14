import { useCallback, useRef, useState, type KeyboardEvent } from "react";

export interface ActiveCell {
  rowIndex: number;
  columnIndex: number;
}

export interface UseTableKeyboardNavOptions {
  /** Current row count (read fresh on every keydown via a ref so bounds stay in sync with data changes). */
  rowCount: number;
  /** Current column count */
  columnCount: number;
  /** Callback to resolve the DOM element for a given (row, col) coordinate */
  getCellElement: (rowIndex: number, columnIndex: number) => HTMLElement | null;
}

export interface UseTableKeyboardNavReturn {
  /** Currently active cell (roving tabindex target). null = nothing focused yet. */
  activeCell: ActiveCell | null;
  /** Attach to the table root: onKeyDown={onKeyDown} */
  onKeyDown: (event: KeyboardEvent) => void;
  /** Attach to each cell: onFocus={() => onCellFocus(rowIndex, columnIndex)} */
  onCellFocus: (rowIndex: number, columnIndex: number) => void;
  /** Query helper: is this cell the tabindex=0 target? */
  isActive: (rowIndex: number, columnIndex: number) => boolean;
}

/**
 * useTableKeyboardNav — WAI-ARIA data grid keyboard navigation.
 *
 * Implements:
 *   Arrow keys — cell-by-cell movement, no wrap
 *   Home / End — first / last cell in current row
 *   Ctrl+Home / Ctrl+End — first cell of first row / last cell of last row
 *
 * Uses roving tabindex: exactly one cell has tabindex=0 at any time.
 * The caller renders cells and binds tabIndex via `isActive(r,c) ? 0 : -1`.
 */
export function useTableKeyboardNav(options: UseTableKeyboardNavOptions): UseTableKeyboardNavReturn {
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);

  // Always read the latest bounds/resolver inside the keydown handler without
  // having to recreate the callback (and re-bind onKeyDown) every render.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const move = useCallback((newRow: number, newCol: number) => {
    const { rowCount, columnCount, getCellElement } = optionsRef.current;
    const rMax = rowCount - 1;
    const cMax = columnCount - 1;
    if (rMax < 0 || cMax < 0) return;
    const clampedR = Math.max(0, Math.min(newRow, rMax));
    const clampedC = Math.max(0, Math.min(newCol, cMax));
    setActiveCell({ rowIndex: clampedR, columnIndex: clampedC });
    // Focus on next tick (after render commits the new tabIndex/DOM state).
    queueMicrotask(() => {
      const el = getCellElement(clampedR, clampedC);
      el?.focus();
    });
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { rowCount, columnCount } = optionsRef.current;
      if (rowCount === 0 || columnCount === 0) return;

      // Bootstrap: first arrow key with no active cell -> (0,0)
      const current = activeCell ?? { rowIndex: 0, columnIndex: 0 };

      let handled = false;
      switch (event.key) {
        case "ArrowRight":
          move(current.rowIndex, current.columnIndex + 1);
          handled = true;
          break;
        case "ArrowLeft":
          move(current.rowIndex, current.columnIndex - 1);
          handled = true;
          break;
        case "ArrowDown":
          move(current.rowIndex + 1, current.columnIndex);
          handled = true;
          break;
        case "ArrowUp":
          move(current.rowIndex - 1, current.columnIndex);
          handled = true;
          break;
        case "Home":
          if (event.ctrlKey || event.metaKey) {
            move(0, 0);
          } else {
            move(current.rowIndex, 0);
          }
          handled = true;
          break;
        case "End":
          if (event.ctrlKey || event.metaKey) {
            move(rowCount - 1, columnCount - 1);
          } else {
            move(current.rowIndex, columnCount - 1);
          }
          handled = true;
          break;
        // Tab NOT intercepted — exits the grid per WAI-ARIA
      }

      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [activeCell, move],
  );

  const onCellFocus = useCallback((rowIndex: number, columnIndex: number) => {
    // User clicked or Tab-entered a cell directly — sync activeCell
    setActiveCell({ rowIndex, columnIndex });
  }, []);

  const isActive = useCallback(
    (rowIndex: number, columnIndex: number): boolean => {
      if (activeCell === null) return rowIndex === 0 && columnIndex === 0;
      return activeCell.rowIndex === rowIndex && activeCell.columnIndex === columnIndex;
    },
    [activeCell],
  );

  return { activeCell, onKeyDown, onCellFocus, isActive };
}
