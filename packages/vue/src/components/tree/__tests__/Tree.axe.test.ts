import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import axe from 'axe-core'
import Tree from '../Tree.vue'
import TreeItem from '../TreeItem.vue'
import TreeItemToggle from '../TreeItemToggle.vue'

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

describe('Tree axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('Axe Test 1: multi-level tree with one expanded node and one selected node passes axe', async () => {
    const Wrapper = defineComponent({
      components: { Tree, TreeItem, TreeItemToggle },
      setup() {
        // 'main.ts' (nested, level 2) selected; 'src' (level 1) expanded.
        const selected = ref<FileNode | null>(fileTree[0]!.children![0]!)
        const expanded = ref<string[]>(['src'])
        return { fileTree, selected, expanded }
      },
      template: `
        <Tree
          :items="fileTree"
          :get-key="(i) => i.id"
          :get-children="(i) => i.children"
          aria-label="File tree"
          v-model="selected"
          v-model:expanded="expanded"
        >
          <template #default="{ flattenItems }">
            <TreeItem v-for="item in flattenItems" :key="item._id" v-bind="item.bind">
              <template #default="{ isExpanded, hasChildren, toggleClass }">
                <TreeItemToggle :is-expanded="isExpanded" :has-children="hasChildren" :class="toggleClass" />
                <span>{{ item.value.label }}</span>
              </template>
            </TreeItem>
          </template>
        </Tree>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
