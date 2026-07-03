import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import axe from 'axe-core'
import SplitterGroup from '../SplitterGroup.vue'
import SplitterPanel from '../SplitterPanel.vue'
import SplitterResizeHandle from '../SplitterResizeHandle.vue'

describe('Splitter axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('Axe Test 1: SplitterGroup with two SplitterPanels and a SplitterResizeHandle passes axe', async () => {
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        template: `
          <SplitterGroup>
            <SplitterPanel id="left" :default-size="50" />
            <SplitterResizeHandle id="handle" />
            <SplitterPanel id="right" :default-size="50" />
          </SplitterGroup>
        `,
      }),
      { attachTo: document.body },
    )
    mountedWrappers.push(wrapper)

    // reka-ui computes aria-controls/aria-valuenow/aria-valuemin/aria-valuemax for each resize
    // handle (per the WAI-ARIA window-splitter pattern) inside a `watchEffect` in its
    // SplitterGroup implementation (see reka-ui's
    // Splitter/utils/composables/useWindowSplitterPanelGroupBehavior.ts), gated on panel
    // registration (which happens in each SplitterPanel's onMounted) and the panel-group
    // element ref resolving. Both settle within one Vue tick after mount, so a single
    // `await nextTick()` here is enough for the real ARIA values to be present before auditing
    // — no faked attributes or disabled axe rules needed.
    await nextTick()

    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
