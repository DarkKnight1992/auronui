import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleGroup,
} from '../index'

function groupHarness(singleOpen: boolean) {
  return mount({
    components: { CollapsibleGroup, Collapsible, CollapsibleTrigger, CollapsibleContent },
    setup() {
      return { singleOpen }
    },
    template: `
      <CollapsibleGroup :single-open="singleOpen">
        <Collapsible :default-open="true">
          <CollapsibleTrigger>A</CollapsibleTrigger>
          <CollapsibleContent>A content</CollapsibleContent>
        </Collapsible>
        <Collapsible :default-open="false">
          <CollapsibleTrigger>B</CollapsibleTrigger>
          <CollapsibleContent>B content</CollapsibleContent>
        </Collapsible>
      </CollapsibleGroup>
    `,
  })
}

describe('CollapsibleGroup', () => {
  it('applies collapsible-group class', () => {
    expect(groupHarness(false).find('.collapsible-group').exists()).toBe(true)
  })

  it('multi-open (default): opening B leaves A open', async () => {
    const w = groupHarness(false)
    const triggers = w.findAll('.collapsible__trigger')
    // A starts open (default-open=true); click B to open it
    await triggers[1].trigger('click')
    await nextTick()
    expect(triggers[0].attributes('data-state')).toBe('open')
    expect(triggers[1].attributes('data-state')).toBe('open')
  })

  it('single-open: opening B closes A', async () => {
    const w = groupHarness(true)
    const triggers = w.findAll('.collapsible__trigger')
    // A starts open; click B
    await triggers[1].trigger('click')
    // Allow reactivity flush
    await nextTick()
    await nextTick()
    expect(triggers[0].attributes('data-state')).toBe('closed')
    expect(triggers[1].attributes('data-state')).toBe('open')
  })
})
