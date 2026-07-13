import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import Timeline from '../Timeline.vue'
import TimelineItem from '../TimelineItem.vue'

describe('Timeline', () => {
  it('renders role="list" on the root and role="listitem" on each item', () => {
    const wrapper = mount(
      defineComponent({
        components: { Timeline, TimelineItem },
        template: `
          <Timeline>
            <TimelineItem title="A" />
            <TimelineItem title="B" />
          </Timeline>
        `,
      }),
    )
    expect(wrapper.find('[data-slot="timeline"]').attributes('role')).toBe('list')
    expect(wrapper.findAll('[data-slot="timeline-item"]')).toHaveLength(2)
    expect(wrapper.findAll('[role="listitem"]')).toHaveLength(2)
  })

  it('renders title, description, and timestamp when provided', () => {
    const wrapper = mount(TimelineItem, {
      props: { title: 'Order placed', description: 'Confirmed via email', timestamp: 'Jan 3' },
    })
    expect(wrapper.find('[data-slot="timeline-title"]').text()).toBe('Order placed')
    expect(wrapper.find('[data-slot="timeline-description"]').text()).toBe('Confirmed via email')
    expect(wrapper.find('[data-slot="timeline-timestamp"]').text()).toBe('Jan 3')
  })

  it('renders none of title/description/timestamp spans when not provided', () => {
    const wrapper = mount(TimelineItem)
    expect(wrapper.find('[data-slot="timeline-title"]').exists()).toBe(false)
    expect(wrapper.find('[data-slot="timeline-description"]').exists()).toBe(false)
    expect(wrapper.find('[data-slot="timeline-timestamp"]').exists()).toBe(false)
  })

  it('default slot content overrides the title/description/timestamp props', () => {
    const wrapper = mount(TimelineItem, {
      props: { title: 'Ignored' },
      slots: { default: '<span class="custom">Custom content</span>' },
    })
    expect(wrapper.find('[data-slot="timeline-title"]').exists()).toBe(false)
    expect(wrapper.find('.custom').text()).toBe('Custom content')
  })

  it('applies status classes to the dot', () => {
    const statuses = ['done', 'current', 'pending'] as const
    for (const status of statuses) {
      const wrapper = mount(TimelineItem, { props: { status } })
      expect(wrapper.find('[data-slot="timeline-dot"]').classes()).toContain(`timeline__dot--${status}`)
    }
  })

  it('color prop applies a dot color class', () => {
    const wrapper = mount(TimelineItem, { props: { color: 'danger' } })
    expect(wrapper.find('[data-slot="timeline-dot"]').classes()).toContain('timeline__dot--color-danger')
  })

  it('applies all color variants to the dot', () => {
    const colors = ['default', 'primary', 'secondary', 'accent', 'success', 'warning', 'danger'] as const
    for (const color of colors) {
      const wrapper = mount(TimelineItem, { props: { color } })
      expect(wrapper.find('[data-slot="timeline-dot"]').classes()).toContain(`timeline__dot--color-${color}`)
    }
  })

  it('defaults to vertical orientation', () => {
    const wrapper = mount(Timeline)
    expect(wrapper.find('[data-slot="timeline"]').classes()).toContain('timeline--vertical')
  })

  it('orientation="horizontal" applies the horizontal class to root and items', () => {
    const wrapper = mount(
      defineComponent({
        components: { Timeline, TimelineItem },
        template: `
          <Timeline orientation="horizontal">
            <TimelineItem title="A" />
          </Timeline>
        `,
      }),
    )
    expect(wrapper.find('[data-slot="timeline"]').classes()).toContain('timeline--horizontal')
    expect(wrapper.find('[data-slot="timeline-item"]').classes()).toContain('timeline__item--horizontal')
  })

  it('the connecting line is decorative (aria-hidden)', () => {
    const wrapper = mount(TimelineItem)
    expect(wrapper.find('[data-slot="timeline-line"]').attributes('aria-hidden')).toBe('true')
  })

  it('the dot is decorative (aria-hidden)', () => {
    const wrapper = mount(TimelineItem)
    expect(wrapper.find('[data-slot="timeline-dot"]').attributes('aria-hidden')).toBe('true')
  })

  it('passing class="custom" merges with base classes on the root', () => {
    const wrapper = mount(Timeline, { props: { class: 'custom-class' } })
    expect(wrapper.find('[data-slot="timeline"]').classes()).toContain('custom-class')
    expect(wrapper.find('[data-slot="timeline"]').classes()).toContain('timeline')
  })
})
