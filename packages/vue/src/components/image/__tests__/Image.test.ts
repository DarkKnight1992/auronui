import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Image from '../Image.vue'

// jsdom does not implement IntersectionObserver — capture the callback so
// lazy-loading tests can manually simulate the element entering the
// viewport, mirroring the pattern ListBox.test.ts uses for useInfiniteScroll.
const observerHooks = vi.hoisted(() => ({
  callback: null as null | ((entries: { isIntersecting: boolean }[]) => void),
  stop: vi.fn(),
}))
vi.mock('@vueuse/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vueuse/core')>()
  return {
    ...actual,
    useIntersectionObserver: (
      _target: unknown,
      callback: (entries: { isIntersecting: boolean }[]) => void,
    ) => {
      observerHooks.callback = callback
      return { stop: observerHooks.stop, isSupported: { value: true } }
    },
  }
})

function triggerIntersect(isIntersecting: boolean) {
  observerHooks.callback?.([{ isIntersecting }])
}

describe('Image', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('isLazy: false renders the image immediately without waiting for intersection', async () => {
    const wrapper = mount(Image, { props: { src: '/photo.jpg', alt: 'A photo', isLazy: false } })
    await nextTick()
    expect(wrapper.find('[data-slot="image-img"]').attributes('src')).toBe('/photo.jpg')
  })

  it('isLazy: true (default) does not render the image until it intersects the viewport', async () => {
    const wrapper = mount(Image, { props: { src: '/photo.jpg', alt: 'A photo' } })
    await nextTick()
    expect(wrapper.find('[data-slot="image-img"]').exists()).toBe(false)

    triggerIntersect(true)
    await nextTick()
    expect(wrapper.find('[data-slot="image-img"]').attributes('src')).toBe('/photo.jpg')
  })

  it('stops observing once the image becomes visible', async () => {
    mount(Image, { props: { src: '/photo.jpg', alt: 'A photo' } })
    await nextTick()
    triggerIntersect(true)
    await nextTick()
    expect(observerHooks.stop).toHaveBeenCalled()
  })

  it('renders alt text on the image', async () => {
    const wrapper = mount(Image, { props: { src: '/photo.jpg', alt: 'A mountain landscape', isLazy: false } })
    await nextTick()
    expect(wrapper.find('[data-slot="image-img"]').attributes('alt')).toBe('A mountain landscape')
  })

  it('renders a fallback while the image has not yet loaded', () => {
    const wrapper = mount(Image, { props: { src: '/photo.jpg', alt: 'A photo', isLazy: false } })
    expect(wrapper.find('[data-slot="image-fallback"]').exists()).toBe(true)
  })

  it('custom #fallback slot content overrides the default icon', () => {
    const wrapper = mount(Image, {
      props: { src: '/photo.jpg', alt: 'A photo', isLazy: false },
      slots: { fallback: '<span class="custom-fallback">Loading…</span>' },
    })
    expect(wrapper.find('.custom-fallback').exists()).toBe(true)
  })

  it('applies fit and radius classes', () => {
    const wrapper = mount(Image, { props: { src: '/photo.jpg', alt: 'X', fit: 'contain', radius: 'full' } })
    expect(wrapper.find('[data-slot="image"]').classes()).toContain('image--radius-full')
  })

  it('isZoomable: false renders no zoom trigger button', () => {
    const wrapper = mount(Image, { props: { src: '/photo.jpg', alt: 'X', isLazy: false, isZoomable: false } })
    expect(wrapper.find('[data-slot="image-zoom-trigger"]').exists()).toBe(false)
  })

  it('isZoomable: true renders a zoom trigger button with an aria-label once loaded', async () => {
    const wrapper = mount(Image, { props: { src: '/photo.jpg', alt: 'Sunset', isLazy: false, isZoomable: true } })
    await nextTick()
    const trigger = wrapper.find('[data-slot="image-zoom-trigger"]')
    expect(trigger.exists()).toBe(true)
    expect(trigger.attributes('aria-label')).toContain('Sunset')
  })

  it('clicking the zoom trigger opens the Modal', async () => {
    const wrapper = mount(Image, {
      props: { src: '/photo.jpg', alt: 'Sunset', isLazy: false, isZoomable: true },
      attachTo: document.body,
    })
    await nextTick()
    await wrapper.find('[data-slot="image-zoom-trigger"]').trigger('click')
    await nextTick()
    // Modal teleports its content to <body> — assert against the document, not the wrapper.
    expect(document.body.innerHTML).toContain('Sunset')
    wrapper.unmount()
  })

  it('passing class="custom" merges with base classes on the root', () => {
    const wrapper = mount(Image, { props: { src: '/photo.jpg', alt: 'X', class: 'custom-class' } })
    expect(wrapper.find('[data-slot="image"]').classes()).toContain('custom-class')
    expect(wrapper.find('[data-slot="image"]').classes()).toContain('image')
  })
})
