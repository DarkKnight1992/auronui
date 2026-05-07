import { ref, type Ref } from 'vue'

export interface TableKeyboardNavOptions {
  /** Reactive row count (so keyboard nav bounds update when data changes) */
  rowCount: Ref<number>
  /** Reactive column count */
  columnCount: Ref<number>
  /** Callback to resolve the DOM element for a given (row, col) coordinate */
  getCellElement: (rowIndex: number, columnIndex: number) => HTMLElement | null
}

export interface TableKeyboardNav {
  /** Currently active cell (roving tabindex target). null = nothing focused yet. */
  activeCell: Ref<{ rowIndex: number; columnIndex: number } | null>
  /** Attach to the table root: @keydown="onKeydown" */
  onKeydown: (event: KeyboardEvent) => void
  /** Attach to each cell: @focus="onCellFocus(rowIndex, columnIndex)" */
  onCellFocus: (rowIndex: number, columnIndex: number) => void
  /** Query helper: is this cell the tabindex=0 target? */
  isActive: (rowIndex: number, columnIndex: number) => boolean
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
 * The caller renders cells and binds tabindex via `isActive(r,c) ? 0 : -1`.
 */
export function useTableKeyboardNav(options: TableKeyboardNavOptions): TableKeyboardNav {
  const activeCell: Ref<{ rowIndex: number; columnIndex: number } | null> = ref(null)

  function move(newRow: number, newCol: number) {
    const rMax = options.rowCount.value - 1
    const cMax = options.columnCount.value - 1
    if (rMax < 0 || cMax < 0) return
    const clampedR = Math.max(0, Math.min(newRow, rMax))
    const clampedC = Math.max(0, Math.min(newCol, cMax))
    activeCell.value = { rowIndex: clampedR, columnIndex: clampedC }
    // Focus on next tick (after template updates tabindex)
    queueMicrotask(() => {
      const el = options.getCellElement(clampedR, clampedC)
      el?.focus()
    })
  }

  function onKeydown(event: KeyboardEvent) {
    const rowCount = options.rowCount.value
    const columnCount = options.columnCount.value
    if (rowCount === 0 || columnCount === 0) return

    // Bootstrap: first arrow key with no active cell -> (0,0)
    const current = activeCell.value ?? { rowIndex: 0, columnIndex: 0 }

    let handled = false
    switch (event.key) {
      case 'ArrowRight':
        move(current.rowIndex, current.columnIndex + 1)
        handled = true
        break
      case 'ArrowLeft':
        move(current.rowIndex, current.columnIndex - 1)
        handled = true
        break
      case 'ArrowDown':
        move(current.rowIndex + 1, current.columnIndex)
        handled = true
        break
      case 'ArrowUp':
        move(current.rowIndex - 1, current.columnIndex)
        handled = true
        break
      case 'Home':
        if (event.ctrlKey || event.metaKey) {
          move(0, 0)
        } else {
          move(current.rowIndex, 0)
        }
        handled = true
        break
      case 'End':
        if (event.ctrlKey || event.metaKey) {
          move(rowCount - 1, columnCount - 1)
        } else {
          move(current.rowIndex, columnCount - 1)
        }
        handled = true
        break
      // Tab NOT intercepted — exits the grid per WAI-ARIA
    }

    if (handled) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  function onCellFocus(rowIndex: number, columnIndex: number) {
    // User clicked or Tab-entered a cell directly — sync activeCell
    activeCell.value = { rowIndex, columnIndex }
  }

  function isActive(rowIndex: number, columnIndex: number): boolean {
    // If nothing is active yet, the (0,0) cell is the tab entry point
    if (activeCell.value === null) return rowIndex === 0 && columnIndex === 0
    return activeCell.value.rowIndex === rowIndex && activeCell.value.columnIndex === columnIndex
  }

  return { activeCell, onKeydown, onCellFocus, isActive }
}
