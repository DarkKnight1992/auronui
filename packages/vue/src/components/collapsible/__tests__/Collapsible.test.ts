import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../index'

describe('Collapsible', () => {
  it('applies base "collapsible" class', () => {
    const w = mount({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel content</CollapsibleContent>
        </Collapsible>
      `,
    })
    expect(w.find('.collapsible').exists()).toBe(true)
  })

  it('trigger has collapsible__trigger class', () => {
    const w = mount({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel content</CollapsibleContent>
        </Collapsible>
      `,
    })
    expect(w.find('.collapsible__trigger').exists()).toBe(true)
  })

  it('defaultOpen=true starts open', () => {
    const w = mount({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible :default-open="true">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel content</CollapsibleContent>
        </Collapsible>
      `,
    })
    expect(w.find('.collapsible__trigger').attributes('data-state')).toBe('open')
  })

  it('defaultOpen=false starts closed', () => {
    const w = mount({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible :default-open="false">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel content</CollapsibleContent>
        </Collapsible>
      `,
    })
    expect(w.find('.collapsible__trigger').attributes('data-state')).toBe('closed')
  })

  it('clicking trigger flips v-model state', async () => {
    const open = ref(false)
    const Wrapper = defineComponent({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      setup() { return { open } },
      template: `
        <Collapsible v-model:open="open">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel content</CollapsibleContent>
        </Collapsible>
      `,
    })
    const w = mount(Wrapper, { attachTo: document.body })
    await w.find('.collapsible__trigger').trigger('click')
    await nextTick()
    expect(open.value).toBe(true)
    w.unmount()
  })
})
