import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { defineComponent } from 'vue'
import Checkbox from '../Checkbox.vue'
import CheckboxGroup from '../CheckboxGroup.vue'

describe('CheckboxGroup axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('Axe Test 5: CheckboxGroup with label + 3 children (2 selected) passes axe', async () => {
    const Wrapper = defineComponent({
      components: { Checkbox, CheckboxGroup },
      template: `
        <CheckboxGroup :modelValue="['apples', 'bananas']" label="Favourite fruits">
          <Checkbox value="apples" aria-label="Apples" />
          <Checkbox value="bananas" aria-label="Bananas" />
          <Checkbox value="cherries" aria-label="Cherries" />
        </CheckboxGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('Axe Test 6: CheckboxGroup with group disabled=true passes axe', async () => {
    const Wrapper = defineComponent({
      components: { Checkbox, CheckboxGroup },
      template: `
        <CheckboxGroup :disabled="true" label="Disabled group">
          <Checkbox value="a" aria-label="Option A" />
          <Checkbox value="b" aria-label="Option B" />
        </CheckboxGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
