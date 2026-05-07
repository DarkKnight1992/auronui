import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { defineComponent } from 'vue'
import Alert from '../Alert.vue'
import AlertIcon from '../AlertIcon.vue'
import AlertTitle from '../AlertTitle.vue'
import AlertDescription from '../AlertDescription.vue'

// motion-v stub for jsdom
vi.mock('../../../utils/motion', () => ({
  motion: {
    div: {
      name: 'motion-div',
      props: ['initial', 'animate', 'exit', 'transition'],
      template: '<div><slot /></div>',
      inheritAttrs: false,
    },
  },
  AnimatePresence: {
    name: 'AnimatePresence',
    template: '<slot />',
  },
}))

const severities = ['default', 'primary', 'success', 'warning', 'danger'] as const

describe('Alert axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach((w) => w.unmount())
    mountedWrappers.length = 0
  })

  for (const severity of severities) {
    it(`passes axe with severity="${severity}"`, async () => {
      const wrapper = mount(Alert, {
        props: { severity },
        slots: { default: `Alert with ${severity} severity` },
        attachTo: document.body,
      })
      mountedWrappers.push(wrapper)
      const results = await axe.run(wrapper.element)
      expect(results).toHaveNoViolations()
    })
  }

  it('passes axe with AlertIcon + AlertTitle + AlertDescription', async () => {
    const FullAlert = defineComponent({
      components: { Alert, AlertIcon, AlertTitle, AlertDescription },
      template: `
        <Alert severity="success">
          <AlertIcon>✓</AlertIcon>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your action was completed.</AlertDescription>
        </Alert>
      `,
    })
    const wrapper = mount(FullAlert, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with isClosable=true', async () => {
    const wrapper = mount(Alert, {
      props: { isClosable: true },
      slots: { default: 'Closable alert content' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with all severity variants and closable', async () => {
    for (const severity of severities) {
      const wrapper = mount(Alert, {
        props: { severity, isClosable: true },
        slots: { default: `${severity} dismissible alert` },
        attachTo: document.body,
      })
      mountedWrappers.push(wrapper)
      const results = await axe.run(wrapper.element)
      expect(results).toHaveNoViolations()
    }
  })
})
