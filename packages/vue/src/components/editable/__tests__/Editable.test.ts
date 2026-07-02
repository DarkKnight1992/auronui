import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import Editable from '../Editable.vue'
import EditableArea from '../EditableArea.vue'
import EditablePreview from '../EditablePreview.vue'
import EditableInput from '../EditableInput.vue'
import EditableEditTrigger from '../EditableEditTrigger.vue'
import EditableSubmitTrigger from '../EditableSubmitTrigger.vue'
import EditableCancelTrigger from '../EditableCancelTrigger.vue'

function mountEditable(props: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: {
        Editable, EditableArea, EditablePreview, EditableInput,
        EditableEditTrigger, EditableSubmitTrigger, EditableCancelTrigger,
      },
      props: Object.keys(props),
      template: `
        <Editable v-bind="$props">
          <EditableArea>
            <EditablePreview />
            <EditableInput />
          </EditableArea>
          <EditableEditTrigger>Edit</EditableEditTrigger>
          <EditableSubmitTrigger>Save</EditableSubmitTrigger>
          <EditableCancelTrigger>Cancel</EditableCancelTrigger>
        </Editable>
      `,
    }),
    { props, attachTo: document.body },
  )
}

describe('Editable', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach((w) => w.unmount())
    wrappers.length = 0
    document.body.innerHTML = ''
  })

  it('renders both preview and input elements (Reka toggles visibility internally)', async () => {
    const wrapper = mountEditable({ defaultValue: 'Hello' })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders the defaultValue text in preview', async () => {
    const wrapper = mountEditable({ defaultValue: 'Hello World' })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.text()).toContain('Hello World')
  })

  it('entering edit mode hides the preview and shows the input (via activationMode=focus)', async () => {
    const wrapper = mountEditable({ defaultValue: 'Hello', activationMode: 'focus' })
    wrappers.push(wrapper)
    await flushPromises()

    const preview = wrapper.find('span')
    expect(preview.attributes('hidden')).toBeUndefined()

    // Reka's EditablePreview listens for `focusin` (not `focus`) to trigger
    // activationMode="focus" — .trigger('focus') dispatches a synthetic 'focus'
    // event that never reaches a focusin listener (focusin only fires natively
    // via element.focus() or real user interaction, not synthetic dispatch of
    // an unrelated event type).
    await preview.trigger('focusin')
    await flushPromises()

    const input = wrapper.find('input')
    expect(input.attributes('hidden')).toBeUndefined()
  })

  it('clicking EditableEditTrigger enters edit mode', async () => {
    const wrapper = mountEditable({ defaultValue: 'Hello', activationMode: 'none' })
    wrappers.push(wrapper)
    await flushPromises()

    const editButton = wrapper.findAll('button')[0]
    await editButton.trigger('click')
    await flushPromises()

    const input = wrapper.find('input')
    expect(input.attributes('hidden')).toBeUndefined()
  })

  it('v-model:modelValue reflects the controlled value', async () => {
    const value = ref('Initial')
    const wrapper = mount(
      defineComponent({
        components: { Editable, EditableArea, EditablePreview, EditableInput },
        setup() {
          return { value }
        },
        template: `
          <Editable v-model="value">
            <EditableArea>
              <EditablePreview />
              <EditableInput />
            </EditableArea>
          </Editable>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await nextTick()

    expect(wrapper.text()).toContain('Initial')

    value.value = 'Updated'
    await nextTick()
    expect(wrapper.text()).toContain('Updated')
  })

  it('deprecated bare required=true forwards to EditableRoot as required', async () => {
    const wrapper = mountEditable({ defaultValue: 'Hello', required: true })
    wrappers.push(wrapper)
    await nextTick()
    const root = wrapper.findComponent({ name: 'EditableRoot' })
    expect(root.props('required')).toBe(true)
  })

  it('deprecated bare readonly=true forwards to EditableRoot as readonly', async () => {
    const wrapper = mountEditable({ defaultValue: 'Hello', readonly: true })
    wrappers.push(wrapper)
    await nextTick()
    const root = wrapper.findComponent({ name: 'EditableRoot' })
    expect(root.props('readonly')).toBe(true)
  })

  it('applies editable base class to root', async () => {
    const wrapper = mountEditable({ defaultValue: 'Hello' })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.html()).toContain('editable')
  })
})
