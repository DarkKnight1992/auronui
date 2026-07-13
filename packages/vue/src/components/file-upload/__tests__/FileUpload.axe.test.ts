import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import FileUpload from '../FileUpload.vue'

function makeFile(name: string, size: number): File {
  return new File(['x'.repeat(size)], name, { type: 'text/plain' })
}

describe('FileUpload axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('passes axe with a label', async () => {
    const wrapper = mount(FileUpload, {
      props: { label: 'Attachments' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with a selected file list', async () => {
    const wrapper = mount(FileUpload, {
      props: { label: 'Attachments', modelValue: [makeFile('resume.pdf', 100)] },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe when isInvalid with errorMessage', async () => {
    const wrapper = mount(FileUpload, {
      props: { label: 'Attachments', isInvalid: true, errorMessage: 'A file is required' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe when isDisabled', async () => {
    const wrapper = mount(FileUpload, {
      props: { label: 'Attachments', isDisabled: true },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
