import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { defineComponent } from 'vue'

// Stub motion-v
vi.mock('../../../utils/motion', () => ({
  motion: {
    div: {
      name: 'motion-div',
      props: ['initial', 'animate', 'exit', 'transition'],
      template: '<div><slot /></div>',
      inheritAttrs: false,
    },
  },
  AnimatePresence: {
    name: 'AnimatePresence',
    template: '<slot />',
  },
}))

// Stub Reka UI Toast primitives for accessible test rendering.
// Using div-based semantics to avoid list/role conflicts in jsdom axe audit.
vi.mock('reka-ui', async () => {
  const actual = await vi.importActual<typeof import('reka-ui')>('reka-ui')
  return {
    ...actual,
    ToastProvider: {
      name: 'ToastProvider',
      template: '<div><slot /></div>',
    },
    // ToastRoot renders as role="status" div (aria-live region, not a list item)
    ToastRoot: {
      name: 'ToastRoot',
      props: ['open', 'duration', 'class'],
      emits: ['update:open', 'pause', 'resume'],
      template: '<div v-if="open" role="status" aria-live="polite" aria-atomic="true" :class="$props.class"><slot /></div>',
    },
    // ToastViewport renders as a section (landmark with label)
    ToastViewport: {
      name: 'ToastViewport',
      props: ['hotkey', 'label', 'class'],
      template: '<section aria-label="Notifications" :class="$props.class" tabindex="-1"><slot /></section>',
    },
    ToastTitle: {
      name: 'ToastTitle',
      props: ['class'],
      template: '<div :class="$props.class"><slot /></div>',
    },
    ToastDescription: {
      name: 'ToastDescription',
      props: ['class'],
      template: '<div :class="$props.class"><slot /></div>',
    },
    // as-child passthrough — ToastAction.vue wraps Button with as-child.
    ToastAction: {
      name: 'ToastAction',
      props: ['altText', 'class', 'asChild'],
      template: '<slot />',
    },
    // as-child passthrough — ToastClose.vue wraps CloseButton with as-child,
    // so this mock must not add its own button wrapper to avoid nested-interactive.
    ToastClose: {
      name: 'ToastClose',
      props: ['class', 'asChild'],
      template: '<slot />',
    },
  }
})

describe('Toast axe audit', async () => {
  const { default: Toast } = await import('../Toast.vue')
  const { default: ToastTitle } = await import('../ToastTitle.vue')
  const { default: ToastDescription } = await import('../ToastDescription.vue')
  const { default: ToastAction } = await import('../ToastAction.vue')
  const { default: ToastClose } = await import('../ToastClose.vue')
  const { default: ToastProvider } = await import('../ToastProvider.vue')
  const { useToast } = await import('../../../composables/useToast')

  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach((w) => w.unmount())
    mountedWrappers.length = 0
    // Cleanup toasts
    const { toasts, remove } = useToast()
    toasts.value.forEach((t) => remove(t.id))
  })

  it('passes axe with basic Toast (title only)', async () => {
    const TestComp = defineComponent({
      components: { Toast, ToastTitle },
      template: `
        <div>
          <Toast :open="true" :duration="0">
            <ToastTitle>Hello</ToastTitle>
          </Toast>
        </div>
      `,
    })
    const wrapper = mount(TestComp, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with ToastTitle + ToastDescription + ToastClose', async () => {
    const TestComp = defineComponent({
      components: { Toast, ToastTitle, ToastDescription, ToastClose },
      template: `
        <div>
          <Toast :open="true" :duration="0">
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>Your data was saved.</ToastDescription>
            <ToastClose />
          </Toast>
        </div>
      `,
    })
    const wrapper = mount(TestComp, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with ToastAction', async () => {
    const TestComp = defineComponent({
      components: { Toast, ToastTitle, ToastAction },
      template: `
        <div>
          <Toast :open="true" :duration="0">
            <ToastTitle>Update available</ToastTitle>
            <ToastAction alt-text="Refresh to update">Refresh</ToastAction>
          </Toast>
        </div>
      `,
    })
    const wrapper = mount(TestComp, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with ToastProvider', async () => {
    const TestComp = defineComponent({
      components: { ToastProvider },
      template: `
        <ToastProvider>
          <div>App content</div>
        </ToastProvider>
      `,
    })
    const wrapper = mount(TestComp, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with full toast structure (all sub-parts)', async () => {
    const TestComp = defineComponent({
      components: { Toast, ToastTitle, ToastDescription, ToastAction, ToastClose },
      template: `
        <div>
          <Toast :open="true" :duration="0" variant="success">
            <ToastTitle>File uploaded</ToastTitle>
            <ToastDescription>Your file was uploaded successfully.</ToastDescription>
            <ToastAction alt-text="View file">View</ToastAction>
            <ToastClose />
          </Toast>
        </div>
      `,
    })
    const wrapper = mount(TestComp, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
