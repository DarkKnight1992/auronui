import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { describe, it, expect } from 'vitest'
import { defineComponent } from 'vue'
import EmptyState from '../EmptyState.vue'
import EmptyStateContent from '../EmptyStateContent.vue'

describe('EmptyState', () => {
  it('EmptyState root renders a div with class "empty-state" and aria-live="polite"', () => {
    const wrapper = mount(EmptyState)
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    expect(wrapper.classes()).toContain('empty-state')
    expect(wrapper.attributes('aria-live')).toBe('polite')
  })

  it('EmptyStateContent renders a child div with class "empty-state__content"', () => {
    const wrapper = mount(EmptyStateContent)
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    expect(wrapper.classes()).toContain('empty-state__content')
  })

  it('EmptyState provides context that EmptyStateContent can inject', () => {
    const Composition = defineComponent({
      components: { EmptyState, EmptyStateContent },
      template: `
        <EmptyState>
          <EmptyStateContent>No results</EmptyStateContent>
        </EmptyState>
      `,
    })
    const wrapper = mount(Composition)
    expect(wrapper.findComponent(EmptyState).classes()).toContain('empty-state')
    expect(wrapper.findComponent(EmptyStateContent).classes()).toContain('empty-state__content')
    expect(wrapper.findComponent(EmptyStateContent).text()).toBe('No results')
  })

  it('passes axe audit for EmptyState + EmptyStateContent composition', async () => {
    const Composition = defineComponent({
      components: { EmptyState, EmptyStateContent },
      template: `
        <EmptyState>
          <EmptyStateContent>Nothing found</EmptyStateContent>
        </EmptyState>
      `,
    })
    const wrapper = mount(Composition, { attachTo: document.body })
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
    wrapper.unmount()
  })
})
