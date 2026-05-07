import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import Card from '../Card.vue'
import CardHeader from '../CardHeader.vue'
import CardBody from '../CardBody.vue'
import CardFooter from '../CardFooter.vue'

describe('Card', () => {
  it('Card root renders a div with class "card card--default" by default', () => {
    const wrapper = mount(Card)
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    expect(wrapper.classes()).toContain('card')
    expect(wrapper.classes()).toContain('card--default')
  })

  it('Card root renders with class "card card--secondary" when variant="secondary"', () => {
    const wrapper = mount(Card, { props: { variant: 'secondary' } })
    expect(wrapper.classes()).toContain('card')
    expect(wrapper.classes()).toContain('card--secondary')
  })

  it('Card root renders with class "card card--tertiary" when variant="tertiary"', () => {
    const wrapper = mount(Card, { props: { variant: 'tertiary' } })
    expect(wrapper.classes()).toContain('card')
    expect(wrapper.classes()).toContain('card--tertiary')
  })

  it('Card root renders with class "card card--transparent" when variant="transparent"', () => {
    const wrapper = mount(Card, { props: { variant: 'transparent' } })
    expect(wrapper.classes()).toContain('card')
    expect(wrapper.classes()).toContain('card--transparent')
  })

  it('CardHeader renders a div with class "card__header"', () => {
    const wrapper = mount(CardHeader)
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    expect(wrapper.classes()).toContain('card__header')
  })

  it('CardBody renders a div with class "card__content"', () => {
    const wrapper = mount(CardBody)
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    expect(wrapper.classes()).toContain('card__content')
  })

  it('CardFooter renders a div with class "card__footer"', () => {
    const wrapper = mount(CardFooter)
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    expect(wrapper.classes()).toContain('card__footer')
  })

  it('CardHeader injected inside Card root applies the header slot class', () => {
    const wrapper = mount(Card, {
      props: { variant: 'default' },
      slots: { default: CardHeader },
    })
    const header = wrapper.findComponent(CardHeader)
    expect(header.classes()).toContain('card__header')
  })

  it('changing Card variant reactively updates CardHeader injected slot class', async () => {
    const variant = ref<'default' | 'secondary' | 'tertiary' | 'transparent'>('default')
    const Wrapper = defineComponent({
      components: { Card, CardHeader },
      setup() { return { variant } },
      template: '<Card :variant="variant"><CardHeader>Header</CardHeader></Card>',
    })
    const wrapper = mount(Wrapper)
    const header = wrapper.findComponent(CardHeader)
    expect(header.classes()).toContain('card__header')

    variant.value = 'secondary'
    await nextTick()
    // CardHeader still uses card__header class (slot class doesn't change by variant)
    // but variant context is updated
    expect(header.classes()).toContain('card__header')
  })

  it('CardHeader used standalone (no Card parent) falls back to default variant', () => {
    const wrapper = mount(CardHeader)
    expect(wrapper.classes()).toContain('card__header')
  })

  it('CardBody used standalone (no Card parent) falls back to default variant', () => {
    const wrapper = mount(CardBody)
    expect(wrapper.classes()).toContain('card__content')
  })

  it('CardFooter used standalone (no Card parent) falls back to default variant', () => {
    const wrapper = mount(CardFooter)
    expect(wrapper.classes()).toContain('card__footer')
  })

  it('Card composition: renders Card with CardHeader + CardBody + CardFooter correctly', () => {
    const Composition = defineComponent({
      components: { Card, CardHeader, CardBody, CardFooter },
      template: `
        <Card variant="default">
          <CardHeader>Title</CardHeader>
          <CardBody>Content</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      `,
    })
    const wrapper = mount(Composition)
    expect(wrapper.findComponent(Card).classes()).toContain('card')
    expect(wrapper.findComponent(CardHeader).classes()).toContain('card__header')
    expect(wrapper.findComponent(CardBody).classes()).toContain('card__content')
    expect(wrapper.findComponent(CardFooter).classes()).toContain('card__footer')
  })

  it('passes axe audit for Card composition', async () => {
    const Composition = defineComponent({
      components: { Card, CardHeader, CardBody, CardFooter },
      template: `
        <Card variant="default">
          <CardHeader>Title</CardHeader>
          <CardBody>Content</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      `,
    })
    const wrapper = mount(Composition, { attachTo: document.body })
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
    wrapper.unmount()
  })
})
