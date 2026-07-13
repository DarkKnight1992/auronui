import { describe, it, expect, afterEach } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { useLocationPath } from '../useLocationPath'

function mountHook() {
  let result: ReturnType<typeof useLocationPath> | undefined
  const TestComponent = defineComponent({
    setup() {
      result = useLocationPath()
      return {}
    },
    template: '<div></div>',
  })
  const wrapper = mount(TestComponent)
  return { wrapper, path: result as ReturnType<typeof useLocationPath> }
}

describe('useLocationPath', () => {
  const wrappers: VueWrapper[] = []

  afterEach(() => {
    wrappers.forEach((w) => w.unmount())
    wrappers.length = 0
    window.history.pushState({}, '', '/')
  })

  it('returns the current pathname on mount', () => {
    window.history.pushState({}, '', '/initial')
    const { wrapper, path } = mountHook()
    wrappers.push(wrapper)
    expect(path.value).toBe('/initial')
  })

  it('updates reactively when history.pushState is called (SPA navigation)', async () => {
    const { wrapper, path } = mountHook()
    wrappers.push(wrapper)
    window.history.pushState({}, '', '/next')
    await nextTick()
    expect(path.value).toBe('/next')
  })

  it('updates reactively when history.replaceState is called', async () => {
    const { wrapper, path } = mountHook()
    wrappers.push(wrapper)
    window.history.replaceState({}, '', '/replaced')
    await nextTick()
    expect(path.value).toBe('/replaced')
  })

  it('updates on popstate (browser back/forward)', async () => {
    const { wrapper, path } = mountHook()
    wrappers.push(wrapper)
    window.history.pushState({}, '', '/before-popstate')
    window.dispatchEvent(new PopStateEvent('popstate'))
    await nextTick()
    expect(path.value).toBe('/before-popstate')
  })

  it('patches history.pushState only once across multiple mounted instances', () => {
    const { wrapper: w1 } = mountHook()
    wrappers.push(w1)
    const afterFirst = window.history.pushState
    const { wrapper: w2 } = mountHook()
    wrappers.push(w2)
    const afterSecond = window.history.pushState
    expect(afterSecond).toBe(afterFirst)
  })

  it('stops updating after unmount (removes its own listeners)', async () => {
    const { wrapper, path } = mountHook()
    wrapper.unmount()
    window.history.pushState({}, '', '/after-unmount')
    await nextTick()
    expect(path.value).not.toBe('/after-unmount')
  })
})
