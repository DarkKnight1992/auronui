import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, reactive } from 'vue'
import axe from 'axe-core'

// Mock @vueuse/core useScroll before importing the component
// arrivedState.top = true means AT the top edge (no content above)
// arrivedState.bottom = true means AT the bottom edge (no content below)
const mockArrivedState = reactive({ top: true, bottom: false, left: true, right: false })

vi.mock('@vueuse/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vueuse/core')>()
  return {
    ...actual,
    useScroll: vi.fn(() => ({
      x: { value: 0 },
      y: { value: 0 },
      isScrolling: { value: false },
      arrivedState: mockArrivedState,
      directions: { top: false, bottom: false, left: false, right: false },
    })),
  }
})

import ScrollShadow from '../ScrollShadow.vue'

describe('ScrollShadow', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  beforeEach(() => {
    // Reset to initial state (at top, not at bottom)
    mockArrivedState.top = true
    mockArrivedState.bottom = false
    mockArrivedState.left = true
    mockArrivedState.right = false
  })

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 1: Component mounts and renders slot content
  it('mounts with default slot content', async () => {
    const wrapper = mount(ScrollShadow, {
      slots: { default: '<p>Long content</p>' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    expect(wrapper.find('p').text()).toBe('Long content')
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
  })

  // Test 2: At top (arrivedState.top=true) — no top shadow; content below (arrivedState.bottom=false) → bottom shadow shown
  it('shows bottom shadow and hides top shadow when at top', async () => {
    mockArrivedState.top = true
    mockArrivedState.bottom = false

    const wrapper = mount(ScrollShadow, {
      slots: { default: '<p>Content</p>' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const el = wrapper.element as HTMLElement
    // At top: no content above → data-top-scroll should NOT be "true"
    expect(el.getAttribute('data-top-scroll')).not.toBe('true')
    // Content below: bottom shadow should be shown → data-bottom-scroll="true"
    expect(el.getAttribute('data-bottom-scroll')).toBe('true')
  })

  // Test 3: Scrolled to middle — both shadows visible
  it('shows both shadows when scrolled to middle', async () => {
    mockArrivedState.top = false
    mockArrivedState.bottom = false

    const wrapper = mount(ScrollShadow, {
      slots: { default: '<p>Content</p>' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const el = wrapper.element as HTMLElement
    // Content above and below → both shadow data-attrs set to "true"
    expect(el.getAttribute('data-top-scroll')).toBe('true')
    expect(el.getAttribute('data-bottom-scroll')).toBe('true')
  })

  // Test 4: At bottom — top shadow visible, no bottom shadow
  it('shows top shadow and hides bottom shadow when at bottom', async () => {
    mockArrivedState.top = false
    mockArrivedState.bottom = true

    const wrapper = mount(ScrollShadow, {
      slots: { default: '<p>Content</p>' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const el = wrapper.element as HTMLElement
    // Content above → top shadow shown
    expect(el.getAttribute('data-top-scroll')).toBe('true')
    // At bottom → no content below → bottom shadow hidden
    expect(el.getAttribute('data-bottom-scroll')).not.toBe('true')
  })

  // Test 5: orientation="horizontal" switches to left/right tracking
  it('tracks left/right scroll state for horizontal orientation', async () => {
    mockArrivedState.left = false
    mockArrivedState.right = true

    const wrapper = mount(ScrollShadow, {
      props: { orientation: 'horizontal' },
      slots: { default: '<p>Content</p>' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const el = wrapper.element as HTMLElement
    expect(el.getAttribute('data-orientation')).toBe('horizontal')
    // Content to the left → left shadow shown
    expect(el.getAttribute('data-left-scroll')).toBe('true')
    // At right edge → no right shadow
    expect(el.getAttribute('data-right-scroll')).not.toBe('true')
  })

  // Test 6: axe zero violations on initial mount
  it('passes axe accessibility audit', async () => {
    const wrapper = mount(ScrollShadow, {
      slots: { default: '<p id="scroll-content">Scrollable content here</p>' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const results = await axe.run(wrapper.element as HTMLElement)
    expect(results.violations).toHaveLength(0)
  })
})
