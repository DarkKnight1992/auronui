import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import { CalendarDate } from '@internationalized/date'
import Calendar from '../Calendar.vue'

// Polyfill ResizeObserver for jsdom
beforeEach(() => {
  ;(globalThis as any).ResizeObserver = function ResizeObserver(
    _callback: ResizeObserverCallback
  ) {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
  }
})

describe('Calendar - Accessibility', () => {
  afterEach(() => {
    // Remove any attached elements
    document.body.innerHTML = ''
  })

  it('has zero axe violations in default state', async () => {
    const wrapper = mount(Calendar, {
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  it('has zero axe violations with a selected date', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: new CalendarDate(2024, 6, 15) },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  it('has zero axe violations in month view', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: new CalendarDate(2024, 6, 15) },
      attachTo: document.body,
    })
    await nextTick()
    await wrapper.find('.calendar__heading-button').trigger('click')
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  it('has zero axe violations in year view', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: new CalendarDate(2024, 6, 15) },
      attachTo: document.body,
    })
    await nextTick()
    await wrapper.find('.calendar__heading-button').trigger('click')
    await nextTick()
    await wrapper.find('.calendar__heading-button').trigger('click')
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })
})
