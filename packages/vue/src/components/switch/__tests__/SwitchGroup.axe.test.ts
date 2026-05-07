import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import axe from 'axe-core'
import Switch from '../Switch.vue'
import SwitchGroup from '../SwitchGroup.vue'

describe('SwitchGroup axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('Axe Test 3: SwitchGroup with 3 children + label passes axe', async () => {
    const Wrapper = defineComponent({
      components: { Switch, SwitchGroup },
      template: `
        <SwitchGroup label="Notification Settings">
          <Switch value="email" aria-label="Email notifications" />
          <Switch value="sms" aria-label="SMS notifications" />
          <Switch value="push" aria-label="Push notifications" />
        </SwitchGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('Axe Test 4: SwitchGroup with group disabled passes axe', async () => {
    const Wrapper = defineComponent({
      components: { Switch, SwitchGroup },
      template: `
        <SwitchGroup label="Disabled Settings" :disabled="true">
          <Switch value="a" aria-label="Option A" />
          <Switch value="b" aria-label="Option B" />
        </SwitchGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
