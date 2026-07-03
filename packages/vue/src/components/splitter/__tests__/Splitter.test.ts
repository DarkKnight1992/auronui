import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
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
