import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import ProgressBar from '../ProgressBar.vue'

describe('ProgressBar', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 1: Determinate progress — aria-valuenow and indicator width
  it('renders determinate progress with aria-valuenow and indicator transform', async () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 60, maxValue: 100 },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const progressbar = wrapper.find('[role="progressbar"]')
    expect(progressbar.exists()).toBe(true)
    expect((progressbar.element as HTMLElement).getAttribute('aria-valuenow')).toBe('60')

    const indicator = wrapper.find('.progress-bar__indicator')
    expect(indicator.exists()).toBe(true)
    const style = (indicator.element as HTMLElement).getAttribute('style') || ''
    expect(style).toContain('translateX(-40%)')
  })

  // Test 2: Indeterminate (value=null) — no aria-valuenow, data-state=indeterminate
  it('renders indeterminate state when value is null', async () => {
    const wrapper = mount(ProgressBar, {
      props: { value: null },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const progressbar = wrapper.find('[role="progressbar"]')
    expect(progressbar.exists()).toBe(true)
    expect((progressbar.element as HTMLElement).getAttribute('aria-valuenow')).toBeNull()
    expect((progressbar.element as HTMLElement).getAttribute('data-state')).toBe('indeterminate')
  })

  // Test 3: label + showValueLabel rendered in labelWrapper
  it('renders label and value label above the track', async () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 50, label: 'Loading...', showValueLabel: true, valueLabel: '50%' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const labelWrapper = wrapper.find('.progress-bar__label-wrapper')
    expect(labelWrapper.exists()).toBe(true)
    expect(wrapper.find('.progress-bar__label').text()).toBe('Loading...')
    expect(wrapper.find('.progress-bar__value').text()).toBe('50%')
  })

  // Test 4: formatOptions with style: 'percent' and maxValue=1
  it('applies formatOptions to format value display', async () => {
    const wrapper = mount(ProgressBar, {
      props: {
        value: 0.5,
        maxValue: 1,
        showValueLabel: true,
        formatOptions: { style: 'percent' },
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const valueEl = wrapper.find('.progress-bar__value')
    expect(valueEl.exists()).toBe(true)
    // Intl.NumberFormat with style: 'percent' on 0.5 -> "50%"
    expect(valueEl.text()).toContain('50')
    expect(valueEl.text()).toContain('%')
  })

  // Test 5: isDisabled adds data-disabled attribute
  it('adds data-disabled attribute when isDisabled is true', async () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 30, isDisabled: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const root = wrapper.find('.progress-bar')
    expect((root.element as HTMLElement).getAttribute('data-disabled')).toBe('')
  })

  // Test 6: axe zero violations
  it('passes axe with zero violations in determinate state', async () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 60, maxValue: 100, label: 'File upload' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const results = await axe.run(wrapper.element as Element)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  it('passes axe with zero violations in indeterminate state', async () => {
    const wrapper = mount(ProgressBar, {
      props: { value: null, label: 'Loading' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const results = await axe.run(wrapper.element as Element)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  it('passes axe with zero violations with label', async () => {
    const wrapper = mount(ProgressBar, {
      props: { value: 75, label: 'Progress', showValueLabel: true, valueLabel: '75%' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const results = await axe.run(wrapper.element as Element)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })
})
