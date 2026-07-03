import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScrollArea from '../ScrollArea.vue'

describe('ScrollArea', () => {
  it('Test 1: default mount renders viewport with default slot content', () => {
    const wrapper = mount(ScrollArea, {
      slots: { default: '<p>scrollable content</p>' },
    })
    const viewport = wrapper.find('[data-reka-scroll-area-viewport]')
    expect(viewport.exists()).toBe(true)
    expect(viewport.html()).toContain('scrollable content')
  })

  it('Test 2: orientation="vertical" (default) renders exactly one vertical scrollbar and no corner', () => {
    // type="always" forces the scrollbar to render unconditionally — reka-ui's
    // default type="hover" gates the scrollbar behind pointer-enter/leave state
    // that never fires in jsdom, so it never mounts there.
    const wrapper = mount(ScrollArea, {
      props: { type: 'always' },
      slots: { default: 'content' },
    })
    const scrollbars = wrapper.findAll('[data-orientation]')
    expect(scrollbars).toHaveLength(1)
    expect(scrollbars[0]!.attributes('data-orientation')).toBe('vertical')
    expect(scrollbars[0]!.classes()).toContain('scroll-area__scrollbar--vertical')
    expect(wrapper.findComponent({ name: 'ScrollAreaCorner' }).exists()).toBe(false)
  })

  it('Test 3: orientation="horizontal" renders exactly one horizontal scrollbar and no corner', () => {
    const wrapper = mount(ScrollArea, {
      props: { type: 'always', orientation: 'horizontal' },
      slots: { default: 'content' },
    })
    const scrollbars = wrapper.findAll('[data-orientation]')
    expect(scrollbars).toHaveLength(1)
    expect(scrollbars[0]!.attributes('data-orientation')).toBe('horizontal')
    expect(scrollbars[0]!.classes()).toContain('scroll-area__scrollbar--horizontal')
    expect(wrapper.findComponent({ name: 'ScrollAreaCorner' }).exists()).toBe(false)
  })

  it('Test 4: orientation="both" renders both scrollbars and mounts the corner', () => {
    const wrapper = mount(ScrollArea, {
      props: { type: 'always', orientation: 'both' },
      slots: { default: 'content' },
    })
    const scrollbars = wrapper.findAll('[data-orientation]')
    expect(scrollbars).toHaveLength(2)
    expect(scrollbars.map(s => s.attributes('data-orientation')).sort()).toEqual(['horizontal', 'vertical'])
    // reka-ui's ScrollAreaCorner is mounted (our v-if renders it for orientation="both"),
    // but it renders no DOM node here: its visibility is gated on non-zero
    // offsetWidth/offsetHeight of the scrollbar elements (via ResizeObserver),
    // which jsdom always reports as 0. So no corner element ever appears in this
    // test environment even though the component instance exists.
    expect(wrapper.findComponent({ name: 'ScrollAreaCorner' }).exists()).toBe(true)
  })

  it('Test 5: type, scrollHideDelay, and dir props forward to the reka-ui ScrollAreaRoot', () => {
    const wrapper = mount(ScrollArea, {
      props: { type: 'scroll', scrollHideDelay: 1234, dir: 'rtl' },
      slots: { default: 'content' },
    })
    const root = wrapper.findComponent({ name: 'ScrollAreaRoot' })
    expect(root.exists()).toBe(true)
    expect(root.props('type')).toBe('scroll')
    expect(root.props('scrollHideDelay')).toBe(1234)
    expect(root.props('dir')).toBe('rtl')
  })

  it('Test 6: class prop applies to the root element', () => {
    const wrapper = mount(ScrollArea, {
      props: { class: 'my-root-class' },
      slots: { default: 'content' },
    })
    expect(wrapper.classes()).toContain('scroll-area__root')
    expect(wrapper.classes()).toContain('my-root-class')
  })

  it('Test 7: viewportClass prop applies to the viewport element', () => {
    const wrapper = mount(ScrollArea, {
      props: { viewportClass: 'my-viewport-class' },
      slots: { default: 'content' },
    })
    const viewport = wrapper.find('[data-reka-scroll-area-viewport]')
    expect(viewport.classes()).toContain('scroll-area__viewport')
    expect(viewport.classes()).toContain('my-viewport-class')
  })
})
