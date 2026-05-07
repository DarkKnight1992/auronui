import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleGroup,
} from '../index'

describe('Collapsible axe audit', () => {
  const wrappers: ReturnType<typeof mount>[] = []
  afterEach(() => { wrappers.forEach(w => w.unmount()); wrappers.length = 0 })

  it('standalone Collapsible passes axe', async () => {
    const w = mount({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible default-open>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    }, { attachTo: document.body })
    wrappers.push(w)
    const r = await axe.run(w.element as HTMLElement)
    expect(r.violations).toEqual([])
  })

  it('CollapsibleGroup single-open passes axe', async () => {
    const w = mount({
      components: { CollapsibleGroup, Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <CollapsibleGroup :single-open="true">
          <Collapsible><CollapsibleTrigger>A</CollapsibleTrigger><CollapsibleContent>Ac</CollapsibleContent></Collapsible>
          <Collapsible><CollapsibleTrigger>B</CollapsibleTrigger><CollapsibleContent>Bc</CollapsibleContent></Collapsible>
        </CollapsibleGroup>
      `,
    }, { attachTo: document.body })
    wrappers.push(w)
    const r = await axe.run(w.element as HTMLElement)
    expect(r.violations).toEqual([])
  })
})
