import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { defineComponent } from 'vue'
import ToggleButton from '../ToggleButton.vue'
import ToggleButtonGroup from '../ToggleButtonGroup.vue'

describe('ToggleButtonGroup axe audit', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 3: ToggleButtonGroup with 3 children (single mode) has zero axe violations
  it('single-mode group with 3 children passes axe', async () => {
    const Wrapper = defineComponent({
      components: { ToggleButton, ToggleButtonGroup },
      template: `
        <ToggleButtonGroup selectionMode="single" :modelValue="'a'">
          <ToggleButton value="a" aria-label="Option A">A</ToggleButton>
          <ToggleButton value="b" aria-label="Option B">B</ToggleButton>
          <ToggleButton value="c" aria-label="Option C">C</ToggleButton>
        </ToggleButtonGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toEqual([])
  })

  // Test 4: ToggleButtonGroup with 3 children (multiple mode, 2 selected) has zero axe violations
  it('multiple-mode group with 2 selected passes axe', async () => {
    const Wrapper = defineComponent({
      components: { ToggleButton, ToggleButtonGroup },
      template: `
        <ToggleButtonGroup selectionMode="multiple" :modelValue="['a','b']">
          <ToggleButton value="a" aria-label="Option A">A</ToggleButton>
          <ToggleButton value="b" aria-label="Option B">B</ToggleButton>
          <ToggleButton value="c" aria-label="Option C">C</ToggleButton>
        </ToggleButtonGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toEqual([])
  })

  // Test 5: Vertical orientation ToggleButtonGroup has zero axe violations
  it('vertical orientation group passes axe', async () => {
    const Wrapper = defineComponent({
      components: { ToggleButton, ToggleButtonGroup },
      template: `
        <ToggleButtonGroup orientation="vertical">
          <ToggleButton value="top" aria-label="Top">Top</ToggleButton>
          <ToggleButton value="mid" aria-label="Middle">Middle</ToggleButton>
          <ToggleButton value="bot" aria-label="Bottom">Bottom</ToggleButton>
        </ToggleButtonGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toEqual([])
  })

  // Disabled group passes axe
  it('disabled group passes axe', async () => {
    const Wrapper = defineComponent({
      components: { ToggleButton, ToggleButtonGroup },
      template: `
        <ToggleButtonGroup :disabled="true">
          <ToggleButton value="a" aria-label="Option A">A</ToggleButton>
          <ToggleButton value="b" aria-label="Option B">B</ToggleButton>
        </ToggleButtonGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toEqual([])
  })
})
