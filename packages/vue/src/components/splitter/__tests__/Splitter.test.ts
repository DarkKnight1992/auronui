import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import SplitterGroup from '../SplitterGroup.vue'
import SplitterPanel from '../SplitterPanel.vue'
import SplitterResizeHandle from '../SplitterResizeHandle.vue'

describe('SplitterResizeHandle', () => {
  it('deprecated bare disabled prop sets data-disabled on the resize handle', () => {
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        template: `
          <SplitterGroup>
            <SplitterPanel />
            <SplitterResizeHandle :disabled="true" />
            <SplitterPanel />
          </SplitterGroup>
        `,
      }),
      { attachTo: document.body },
    )
    const handle = wrapper.find('[data-resize-handle]')
    expect(handle.exists()).toBe(true)
    expect(handle.attributes('data-disabled')).toBe('')
    wrapper.unmount()
  })
})
