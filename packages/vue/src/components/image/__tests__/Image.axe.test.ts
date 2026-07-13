import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import Image from '../Image.vue'

describe('Image axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('passes axe in default state', async () => {
    const wrapper = mount(Image, {
      props: { src: '/photo.jpg', alt: 'A scenic mountain landscape', isLazy: false },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe when zoomable', async () => {
    const wrapper = mount(Image, {
      props: { src: '/photo.jpg', alt: 'A scenic mountain landscape', isLazy: false, isZoomable: true },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
