import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { defineComponent } from 'vue'
import Radio from '../Radio.vue'
import RadioGroup from '../RadioGroup.vue'

describe('RadioGroup axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('Axe Test 4: RadioGroup with preselected value passes axe with zero violations', async () => {
    const Wrapper = defineComponent({
      components: { Radio, RadioGroup },
      template: `
        <RadioGroup modelValue="b" label="Choose your plan">
          <Radio value="a">Starter</Radio>
          <Radio value="b">Pro</Radio>
          <Radio value="c">Enterprise</Radio>
        </RadioGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('Axe Test 5: Horizontal RadioGroup passes axe with zero violations', async () => {
    const Wrapper = defineComponent({
      components: { Radio, RadioGroup },
      template: `
        <RadioGroup orientation="horizontal" label="Pick a size">
          <Radio value="sm">Small</Radio>
          <Radio value="md">Medium</Radio>
          <Radio value="lg">Large</Radio>
        </RadioGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
