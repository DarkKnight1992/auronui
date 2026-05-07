import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import ProgressCircle from '../ProgressCircle.vue'

describe('ProgressCircle', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 1: value=75 — two circles with correct stroke-dashoffset
  it('renders two circles with correct stroke-dashoffset for value=75', async () => {
    const strokeWidth = 3
    const radius = 16 - strokeWidth // 13
    const circumference = 2 * Math.PI * radius // ~81.68
    const expectedOffset = circumference * (1 - 75 / 100) // ~20.42

    const wrapper = mount(ProgressCircle, {
      props: { value: 75, maxValue: 100, strokeWidth },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const circles = wrapper.findAll('circle')
    expect(circles).toHaveLength(2)

    // The indicator circle (second) has stroke-dashoffset
    const indicatorCircle = circles[1]
    const dashoffset = parseFloat(
      (indicatorCircle.element as SVGCircleElement).getAttribute('stroke-dashoffset') || '0'
    )
    expect(Math.abs(dashoffset - expectedOffset)).toBeLessThan(0.5)
  })

  // Test 2: role="progressbar" from ProgressRoot with aria-valuenow
  it('has role="progressbar" and aria-valuenow="75"', async () => {
    const wrapper = mount(ProgressCircle, {
      props: { value: 75, maxValue: 100 },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const progressbar = wrapper.find('[role="progressbar"]')
    expect(progressbar.exists()).toBe(true)
    expect((progressbar.element as HTMLElement).getAttribute('aria-valuenow')).toBe('75')
  })

  // Test 3: Indeterminate (value=null) — no specific offset, spin class applied
  it('renders indeterminate state when value is null', async () => {
    const wrapper = mount(ProgressCircle, {
      props: { value: null },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const progressbar = wrapper.find('[role="progressbar"]')
    expect(progressbar.exists()).toBe(true)
    expect((progressbar.element as HTMLElement).getAttribute('aria-valuenow')).toBeNull()
    expect((progressbar.element as HTMLElement).getAttribute('data-state')).toBe('indeterminate')

    // SVG should have spin class for indeterminate
    const svg = wrapper.find('svg')
    expect(svg.classes()).toContain('animate-spin')
  })

  // Test 4: size prop changes rendered size class
  it('applies size class based on size prop', async () => {
    const wrapper = mount(ProgressCircle, {
      props: { value: 50, size: 'lg' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const base = wrapper.find('.progress-circle')
    expect(base.classes().some(c => c.includes('progress-circle--lg'))).toBe(true)
  })

  // Test 5: showValueLabel renders formatted number inside circle
  it('renders value label text when showValueLabel is true', async () => {
    const wrapper = mount(ProgressCircle, {
      props: { value: 75, showValueLabel: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const valueEl = wrapper.find('.progress-circle__value')
    expect(valueEl.exists()).toBe(true)
    expect(valueEl.text()).toContain('75')
  })

  // Test 6: axe zero violations
  it('passes axe with zero violations in determinate state', async () => {
    const wrapper = mount(ProgressCircle, {
      props: { value: 75, label: 'Upload progress' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const results = await axe.run(wrapper.element as Element)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  it('passes axe with zero violations in indeterminate state', async () => {
    const wrapper = mount(ProgressCircle, {
      props: { value: null, label: 'Loading' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const results = await axe.run(wrapper.element as Element)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  it('passes axe with zero violations with value label', async () => {
    const wrapper = mount(ProgressCircle, {
      props: { value: 50, label: 'Progress', showValueLabel: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const results = await axe.run(wrapper.element as Element)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })
})
