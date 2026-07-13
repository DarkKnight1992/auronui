import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import axe from 'axe-core'
import Timeline from '../Timeline.vue'
import TimelineItem from '../TimelineItem.vue'

describe('Timeline axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('passes axe with title/description/timestamp items', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Timeline, TimelineItem },
        template: `
          <Timeline>
            <TimelineItem title="Order placed" timestamp="Jan 3" status="done" />
            <TimelineItem title="Shipped" timestamp="Jan 5" status="current" />
            <TimelineItem title="Delivered" status="pending" />
          </Timeline>
        `,
      }),
      { attachTo: document.body },
    )
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe in horizontal orientation', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Timeline, TimelineItem },
        template: `
          <Timeline orientation="horizontal">
            <TimelineItem title="Step 1" />
            <TimelineItem title="Step 2" />
          </Timeline>
        `,
      }),
      { attachTo: document.body },
    )
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
