import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Textarea from '../Textarea.vue'

describe('Textarea exposed API', () => {
  it('exposes focus()/blur() and the native element', () => {
    const w = mount(Textarea, { attachTo: document.body })
    const vm = w.vm as unknown as { focus(): void; blur(): void; el: HTMLElement | null }
    const native = w.find('textarea').element
    expect(vm.el).toBe(native)
    vm.focus()
    expect(document.activeElement).toBe(native)
    vm.blur()
    expect(document.activeElement).not.toBe(native)
    w.unmount()
  })
})
