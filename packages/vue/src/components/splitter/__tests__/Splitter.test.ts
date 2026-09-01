import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { _clearWarnedCache } from '../../../utils/warnDeprecated'
import SplitterGroup from '../SplitterGroup.vue'
import SplitterPanel from '../SplitterPanel.vue'
import SplitterResizeHandle from '../SplitterResizeHandle.vue'

describe('SplitterGroup', () => {
  it('Test 1: renders data-slot="splitter-group" on the root', () => {
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        template: `
          <SplitterGroup>
            <SplitterPanel />
            <SplitterResizeHandle />
            <SplitterPanel />
          </SplitterGroup>
        `,
      }),
    )
    const root = wrapper.find('[data-slot="splitter-group"]')
    expect(root.exists()).toBe(true)
  })

  it('Test 2: direction prop forwards to descendant handle via context (horizontal vs vertical class)', () => {
    const mountWithDirection = (direction: 'horizontal' | 'vertical') =>
      mount(
        defineComponent({
          components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
          props: ['direction'],
          template: `
            <SplitterGroup :direction="direction">
              <SplitterPanel />
              <SplitterResizeHandle />
              <SplitterPanel />
            </SplitterGroup>
          `,
        }),
        { props: { direction } },
      )

    const horizontal = mountWithDirection('horizontal')
    const vertical = mountWithDirection('vertical')

    const horizontalHandle = horizontal.find('[data-slot="splitter-handle"]')
    const verticalHandle = vertical.find('[data-slot="splitter-handle"]')

    expect(horizontalHandle.classes()).toContain('splitter-handle--horizontal')
    expect(horizontalHandle.classes()).not.toContain('splitter-handle--vertical')
    expect(verticalHandle.classes()).toContain('splitter-handle--vertical')
    expect(verticalHandle.classes()).not.toContain('splitter-handle--horizontal')
  })

  it('Test 3: composes SplitterPanel and SplitterResizeHandle children', () => {
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        template: `
          <SplitterGroup>
            <SplitterPanel id="left" />
            <SplitterResizeHandle />
            <SplitterPanel id="right" />
          </SplitterGroup>
        `,
      }),
    )
    expect(wrapper.findAllComponents(SplitterPanel)).toHaveLength(2)
    expect(wrapper.findAllComponents(SplitterResizeHandle)).toHaveLength(1)
  })

  // NOTE: The `layout` event is emitted by reka-ui's underlying panel-group engine only
  // after it measures real DOM layout via ResizeObserver and computes panel pixel/percentage
  // sizes from an actual pointer-driven drag (or a programmatic resize triggered by a real
  // layout pass). jsdom (this project's test environment) does not implement layout at all —
  // `getBoundingClientRect()` and ResizeObserver never report real dimensions, so reka-ui's
  // internal panel-group registration never completes a "real" layout pass and the `layout`
  // event does not fire in this environment. Dispatching synthetic pointerdown/pointermove
  // events on the handle does not help, since the resize math depends on element sizes that
  // jsdom cannot provide. Faking the event by calling `wrapper.vm.$emit('layout', [...])`
  // directly would not test any real behavior of this component, so that assertion is
  // intentionally omitted here. What IS covered above is that SplitterGroup renders its
  // slot marker and correctly composes/forwards context to its children.
})

describe('SplitterPanel', () => {
  it('Test 4: renders data-slot="splitter-panel" on the root', () => {
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        template: `
          <SplitterGroup>
            <SplitterPanel />
            <SplitterResizeHandle />
            <SplitterPanel />
          </SplitterGroup>
        `,
      }),
    )
    const panel = wrapper.find('[data-slot="splitter-panel"]')
    expect(panel.exists()).toBe(true)
  })

  it('Test 5: defaultSize/minSize/maxSize forward to the underlying reka-ui SplitterPanel', () => {
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        template: `
          <SplitterGroup>
            <SplitterPanel :default-size="40" :min-size="20" :max-size="60" />
            <SplitterResizeHandle />
            <SplitterPanel />
          </SplitterGroup>
        `,
      }),
    )
    const rekaPanel = wrapper.findComponent({ name: 'SplitterPanel' })
    expect(rekaPanel.exists()).toBe(true)
    expect(rekaPanel.props('defaultSize')).toBe(40)
    expect(rekaPanel.props('minSize')).toBe(20)
    expect(rekaPanel.props('maxSize')).toBe(60)
  })

  it('Test 6: collapsible prop forwards to the underlying reka-ui SplitterPanel', () => {
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        template: `
          <SplitterGroup>
            <SplitterPanel :collapsible="true" :collapsed-size="10" :min-size="20" />
            <SplitterResizeHandle />
            <SplitterPanel />
          </SplitterGroup>
        `,
      }),
    )
    const rekaPanel = wrapper.findComponent({ name: 'SplitterPanel' })
    expect(rekaPanel.props('collapsible')).toBe(true)
  })

  it('Test 6b: re-exposes the reka-ui panel imperative API on a template ref', async () => {
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        template: `
          <SplitterGroup>
            <SplitterPanel ref="panel" :collapsible="true" :default-size="30" :min-size="20" />
            <SplitterResizeHandle />
            <SplitterPanel :default-size="70" />
          </SplitterGroup>
        `,
      }),
      { attachTo: document.body },
    )
    await nextTick()
    const panel = wrapper.vm.$refs.panel as {
      collapse: () => void
      expand: () => void
      resize: (size: number) => void
      getSize: () => number
      isCollapsed: boolean
      isExpanded: boolean
    }
    expect(typeof panel.collapse).toBe('function')
    expect(typeof panel.expand).toBe('function')
    expect(typeof panel.resize).toBe('function')
    expect(typeof panel.getSize).toBe('function')
    expect(panel.isCollapsed).toBe(false)
    expect(panel.isExpanded).toBe(true)
    wrapper.unmount()
  })

  it('Test 6c: forwards the reka-ui panel slot props to the default slot', async () => {
    const seen: Record<string, unknown>[] = []
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        setup() {
          return { record: (slotProps: Record<string, unknown>) => { seen.push(slotProps) } }
        },
        template: `
          <SplitterGroup>
            <SplitterPanel :collapsible="true" :default-size="30" v-slot="slotProps">
              {{ record(slotProps) }}
            </SplitterPanel>
            <SplitterResizeHandle />
            <SplitterPanel :default-size="70" />
          </SplitterGroup>
        `,
      }),
      { attachTo: document.body },
    )
    await nextTick()
    expect(seen.length).toBeGreaterThan(0)
    expect(seen[0]).toHaveProperty('isCollapsed')
    expect(seen[0]).toHaveProperty('isExpanded')
    expect(typeof seen[0].collapse).toBe('function')
    expect(typeof seen[0].expand).toBe('function')
    expect(typeof seen[0].resize).toBe('function')
    wrapper.unmount()
  })

  // reka-ui logs its own layout-normalization warnings while a panel unmounts, so
  // only count the ones this library emits.
  const auronWarnings = (warn: { mock: { calls: unknown[][] } }) =>
    warn.mock.calls.filter((call: unknown[]) => String(call[0]).startsWith('[AuronUI] SplitterPanel'))

  it('warns when a remounted panel registers out of DOM order without an explicit order', async () => {
    _clearWarnedCache()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        data: () => ({ showFirst: true }),
        template: `
          <SplitterGroup>
            <template v-if="showFirst">
              <SplitterPanel :default-size="20" />
              <SplitterResizeHandle />
            </template>
            <SplitterPanel :default-size="30" />
            <SplitterResizeHandle />
            <SplitterPanel :default-size="50" />
          </SplitterGroup>
        `,
      }),
      { attachTo: document.body },
    )
    await nextTick()

    // Toggling the first panel off and back on re-registers it last, while it renders
    // first — reka-ui sorts panels by `order` and otherwise keeps mount order.
    await wrapper.setData({ showFirst: false })
    await nextTick()
    expect(auronWarnings(warn)).toHaveLength(0)

    await wrapper.setData({ showFirst: true })
    await nextTick()
    expect(auronWarnings(warn)).toHaveLength(1)
    expect(String(auronWarnings(warn)[0][0])).toContain('registered at position 2 but rendered at position 0')

    warn.mockRestore()
    wrapper.unmount()
  })

  it('does not warn when conditional panels carry an explicit order', async () => {
    _clearWarnedCache()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        data: () => ({ showFirst: true }),
        template: `
          <SplitterGroup>
            <template v-if="showFirst">
              <SplitterPanel :order="1" :default-size="20" />
              <SplitterResizeHandle />
            </template>
            <SplitterPanel :order="2" :default-size="30" />
            <SplitterResizeHandle />
            <SplitterPanel :order="3" :default-size="50" />
          </SplitterGroup>
        `,
      }),
      { attachTo: document.body },
    )
    await nextTick()
    await wrapper.setData({ showFirst: false })
    await nextTick()
    await wrapper.setData({ showFirst: true })
    await nextTick()

    expect(auronWarnings(warn)).toHaveLength(0)
    warn.mockRestore()
    wrapper.unmount()
  })

  const panelIds = (wrapper: ReturnType<typeof mount>) =>
    wrapper.findAll('[data-slot="splitter-panel"]').map((w) => w.attributes('id'))

  const mountToggleGroup = (groupProps = '') =>
    mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        data: () => ({ showFirst: true }),
        template: `
          <SplitterGroup ${groupProps}>
            <template v-if="showFirst">
              <SplitterPanel :default-size="20" />
              <SplitterResizeHandle />
            </template>
            <SplitterPanel :default-size="30" />
            <SplitterResizeHandle />
            <SplitterPanel :default-size="50" />
          </SplitterGroup>
        `,
      }),
      { attachTo: document.body },
    )

  it('preservePanelOrder remounts the panels after a restored one so they re-register behind it', async () => {
    _clearWarnedCache()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountToggleGroup(':preserve-panel-order="true"')
    await nextTick()
    const before = panelIds(wrapper)

    await wrapper.setData({ showFirst: false })
    await nextTick()
    await wrapper.setData({ showFirst: true })
    // the repair steps out of the mounting flush, then unmounts and remounts
    await nextTick()
    await nextTick()
    await nextTick()

    const after = panelIds(wrapper)
    expect(after).toHaveLength(3)
    // the two panels that follow the restored one are new instances...
    expect(after[1]).not.toBe(before[1])
    expect(after[2]).not.toBe(before[2])
    // ...and re-registering them keeps reka's registry in DOM order, so no warning
    expect(auronWarnings(warn)).toHaveLength(0)

    warn.mockRestore()
    wrapper.unmount()
  })

  it('leaves panels untouched and warns instead when preservePanelOrder is off', async () => {
    _clearWarnedCache()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountToggleGroup()
    await nextTick()
    const before = panelIds(wrapper)

    await wrapper.setData({ showFirst: false })
    await nextTick()
    await wrapper.setData({ showFirst: true })
    await nextTick()
    await nextTick()
    await nextTick()

    const after = panelIds(wrapper)
    expect(after[1]).toBe(before[1])
    expect(after[2]).toBe(before[2])
    expect(auronWarnings(warn)).toHaveLength(1)

    warn.mockRestore()
    wrapper.unmount()
  })

  // NOTE: Same jsdom layout limitation as SplitterGroup's `layout` event above applies to
  // SplitterPanel's `collapse` / `expand` / `resize` emits — reka-ui only fires these after
  // a real drag-driven (or layout-driven) resize pass computed from actual measured
  // dimensions, which jsdom cannot produce. These emits are intentionally not asserted here
  // rather than faked.
})

describe('SplitterResizeHandle', () => {
  it('deprecated bare disabled prop sets data-disabled on the resize handle', () => {
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        template: `
          <SplitterGroup>
            <SplitterPanel />
            <SplitterResizeHandle :disabled="true" />
            <SplitterPanel />
          </SplitterGroup>
        `,
      }),
      { attachTo: document.body },
    )
    const handle = wrapper.find('[data-resize-handle]')
    expect(handle.exists()).toBe(true)
    expect(handle.attributes('data-disabled')).toBe('')
    wrapper.unmount()
  })

  it('keeps keyboard resizing alive on a handle mounted after the group (late mount)', async () => {
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        data: () => ({ showSecond: false }),
        template: `
          <SplitterGroup>
            <SplitterPanel :default-size="100" />
            <template v-if="showSecond">
              <SplitterResizeHandle />
              <SplitterPanel :default-size="50" />
            </template>
          </SplitterGroup>
        `,
      }),
      { attachTo: document.body },
    )

    // Mount the handle only after the group is already on the page. reka-ui attaches
    // its Arrow/Home/End listener in an effect that bails when the handle element is
    // not yet in the DOM, and on a late mount nothing makes that effect run again.
    await wrapper.setData({ showSecond: true })
    await nextTick()
    await nextTick()

    const handle = wrapper.find('[data-resize-handle]').element
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
    handle.dispatchEvent(event)

    // reka-ui's keydown handler calls preventDefault on the arrow keys it handles,
    // so a defaultPrevented event is proof the listener is attached.
    expect(event.defaultPrevented).toBe(true)
    wrapper.unmount()
  })

  it('Test 7: renders data-slot="splitter-handle" on the root', () => {
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        template: `
          <SplitterGroup>
            <SplitterPanel />
            <SplitterResizeHandle />
            <SplitterPanel />
          </SplitterGroup>
        `,
      }),
    )
    const handle = wrapper.find('[data-slot="splitter-handle"]')
    expect(handle.exists()).toBe(true)
  })

  it('Test 8: default slot fallback renders a drag-bar div when no slot content is given', () => {
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        template: `
          <SplitterGroup>
            <SplitterPanel />
            <SplitterResizeHandle />
            <SplitterPanel />
          </SplitterGroup>
        `,
      }),
    )
    const handle = wrapper.find('[data-slot="splitter-handle"]')
    const bar = handle.find('.splitter-handle__bar')
    expect(bar.exists()).toBe(true)
  })

  it('Test 9: custom slot content overrides the fallback drag-bar div', () => {
    const wrapper = mount(
      defineComponent({
        components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
        template: `
          <SplitterGroup>
            <SplitterPanel />
            <SplitterResizeHandle>
              <span class="custom-handle-content">grip</span>
            </SplitterResizeHandle>
            <SplitterPanel />
          </SplitterGroup>
        `,
      }),
    )
    const handle = wrapper.find('[data-slot="splitter-handle"]')
    expect(handle.find('.custom-handle-content').exists()).toBe(true)
    expect(handle.find('.splitter-handle__bar').exists()).toBe(false)
  })

  // NOTE: The `dragging` event is emitted by reka-ui only in response to real pointer-driven
  // drag interactions measured against actual DOM layout, which jsdom does not implement (see
  // notes on SplitterGroup's `layout` and SplitterPanel's `collapse`/`expand`/`resize` above
  // for the same underlying reason). It is intentionally not asserted here rather than faked
  // with a synthetic emit.
})
