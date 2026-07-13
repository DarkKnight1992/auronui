import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import InputGroup from '../InputGroup.vue'
import InputGroupAddon from '../InputGroupAddon.vue'
import InputGroupInput from '../InputGroupInput.vue'

function mountGroup(groupProps: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { InputGroup, InputGroupAddon, InputGroupInput },
      props: Object.keys(groupProps),
      template: `
        <InputGroup v-bind="$props">
          <InputGroupAddon data-testid="prefix"><svg data-testid="icon" /></InputGroupAddon>
          <InputGroupInput placeholder="Search…" />
        </InputGroup>
      `,
    }),
    { props: groupProps },
  )
}

describe('InputGroup', () => {
  it('renders data-slot="input-group" root containing the addon and the bare input', () => {
    const wrapper = mountGroup()
    expect(wrapper.find('[data-slot="input-group"]').exists()).toBe(true)
    expect(wrapper.find('[data-slot="input-group-addon"]').exists()).toBe(true)
    expect(wrapper.find('[data-slot="input-group-input"]').exists()).toBe(true)
  })

  it('applies size classes to the base', () => {
    const wrapper = mountGroup({ size: 'lg' })
    expect(wrapper.find('[data-slot="input-group"]').classes()).toContain('input-group--lg')
  })

  it('defaults to md size', () => {
    const wrapper = mountGroup()
    expect(wrapper.find('[data-slot="input-group"]').classes()).toContain('input-group--md')
  })

  it('fullWidth: true applies input-group--full-width', () => {
    const wrapper = mountGroup({ fullWidth: true })
    expect(wrapper.find('[data-slot="input-group"]').classes()).toContain('input-group--full-width')
  })

  it('isInvalid: true sets data-invalid on the root', () => {
    const wrapper = mountGroup({ isInvalid: true })
    expect(wrapper.find('[data-slot="input-group"]').attributes('data-invalid')).toBeTruthy()
  })

  it('isInvalid: false — no data-invalid on the root', () => {
    const wrapper = mountGroup({ isInvalid: false })
    expect(wrapper.find('[data-slot="input-group"]').attributes('data-invalid')).toBeUndefined()
  })

  it('isDisabled: true sets data-disabled on the root and disables the contained input', () => {
    const wrapper = mountGroup({ isDisabled: true })
    expect(wrapper.find('[data-slot="input-group"]').attributes('data-disabled')).toBeTruthy()
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('isDisabled: true propagates to InputGroupAddon via data-disabled', () => {
    const wrapper = mountGroup({ isDisabled: true })
    expect(wrapper.find('[data-slot="input-group-addon"]').attributes('data-disabled')).toBeTruthy()
  })

  it('isDisabled: false — addon and input are not disabled', () => {
    const wrapper = mountGroup({ isDisabled: false })
    expect(wrapper.find('[data-slot="input-group-addon"]').attributes('data-disabled')).toBeUndefined()
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
  })

  it('passing class="custom" merges with base classes on the root', () => {
    const wrapper = mountGroup({ class: 'custom-class' })
    expect(wrapper.find('[data-slot="input-group"]').classes()).toContain('custom-class')
    expect(wrapper.find('[data-slot="input-group"]').classes()).toContain('input-group')
  })

  it('forwards placeholder to the contained InputGroupInput', () => {
    const wrapper = mountGroup()
    expect(wrapper.find('input').attributes('placeholder')).toBe('Search…')
  })

  it('InputGroupInput v-model binds two-way', async () => {
    let value = ''
    const wrapper = mount(
      defineComponent({
        components: { InputGroup, InputGroupInput },
        setup() {
          return { value }
        },
        data() {
          return { query: 'initial' }
        },
        template: `
          <InputGroup>
            <InputGroupInput v-model="query" />
          </InputGroup>
        `,
      }),
    )
    const inputEl = wrapper.find('input')
    expect((inputEl.element as HTMLInputElement).value).toBe('initial')
    await inputEl.setValue('changed')
    expect((wrapper.vm as unknown as { query: string }).query).toBe('changed')
  })
})

describe('InputGroupAddon standalone (used without a parent InputGroup)', () => {
  it('falls back to sane context defaults instead of throwing', () => {
    const wrapper = mount(InputGroupAddon, { slots: { default: 'x' } })
    expect(wrapper.find('[data-slot="input-group-addon"]').exists()).toBe(true)
    expect(wrapper.classes()).toContain('input-group__addon')
  })
})
