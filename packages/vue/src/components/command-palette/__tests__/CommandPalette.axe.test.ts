import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import CommandPalette from '../CommandPalette.vue'
import type { CommandPaletteItemData } from '../CommandPalette.vue'

const items: CommandPaletteItemData[] = [
  { value: 'new-file', label: 'New File', group: 'File', shortcut: '⌘N' },
  { value: 'open-file', label: 'Open File', group: 'File' },
  { value: 'toggle-theme', label: 'Toggle Theme', group: 'View' },
  { value: 'go-home', label: 'Go to Home' },
]

// Disable region: the Modal teleports its content directly into body,
// outside any landmark — same known false positive documented in
// HoverCard.axe.test.ts / DatePicker.axe.test.ts for other portalled
// components in this codebase.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    region: { enabled: false },
  },
}

describe('CommandPalette axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
    document.body.innerHTML = ''
  })

  it('passes axe when open with grouped items', async () => {
    const wrapper = mount(CommandPalette, { props: { items, open: true }, attachTo: document.body })
    mountedWrappers.push(wrapper)
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with the empty state visible', async () => {
    const wrapper = mount(CommandPalette, { props: { items, open: true }, attachTo: document.body })
    mountedWrappers.push(wrapper)
    await nextTick()
    const search = document.querySelector('input[type="search"]') as HTMLInputElement
    search.value = 'zzz-no-match'
    search.dispatchEvent(new Event('input'))
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })
})
