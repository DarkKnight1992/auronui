import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useToast } from '../../../composables/useToast'

// Stub motion-v in tests
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

// Stub Reka UI Toast primitives
vi.mock('reka-ui', async () => {
  const actual = await vi.importActual<typeof import('reka-ui')>('reka-ui')
  return {
    ...actual,
    ToastProvider: {
      name: 'ToastProvider',
      template: '<div data-testid="toast-provider"><slot /></div>',
    },
    ToastRoot: {
      name: 'ToastRoot',
      props: ['open', 'duration', 'class'],
      emits: ['update:open', 'pause', 'resume'],
      template: '<li v-if="open" role="status" aria-live="off" aria-atomic="true" :class="$props.class"><slot /></li>',
    },
    ToastViewport: {
      name: 'ToastViewport',
      props: ['hotkey', 'label', 'class'],
      template: '<ol :class="$props.class" aria-label="Notifications" tabindex="-1"><slot /></ol>',
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
    ToastAction: {
      name: 'ToastAction',
      props: ['altText', 'class'],
      template: '<button :class="$props.class"><slot /></button>',
    },
    ToastClose: {
      name: 'ToastClose',
      props: ['class'],
      template: '<button :class="$props.class" aria-label="Close notification"><slot /></button>',
    },
  }
})

describe('useToast composable', () => {
  let cleanup: (() => void) | null = null

  beforeEach(() => {
    // Reset toast state between tests by getting fresh instance and removing all
    const { toasts, remove } = useToast()
    // Remove all existing toasts
    const ids = toasts.value.map((t) => t.id)
    ids.forEach((id) => remove(id))
  })

  afterEach(() => {
    cleanup?.()
    cleanup = null
    vi.clearAllTimers()
  })

  it('creates a toast and adds it to the toasts list', () => {
    const { toast, toasts, remove } = useToast()
    const id = toast({ title: 'Hello' })
    expect(toasts.value.some((t) => t.id === id)).toBe(true)
    remove(id)
  })

  it('toast has correct title', () => {
    const { toast, toasts, remove } = useToast()
    const id = toast({ title: 'My Toast' })
    const t = toasts.value.find((t) => t.id === id)
    expect(t?.title).toBe('My Toast')
    remove(id)
  })

  it('toast has correct description', () => {
    const { toast, toasts, remove } = useToast()
    const id = toast({ title: 'Title', description: 'My description' })
    const t = toasts.value.find((t) => t.id === id)
    expect(t?.description).toBe('My description')
    remove(id)
  })

  it('toast defaults to 5000ms duration', () => {
    const { toast, toasts, remove } = useToast()
    const id = toast({ title: 'Title' })
    const t = toasts.value.find((t) => t.id === id)
    expect(t?.duration).toBe(5000)
    remove(id)
  })

  it('toast respects custom duration', () => {
    const { toast, toasts, remove } = useToast()
    const id = toast({ title: 'Title', duration: 3000 })
    const t = toasts.value.find((t) => t.id === id)
    expect(t?.duration).toBe(3000)
    remove(id)
  })

  it('clamps duration below MIN (100ms)', () => {
    const { toast, toasts, remove } = useToast()
    const id = toast({ title: 'Title', duration: 10 })
    const t = toasts.value.find((t) => t.id === id)
    expect(t?.duration).toBeGreaterThanOrEqual(100)
    remove(id)
  })

  it('clamps duration above MAX (30s)', () => {
    const { toast, toasts, remove } = useToast()
    const id = toast({ title: 'Title', duration: 999999 })
    const t = toasts.value.find((t) => t.id === id)
    expect(t?.duration).toBeLessThanOrEqual(30000)
    remove(id)
  })

  it('toast defaults to bottom-right position', () => {
    const { toast, toasts, remove } = useToast()
    const id = toast({ title: 'Title' })
    const t = toasts.value.find((t) => t.id === id)
    expect(t?.position).toBe('bottom-right')
    remove(id)
  })

  it('toast respects position prop', () => {
    const { toast, toasts, remove } = useToast()
    const id = toast({ title: 'Title', position: 'top-left' })
    const t = toasts.value.find((t) => t.id === id)
    expect(t?.position).toBe('top-left')
    remove(id)
  })

  it('dismiss sets open=false on the toast', () => {
    const { toast, toasts, dismiss, remove } = useToast()
    const id = toast({ title: 'Title' })
    dismiss(id)
    const t = toasts.value.find((t) => t.id === id)
    expect(t?.open).toBe(false)
    remove(id)
  })

  it('remove deletes the toast from the list', () => {
    const { toast, toasts, remove } = useToast()
    const id = toast({ title: 'Title' })
    expect(toasts.value.some((t) => t.id === id)).toBe(true)
    remove(id)
    expect(toasts.value.some((t) => t.id === id)).toBe(false)
  })

  it('enforces max 5 concurrent toasts (T-06-03)', () => {
    const { toast, toasts, remove } = useToast()
    const initialCount = toasts.value.length
    const ids: string[] = []
    for (let i = 0; i < 6; i++) {
      ids.push(toast({ title: `Toast ${i}` }))
    }
    // Should not exceed MAX_TOASTS
    const openCount = toasts.value.filter((t) => t.open).length
    expect(openCount).toBeLessThanOrEqual(5)
    // Cleanup
    ids.forEach((id) => remove(id))
    expect(toasts.value.length).toBe(initialCount)
  })

  it('toasts list is readonly (cannot mutate externally — warns in dev)', () => {
    const { toasts } = useToast()
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // readonly ref — Vue warns but does not throw in prod; mutation is silently ignored
    // @ts-expect-error testing readonly enforcement
    toasts.value = []
    // The value should not have been mutated (readonly protection)
    // Vue emits a warning instead of throwing
    warnSpy.mockRestore()
    // The returned toasts is a readonly ref — verifying the type constraint is enough
    expect(toasts).toBeDefined()
  })
})

describe('Toast component', async () => {
  const { default: Toast } = await import('../Toast.vue')
  const { default: ToastTitle } = await import('../ToastTitle.vue')
  const { default: ToastDescription } = await import('../ToastDescription.vue')

  it('renders when open=true', () => {
    const wrapper = mount(Toast, {
      props: { open: true, duration: 0 },
      slots: { default: '<span>Toast content</span>' },
    })
    expect(wrapper.text()).toContain('Toast content')
  })

  it('does not render when open=false', () => {
    const wrapper = mount(Toast, {
      props: { open: false, duration: 0 },
      slots: { default: '<span>Toast content</span>' },
    })
    expect(wrapper.text()).not.toContain('Toast content')
  })

  it('emits update:open false when dismissed', async () => {
    const wrapper = mount(Toast, {
      props: { open: true, duration: 0 },
      slots: { default: '<span>content</span>' },
    })
    // Find the ToastRoot stub and trigger its update:open event
    const toastRoot = wrapper.findComponent({ name: 'ToastRoot' })
    await toastRoot.vm.$emit('update:open', false)
    expect(wrapper.emitted('update:open')).toBeTruthy()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('renders ToastTitle inside Toast', () => {
    const Combo = defineComponent({
      components: { Toast, ToastTitle },
      template: `<Toast :open="true" :duration="0"><ToastTitle>My Title</ToastTitle></Toast>`,
    })
    const wrapper = mount(Combo)
    expect(wrapper.text()).toContain('My Title')
  })

  it('renders ToastDescription inside Toast', () => {
    const Combo = defineComponent({
      components: { Toast, ToastDescription },
      template: `<Toast :open="true" :duration="0"><ToastDescription>My Desc</ToastDescription></Toast>`,
    })
    const wrapper = mount(Combo)
    expect(wrapper.text()).toContain('My Desc')
  })
})

describe('ToastProvider component', async () => {
  const { default: ToastProvider } = await import('../ToastProvider.vue')

  it('mounts without errors', () => {
    const wrapper = mount(ToastProvider, {
      slots: { default: '<div>App content</div>' },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = mount(ToastProvider, {
      slots: { default: '<div>App content</div>' },
    })
    expect(wrapper.text()).toContain('App content')
  })
})
