import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from '../index'

describe('Toolbar axe', () => {
  const wrappers: ReturnType<typeof mount>[] = []
  afterEach(() => { wrappers.forEach(w => w.unmount()); wrappers.length = 0 })

  it('horizontal toolbar with mixed children passes axe', async () => {
    const w = mount({
      components: { Toolbar, ToolbarButton, ToolbarLink, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem },
      template: `
        <Toolbar>
          <ToolbarButton aria-label="New">New</ToolbarButton>
          <ToolbarButton aria-label="Open">Open</ToolbarButton>
          <ToolbarSeparator />
          <ToolbarToggleGroup type="multiple">
            <ToolbarToggleItem value="bold" aria-label="Bold">B</ToolbarToggleItem>
            <ToolbarToggleItem value="italic" aria-label="Italic">I</ToolbarToggleItem>
          </ToolbarToggleGroup>
          <ToolbarSeparator />
          <ToolbarLink href="https://example.com">Docs</ToolbarLink>
        </Toolbar>
      `,
    }, { attachTo: document.body })
    wrappers.push(w)
    const r = await axe.run(w.element as HTMLElement)
    expect(r.violations).toEqual([])
  })

  it('vertical toolbar passes axe', async () => {
    const w = mount({
      components: { Toolbar, ToolbarButton },
      template: `
        <Toolbar orientation="vertical">
          <ToolbarButton aria-label="Up">Up</ToolbarButton>
          <ToolbarButton aria-label="Down">Down</ToolbarButton>
        </Toolbar>
      `,
    }, { attachTo: document.body })
    wrappers.push(w)
    const r = await axe.run(w.element as HTMLElement)
    expect(r.violations).toEqual([])
  })
})
