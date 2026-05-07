import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import Button from '../Button.vue'
import ButtonGroup from '../ButtonGroup.vue'
import { defineComponent } from 'vue'

describe('ButtonGroup axe audit', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  it('horizontal group passes axe', async () => {
    const Wrapper = defineComponent({
      components: { ButtonGroup, Button },
      template: `
        <ButtonGroup orientation="horizontal">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })

  it('vertical group passes axe', async () => {
    const Wrapper = defineComponent({
      components: { ButtonGroup, Button },
      template: `
        <ButtonGroup orientation="vertical">
          <Button>One</Button>
          <Button>Two</Button>
        </ButtonGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })

  it('disabled group passes axe', async () => {
    const Wrapper = defineComponent({
      components: { ButtonGroup, Button },
      template: `
        <ButtonGroup :disabled="true">
          <Button>Disabled</Button>
        </ButtonGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })
})
