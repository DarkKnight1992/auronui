import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import Tree from '../Tree.vue'
import TreeItem from '../TreeItem.vue'
import TreeItemToggle from '../TreeItemToggle.vue'

describe('Tree', () => {
  // Reka UI's TreeRoot only exposes `disabled` via injected context for
  // descendants to consume (no DOM data-disabled/aria-disabled is rendered
  // on the root itself in this version) — so the observable contract we can
  // verify is that the resolved boolean is correctly forwarded as the
  // `disabled` prop on the underlying TreeRoot primitive.
  it('deprecated bare disabled prop resolves to true and is forwarded to TreeRoot', () => {
    const items: Record<string, unknown>[] = [{ id: '1', label: 'Item 1' }]
    const wrapper = mount(Tree, {
      props: {
        items,
        getKey: (item: Record<string, unknown>) => item.id as string,
        disabled: true,
      },
    })
    const treeRoot = wrapper.findComponent({ name: 'TreeRoot' })
    expect(treeRoot.exists()).toBe(true)
    expect(treeRoot.props('disabled')).toBe(true)
    wrapper.unmount()
  })

  it('Test 0: canonical isDisabled prop resolves to true and is forwarded to TreeRoot', () => {
    const items: Record<string, unknown>[] = [{ id: '1', label: 'Item 1' }]
    const wrapper = mount(Tree, {
      props: {
        items,
        getKey: (item: Record<string, unknown>) => item.id as string,
        isDisabled: true,
      },
    })
    const treeRoot = wrapper.findComponent({ name: 'TreeRoot' })
    expect(treeRoot.exists()).toBe(true)
    expect(treeRoot.props('disabled')).toBe(true)
    wrapper.unmount()
  })
})

interface FileNode {
  id: string
  label: string
  children?: FileNode[]
}

const fileTree: FileNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'main.ts', label: 'main.ts' },
      { id: 'app.vue', label: 'App.vue' },
    ],
  },
  { id: 'package.json', label: 'package.json' },
]

// Shared composed-usage template mirroring the real Storybook consumer
// pattern (Tree.stories.ts): iterate `flattenItems` from Tree's default
// scoped slot, spread `item.bind` onto TreeItem, render TreeItemToggle +
// label inside TreeItem's own scoped slot.
const TREE_TEMPLATE = `
  <Tree
    :items="fileTree"
    :get-key="(i) => i.id"
    :get-children="(i) => i.children"
    v-bind="treeProps"
    v-model="selected"
    v-model:expanded="expanded"
  >
    <template #default="{ flattenItems }">
      <TreeItem
        v-for="item in flattenItems"
        :key="item._id"
        v-bind="item.bind"
        @select="onSelect"
        @toggle="onToggle"
      >
        <template #default="{ isExpanded, hasChildren, toggleClass }">
          <TreeItemToggle :is-expanded="isExpanded" :has-children="hasChildren" :class="toggleClass" />
          <span>{{ item.value.label }}</span>
        </template>
      </TreeItem>
    </template>
  </Tree>
`

describe('Tree — composed with TreeItem', () => {
  it('Test 1: renders data-slot="tree" on the root', () => {
    const wrapper = mount(Tree, {
      props: {
        items: fileTree,
        getKey: (item: Record<string, any>) => item.id as string,
        getChildren: (item: Record<string, any>) => item.children as FileNode[] | undefined,
      },
    })
    expect(wrapper.find('[data-slot="tree"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('Test 2: renders root-level items via getKey/getChildren as composed TreeItem rows, nested children hidden until expanded', () => {
    const Wrapper = defineComponent({
      components: { Tree, TreeItem, TreeItemToggle },
      setup() {
        const selected = ref<FileNode | null>(null)
        const expanded = ref<string[]>([])
        return { fileTree, selected, expanded, treeProps: {}, onSelect: () => {}, onToggle: () => {} }
      },
      template: TREE_TEMPLATE,
    })
    const wrapper = mount(Wrapper)
    expect(wrapper.findAll('[data-slot="tree-item"]')).toHaveLength(2)
    wrapper.unmount()
  })

  it('Test 3: defaultExpanded reveals nested children as additional composed TreeItem rows', () => {
    const Wrapper = defineComponent({
      components: { Tree, TreeItem, TreeItemToggle },
      setup() {
        const selected = ref<FileNode | null>(null)
        const expanded = ref<string[]>(['src'])
        return { fileTree, selected, expanded, treeProps: {}, onSelect: () => {}, onToggle: () => {} }
      },
      template: TREE_TEMPLATE,
    })
    const wrapper = mount(Wrapper)
    // src, main.ts, app.vue, package.json
    expect(wrapper.findAll('[data-slot="tree-item"]')).toHaveLength(4)
    wrapper.unmount()
  })

  it('Test 4: clicking a parent item with children emits update:expanded + update:modelValue and reveals its children', async () => {
    const Wrapper = defineComponent({
      components: { Tree, TreeItem, TreeItemToggle },
      setup() {
        const selected = ref<FileNode | null>(null)
        const expanded = ref<string[]>([])
        return { fileTree, selected, expanded, treeProps: {}, onSelect: () => {}, onToggle: () => {} }
      },
      template: TREE_TEMPLATE,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const rows = wrapper.findAll('[data-slot="tree-item"]')
    await rows[0]!.trigger('click') // 'src' folder row (has children)
    await nextTick()

    const vm = wrapper.vm as unknown as { selected: FileNode | null, expanded: string[] }
    expect(vm.expanded).toContain('src')
    expect(vm.selected?.id).toBe('src')
    expect(wrapper.findAll('[data-slot="tree-item"]')).toHaveLength(4)
    wrapper.unmount()
  })

  it('Test 5: multiple selection accumulates clicked items into the modelValue array', async () => {
    const Wrapper = defineComponent({
      components: { Tree, TreeItem, TreeItemToggle },
      setup() {
        const selected = ref<FileNode[]>([])
        const expanded = ref<string[]>([])
        return { fileTree, selected, expanded, treeProps: { multiple: true }, onSelect: () => {}, onToggle: () => {} }
      },
      template: TREE_TEMPLATE,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })

    let rows = wrapper.findAll('[data-slot="tree-item"]')
    await rows[0]!.trigger('click') // selects + expands 'src'
    await nextTick()

    rows = wrapper.findAll('[data-slot="tree-item"]') // src, main.ts, app.vue, package.json
    await rows[3]!.trigger('click') // selects 'package.json'
    await nextTick()

    const vm = wrapper.vm as unknown as { selected: FileNode[] }
    expect(vm.selected.map(i => i.id).sort()).toEqual(['package.json', 'src'])
    wrapper.unmount()
  })
})

describe('TreeItem', () => {
  it('Test 6: data-slot="tree-item" is present on each composed row, data-selected/data-expanded and --tree-indent reflect state and level', () => {
    const Wrapper = defineComponent({
      components: { Tree, TreeItem, TreeItemToggle },
      setup() {
        const selected = ref<FileNode | null>(fileTree[0]!) // 'src' selected
        const expanded = ref<string[]>(['src'])
        return { fileTree, selected, expanded, treeProps: {}, onSelect: () => {}, onToggle: () => {} }
      },
      template: TREE_TEMPLATE,
    })
    const wrapper = mount(Wrapper)
    const rows = wrapper.findAll('[data-slot="tree-item"]')
    // rows: src (level 1, selected + expanded), main.ts (level 2), app.vue (level 2), package.json (level 1)
    const srcRow = rows[0]!
    expect(srcRow.attributes('data-slot')).toBe('tree-item')
    const srcContent = srcRow.find('div')
    expect(srcContent.attributes('data-selected')).toBe('')
    expect(srcContent.attributes('data-expanded')).toBe('')
    expect(srcContent.element.style.getPropertyValue('--tree-indent').trim()).toBe('0') // level 1 -> 0

    const childRow = rows[1]!
    const childContent = childRow.find('div')
    expect(childContent.attributes('data-selected')).toBeUndefined()
    expect(childContent.attributes('data-expanded')).toBeUndefined()
    expect(childContent.element.style.getPropertyValue('--tree-indent').trim()).toBe('1') // level 2 -> 1

    const packageRow = rows[3]!
    expect(packageRow.find('div').element.style.getPropertyValue('--tree-indent').trim()).toBe('0') // level 1 -> 0
    wrapper.unmount()
  })

  it('Test 7b: pressing Enter on a focused parent row toggles expansion, matching click behavior', async () => {
    const Wrapper = defineComponent({
      components: { Tree, TreeItem, TreeItemToggle },
      setup() {
        const selected = ref<FileNode | null>(null)
        const expanded = ref<string[]>([])
        return { fileTree, selected, expanded, treeProps: {}, onSelect: () => {}, onToggle: () => {} }
      },
      template: TREE_TEMPLATE,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const srcRow = wrapper.findAll('[data-slot="tree-item"]')[0]!
    expect(wrapper.findAll('[data-slot="tree-item"]')).toHaveLength(2)

    await srcRow.trigger('keydown', { key: 'Enter' })
    await nextTick()

    const vm = wrapper.vm as unknown as { expanded: string[] }
    expect(vm.expanded).toContain('src')
    expect(wrapper.findAll('[data-slot="tree-item"]')).toHaveLength(4)
    wrapper.unmount()
  })

  it('Test 7c: pressing Space on a focused leaf row (no children) does not attempt to toggle', async () => {
    const Wrapper = defineComponent({
      components: { Tree, TreeItem, TreeItemToggle },
      setup() {
        const selected = ref<FileNode | null>(null)
        const expanded = ref<string[]>([])
        return { fileTree, selected, expanded, treeProps: {}, onSelect: () => {}, onToggle: () => {} }
      },
      template: TREE_TEMPLATE,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const packageRow = wrapper.findAll('[data-slot="tree-item"]')[1]! // 'package.json', no children
    await packageRow.trigger('keydown', { key: ' ' })
    await nextTick()
    expect(wrapper.findAll('[data-slot="tree-item"]')).toHaveLength(2)
    wrapper.unmount()
  })

  it('Test 7a: pressing Enter on a focused parent row emits the toggle event, not just select (regression: keyboard toggle bypassed the toggle emit)', async () => {
    // Reka-ui's exposed handleToggle() mutates internal expand state directly
    // without going through the component's own `toggle` emit — a consumer
    // relying on @toggle (e.g. to lazy-load children only once expanded)
    // must still be notified for keyboard-driven expansion, matching click.
    const selectSpy = vi.fn()
    const toggleSpy = vi.fn()
    const Wrapper = defineComponent({
      components: { Tree, TreeItem, TreeItemToggle },
      setup() {
        const selected = ref<FileNode | null>(null)
        const expanded = ref<string[]>([])
        return { fileTree, selected, expanded, treeProps: {}, onSelect: selectSpy, onToggle: toggleSpy }
      },
      template: TREE_TEMPLATE,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const srcRow = wrapper.findAll('[data-slot="tree-item"]')[0]!
    await srcRow.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(toggleSpy).toHaveBeenCalledTimes(1)
    expect(selectSpy).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('Test 7: TreeItem emits select and toggle together on row click interaction', async () => {
    // reka-ui's TreeItem fires both select and toggle from a single row click
    // handler; toggle only mutates expanded state when the item has children,
    // but the event itself always fires regardless.
    const selectSpy = vi.fn()
    const toggleSpy = vi.fn()
    const Wrapper = defineComponent({
      components: { Tree, TreeItem, TreeItemToggle },
      setup() {
        const selected = ref<FileNode | null>(null)
        const expanded = ref<string[]>([])
        return { fileTree, selected, expanded, treeProps: {}, onSelect: selectSpy, onToggle: toggleSpy }
      },
      template: TREE_TEMPLATE,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const rows = wrapper.findAll('[data-slot="tree-item"]')
    await rows[0]!.trigger('click') // 'src' folder row
    await nextTick()
    expect(selectSpy).toHaveBeenCalledTimes(1)
    expect(toggleSpy).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })
})

describe('TreeItemToggle', () => {
  it('Test 8: data-expanded reflects the isExpanded prop', () => {
    const expandedWrapper = mount(TreeItemToggle, { props: { isExpanded: true } })
    expect(expandedWrapper.attributes('data-expanded')).toBe('')
    expandedWrapper.unmount()

    const collapsedWrapper = mount(TreeItemToggle, { props: { isExpanded: false } })
    expect(collapsedWrapper.attributes('data-expanded')).toBeUndefined()
    collapsedWrapper.unmount()
  })

  it('Test 9: data-no-children reflects the hasChildren prop', () => {
    const leafWrapper = mount(TreeItemToggle, { props: { hasChildren: false } })
    expect(leafWrapper.attributes('data-no-children')).toBe('')
    leafWrapper.unmount()

    const branchWrapper = mount(TreeItemToggle, { props: { hasChildren: true } })
    expect(branchWrapper.attributes('data-no-children')).toBeUndefined()
    branchWrapper.unmount()
  })

  it('Test 10: renders the fallback chevron svg when no slot content is provided', () => {
    const wrapper = mount(TreeItemToggle)
    expect(wrapper.find('svg').exists()).toBe(true)
    wrapper.unmount()
  })

  it('Test 11: renders custom slot content instead of the fallback chevron', () => {
    const wrapper = mount(TreeItemToggle, {
      slots: { default: '<span class="custom-icon">*</span>' },
    })
    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.find('span.custom-icon').exists()).toBe(true)
    wrapper.unmount()
  })
})
