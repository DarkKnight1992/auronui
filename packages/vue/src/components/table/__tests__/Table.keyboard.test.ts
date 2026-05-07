import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useTableKeyboardNav } from '../useTableKeyboardNav'

function makeKeyEvent(key: string, mods: Partial<Pick<KeyboardEvent, 'ctrlKey' | 'metaKey'>> = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { key, ctrlKey: mods.ctrlKey ?? false, metaKey: mods.metaKey ?? false, bubbles: true, cancelable: true })
}

describe('useTableKeyboardNav', () => {
  function setup(rows = 3, cols = 4) {
    const elements = new Map<string, HTMLElement>()
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const el = document.createElement('td')
        el.tabIndex = -1
        document.body.appendChild(el)
        elements.set(`${r},${c}`, el)
      }
    }
    const nav = useTableKeyboardNav({
      rowCount: ref(rows),
      columnCount: ref(cols),
      getCellElement: (r, c) => elements.get(`${r},${c}`) ?? null,
    })
    return { nav, elements }
  }

  it('ArrowRight from (0,0) -> (0,1)', () => {
    const { nav } = setup()
    nav.onCellFocus(0, 0)
    nav.onKeydown(makeKeyEvent('ArrowRight'))
    expect(nav.activeCell.value).toEqual({ rowIndex: 0, columnIndex: 1 })
  })

  it('ArrowRight at last column does NOT wrap', () => {
    const { nav } = setup(3, 4)
    nav.onCellFocus(0, 3)
    nav.onKeydown(makeKeyEvent('ArrowRight'))
    expect(nav.activeCell.value).toEqual({ rowIndex: 0, columnIndex: 3 })
  })

  it('ArrowLeft from (0,1) -> (0,0)', () => {
    const { nav } = setup()
    nav.onCellFocus(0, 1)
    nav.onKeydown(makeKeyEvent('ArrowLeft'))
    expect(nav.activeCell.value).toEqual({ rowIndex: 0, columnIndex: 0 })
  })

  it('ArrowDown from (0,0) -> (1,0)', () => {
    const { nav } = setup()
    nav.onCellFocus(0, 0)
    nav.onKeydown(makeKeyEvent('ArrowDown'))
    expect(nav.activeCell.value).toEqual({ rowIndex: 1, columnIndex: 0 })
  })

  it('ArrowDown at last row does NOT wrap', () => {
    const { nav } = setup(3, 4)
    nav.onCellFocus(2, 0)
    nav.onKeydown(makeKeyEvent('ArrowDown'))
    expect(nav.activeCell.value).toEqual({ rowIndex: 2, columnIndex: 0 })
  })

  it('Home moves to first cell in current row', () => {
    const { nav } = setup()
    nav.onCellFocus(1, 2)
    nav.onKeydown(makeKeyEvent('Home'))
    expect(nav.activeCell.value).toEqual({ rowIndex: 1, columnIndex: 0 })
  })

  it('End moves to last cell in current row', () => {
    const { nav } = setup(3, 4)
    nav.onCellFocus(1, 1)
    nav.onKeydown(makeKeyEvent('End'))
    expect(nav.activeCell.value).toEqual({ rowIndex: 1, columnIndex: 3 })
  })

  it('Ctrl+Home moves to (0,0)', () => {
    const { nav } = setup()
    nav.onCellFocus(2, 3)
    nav.onKeydown(makeKeyEvent('Home', { ctrlKey: true }))
    expect(nav.activeCell.value).toEqual({ rowIndex: 0, columnIndex: 0 })
  })

  it('Ctrl+End moves to last cell of last row', () => {
    const { nav } = setup(3, 4)
    nav.onCellFocus(0, 0)
    nav.onKeydown(makeKeyEvent('End', { ctrlKey: true }))
    expect(nav.activeCell.value).toEqual({ rowIndex: 2, columnIndex: 3 })
  })

  it('Tab key is NOT intercepted (preventDefault not called)', () => {
    const { nav } = setup()
    nav.onCellFocus(0, 0)
    const ev = makeKeyEvent('Tab')
    const spy = vi.spyOn(ev, 'preventDefault')
    nav.onKeydown(ev)
    expect(spy).not.toHaveBeenCalled()
  })

  it('isActive returns true only for active cell', () => {
    const { nav } = setup()
    nav.onCellFocus(1, 2)
    expect(nav.isActive(1, 2)).toBe(true)
    expect(nav.isActive(0, 0)).toBe(false)
  })

  it('isActive(0,0) is true when no cell active yet (tab entry)', () => {
    const { nav } = setup()
    expect(nav.isActive(0, 0)).toBe(true)
    expect(nav.isActive(1, 0)).toBe(false)
  })
})
