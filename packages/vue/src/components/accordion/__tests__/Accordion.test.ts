import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from '../index'

function harness(props: Record<string, unknown> = {}) {
  return mount({
    components: { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent },
    props: ['type', 'modelValue', 'defaultValue', 'variant'],
    template: `
      <Accordion
        :type="type ?? 'single'"
        :model-value="modelValue"
        :default-value="defaultValue"
        :variant="variant"
      >
        <AccordionItem value="a">
          <AccordionHeader><AccordionTrigger>A trigger</AccordionTrigger></AccordionHeader>
          <AccordionContent>A content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b" disabled>
          <AccordionHeader><AccordionTrigger>B trigger</AccordionTrigger></AccordionHeader>
          <AccordionContent>B content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="c">
          <AccordionHeader><AccordionTrigger>C trigger</AccordionTrigger></AccordionHeader>
          <AccordionContent>C content</AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }, { props })
}

describe('Accordion', () => {
  it('applies base "accordion" class', () => {
    expect(harness().find('.accordion').exists()).toBe(true)
  })

  it('renders all AccordionItems with accordion__item class', () => {
    expect(harness().findAll('.accordion__item').length).toBe(3)
  })

  it('variant="surface" applies accordion--surface modifier', () => {
    expect(harness({ variant: 'surface' }).find('.accordion--surface').exists()).toBe(true)
  })

  it('single mode: defaultValue opens the specified item', () => {
    const w = harness({ type: 'single', defaultValue: 'a' })
    // Reka UI sets data-state="open" on the opened item
    const openItems = w.findAll('[data-state="open"]')
    expect(openItems.length).toBeGreaterThan(0)
  })

  it('disabled AccordionItem surfaces data-disabled', () => {
    const w = harness({ type: 'single' })
    const disabled = w.find('.accordion__item[data-disabled]')
    expect(disabled.exists()).toBe(true)
  })

  it('multiple mode accepts defaultValue array', () => {
    const w = harness({ type: 'multiple', defaultValue: ['a', 'c'] })
    const openItems = w.findAll('[data-state="open"]')
    // At least two items have open state
    expect(openItems.length).toBeGreaterThanOrEqual(2)
  })

  it('AccordionTrigger has accordion__trigger class', () => {
    expect(harness().find('.accordion__trigger').exists()).toBe(true)
  })

  it('AccordionTrigger contains an aria-hidden indicator', () => {
    const w = harness()
    const indicator = w.find('.accordion__indicator')
    expect(indicator.exists()).toBe(true)
    expect(indicator.attributes('aria-hidden')).toBe('true')
  })

  it('AccordionContent body is force-mounted so animation has a stable parent', () => {
    const w = harness({ type: 'single', defaultValue: 'a' })
    // Animation is driven by motion-v inside AccordionContent, keyed off the
    // per-item open state we re-provide from Reka. Reka's content stays mounted
    // (force-mount=true) so ARIA state is always correct and the motion panel
    // has a stable parent regardless of open/closed.
    expect(w.find('.accordion__body').exists()).toBe(true)
  })
})
