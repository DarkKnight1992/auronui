import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from '../index'

describe('Toolbar', () => {
  it('renders horizontal toolbar with toolbar class', () => {
    const w = mount({
      components: { Toolbar, ToolbarButton },
      template: `<Toolbar><ToolbarButton>One</ToolbarButton></Toolbar>`,
    })
    expect(w.find('.toolbar').exists()).toBe(true)
    expect(w.find('.toolbar--horizontal').exists()).toBe(true)
  })

  it('vertical orientation applies toolbar--vertical', () => {
    const w = mount({
      components: { Toolbar, ToolbarButton },
      template: `<Toolbar orientation="vertical"><ToolbarButton>One</ToolbarButton></Toolbar>`,
    })
    expect(w.find('.toolbar--vertical').exists()).toBe(true)
  })

  it('renders ToolbarToggleGroup with toggle items', () => {
    const w = mount({
      components: { Toolbar, ToolbarToggleGroup, ToolbarToggleItem },
      template: `
        <Toolbar>
          <ToolbarToggleGroup type="single" default-value="bold">
            <ToolbarToggleItem value="bold">B</ToolbarToggleItem>
            <ToolbarToggleItem value="italic">I</ToolbarToggleItem>
          </ToolbarToggleGroup>
        </Toolbar>
      `,
    })
    expect(w.findAll('[data-state]').length).toBeGreaterThanOrEqual(2)
  })

  it('renders ToolbarLink with href', () => {
    const w = mount({
      components: { Toolbar, ToolbarLink },
      template: `<Toolbar><ToolbarLink href="https://example.com">Home</ToolbarLink></Toolbar>`,
    })
    expect(w.find('a[href="https://example.com"]').exists()).toBe(true)
  })

  it('isAttached prop applies toolbar--attached', () => {
    const w = mount({
      components: { Toolbar, ToolbarButton },
      template: `<Toolbar :is-attached="true"><ToolbarButton>x</ToolbarButton></Toolbar>`,
    })
    expect(w.find('.toolbar--attached').exists()).toBe(true)
  })

  it('deprecated bare disabled prop on ToolbarButton disables the button', () => {
    const w = mount({
      components: { Toolbar, ToolbarButton },
      template: `<Toolbar><ToolbarButton :disabled="true">One</ToolbarButton></Toolbar>`,
    })
    expect(w.find('button').attributes('disabled')).toBeDefined()
  })

  it('deprecated bare disabled prop on ToolbarToggleItem disables the item', () => {
    const w = mount({
      components: { Toolbar, ToolbarToggleGroup, ToolbarToggleItem },
      template: `
        <Toolbar>
          <ToolbarToggleGroup type="single" default-value="bold">
            <ToolbarToggleItem value="bold" :disabled="true">B</ToolbarToggleItem>
            <ToolbarToggleItem value="italic">I</ToolbarToggleItem>
          </ToolbarToggleGroup>
        </Toolbar>
      `,
    })
    const buttons = w.findAll('button')
    expect(buttons[0].attributes('disabled')).toBeDefined()
  })

  it('deprecated bare disabled prop on ToolbarToggleGroup disables its items', () => {
    const w = mount({
      components: { Toolbar, ToolbarToggleGroup, ToolbarToggleItem },
      template: `
        <Toolbar>
          <ToolbarToggleGroup type="single" default-value="bold" :disabled="true">
            <ToolbarToggleItem value="bold">B</ToolbarToggleItem>
            <ToolbarToggleItem value="italic">I</ToolbarToggleItem>
          </ToolbarToggleGroup>
        </Toolbar>
      `,
    })
    const buttons = w.findAll('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
    buttons.forEach((btn) => {
      expect(btn.attributes('disabled')).toBeDefined()
    })
  })
})
