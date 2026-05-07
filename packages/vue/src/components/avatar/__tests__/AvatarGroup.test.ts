import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { defineComponent, ref } from 'vue'
import AvatarGroup from '../AvatarGroup.vue'
import Avatar from '../Avatar.vue'
import { useAvatarGroupInject } from '../avatar-group.context'

describe('AvatarGroup', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  it('renders all child avatars when max is not set', () => {
    const Wrapper = defineComponent({
      components: { AvatarGroup, Avatar },
      template: `
        <AvatarGroup>
          <Avatar name="AB" />
          <Avatar name="CD" />
          <Avatar name="EF" />
          <Avatar name="GH" />
          <Avatar name="IJ" />
        </AvatarGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    wrappers.push(wrapper)
    const avatars = wrapper.findAllComponents(Avatar)
    expect(avatars).toHaveLength(5)
  })

  it('renders first max avatars + counter when max is set', () => {
    const Wrapper = defineComponent({
      components: { AvatarGroup, Avatar },
      template: `
        <AvatarGroup :max="3">
          <Avatar name="AB" />
          <Avatar name="CD" />
          <Avatar name="EF" />
          <Avatar name="GH" />
          <Avatar name="IJ" />
        </AvatarGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    wrappers.push(wrapper)
    // 3 visible + 1 counter = 4 avatar elements
    const avatars = wrapper.findAllComponents(Avatar)
    expect(avatars).toHaveLength(4)
    // Counter shows "+2"
    expect(wrapper.text()).toContain('+2')
  })

  it('root element has role="group"', () => {
    const Wrapper = defineComponent({
      components: { AvatarGroup, Avatar },
      template: `
        <AvatarGroup aria-label="Team members">
          <Avatar name="AB" />
        </AvatarGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    wrappers.push(wrapper)
    expect(wrapper.attributes('role')).toBe('group')
  })

  it('provides size context reactively to child components', () => {
    let receivedSize: string | undefined
    const ChildConsumer = defineComponent({
      setup() {
        const ctx = useAvatarGroupInject({
          size: ref('md'),
          isBordered: ref(false),
          isDisabled: ref(false),
          isGrid: ref(false),
          isInGroup: ref(false),
        })
        receivedSize = ctx.size.value
        return {}
      },
      template: '<div></div>',
    })

    const Wrapper = defineComponent({
      components: { AvatarGroup, ChildConsumer },
      template: '<AvatarGroup size="lg"><ChildConsumer /></AvatarGroup>',
    })
    const wrapper = mount(Wrapper)
    wrappers.push(wrapper)
    expect(receivedSize).toBe('lg')
  })

  it('passes axe with zero violations', async () => {
    const Wrapper = defineComponent({
      components: { AvatarGroup, Avatar },
      template: `
        <AvatarGroup aria-label="Team members">
          <Avatar name="Alice Bob" />
          <Avatar name="Carol Dan" />
          <Avatar name="Eve Frank" />
        </AvatarGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })
})
