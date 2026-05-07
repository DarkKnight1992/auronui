import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from '../index'

describe('Accordion axe audit', () => {
  const wrappers: ReturnType<typeof mount>[] = []
  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  async function run(attrs: Record<string, unknown> = {}) {
    const w = mount({
      components: { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent },
      template: `
        <Accordion v-bind="$attrs">
          <AccordionItem value="one">
            <AccordionHeader><AccordionTrigger>One</AccordionTrigger></AccordionHeader>
            <AccordionContent>Content one</AccordionContent>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionHeader><AccordionTrigger>Two</AccordionTrigger></AccordionHeader>
            <AccordionContent>Content two</AccordionContent>
          </AccordionItem>
        </Accordion>
      `,
    }, { attachTo: document.body, attrs })
    wrappers.push(w)
    const results = await axe.run(w.element as HTMLElement)
    expect(results.violations).toEqual([])
  }

  it('single collapsible accordion passes axe', async () => {
    await run({ type: 'single', collapsible: true })
  })
  it('multiple accordion passes axe', async () => {
    await run({ type: 'multiple' })
  })
  it('surface variant passes axe', async () => {
    await run({ type: 'single', variant: 'surface' })
  })
})
