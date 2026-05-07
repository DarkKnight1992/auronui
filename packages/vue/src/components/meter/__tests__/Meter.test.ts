import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import Meter from '../Meter.vue'

describe('Meter', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 1: ARIA attributes — role="meter" with aria-valuenow/min/max
  it('renders role="meter" with correct aria attributes', async () => {
    const wrapper = mount(Meter, {
      props: { value: 70, minValue: 0, maxValue: 100 },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const meter = wrapper.find('[role="meter"]')
    expect(meter.exists()).toBe(true)
    expect(meter.attributes('aria-valuenow')).toBe('70')
    expect(meter.attributes('aria-valuemin')).toBe('0')
    expect(meter.attributes('aria-valuemax')).toBe('100')
  })

  // Test 2: Visual indicator has width 70%
  it('renders indicator with correct percentage width', async () => {
    const wrapper = mount(Meter, {
      props: { value: 70, minValue: 0, maxValue: 100 },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const fill = wrapper.find('.meter__fill')
    expect(fill.exists()).toBe(true)
    const style = (fill.element as HTMLElement).getAttribute('style') || ''
    expect(style).toContain('width: 70%')
  })

  // Test 3: label + showValueLabel + formatOptions
  it('renders label and formatted value label', async () => {
    const wrapper = mount(Meter, {
      props: {
        value: 0.7,
        minValue: 0,
        maxValue: 1,
        label: 'CPU Usage',
        showValueLabel: true,
        formatOptions: { style: 'percent' },
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    expect(wrapper.text()).toContain('CPU Usage')
    // Intl.NumberFormat with style:'percent' on 0.7 → "70%"
    expect(wrapper.text()).toContain('70%')
  })

  // Test 4: color prop changes slot class
  it('applies color variant class', async () => {
    const wrapper = mount(Meter, {
      props: { value: 50, color: 'danger' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const html = wrapper.html()
    expect(html).toContain('meter--danger')
  })

  // Test 5: Clamp value above max to 100%
  it('clamps value above maxValue to 100% width', async () => {
    const wrapper = mount(Meter, {
      props: { value: 150, minValue: 0, maxValue: 100 },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const fill = wrapper.find('.meter__fill')
    const style = (fill.element as HTMLElement).getAttribute('style') || ''
    expect(style).toContain('width: 100%')
  })

  // Test 6: Clamp value below min to 0%
  it('clamps value below minValue to 0% width', async () => {
    const wrapper = mount(Meter, {
      props: { value: -10, minValue: 0, maxValue: 100 },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const fill = wrapper.find('.meter__fill')
    const style = (fill.element as HTMLElement).getAttribute('style') || ''
    expect(style).toContain('width: 0%')
  })

  // Test 7: axe zero violations
  it('passes axe accessibility audit', async () => {
    const wrapper = mount(Meter, {
      props: { value: 50, label: 'Storage' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const results = await axe.run(wrapper.element as HTMLElement)
    expect(results.violations).toHaveLength(0)
  })
})
