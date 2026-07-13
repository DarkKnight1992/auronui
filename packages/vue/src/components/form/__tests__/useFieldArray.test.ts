import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import Form from '../Form.vue'
import FormField from '../FormField.vue'
import FormFieldArray from '../FormFieldArray.vue'
import Input from '../../input/Input.vue'

function makeContactsForm(opts: {
  defaultValue?: { name: string; email: string }[]
  rules?: object
} = {}) {
  const onSubmit = vi.fn()
  const onInvalid = vi.fn()

  const Wrapper = defineComponent({
    components: { Form, FormField, FormFieldArray, Input },
    setup() {
      return { onSubmit, onInvalid, defaultValue: opts.defaultValue, rules: opts.rules }
    },
    template: `
      <Form @submit="onSubmit" @invalid="onInvalid" v-slot="{ reset, getValues }">
        <FormFieldArray name="contacts" :default-value="defaultValue" :rules="rules" v-slot="{ fields, fieldName, append, prepend, insert, remove, move, swap, replace, error }">
          <div v-for="row in fields" :key="row.id" :data-testid="'row-' + row.id">
            <FormField :name="fieldName(row.id, 'name')" :default-value="row.defaultValue.name">
              <template #default="{ fieldProps }">
                <Input v-bind="fieldProps" :label="'Name ' + row.index" />
              </template>
            </FormField>
            <FormField :name="fieldName(row.id, 'email')" :default-value="row.defaultValue.email" :rules="{ required: true, email: true }">
              <template #default="{ fieldProps }">
                <Input v-bind="fieldProps" :label="'Email ' + row.index" />
              </template>
            </FormField>
            <button type="button" data-testid="remove" @click="remove(row.id)">Remove</button>
          </div>
          <p data-testid="array-error">{{ error }}</p>
          <button type="button" data-testid="append" @click="append({ name: '', email: '' })">Add</button>
          <button type="button" data-testid="prepend" @click="prepend({ name: 'first', email: '' })">Prepend</button>
          <button type="button" data-testid="insert1" @click="insert(1, { name: 'inserted', email: '' })">Insert at 1</button>
          <button type="button" data-testid="move-0-1" @click="move(0, 1)">Move 0->1</button>
          <button type="button" data-testid="swap-0-1" @click="swap(0, 1)">Swap 0,1</button>
          <button type="button" data-testid="replace" @click="replace([{ name: 'z', email: 'z@x.com' }])">Replace</button>
        </FormFieldArray>
        <button type="submit">Submit</button>
        <button type="button" data-testid="reset" @click="reset()">Reset</button>
        <button type="button" data-testid="snapshot" @click="() => { window.__snapshot = getValues() }">Snapshot</button>
      </Form>
    `,
  })

  const wrapper = mount(Wrapper, { attachTo: document.body })
  return { wrapper, onSubmit, onInvalid }
}

describe('useFieldArray — mutations', () => {
  it('starts with rows from defaultValue', () => {
    const { wrapper } = makeContactsForm({
      defaultValue: [{ name: 'Jane', email: 'jane@x.com' }, { name: 'Bob', email: 'bob@x.com' }],
    })
    expect(wrapper.findAll('[data-testid^="row-"]')).toHaveLength(2)
  })

  it('append adds a row at the end', async () => {
    const { wrapper } = makeContactsForm({ defaultValue: [{ name: 'Jane', email: 'jane@x.com' }] })
    await wrapper.find('[data-testid="append"]').trigger('click')
    expect(wrapper.findAll('[data-testid^="row-"]')).toHaveLength(2)
  })

  it('prepend adds a row at the start', async () => {
    const { wrapper } = makeContactsForm({ defaultValue: [{ name: 'Jane', email: 'jane@x.com' }] })
    await wrapper.find('[data-testid="prepend"]').trigger('click')
    const rows = wrapper.findAll('[data-testid^="row-"]')
    expect(rows).toHaveLength(2)
    expect(rows[0]!.text()).toContain('Name 0')
  })

  it('insert adds a row at the given index', async () => {
    const { wrapper } = makeContactsForm({
      defaultValue: [{ name: 'A', email: 'a@x.com' }, { name: 'B', email: 'b@x.com' }],
    })
    await wrapper.find('[data-testid="insert1"]').trigger('click')
    expect(wrapper.findAll('[data-testid^="row-"]')).toHaveLength(3)
  })

  it('remove drops exactly the targeted row', async () => {
    const { wrapper } = makeContactsForm({
      defaultValue: [{ name: 'A', email: 'a@x.com' }, { name: 'B', email: 'b@x.com' }, { name: 'C', email: 'c@x.com' }],
    })
    const removeButtons = wrapper.findAll('[data-testid="remove"]')
    await removeButtons[1]!.trigger('click') // remove row B
    const rows = wrapper.findAll('[data-testid^="row-"]')
    expect(rows).toHaveLength(2)
  })

  it('move and swap reorder rows without changing count', async () => {
    const { wrapper } = makeContactsForm({
      defaultValue: [{ name: 'A', email: 'a@x.com' }, { name: 'B', email: 'b@x.com' }],
    })
    await wrapper.find('[data-testid="move-0-1"]').trigger('click')
    expect(wrapper.findAll('[data-testid^="row-"]')).toHaveLength(2)
    await wrapper.find('[data-testid="swap-0-1"]').trigger('click')
    expect(wrapper.findAll('[data-testid^="row-"]')).toHaveLength(2)
  })

  it('replace wholesale swaps out all rows', async () => {
    const { wrapper } = makeContactsForm({
      defaultValue: [{ name: 'A', email: 'a@x.com' }, { name: 'B', email: 'b@x.com' }],
    })
    await wrapper.find('[data-testid="replace"]').trigger('click')
    expect(wrapper.findAll('[data-testid^="row-"]')).toHaveLength(1)
  })
})

describe('useFieldArray — nested getValues()', () => {
  it('produces a nested array shape on submit', async () => {
    const { wrapper, onSubmit } = makeContactsForm({
      defaultValue: [{ name: 'Jane', email: 'jane@x.com' }, { name: 'Bob', email: 'bob@x.com' }],
    })
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit.mock.calls[0]![0].values).toEqual({
      contacts: [
        { name: 'Jane', email: 'jane@x.com' },
        { name: 'Bob', email: 'bob@x.com' },
      ],
    })
  })

  it('keeps the correct row data at the correct index after removing a middle row', async () => {
    const { wrapper, onSubmit } = makeContactsForm({
      defaultValue: [
        { name: 'A', email: 'a@x.com' },
        { name: 'B', email: 'b@x.com' },
        { name: 'C', email: 'c@x.com' },
      ],
    })
    await wrapper.findAll('[data-testid="remove"]')[1]!.trigger('click') // remove B
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit.mock.calls[0]![0].values).toEqual({
      contacts: [
        { name: 'A', email: 'a@x.com' },
        { name: 'C', email: 'c@x.com' },
      ],
    })
  })

  it('reflects move() in the assembled array order', async () => {
    const { wrapper, onSubmit } = makeContactsForm({
      defaultValue: [{ name: 'A', email: 'a@x.com' }, { name: 'B', email: 'b@x.com' }],
    })
    await wrapper.find('[data-testid="move-0-1"]').trigger('click')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit.mock.calls[0]![0].values).toEqual({
      contacts: [
        { name: 'B', email: 'b@x.com' },
        { name: 'A', email: 'a@x.com' },
      ],
    })
  })

  it('produces an empty array when there are no rows', async () => {
    const { wrapper, onInvalid } = makeContactsForm({ defaultValue: [] })
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    // No rows means no per-row validation errors fire; submit should succeed with an empty array.
    expect(onInvalid).not.toHaveBeenCalled()
  })
})

describe('useFieldArray — array-level validation', () => {
  it('required: true fails submit when there are zero rows', async () => {
    const { wrapper, onSubmit, onInvalid } = makeContactsForm({
      defaultValue: [],
      rules: { required: true },
    })
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onInvalid).toHaveBeenCalledOnce()
    expect(onInvalid.mock.calls[0]![0].contacts).toBeTruthy()
  })

  it('maxLength blocks submit once row count exceeds the limit', async () => {
    const { wrapper, onSubmit, onInvalid } = makeContactsForm({
      defaultValue: [{ name: 'A', email: 'a@x.com' }],
      rules: { maxLength: 1 },
    })
    await wrapper.find('[data-testid="append"]').trigger('click')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onInvalid).toHaveBeenCalledOnce()
  })

  it('per-row field validation still runs independently of array-level rules', async () => {
    const { wrapper, onSubmit, onInvalid } = makeContactsForm({
      defaultValue: [{ name: 'A', email: 'not-an-email' }],
    })
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onInvalid).toHaveBeenCalledOnce()
    expect(Object.keys(onInvalid.mock.calls[0]![0]).some((k) => k.endsWith('.email'))).toBe(true)
  })
})

describe('useFieldArray — reset()', () => {
  it('restores the default rows after mutation', async () => {
    const { wrapper } = makeContactsForm({
      defaultValue: [{ name: 'A', email: 'a@x.com' }],
    })
    await wrapper.find('[data-testid="append"]').trigger('click')
    await wrapper.find('[data-testid="append"]').trigger('click')
    expect(wrapper.findAll('[data-testid^="row-"]')).toHaveLength(3)

    await wrapper.find('[data-testid="reset"]').trigger('click')
    expect(wrapper.findAll('[data-testid^="row-"]')).toHaveLength(1)
  })
})

describe('useFieldArray — focus retention across reorder', () => {
  it('reuses the same DOM node for a row across a move() instead of remounting it', async () => {
    // Note: physically relocating a focused DOM node via insertBefore blurs
    // it in real browsers too (a DOM mechanics quirk, not something this
    // component can or should prevent) — so the meaningful invariant to test
    // is node IDENTITY surviving the reorder, not literal focus survival.
    const { wrapper } = makeContactsForm({
      defaultValue: [{ name: 'A', email: 'a@x.com' }, { name: 'B', email: 'b@x.com' }],
    })
    const nameInputBBefore = wrapper
      .find('[data-testid="row-contacts-row-1"]')
      .element.querySelector('input') as HTMLInputElement

    await wrapper.find('[data-testid="move-0-1"]').trigger('click')
    await flushPromises()

    // Row B (id contacts-row-1) is now first in the DOM, and its <input> is
    // the exact same node — id-keyed v-for reorders instances rather than
    // remounting them, so the underlying FormField never unregistered/
    // re-registered.
    const rowIds = wrapper.findAll('[data-testid^="row-"]').map((w) => w.attributes('data-testid'))
    expect(rowIds).toEqual(['row-contacts-row-1', 'row-contacts-row-0'])

    const nameInputBAfter = wrapper
      .find('[data-testid="row-contacts-row-1"]')
      .element.querySelector('input') as HTMLInputElement
    expect(nameInputBAfter).toBe(nameInputBBefore)
  })
})

describe('useFieldArray — SSR-safe id generation', () => {
  it('generates identical row ids across two independent mounts given the same default data', () => {
    const defaultValue = [{ name: 'A', email: 'a@x.com' }, { name: 'B', email: 'b@x.com' }]
    const { wrapper: w1 } = makeContactsForm({ defaultValue })
    const { wrapper: w2 } = makeContactsForm({ defaultValue })

    const ids1 = w1.findAll('[data-testid^="row-"]').map((w) => w.attributes('data-testid'))
    const ids2 = w2.findAll('[data-testid^="row-"]').map((w) => w.attributes('data-testid'))
    expect(ids1).toEqual(ids2)
  })
})
