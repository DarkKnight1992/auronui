import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FileUpload from '../FileUpload.vue'

function makeFile(name: string, size: number, type = 'text/plain'): File {
  const file = new File(['x'.repeat(size)], name, { type })
  return file
}

// jsdom does not implement DataTransfer/FileList construction — fake a
// minimal FileList-like object (array-like with .item()) and assign it
// directly, bypassing the native constructor entirely.
function fakeFileList(files: File[]): FileList {
  const list = files.slice() as unknown as FileList & File[]
  ;(list as unknown as { item: (i: number) => File | null }).item = (i: number) => files[i] ?? null
  return list
}

function setInputFiles(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', { value: fakeFileList(files), configurable: true })
}

describe('FileUpload', () => {
  it('renders a dropzone with role="button" and a visually-hidden native file input', () => {
    const wrapper = mount(FileUpload)
    expect(wrapper.find('[data-slot="file-upload-dropzone"]').attributes('role')).toBe('button')
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
  })

  it('clicking the dropzone opens the native file picker (delegates click to the hidden input)', async () => {
    const wrapper = mount(FileUpload, { attachTo: document.body })
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    let clicked = false
    input.addEventListener('click', () => { clicked = true })
    await wrapper.find('[data-slot="file-upload-dropzone"]').trigger('click')
    expect(clicked).toBe(true)
    wrapper.unmount()
  })

  it('the dropzone is keyboard-focusable (tabindex="0") and Enter opens the picker — not mouse-only', async () => {
    const wrapper = mount(FileUpload, { attachTo: document.body })
    const dropzone = wrapper.find('[data-slot="file-upload-dropzone"]')
    expect(dropzone.attributes('tabindex')).toBe('0')
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    let clicked = false
    input.addEventListener('click', () => { clicked = true })
    await dropzone.trigger('keydown', { key: 'Enter' })
    expect(clicked).toBe(true)
    wrapper.unmount()
  })

  it('Space also opens the picker (same keyboard-parity guarantee as Enter)', async () => {
    const wrapper = mount(FileUpload, { attachTo: document.body })
    const dropzone = wrapper.find('[data-slot="file-upload-dropzone"]')
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    let clicked = false
    input.addEventListener('click', () => { clicked = true })
    await dropzone.trigger('keydown', { key: ' ' })
    expect(clicked).toBe(true)
    wrapper.unmount()
  })

  it('selecting a file via the native input adds it to modelValue and emits change', async () => {
    let modelValue: File[] = []
    const wrapper = mount(FileUpload, {
      props: {
        modelValue,
        'onUpdate:modelValue': (v: File[]) => { modelValue = v },
      },
    })
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    const file = makeFile('resume.pdf', 100, 'application/pdf')
    setInputFiles(input, [file])
    await wrapper.find('input[type="file"]').trigger('change')
    expect(modelValue).toHaveLength(1)
    expect(modelValue[0]!.name).toBe('resume.pdf')
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual([file])
  })

  it('multiple: false replaces the current file instead of appending', async () => {
    let modelValue: File[] = [makeFile('old.txt', 10)]
    const wrapper = mount(FileUpload, {
      props: {
        multiple: false,
        modelValue,
        'onUpdate:modelValue': (v: File[]) => { modelValue = v },
      },
    })
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    setInputFiles(input, [makeFile('new.txt', 10)])
    await wrapper.find('input[type="file"]').trigger('change')
    expect(modelValue).toHaveLength(1)
    expect(modelValue[0]!.name).toBe('new.txt')
  })

  it('multiple: true appends to existing files', async () => {
    let modelValue: File[] = [makeFile('a.txt', 10)]
    const wrapper = mount(FileUpload, {
      props: {
        multiple: true,
        modelValue,
        'onUpdate:modelValue': (v: File[]) => { modelValue = v },
      },
    })
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    setInputFiles(input, [makeFile('b.txt', 10)])
    await wrapper.find('input[type="file"]').trigger('change')
    expect(modelValue.map(f => f.name).sort()).toEqual(['a.txt', 'b.txt'])
  })

  it('rejects files exceeding maxSizeBytes and emits reject with reason "maxSize"', async () => {
    const wrapper = mount(FileUpload, { props: { maxSizeBytes: 50 } })
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    const tooBig = makeFile('huge.bin', 1000)
    setInputFiles(input, [tooBig])
    await wrapper.find('input[type="file"]').trigger('change')
    const rejections = wrapper.emitted('reject')?.[0]?.[0] as Array<{ file: File, reason: string }>
    expect(rejections).toHaveLength(1)
    expect(rejections[0]!.reason).toBe('maxSize')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('rejects files not matching accept and emits reject with reason "accept"', async () => {
    const wrapper = mount(FileUpload, { props: { accept: 'image/*' } })
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    const wrongType = makeFile('doc.txt', 10, 'text/plain')
    setInputFiles(input, [wrongType])
    await wrapper.find('input[type="file"]').trigger('change')
    const rejections = wrapper.emitted('reject')?.[0]?.[0] as Array<{ file: File, reason: string }>
    expect(rejections[0]!.reason).toBe('accept')
  })

  it('rejects files beyond maxFiles capacity with reason "maxFiles"', async () => {
    const wrapper = mount(FileUpload, {
      props: { multiple: true, maxFiles: 1, modelValue: [makeFile('existing.txt', 10)] },
    })
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    setInputFiles(input, [makeFile('overflow.txt', 10)])
    await wrapper.find('input[type="file"]').trigger('change')
    const rejections = wrapper.emitted('reject')?.[0]?.[0] as Array<{ file: File, reason: string }>
    expect(rejections[0]!.reason).toBe('maxFiles')
  })

  it('renders the selected files with name and formatted size', () => {
    const wrapper = mount(FileUpload, { props: { modelValue: [makeFile('photo.png', 2048)] } })
    expect(wrapper.find('[data-slot="file-upload-file-name"]').text()).toBe('photo.png')
    expect(wrapper.find('[data-slot="file-upload-file-size"]').text()).toBe('2.0 KB')
  })

  it('renders no file list when modelValue is empty', () => {
    const wrapper = mount(FileUpload)
    expect(wrapper.find('[data-slot="file-upload-file-list"]').exists()).toBe(false)
  })

  it('clicking the remove button removes that file and emits remove', async () => {
    const file = makeFile('a.txt', 10)
    let modelValue: File[] = [file]
    const wrapper = mount(FileUpload, {
      props: {
        modelValue,
        'onUpdate:modelValue': (v: File[]) => { modelValue = v },
      },
    })
    await wrapper.find('[data-slot="file-upload-remove-button"]').trigger('click')
    expect(modelValue).toHaveLength(0)
    expect(wrapper.emitted('remove')?.[0]?.[0]).toBe(file)
  })

  it('dropping files on the dropzone adds them (native Drag and Drop API, not click-only)', async () => {
    let modelValue: File[] = []
    const wrapper = mount(FileUpload, {
      props: {
        modelValue,
        'onUpdate:modelValue': (v: File[]) => { modelValue = v },
      },
    })
    const file = makeFile('dropped.txt', 10)
    // jsdom has no real DataTransfer — the component only reads
    // ev.dataTransfer.files, so a plain object with that shape is enough.
    await wrapper.find('[data-slot="file-upload-dropzone"]').trigger('drop', {
      dataTransfer: { files: fakeFileList([file]) },
    })
    expect(modelValue).toHaveLength(1)
    expect(modelValue[0]!.name).toBe('dropped.txt')
  })

  it('isDisabled: true sets data-disabled and aria-disabled on the dropzone, tabindex -1', () => {
    const wrapper = mount(FileUpload, { props: { isDisabled: true } })
    const dropzone = wrapper.find('[data-slot="file-upload-dropzone"]')
    expect(dropzone.attributes('aria-disabled')).toBe('true')
    expect(dropzone.attributes('data-disabled')).toBeTruthy()
    expect(dropzone.attributes('tabindex')).toBe('-1')
  })

  it('label renders and pairs with the hidden native file input via for/id (the only labelable element)', () => {
    const wrapper = mount(FileUpload, { props: { label: 'Attachments' } })
    const label = wrapper.find('label')
    expect(label.text()).toContain('Attachments')
    expect(label.attributes('for')).toBe(wrapper.find('input[type="file"]').attributes('id'))
    // The dropzone div is not labelable (only form controls are), so it
    // never pairs with the label via for/id.
    expect(label.attributes('for')).not.toBe(wrapper.find('[data-slot="file-upload-dropzone"]').attributes('id'))
  })

  it('the dropzone carries aria-labelledby pointing at the label so its accessible name still reflects the label text', () => {
    const wrapper = mount(FileUpload, { props: { label: 'Attachments' } })
    const dropzone = wrapper.find('[data-slot="file-upload-dropzone"]')
    const label = wrapper.find('label')
    expect(dropzone.attributes('aria-labelledby')).toBeTruthy()
    expect(dropzone.attributes('aria-labelledby')).toBe(label.attributes('id'))
  })

  it('without a label, the dropzone has no aria-labelledby', () => {
    const wrapper = mount(FileUpload)
    expect(wrapper.find('[data-slot="file-upload-dropzone"]').attributes('aria-labelledby')).toBeUndefined()
  })

  it('dragleave onto a child element inside the dropzone does not clear isDragActive (no flicker)', async () => {
    const wrapper = mount(FileUpload, { attachTo: document.body })
    const dropzone = wrapper.find('[data-slot="file-upload-dropzone"]')
    const child = wrapper.find('[data-slot="file-upload-dropzone"] span').element

    await dropzone.trigger('dragover')
    expect(dropzone.attributes('data-drag-active')).toBeTruthy()

    await dropzone.trigger('dragleave', { relatedTarget: child })
    expect(dropzone.attributes('data-drag-active')).toBeTruthy()

    wrapper.unmount()
  })

  it('dragleave to outside the dropzone clears isDragActive', async () => {
    const wrapper = mount(FileUpload, { attachTo: document.body })
    const dropzone = wrapper.find('[data-slot="file-upload-dropzone"]')

    await dropzone.trigger('dragover')
    expect(dropzone.attributes('data-drag-active')).toBeTruthy()

    await dropzone.trigger('dragleave', { relatedTarget: document.body })
    expect(dropzone.attributes('data-drag-active')).toBeUndefined()

    wrapper.unmount()
  })

  it('dragleave with no relatedTarget (left the window) clears isDragActive', async () => {
    const wrapper = mount(FileUpload, { attachTo: document.body })
    const dropzone = wrapper.find('[data-slot="file-upload-dropzone"]')

    await dropzone.trigger('dragover')
    await dropzone.trigger('dragleave', { relatedTarget: null })
    expect(dropzone.attributes('data-drag-active')).toBeUndefined()

    wrapper.unmount()
  })

  it('change emits the FULL resulting file list on add, matching the React contract', async () => {
    let modelValue: File[] = [makeFile('existing.txt', 10)]
    const wrapper = mount(FileUpload, {
      props: {
        multiple: true,
        modelValue,
        'onUpdate:modelValue': (v: File[]) => { modelValue = v },
      },
    })
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    const file = makeFile('new.txt', 10)
    setInputFiles(input, [file])
    await wrapper.find('input[type="file"]').trigger('change')
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual([expect.any(File), expect.any(File)])
    expect((wrapper.emitted('change')?.[0]?.[0] as File[]).map(f => f.name)).toEqual(['existing.txt', 'new.txt'])
  })

  it('change also emits the FULL resulting file list on remove (not just the remove event)', async () => {
    const file = makeFile('a.txt', 10)
    const other = makeFile('b.txt', 10)
    let modelValue: File[] = [file, other]
    const wrapper = mount(FileUpload, {
      props: {
        modelValue,
        'onUpdate:modelValue': (v: File[]) => { modelValue = v },
      },
    })
    await wrapper.find('[data-slot="file-upload-remove-button"]').trigger('click')
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual([other])
    expect(wrapper.emitted('remove')?.[0]?.[0]).toBe(file)
  })

  it('errorMessage renders and is referenced by aria-describedby when isInvalid', () => {
    const wrapper = mount(FileUpload, { props: { isInvalid: true, errorMessage: 'A file is required' } })
    const describedBy = wrapper.find('[data-slot="file-upload-dropzone"]').attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(wrapper.find(`#${describedBy}`).text()).toBe('A file is required')
  })
})
