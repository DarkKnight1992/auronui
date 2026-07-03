import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import axe from 'axe-core'
import Stepper from '../Stepper.vue'
import StepperItem from '../StepperItem.vue'
import StepperIndicator from '../StepperIndicator.vue'
import StepperContent from '../StepperContent.vue'
import StepperDescription from '../StepperDescription.vue'
import StepperSeparator from '../StepperSeparator.vue'
import StepperTitle from '../StepperTitle.vue'

describe('Stepper axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('Axe Test 1: shorthand items API with 3 items at completed/current/pending statuses passes axe', async () => {
    const wrapper = mount(Stepper, {
      props: {
        modelValue: 2,
        items: [
          { title: 'Account', description: 'Create your account' },
          { title: 'Profile', description: 'Set up your profile' },
          { title: 'Confirm', description: 'Review and confirm' },
        ],
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('Axe Test 2: compound default-slot API passes axe', async () => {
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
        <Stepper :model-value="2" :total-steps="3">
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
            <StepperSeparator />
            <StepperContent>
              <StepperTitle>Profile</StepperTitle>
              <StepperDescription>Set up your profile</StepperDescription>
            </StepperContent>
          </StepperItem>
          <StepperItem :step="3">
            <StepperIndicator>3</StepperIndicator>
            <StepperContent>
              <StepperTitle>Confirm</StepperTitle>
              <StepperDescription>Review and confirm</StepperDescription>
            </StepperContent>
          </StepperItem>
        </Stepper>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
