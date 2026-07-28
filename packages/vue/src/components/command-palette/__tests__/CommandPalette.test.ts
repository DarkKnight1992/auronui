import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CommandPalette from '../CommandPalette.vue'
import type { CommandPaletteItemData } from '../CommandPalette.vue'

const items: CommandPaletteItemData[] = [
  { value: 'new-file', label: 'New File', group: 'File' },
  { value: 'open-file', label: 'Open File', group: 'File' },
  { value: 'toggle-theme', label: 'Toggle Theme', group: 'View' },
  { value: 'go-home', label: 'Go to Home' },
]

function pressGlobalShortcut(key = 'k', mod: 'meta' | 'ctrl' = 'meta') {
  window.dispatchEvent(
    new KeyboardEvent('keydown', { key, metaKey: mod === 'meta', ctrlKey: mod === 'ctrl', bubbles: true }),
  )
}

describe('CommandPalette', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
    document.body.innerHTML = ''
  })

  it('is closed by default', () => {
    const wrapper = mount(CommandPalette, { props: { items }, attachTo: document.body })
    mountedWrappers.push(wrapper)
    expect(document.querySelector('[data-slot="command-palette-content"]')).toBeNull()
  })

  it('pressing the global shortcut (Cmd/Ctrl+K) opens the palette', async () => {
    const wrapper = mount(CommandPalette, { props: { items }, attachTo: document.body })
    mountedWrappers.push(wrapper)
    pressGlobalShortcut()
    await nextTick()
    expect(document.querySelector('[data-slot="command-palette-content"]')).not.toBeNull()
  })

  it('pressing the shortcut again toggles the palette closed', async () => {
    const wrapper = mount(CommandPalette, { props: { items }, attachTo: document.body })
    mountedWrappers.push(wrapper)
    pressGlobalShortcut()
    await nextTick()
    pressGlobalShortcut()
    await nextTick()
    expect(document.querySelector('[data-slot="command-palette-content"]')).toBeNull()
  })

  it('a plain "k" keypress without the modifier does not open the palette', async () => {
    const wrapper = mount(CommandPalette, { props: { items }, attachTo: document.body })
    mountedWrappers.push(wrapper)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', bubbles: true }))
    await nextTick()
    expect(document.querySelector('[data-slot="command-palette-content"]')).toBeNull()
  })

  it('a custom shortcut prop is honored instead of the default mod+k', async () => {
    const wrapper = mount(CommandPalette, { props: { items, shortcut: 'mod+p' }, attachTo: document.body })
    mountedWrappers.push(wrapper)
    pressGlobalShortcut('k')
    await nextTick()
    expect(document.querySelector('[data-slot="command-palette-content"]')).toBeNull()
    pressGlobalShortcut('p')
    await nextTick()
    expect(document.querySelector('[data-slot="command-palette-content"]')).not.toBeNull()
  })

  it('removes the global keydown listener on unmount', async () => {
    const wrapper = mount(CommandPalette, { props: { items }, attachTo: document.body })
    wrapper.unmount()
    pressGlobalShortcut()
    await nextTick()
    expect(document.querySelector('[data-slot="command-palette-content"]')).toBeNull()
  })

  it('renders all items grouped by their group field when open', async () => {
    const wrapper = mount(CommandPalette, { props: { items, open: true }, attachTo: document.body })
    mountedWrappers.push(wrapper)
    await nextTick()
    expect(document.body.textContent).toContain('New File')
    expect(document.body.textContent).toContain('Toggle Theme')
    expect(document.body.textContent).toContain('Go to Home')
    expect(document.body.textContent).toContain('File')
    expect(document.body.textContent).toContain('View')
  })

  it('typing in the search field filters the visible items by label', async () => {
    const wrapper = mount(CommandPalette, { props: { items, open: true }, attachTo: document.body })
    mountedWrappers.push(wrapper)
    await nextTick()
    const search = document.querySelector('input[type="search"]') as HTMLInputElement
    search.value = 'theme'
    search.dispatchEvent(new Event('input'))
    await nextTick()
    expect(document.body.textContent).toContain('Toggle Theme')
    expect(document.body.textContent).not.toContain('New File')
  })

  it('shows the empty state when no items match the query', async () => {
    const wrapper = mount(CommandPalette, {
      props: { items, open: true, emptyMessage: 'Nothing here' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    await nextTick()
    const search = document.querySelector('input[type="search"]') as HTMLInputElement
    search.value = 'zzz-no-match'
    search.dispatchEvent(new Event('input'))
    await nextTick()
    expect(document.querySelector('[data-slot="command-palette-empty"]')).not.toBeNull()
    expect(document.body.textContent).toContain('Nothing here')
  })

  it('clicking an item calls its onSelect callback, emits select, and closes the palette', async () => {
    let selectedValue: string | undefined
    let called = false
    const itemsWithCallback: CommandPaletteItemData[] = [
      { value: 'save', label: 'Save Document', onSelect: () => { called = true } },
    ]
    const wrapper = mount(CommandPalette, {
      props: { items: itemsWithCallback, open: true },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    await nextTick()
    const option = document.querySelector('[role="option"]') as HTMLElement
    option.click()
    await nextTick()
    expect(called).toBe(true)
    const emitted = wrapper.emitted('select')
    expect(emitted).toBeTruthy()
    selectedValue = (emitted![0]![0] as CommandPaletteItemData).value
    expect(selectedValue).toBe('save')
    expect(document.querySelector('[data-slot="command-palette-content"]')).toBeNull()
  })

  it('ArrowDown then Enter in the search input selects the second item without leaving the input focused elsewhere first', async () => {
    let selected: CommandPaletteItemData | undefined
    let called = ''
    const itemsWithCallbacks: CommandPaletteItemData[] = [
      { value: 'first', label: 'First Command', onSelect: () => { called = 'first' } },
      { value: 'second', label: 'Second Command', onSelect: () => { called = 'second' } },
    ]
    const wrapper = mount(CommandPalette, {
      props: { items: itemsWithCallbacks, open: true },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    await nextTick()
    const search = document.querySelector('input[type="search"]') as HTMLInputElement
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
    await nextTick()
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    await nextTick()
    expect(called).toBe('second')
    const emitted = wrapper.emitted('select')
    selected = emitted?.[0]?.[0] as CommandPaletteItemData
    expect(selected.value).toBe('second')
  })

  it('ArrowDown does not move focus out of the search input (the input keeps focus the whole time)', async () => {
    const wrapper = mount(CommandPalette, { props: { items, open: true }, attachTo: document.body })
    mountedWrappers.push(wrapper)
    await nextTick()
    const search = document.querySelector('input[type="search"]') as HTMLInputElement
    search.focus()
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
    await nextTick()
    expect(document.activeElement).toBe(search)
  })

  it('a disabled item cannot be activated via keyboard Enter, matching the mouse-click behavior', async () => {
    let called = false
    const itemsWithDisabled: CommandPaletteItemData[] = [
      { value: 'disabled-item', label: 'Disabled Command', isDisabled: true, onSelect: () => { called = true } },
      { value: 'enabled-item', label: 'Enabled Command' },
    ]
    const wrapper = mount(CommandPalette, {
      props: { items: itemsWithDisabled, open: true },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    await nextTick()
    const search = document.querySelector('input[type="search"]') as HTMLInputElement
    // activeValue defaults to the first item, which is disabled here.
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    await nextTick()
    expect(called).toBe(false)
    expect(wrapper.emitted('select')).toBeFalsy()
    // The palette should still be open — a no-op selection must not close it.
    expect(document.querySelector('[data-slot="command-palette-content"]')).not.toBeNull()
  })

  it('exposes the virtual active item to assistive tech via aria-activedescendant, updated as ArrowDown moves', async () => {
    const wrapper = mount(CommandPalette, { props: { items, open: true }, attachTo: document.body })
    mountedWrappers.push(wrapper)
    await nextTick()
    const search = document.querySelector('input[type="search"]') as HTMLInputElement
    const firstOption = document.querySelector('[role="option"]') as HTMLElement
    expect(firstOption.id).toBe('command-palette-item-new-file')
    expect(search.getAttribute('aria-activedescendant')).toBe(firstOption.id)

    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
    await nextTick()
    expect(search.getAttribute('aria-activedescendant')).toBe('command-palette-item-open-file')
    const activeOption = document.getElementById('command-palette-item-open-file')
    expect(activeOption?.getAttribute('role')).toBe('option')
  })

  it('clearing the search query on close means reopening shows the full list again', async () => {
    const wrapper = mount(CommandPalette, { props: { items, open: true }, attachTo: document.body })
    mountedWrappers.push(wrapper)
    await nextTick()
    const search = document.querySelector('input[type="search"]') as HTMLInputElement
    search.value = 'theme'
    search.dispatchEvent(new Event('input'))
    await nextTick()
    await wrapper.setProps({ open: false })
    await nextTick()
    await wrapper.setProps({ open: true })
    await nextTick()
    expect(document.body.textContent).toContain('New File')
  })
})
