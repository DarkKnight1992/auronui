import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { defineComponent } from 'vue'
import Avatar from '../Avatar.vue'
import AvatarGroup from '../AvatarGroup.vue'

describe('Avatar', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  it('renders an img element with the provided src', () => {
    const wrapper = mount(Avatar, {
      props: { src: 'https://example.com/photo.jpg', alt: 'Test user' },
    })
    wrappers.push(wrapper)
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/photo.jpg')
  })

  it('renders initials from name when no src is passed', () => {
    const wrapper = mount(Avatar, {
      props: { name: 'Jane Doe' },
    })
    wrappers.push(wrapper)
    // AvatarFallback should show immediately (no src, so delayMs not set)
    expect(wrapper.text()).toContain('JD')
  })

  it('renders single initial for single-word name', () => {
    const wrapper = mount(Avatar, {
      props: { name: 'Alice' },
    })
    wrappers.push(wrapper)
    expect(wrapper.text()).toContain('A')
  })

  it('renders SVG icon fallback when no name and no src', () => {
    const wrapper = mount(Avatar)
    wrappers.push(wrapper)
    // Should render the person icon SVG
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
  })

  it('child prop size overrides group size (D-13)', () => {
    const Wrapper = defineComponent({
      components: { AvatarGroup, Avatar },
      template: '<AvatarGroup size="sm"><Avatar size="lg" name="AB" /></AvatarGroup>',
    })
    const wrapper = mount(Wrapper)
    wrappers.push(wrapper)
    // Avatar with explicit size="lg" should have --lg class
    const avatar = wrapper.findComponent(Avatar)
    expect(avatar.classes()).toContain('avatar--lg')
    expect(avatar.classes()).not.toContain('avatar--sm')
  })

  it('group isDisabled=true always wins over child isDisabled=false', () => {
    const Wrapper = defineComponent({
      components: { AvatarGroup, Avatar },
      template: '<AvatarGroup :is-disabled="true"><Avatar :is-disabled="false" name="AB" /></AvatarGroup>',
    })
    const wrapper = mount(Wrapper)
    wrappers.push(wrapper)
    const avatar = wrapper.findComponent(Avatar)
    expect(avatar.attributes('data-disabled')).toBeDefined()
  })

  it('child inherits isBordered from group when no explicit child prop', () => {
    const Wrapper = defineComponent({
      components: { AvatarGroup, Avatar },
      template: '<AvatarGroup :is-bordered="true"><Avatar name="AB" /></AvatarGroup>',
    })
    const wrapper = mount(Wrapper)
    wrappers.push(wrapper)
    const avatar = wrapper.findComponent(Avatar)
    expect(avatar.attributes('data-bordered')).toBe('true')
  })

  it('renders initials JD for name="Jane Doe"', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jane Doe' } })
    wrappers.push(wrapper)
    expect(wrapper.text()).toBe('JD')
  })

  it('passes axe with zero violations — no src', async () => {
    const wrapper = mount(Avatar, { props: { name: 'Alice Bob' }, attachTo: document.body })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })

  it('passes axe with zero violations — with src', async () => {
    const wrapper = mount(Avatar, {
      props: { src: 'https://example.com/photo.jpg', alt: 'Alice' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })

  it('passes axe with zero violations — bordered + disabled', async () => {
    const wrapper = mount(Avatar, {
      props: { name: 'Bob Carol', isBordered: true, isDisabled: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })
})
