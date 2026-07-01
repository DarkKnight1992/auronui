import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import HoverCard from '../HoverCard.vue'
import HoverCardTrigger from '../HoverCardTrigger.vue'
import HoverCardContent from '../HoverCardContent.vue'

function mountHoverCard(defaultOpen = false) {
  const wrapper = mount(
    defineComponent({
      components: { HoverCard, HoverCardTrigger, HoverCardContent },
      props: {
        defaultOpen: { type: Boolean, default: false },
      },
      template: `
        <HoverCard :default-open="defaultOpen">
          <HoverCardTrigger as-child>
            <a href="#profile">@auronui</a>
          </HoverCardTrigger>
          <HoverCardContent>
            <div class="hover-card-body">
              <h2>Auron UI</h2>
              <p>Vue 3 component library.</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      `,
    }),
    {
      attachTo: document.body,
      props: { defaultOpen },
    },
  )
  return wrapper
}

describe('HoverCard', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(async () => {
    wrappers.forEach((w) => w.unmount())
    wrappers.length = 0
    document.body.innerHTML = ''
    await nextTick()
  })

  it('does not render HoverCardContent in DOM when closed by default', async () => {
    const wrapper = mountHoverCard(false)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.hover-card-body')
    expect(content).toBeNull()
  })

  it('renders HoverCardContent in DOM when defaultOpen=true', async () => {
    const wrapper = mountHoverCard(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.hover-card-body')
    expect(content).not.toBeNull()
  })

  it('v-model:open binding reflects open/close state changes', async () => {
    const openState = ref(false)
    const wrapper = mount(
      defineComponent({
        components: { HoverCard, HoverCardTrigger, HoverCardContent },
        setup() {
          return { openState }
        },
        template: `
          <HoverCard v-model:open="openState">
            <HoverCardTrigger as-child>
              <a href="#profile">Profile</a>
            </HoverCardTrigger>
            <HoverCardContent>
              <div class="hover-card-body">Content</div>
            </HoverCardContent>
          </HoverCard>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()

    expect(openState.value).toBe(false)

    openState.value = true
    await flushPromises()
    await nextTick()
    expect(document.body.querySelector('.hover-card-body')).not.toBeNull()

    openState.value = false
    await flushPromises()
    await nextTick()
    expect(document.body.querySelector('.hover-card-body')).toBeNull()
  })

  it('renders with custom openDelay and closeDelay props without throwing', async () => {
    const wrapper = mount(
      defineComponent({
        components: { HoverCard, HoverCardTrigger, HoverCardContent },
        template: `
          <HoverCard :default-open="true" :open-delay="100" :close-delay="50">
            <HoverCardTrigger as-child>
              <a href="#profile">Profile</a>
            </HoverCardTrigger>
            <HoverCardContent>
              <div class="hover-card-body">Content</div>
            </HoverCardContent>
          </HoverCard>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    expect(document.body.querySelector('.hover-card-body')).not.toBeNull()
  })
})
