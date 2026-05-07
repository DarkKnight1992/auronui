import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { defineComponent } from 'vue'
import Radio from '../Radio.vue'
import RadioGroup from '../RadioGroup.vue'

describe('Radio axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('Axe Test 1: RadioGroup with 3 radios + visible labels passes axe with zero violations', async () => {
    const Wrapper = defineComponent({
      components: { Radio, RadioGroup },
      template: `
        <RadioGroup label="Choose a fruit">
          <Radio value="apple">Apple</Radio>
          <Radio value="banana">Banana</Radio>
          <Radio value="cherry">Cherry</Radio>
        </RadioGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('Axe Test 2: RadioGroup with one disabled radio passes axe with zero violations', async () => {
    const Wrapper = defineComponent({
      components: { Radio, RadioGroup },
      template: `
        <RadioGroup label="Choose an option">
          <Radio value="a">Option A</Radio>
          <Radio value="b" :disabled="true">Option B</Radio>
          <Radio value="c">Option C</Radio>
        </RadioGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('Axe Test 3: RadioGroup with group disabled=true passes axe with zero violations', async () => {
    const Wrapper = defineComponent({
      components: { Radio, RadioGroup },
      template: `
        <RadioGroup :disabled="true" label="Disabled group">
          <Radio value="x">Option X</Radio>
          <Radio value="y">Option Y</Radio>
        </RadioGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
