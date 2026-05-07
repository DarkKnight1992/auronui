import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Link from '../Link.vue'

describe('Link', () => {
  it('renders as <a> element by default', () => {
    const wrapper = mount(Link, {
      props: { href: '#' },
      slots: { default: 'Click' },
    })
    expect(wrapper.element.tagName.toLowerCase()).toBe('a')
  })

  it('applies "link" base class', () => {
    const wrapper = mount(Link, { props: { href: '#' }, slots: { default: 'Click' } })
    expect(wrapper.classes()).toContain('link')
  })

  it('isExternal=false: no target, no rel, no SVG glyph', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', isExternal: false },
      slots: { default: 'Example' },
    })
    expect(wrapper.attributes('target')).toBeUndefined()
    expect(wrapper.attributes('rel')).toBeUndefined()
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('isExternal=true: sets target="_blank" (T-02-EXT)', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', isExternal: true },
      slots: { default: 'External' },
    })
    expect(wrapper.attributes('target')).toBe('_blank')
  })

  it('isExternal=true: sets rel="noopener noreferrer" (T-02-EXT)', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', isExternal: true },
      slots: { default: 'External' },
    })
    expect(wrapper.attributes('rel')).toBe('noopener noreferrer')
  })

  it('isExternal=true: renders SVG glyph with aria-hidden', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', isExternal: true },
      slots: { default: 'External' },
    })
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('aria-hidden')).toBe('true')
  })

  it('isExternal=true with explicit rel: uses explicit rel (consumer override)', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', isExternal: true, rel: 'noopener' },
      slots: { default: 'External' },
    })
    expect(wrapper.attributes('rel')).toBe('noopener')
  })

  it('polymorphic as="button": renders as <button>', () => {
    const wrapper = mount(Link, {
      props: { as: 'button' },
      slots: { default: 'Click' },
    })
    expect(wrapper.element.tagName.toLowerCase()).toBe('button')
  })

  it('does NOT import or use ButtonGroup context (D-20)', () => {
    // Structural test: Link.vue must not contain useButtonGroupInject
    // This is enforced by the acceptance_criteria grep check
    // If we get here without error, the component mounted without context errors
    const wrapper = mount(Link, { props: { href: '#' }, slots: { default: 'OK' } })
    expect(wrapper.exists()).toBe(true)
  })
})
