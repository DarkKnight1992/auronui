import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { parseColor } from 'reka-ui'
import ColorSwatch from '../ColorSwatch.vue'
import { provideColorPickerContext } from '../../color-picker/color-picker.context'
import type { ColorPickerContext } from '../../color-picker/color-picker.context'

const mountedWrappers: ReturnType<typeof mount>[] = []

afterEach(() => {
  mountedWrappers.forEach((w) => w.unmount())
  mountedWrappers.length = 0
})

describe('ColorSwatch', () => {
  it('Test 1: color="#ff0000" renders with color-swatch class', async () => {
    const wrapper = mount(ColorSwatch, {
      props: { color: '#ff0000', colorName: 'Red' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const el = wrapper.find('[class*="color-swatch"]')
    expect(el.exists()).toBe(true)
  })

  it('Test 2: colorName sets aria-label', async () => {
    const wrapper = mount(ColorSwatch, {
      props: { color: '#ff0000', colorName: 'Red' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const root = wrapper.element
    // Reka UI ColorSwatch sets aria-label from colorName
    expect(root.getAttribute('aria-label')).toBe('Red')
  })

  it('Test 3: reads from ColorPickerContext when no color prop provided', async () => {
    const color = ref(parseColor('#00ff00'))

    const wrapper = mount({
      setup() {
        const ctx: ColorPickerContext = {
          color,
          format: ref('hex'),
          setChannel: () => {},
          setChannels: () => {},
          emitUpdate: () => {},
        }
        provideColorPickerContext(ctx)
      },
      template: '<ColorSwatch colorName="Green" />',
      components: { ColorSwatch },
    }, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    // Renders without error when context provides color
    expect(wrapper.find('[class*="color-swatch"]').exists()).toBe(true)
  })

  it('Test 4: accepts Color object (not just string)', async () => {
    const colorObj = parseColor('#0000ff')
    const wrapper = mount(ColorSwatch, {
      props: { color: colorObj, colorName: 'Blue' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    expect(wrapper.find('[class*="color-swatch"]').exists()).toBe(true)
  })
})
