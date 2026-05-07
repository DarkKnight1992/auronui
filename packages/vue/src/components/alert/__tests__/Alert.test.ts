import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Alert from '../Alert.vue'
import AlertIcon from '../AlertIcon.vue'
import AlertTitle from '../AlertTitle.vue'
import AlertDescription from '../AlertDescription.vue'

// motion-v components render as plain divs in tests
vi.mock('../../../utils/motion', () => ({
  motion: {
    div: {
      name: 'motion-div',
      props: ['initial', 'animate', 'exit', 'transition'],
      template: '<div v-if="$attrs[\'v-if\'] !== false"><slot /></div>',
      inheritAttrs: false,
    },
  },
  AnimatePresence: {
    name: 'AnimatePresence',
    template: '<slot />',
  },
}))

describe('Alert', () => {
  it('renders role="alert"', () => {
    const wrapper = mount(Alert, {
      slots: { default: 'Alert content' },
    })
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })

  it('applies default severity class', () => {
    const wrapper = mount(Alert, {
      slots: { default: 'Content' },
    })
    const alertEl = wrapper.find('[role="alert"]')
    expect(alertEl.classes()).toContain('alert--default')
  })

  it('applies primary severity class', () => {
    const wrapper = mount(Alert, {
      props: { severity: 'primary' },
      slots: { default: 'Content' },
    })
    const alertEl = wrapper.find('[role="alert"]')
    expect(alertEl.classes()).toContain('alert--accent')
  })

  it('applies success severity class', () => {
    const wrapper = mount(Alert, {
      props: { severity: 'success' },
      slots: { default: 'Content' },
    })
    const alertEl = wrapper.find('[role="alert"]')
    expect(alertEl.classes()).toContain('alert--success')
  })

  it('applies warning severity class', () => {
    const wrapper = mount(Alert, {
      props: { severity: 'warning' },
      slots: { default: 'Content' },
    })
    const alertEl = wrapper.find('[role="alert"]')
    expect(alertEl.classes()).toContain('alert--warning')
  })

  it('applies danger severity class', () => {
    const wrapper = mount(Alert, {
      props: { severity: 'danger' },
      slots: { default: 'Content' },
    })
    const alertEl = wrapper.find('[role="alert"]')
    expect(alertEl.classes()).toContain('alert--danger')
  })

  it('does NOT render CloseButton when isClosable=false (default)', () => {
    const wrapper = mount(Alert, {
      slots: { default: 'Content' },
    })
    expect(wrapper.findComponent({ name: 'Button' }).exists()).toBe(false)
  })

  it('renders CloseButton when isClosable=true', () => {
    const wrapper = mount(Alert, {
      props: { isClosable: true },
      slots: { default: 'Content' },
    })
    // CloseButton uses Button internally
    expect(wrapper.find('button[aria-label="Dismiss alert"]').exists()).toBe(true)
  })

  it('emits close event when CloseButton is clicked', async () => {
    const wrapper = mount(Alert, {
      props: { isClosable: true },
      slots: { default: 'Content' },
    })
    const closeBtn = wrapper.find('button[aria-label="Dismiss alert"]')
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('hides alert when dismissed (isVisible becomes false)', async () => {
    const wrapper = mount(Alert, {
      props: { isClosable: true },
      slots: { default: 'Content' },
    })
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    const closeBtn = wrapper.find('button[aria-label="Dismiss alert"]')
    await closeBtn.trigger('click')
    await nextTick()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('merges custom class prop onto root element', () => {
    const wrapper = mount(Alert, {
      props: { class: 'my-custom-class' },
      slots: { default: 'Content' },
    })
    expect(wrapper.find('[role="alert"]').classes()).toContain('my-custom-class')
  })

  it('renders AlertIcon slot content', () => {
    const wrapper = mount(AlertIcon, {
      slots: { default: '<span>✓</span>' },
    })
    expect(wrapper.text()).toContain('✓')
  })

  it('renders AlertTitle slot content', () => {
    const wrapper = mount(AlertTitle, {
      slots: { default: 'Alert Title' },
    })
    expect(wrapper.text()).toContain('Alert Title')
  })

  it('renders AlertDescription slot content', () => {
    const wrapper = mount(AlertDescription, {
      slots: { default: 'Alert description text' },
    })
    expect(wrapper.text()).toContain('Alert description text')
  })

  it('AlertIcon applies indicator class', () => {
    const wrapper = mount(AlertIcon, {
      slots: { default: 'icon' },
    })
    expect(wrapper.classes()).toContain('alert__indicator')
  })

  it('AlertTitle applies title class', () => {
    const wrapper = mount(AlertTitle, {
      slots: { default: 'title' },
    })
    expect(wrapper.classes()).toContain('alert__title')
  })

  it('AlertDescription applies description class', () => {
    const wrapper = mount(AlertDescription, {
      slots: { default: 'description' },
    })
    expect(wrapper.classes()).toContain('alert__description')
  })
})
