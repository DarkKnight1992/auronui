import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import axe from 'axe-core'
import Form from '../Form.vue'
import FormField from '../FormField.vue'
import FormFieldArray from '../FormFieldArray.vue'
import Input from '../../input/Input.vue'
import Button from '../../button/Button.vue'

describe('FormFieldArray axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach((w) => w.unmount())
    mountedWrappers.length = 0
  })

  it('passes axe with several rows, each with a distinguishing remove label', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Form, FormField, FormFieldArray, Input, Button },
        setup() {
          return {
            defaultValue: [
              { name: 'Jane', email: 'jane@x.com' },
              { name: 'Bob', email: 'bob@x.com' },
            ],
          }
        },
        template: `
          <Form>
            <FormFieldArray
              name="contacts"
              :default-value="defaultValue"
              :rules="{ required: true, minLength: 1 }"
              v-slot="{ fields, fieldName, append, remove, error }"
            >
              <fieldset v-for="row in fields" :key="row.id">
                <legend>Contact {{ row.index + 1 }}</legend>
                <FormField :name="fieldName(row.id, 'name')" :default-value="row.defaultValue.name">
                  <template #default="{ fieldProps }">
                    <Input v-bind="fieldProps" label="Name" />
                  </template>
                </FormField>
                <FormField :name="fieldName(row.id, 'email')" :default-value="row.defaultValue.email" :rules="{ required: true, email: true }">
                  <template #default="{ fieldProps }">
                    <Input v-bind="fieldProps" label="Email" />
                  </template>
                </FormField>
                <Button :aria-label="'Remove contact ' + (row.index + 1)" @click="remove(row.id)">Remove</Button>
              </fieldset>
              <p v-if="error" role="alert">{{ error }}</p>
              <Button @click="append({ name: '', email: '' })">Add contact</Button>
            </FormFieldArray>
          </Form>
        `,
      }),
      { attachTo: document.body },
    )
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with an array-level error surfaced via role="alert"', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Form, FormFieldArray, Button },
        setup() {
          return { defaultValue: [] }
        },
        template: `
          <Form v-slot="{ trigger }">
            <FormFieldArray
              name="contacts"
              :default-value="defaultValue"
              :rules="{ required: true }"
              v-slot="{ fields, error }"
            >
              <p v-if="error" role="alert">{{ error }}</p>
              <span v-if="fields.length === 0">No contacts yet.</span>
            </FormFieldArray>
            <Button type="button" @click="trigger()">Validate</Button>
          </Form>
        `,
      }),
      { attachTo: document.body },
    )
    mountedWrappers.push(wrapper)
    await wrapper.find('button').trigger('click')
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
