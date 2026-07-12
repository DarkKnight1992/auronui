import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import Stepper from '../Stepper.vue'
import StepperItem from '../StepperItem.vue'
import StepperIndicator from '../StepperIndicator.vue'
import StepperContent from '../StepperContent.vue'
import StepperDescription from '../StepperDescription.vue'
import StepperSeparator from '../StepperSeparator.vue'
import StepperTitle from '../StepperTitle.vue'

describe('Stepper', () => {
  it('Test 1: shorthand items API renders one StepperItem per item with correct step count', () => {
    const wrapper = mount(Stepper, {
      props: {
        items: [{ title: 'One' }, { title: 'Two' }, { title: 'Three' }],
      },
    })
    const items = wrapper.findAll('[data-slot="stepper-item"]')
    expect(items.length).toBe(3)
  })

  it('Test 2: shorthand items API renders titles and descriptions', () => {
    const wrapper = mount(Stepper, {
      props: {
        items: [
          { title: 'Account', description: 'Create your account' },
          { title: 'Profile' },
        ],
      },
    })
    const titles = wrapper.findAll('[data-slot="stepper-title"]')
    const descriptions = wrapper.findAll('[data-slot="stepper-description"]')
    expect(titles.map(t => t.text())).toEqual(['Account', 'Profile'])
    expect(descriptions.map(d => d.text())).toEqual(['Create your account'])
  })

  it('Test 3: shorthand items API renders one fewer separator than items', () => {
    const wrapper = mount(Stepper, {
      props: {
        items: [{ title: 'One' }, { title: 'Two' }, { title: 'Three' }],
      },
    })
    const separators = wrapper.findAll('[data-slot="stepper-separator"]')
    expect(separators.length).toBe(2)
  })

  it('Test 4: root has data-slot="stepper" and aria-label "Step X of Y"', () => {
    const wrapper = mount(Stepper, {
      props: {
        defaultValue: 2,
        items: [{ title: 'One' }, { title: 'Two' }, { title: 'Three' }],
      },
    })
    const root = wrapper.find('[data-slot="stepper"]')
    expect(root.exists()).toBe(true)
    expect(root.attributes('aria-label')).toBe('Step 2 of 3')
  })

  it('Test 5: default-slot compound API renders equivalent structure to shorthand items API', () => {
    const Wrapper = defineComponent({
      components: {
        Stepper,
        StepperItem,
        StepperIndicator,
        StepperContent,
        StepperDescription,
        StepperSeparator,
        StepperTitle,
      },
      template: `
        <Stepper :default-value="1">
          <StepperItem :step="1">
            <StepperIndicator>1</StepperIndicator>
            <StepperSeparator />
            <StepperContent>
              <StepperTitle>Account</StepperTitle>
              <StepperDescription>Create your account</StepperDescription>
            </StepperContent>
          </StepperItem>
          <StepperItem :step="2">
            <StepperIndicator>2</StepperIndicator>
            <StepperContent>
              <StepperTitle>Profile</StepperTitle>
            </StepperContent>
          </StepperItem>
        </Stepper>
      `,
    })
    const wrapper = mount(Wrapper)
    expect(wrapper.findAll('[data-slot="stepper-item"]').length).toBe(2)
    expect(wrapper.findAll('[data-slot="stepper-separator"]').length).toBe(1)
    expect(wrapper.findAll('[data-slot="stepper-title"]').map(t => t.text())).toEqual([
      'Account',
      'Profile',
    ])
    expect(wrapper.findAll('[data-slot="stepper-description"]').map(d => d.text())).toEqual([
      'Create your account',
    ])
  })

  it('Test 6: resolvedTotalSteps derives from items.length when items is provided (ignores totalSteps prop)', () => {
    const wrapper = mount(Stepper, {
      props: {
        totalSteps: 10,
        items: [{ title: 'One' }, { title: 'Two' }],
      },
    })
    const root = wrapper.find('[data-slot="stepper"]')
    expect(root.attributes('aria-label')).toBe('Step 1 of 2')
  })

  it('Test 7: resolvedTotalSteps falls back to totalSteps prop when no items given', () => {
    const Wrapper = defineComponent({
      components: { Stepper },
      template: `<Stepper :total-steps="5" :default-value="3"><div /></Stepper>`,
    })
    const wrapper = mount(Wrapper)
    const root = wrapper.find('[data-slot="stepper"]')
    expect(root.attributes('aria-label')).toBe('Step 3 of 5')
  })

  it('Test 8: programmatic modelValue changes reactively update data-status on StepperItem (v-model round trip)', async () => {
    const step = ref(1)
    const Wrapper = defineComponent({
      components: { Stepper, StepperItem },
      setup() {
        return { step }
      },
      template: `
        <Stepper v-model="step" :total-steps="3">
          <StepperItem :step="1" />
          <StepperItem :step="2" />
          <StepperItem :step="3" />
        </Stepper>
      `,
    })
    const wrapper = mount(Wrapper)
    const items = wrapper.findAll('[data-slot="stepper-item"]')

    expect(items[0]!.attributes('data-status')).toBe('current')
    expect(items[1]!.attributes('data-status')).toBe('pending')
    expect(items[2]!.attributes('data-status')).toBe('pending')

    step.value = 2
    await nextTick()

    expect(items[0]!.attributes('data-status')).toBe('completed')
    expect(items[1]!.attributes('data-status')).toBe('current')
    expect(items[2]!.attributes('data-status')).toBe('pending')
  })

  it('Test 9: Stepper.vue has no built-in interactive control that advances currentStep', () => {
    // Stepper.vue has no built-in button/click handler that advances currentStep.
    // currentStep is a writable computed backed by modelValue/internalStep, but nothing
    // inside Stepper.vue itself ever calls currentStep.value = x. Consumers must drive
    // currentStep externally (e.g. via their own Button wired to v-model). This test
    // documents that behavior: mounting without a v-model and without any external driver,
    // the step never advances, confirming there is no hidden internal interaction surface.
    const wrapper = mount(Stepper, {
      props: { items: [{ title: 'One' }, { title: 'Two' }] },
    })
    const items = wrapper.findAll('[data-slot="stepper-item"]')
    expect(items[0]!.attributes('data-status')).toBe('current')
    expect(items[1]!.attributes('data-status')).toBe('pending')
  })

  it('Test 10: orientation prop reaches StepperItem/StepperSeparator via context (vertical)', () => {
    const wrapper = mount(Stepper, {
      props: {
        orientation: 'vertical',
        items: [{ title: 'One' }, { title: 'Two' }],
      },
    })
    const root = wrapper.find('[data-slot="stepper"]')
    expect(root.classes().join(' ')).toContain('stepper--vertical')

    const item = wrapper.find('[data-slot="stepper-item"]')
    expect(item.classes().join(' ')).toContain('stepper__item--vertical')

    const separator = wrapper.find('[data-slot="stepper-separator"]')
    expect(separator.classes().join(' ')).toContain('stepper__separator--vertical')
  })

  it('Test 11: orientation defaults to horizontal on base, item, and separator', () => {
    const wrapper = mount(Stepper, {
      props: { items: [{ title: 'One' }, { title: 'Two' }] },
    })
    const root = wrapper.find('[data-slot="stepper"]')
    expect(root.classes().join(' ')).toContain('stepper--horizontal')

    const item = wrapper.find('[data-slot="stepper-item"]')
    expect(item.classes().join(' ')).toContain('stepper__item--horizontal')

    const separator = wrapper.find('[data-slot="stepper-separator"]')
    expect(separator.classes().join(' ')).toContain('stepper__separator--horizontal')
  })

  it('Test 12: size prop reaches StepperIndicator and StepperTitle via context', () => {
    const wrapper = mount(Stepper, {
      props: { size: 'lg', items: [{ title: 'One' }] },
    })
    const indicator = wrapper.find('[data-slot="stepper-indicator"]')
    const title = wrapper.find('[data-slot="stepper-title"]')
    expect(indicator.classes().join(' ')).toContain('stepper__indicator--lg')
    expect(title.classes().join(' ')).toContain('stepper__title--lg')
  })

  it('Test 13: color prop reaches StepperIndicator via context', () => {
    const wrapper = mount(Stepper, {
      props: { color: 'danger', items: [{ title: 'One' }] },
    })
    const indicator = wrapper.find('[data-slot="stepper-indicator"]')
    expect(indicator.classes().join(' ')).toContain('stepper__indicator--danger')
  })

  it('Test 14: color defaults to primary on StepperIndicator', () => {
    const wrapper = mount(Stepper, {
      props: { items: [{ title: 'One' }] },
    })
    const indicator = wrapper.find('[data-slot="stepper-indicator"]')
    expect(indicator.classes().join(' ')).toContain('stepper__indicator--primary')
  })
})

describe('StepperItem', () => {
  it('Test 15: renders data-status="completed" when step < currentStep', () => {
    const Wrapper = defineComponent({
      components: { Stepper, StepperItem },
      template: `
        <Stepper :model-value="3" :total-steps="3">
          <StepperItem :step="1" />
        </Stepper>
      `,
    })
    const wrapper = mount(Wrapper)
    const item = wrapper.find('[data-slot="stepper-item"]')
    expect(item.attributes('data-status')).toBe('completed')
  })

  it('Test 16: renders data-status="current" when step === currentStep', () => {
    const Wrapper = defineComponent({
      components: { Stepper, StepperItem },
      template: `
        <Stepper :model-value="2" :total-steps="3">
          <StepperItem :step="2" />
        </Stepper>
      `,
    })
    const wrapper = mount(Wrapper)
    const item = wrapper.find('[data-slot="stepper-item"]')
    expect(item.attributes('data-status')).toBe('current')
  })

  it('Test 17: renders data-status="pending" when step > currentStep', () => {
    const Wrapper = defineComponent({
      components: { Stepper, StepperItem },
      template: `
        <Stepper :model-value="1" :total-steps="3">
          <StepperItem :step="3" />
        </Stepper>
      `,
    })
    const wrapper = mount(Wrapper)
    const item = wrapper.find('[data-slot="stepper-item"]')
    expect(item.attributes('data-status')).toBe('pending')
  })

  it('Test 18: renders data-step attribute matching the step prop', () => {
    const Wrapper = defineComponent({
      components: { Stepper, StepperItem },
      template: `
        <Stepper :total-steps="3">
          <StepperItem :step="2" />
        </Stepper>
      `,
    })
    const wrapper = mount(Wrapper)
    const item = wrapper.find('[data-slot="stepper-item"]')
    expect(item.attributes('data-step')).toBe('2')
  })

  it('Test 19: scoped default slot exposes status/step/isCurrent/isCompleted/isError', () => {
    const Wrapper = defineComponent({
      components: { Stepper, StepperItem },
      template: `
        <Stepper :model-value="2" :total-steps="3">
          <StepperItem :step="2" v-slot="{ status, step, isCurrent, isCompleted, isError }">
            <span class="status">{{ status }}</span>
            <span class="step">{{ step }}</span>
            <span class="is-current">{{ isCurrent }}</span>
            <span class="is-completed">{{ isCompleted }}</span>
            <span class="is-error">{{ isError }}</span>
          </StepperItem>
        </Stepper>
      `,
    })
    const wrapper = mount(Wrapper)
    expect(wrapper.find('.status').text()).toBe('current')
    expect(wrapper.find('.step').text()).toBe('2')
    expect(wrapper.find('.is-current').text()).toBe('true')
    expect(wrapper.find('.is-completed').text()).toBe('false')
    // NOTE: getStepStatus() in Stepper.vue never returns 'error' — there is no
    // reachable code path that produces an 'error' status. isError can only ever
    // be confirmed false through Stepper's own logic; it is not exercised as true here.
    expect(wrapper.find('.is-error').text()).toBe('false')
  })

  it('Test 20: mounted standalone without a provided context falls back to status "pending"', () => {
    // No Stepper ancestor => ctx is undefined => getStepStatus falls back to 'pending'.
    const wrapper = mount(StepperItem, { props: { step: 1 } })
    const item = wrapper.find('[data-slot="stepper-item"]')
    expect(item.attributes('data-status')).toBe('pending')
  })
})

describe('StepperIndicator', () => {
  it('Test 21: renders aria-hidden="true" and data-slot="stepper-indicator"', () => {
    const wrapper = mount(StepperIndicator)
    const root = wrapper.find('[data-slot="stepper-indicator"]')
    expect(root.attributes('aria-hidden')).toBe('true')
  })

  it('Test 22: renders default slot content', () => {
    const wrapper = mount(StepperIndicator, {
      slots: { default: '1' },
    })
    expect(wrapper.text()).toBe('1')
  })
})

describe('StepperContent', () => {
  it('Test 23: renders data-slot="stepper-content"', () => {
    const wrapper = mount(StepperContent)
    expect(wrapper.find('[data-slot="stepper-content"]').exists()).toBe(true)
  })

  it('Test 24: renders default slot content', () => {
    const wrapper = mount(StepperContent, {
      slots: { default: '<p class="child">hello</p>' },
    })
    expect(wrapper.find('.child').text()).toBe('hello')
  })
})

describe('StepperDescription', () => {
  it('Test 25: renders a <p> with data-slot="stepper-description"', () => {
    const wrapper = mount(StepperDescription, {
      slots: { default: 'Description text' },
    })
    const el = wrapper.find('[data-slot="stepper-description"]')
    expect(el.element.tagName).toBe('P')
    expect(el.text()).toBe('Description text')
  })
})

describe('StepperSeparator', () => {
  it('Test 26: renders a <div role="none"> with data-slot="stepper-separator"', () => {
    const wrapper = mount(StepperSeparator)
    const el = wrapper.find('[data-slot="stepper-separator"]')
    expect(el.element.tagName).toBe('DIV')
    expect(el.attributes('role')).toBe('none')
  })

  it('Test 27: has no default slot / renders no child content', () => {
    const wrapper = mount(StepperSeparator)
    expect(wrapper.text()).toBe('')
  })

  it('Test 28: has orientation-aware class but no data-orientation attribute', () => {
    const Wrapper = defineComponent({
      components: { Stepper, StepperSeparator },
      template: `
        <Stepper orientation="vertical" :total-steps="2">
          <StepperSeparator />
        </Stepper>
      `,
    })
    const wrapper = mount(Wrapper)
    const el = wrapper.find('[data-slot="stepper-separator"]')
    expect(el.classes().join(' ')).toContain('stepper__separator--vertical')
    expect(el.attributes('data-orientation')).toBeUndefined()
  })
})

describe('StepperTitle', () => {
  it('Test 29: renders a <p> with data-slot="stepper-title"', () => {
    const wrapper = mount(StepperTitle, {
      slots: { default: 'Step title' },
    })
    const el = wrapper.find('[data-slot="stepper-title"]')
    expect(el.element.tagName).toBe('P')
    expect(el.text()).toBe('Step title')
  })
})
