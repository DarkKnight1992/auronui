import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import Tooltip from '../Tooltip.vue'
import TooltipProvider from '../TooltipProvider.vue'
import TooltipTrigger from '../TooltipTrigger.vue'
import TooltipContent from '../TooltipContent.vue'

// jsdom does not implement PointerEvent — Reka's TooltipTrigger listens to
// pointermove/pointerleave/blur/click. We polyfill PointerEvent via MouseEvent
// for dispatching, and use controlled v-model:open for state-driven tests.
class PointerEventPolyfill extends MouseEvent {
  pointerType: string
  pointerId: number
  constructor(type: string, init: PointerEventInit & MouseEventInit = {}) {
    super(type, init)
    this.pointerType = init.pointerType ?? 'mouse'
    this.pointerId = init.pointerId ?? 1
  }
}

// Helper: create a pointer-like event using the polyfill
function mkPointerEvent(type: string, extra: PointerEventInit & MouseEventInit = {}) {
  return new PointerEventPolyfill(type, { bubbles: true, cancelable: true, pointerType: 'mouse', ...extra })
}

// Helper: mount a Tooltip inside a provider with configurable delay
function mountTooltip(defaultOpen = false, delayDuration = 0) {
  const wrapper = mount(
    defineComponent({
      components: { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent },
      props: {
        defaultOpen: { type: Boolean, default: false },
        delayDuration: { type: Number, default: 0 },
      },
      template: `
        <TooltipProvider :delay-duration="delayDuration">
          <Tooltip :default-open="defaultOpen">
            <TooltipTrigger as-child>
              <button>Hover me</button>
            </TooltipTrigger>
            <TooltipContent>
              <span class="tooltip-body">Tooltip text</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      `,
    }),
    {
      attachTo: document.body,
      props: { defaultOpen, delayDuration },
    },
  )
  return wrapper
}

describe('Tooltip', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    vi.useRealTimers()
    wrappers.forEach((w) => w.unmount())
    wrappers.length = 0
    document.body.innerHTML = ''
    await nextTick()
  })

  it('does not render TooltipContent in DOM when closed by default', async () => {
    const wrapper = mountTooltip(false)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.tooltip-body')
    expect(content).toBeNull()
  })

  it('renders TooltipContent in DOM when defaultOpen=true', async () => {
    const wrapper = mountTooltip(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.tooltip-body')
    expect(content).not.toBeNull()
  })

  it('shows tooltip content on pointermove (hover) after delay', async () => {
    const wrapper = mountTooltip(false, 0)
    wrappers.push(wrapper)
    await flushPromises()

    // Confirm closed
    expect(document.body.querySelector('.tooltip-body')).toBeNull()

    // Reka opens tooltip on 'pointermove' — pointerType must not be 'touch'
    const triggerEl = wrapper.find('button').element
    triggerEl.dispatchEvent(mkPointerEvent('pointermove'))
    vi.runAllTimers()
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.tooltip-body')
    expect(content).not.toBeNull()
  })

  it('hides tooltip on pointerleave when disableHoverableContent=true', async () => {
    // With disableHoverableContent=true, Reka calls handleClose() on pointerleave
    // (not just clearTimer). This is the correct way to test pointer-leave close.
    const wrapper = mount(
      defineComponent({
        components: { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent },
        template: `
          <TooltipProvider :delay-duration="0" :disable-hoverable-content="true">
            <Tooltip :default-open="true">
              <TooltipTrigger as-child>
                <button>Hover me</button>
              </TooltipTrigger>
              <TooltipContent>
                <span class="tooltip-body">Tooltip text</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    // Verify open
    expect(document.body.querySelector('.tooltip-body')).not.toBeNull()

    // With disableHoverableContent, pointerleave on trigger calls handleClose()
    const triggerEl = wrapper.find('button').element
    triggerEl.dispatchEvent(mkPointerEvent('pointerleave'))
    vi.runAllTimers()
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.tooltip-body')
    expect(content).toBeNull()
  })

  it('hides tooltip on blur', async () => {
    const wrapper = mountTooltip(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    expect(document.body.querySelector('.tooltip-body')).not.toBeNull()

    // Reka's handleBlur calls rootContext.onClose()
    const triggerEl = wrapper.find('button').element
    triggerEl.dispatchEvent(new FocusEvent('blur', { bubbles: true }))
    vi.runAllTimers()
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.tooltip-body')
    expect(content).toBeNull()
  })

  it('pressing Escape closes an open tooltip', async () => {
    const wrapper = mountTooltip(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    expect(document.body.querySelector('.tooltip-body')).not.toBeNull()

    // Find the tooltip content element and dispatch Escape on it
    const tooltipContentEl = document.body.querySelector('[data-state]') as HTMLElement
    if (tooltipContentEl) {
      tooltipContentEl.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    } else {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    }
    vi.runAllTimers()
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.tooltip-body')
    expect(content).toBeNull()
  })

  it('TooltipProvider delayDuration: tooltip stays closed before delay expires', async () => {
    // With delayDuration=500, tooltip should NOT show until 500ms have passed
    const wrapper = mountTooltip(false, 500)
    wrappers.push(wrapper)
    await flushPromises()

    const triggerEl = wrapper.find('button').element
    triggerEl.dispatchEvent(mkPointerEvent('pointermove'))

    // Advance only 200ms — tooltip should still be closed
    vi.advanceTimersByTime(200)
    await flushPromises()
    await nextTick()
    expect(document.body.querySelector('.tooltip-body')).toBeNull()

    // Advance past 500ms total — tooltip should now open
    vi.advanceTimersByTime(400)
    await flushPromises()
    await nextTick()
    const content = document.body.querySelector('.tooltip-body')
    expect(content).not.toBeNull()
  })

  it('v-model:open controls tooltip open state (controlled mode)', async () => {
    const openState = ref(false)
    const wrapper = mount(
      defineComponent({
        components: { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent },
        setup() {
          return { openState }
        },
        template: `
          <TooltipProvider :delay-duration="0">
            <Tooltip v-model:open="openState">
              <TooltipTrigger as-child>
                <button>Hover me</button>
              </TooltipTrigger>
              <TooltipContent>
                <span class="tooltip-body">Tooltip text</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    // Initially closed
    expect(openState.value).toBe(false)
    expect(document.body.querySelector('.tooltip-body')).toBeNull()

    // Open programmatically
    openState.value = true
    await nextTick()
    await flushPromises()

    expect(document.body.querySelector('.tooltip-body')).not.toBeNull()
  })
})
