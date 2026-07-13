import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import axe from 'axe-core'
import InputGroup from '../InputGroup.vue'
import InputGroupAddon from '../InputGroupAddon.vue'
import InputGroupInput from '../InputGroupInput.vue'

describe('InputGroup axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('passes axe with a leading icon addon and a labelled input', async () => {
    const wrapper = mount(
      defineComponent({
        components: { InputGroup, InputGroupAddon, InputGroupInput },
        template: `
          <InputGroup>
            <InputGroupAddon aria-hidden="true"><svg width="16" height="16"><circle cx="8" cy="8" r="6" /></svg></InputGroupAddon>
            <InputGroupInput aria-label="Amount" placeholder="0.00" />
          </InputGroup>
        `,
      }),
      { attachTo: document.body },
    )
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with a trailing addon containing a real button', async () => {
    const wrapper = mount(
      defineComponent({
        components: { InputGroup, InputGroupAddon, InputGroupInput },
        template: `
          <InputGroup>
            <InputGroupInput aria-label="Search" placeholder="Search…" />
            <InputGroupAddon>
              <button type="button" aria-label="Submit search">Go</button>
            </InputGroupAddon>
          </InputGroup>
        `,
      }),
      { attachTo: document.body },
    )
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe when isDisabled=true', async () => {
    const wrapper = mount(
      defineComponent({
        components: { InputGroup, InputGroupAddon, InputGroupInput },
        template: `
          <InputGroup :is-disabled="true">
            <InputGroupAddon aria-hidden="true"><svg width="16" height="16"><circle cx="8" cy="8" r="6" /></svg></InputGroupAddon>
            <InputGroupInput aria-label="Amount" />
          </InputGroup>
        `,
      }),
      { attachTo: document.body },
    )
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe when isInvalid=true with aria-describedby and associated error span', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const wrapper = mount(
      defineComponent({
        components: { InputGroup, InputGroupAddon, InputGroupInput },
        template: `
          <div>
            <InputGroup :is-invalid="true">
              <InputGroupAddon aria-hidden="true"><svg width="16" height="16"><circle cx="8" cy="8" r="6" /></svg></InputGroupAddon>
              <InputGroupInput aria-label="Amount" aria-describedby="amount-err" />
            </InputGroup>
            <span id="amount-err">Enter a valid amount</span>
          </div>
        `,
      }),
      { attachTo: container },
    )
    mountedWrappers.push(wrapper)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
    document.body.removeChild(container)
  })
})
