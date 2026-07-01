import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import axe from 'axe-core'
import Editable from '../Editable.vue'
import EditableArea from '../EditableArea.vue'
import EditablePreview from '../EditablePreview.vue'
import EditableInput from '../EditableInput.vue'
import EditableEditTrigger from '../EditableEditTrigger.vue'
import EditableSubmitTrigger from '../EditableSubmitTrigger.vue'
import EditableCancelTrigger from '../EditableCancelTrigger.vue'

// jsdom does not implement getComputedStyle with pseudo-elements or HTMLCanvasElement.getContext,
// which causes axe color-contrast checks to throw. Disable them for unit tests.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
}

describe('Editable axe audit', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(async () => {
    wrappers.forEach((w) => w.unmount())
    wrappers.length = 0
    document.body.innerHTML = ''
    await nextTick()
  })

  it('passes axe audit in preview state', async () => {
    const wrapper = mount(
      defineComponent({
        components: {
          Editable, EditableArea, EditablePreview, EditableInput,
          EditableEditTrigger, EditableSubmitTrigger, EditableCancelTrigger,
        },
        template: `
          <Editable default-value="Hello World" activation-mode="none">
            <EditableArea>
              <EditablePreview />
              <EditableInput />
            </EditableArea>
            <EditableEditTrigger />
            <EditableSubmitTrigger />
            <EditableCancelTrigger />
          </Editable>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const results = await axe.run(wrapper.element, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })

  it('passes axe audit in edit state', async () => {
    const wrapper = mount(
      defineComponent({
        components: {
          Editable, EditableArea, EditablePreview, EditableInput,
          EditableEditTrigger, EditableSubmitTrigger, EditableCancelTrigger,
        },
        template: `
          <Editable default-value="Hello World" :start-with-edit-mode="true" activation-mode="none">
            <EditableArea>
              <EditablePreview />
              <EditableInput />
            </EditableArea>
            <EditableEditTrigger />
            <EditableSubmitTrigger />
            <EditableCancelTrigger />
          </Editable>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const results = await axe.run(wrapper.element, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })
})
