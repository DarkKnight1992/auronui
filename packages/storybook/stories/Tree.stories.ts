import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Tree, TreeItem, TreeItemToggle } from '@auronui/vue'

interface FileNode {
  id: string
  label: string
  icon?: 'folder' | 'file' | 'image' | 'config'
  children?: FileNode[]
}

const fileTree: FileNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      {
        id: 'components',
        label: 'components',
        icon: 'folder',
        children: [
          { id: 'button.vue', label: 'Button.vue', icon: 'file' },
          { id: 'input.vue', label: 'Input.vue', icon: 'file' },
          { id: 'modal.vue', label: 'Modal.vue', icon: 'file' },
        ],
      },
      {
        id: 'utils',
        label: 'utils',
        icon: 'folder',
        children: [
          { id: 'helpers.ts', label: 'helpers.ts', icon: 'file' },
          { id: 'constants.ts', label: 'constants.ts', icon: 'file' },
        ],
      },
      { id: 'main.ts', label: 'main.ts', icon: 'file' },
      { id: 'app.vue', label: 'App.vue', icon: 'file' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    icon: 'folder',
    children: [
      { id: 'favicon.svg', label: 'favicon.svg', icon: 'image' },
    ],
  },
  { id: 'package.json', label: 'package.json', icon: 'config' },
  { id: 'vite.config.ts', label: 'vite.config.ts', icon: 'config' },
]

const iconSvg: Record<string, string> = {
  folder: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  file: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  image: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
  config: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
}

const meta: Meta<typeof Tree> = {
  title: 'Extended/Tree',
  component: Tree,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    multiple: { control: 'boolean' },
    classNames: { control: 'object', description: 'Per-slot class overrides. Keys match the component anatomy slot names.' },
  },
  args: {
    size: 'md',
    multiple: false,
  },
  decorators: [
    () => ({
      template: `<div style="padding: 32px; max-width: 320px;"><story /></div>`,
    }),
  ],
}

export default meta
type Story = StoryObj<typeof Tree>

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Tree, TreeItem, TreeItemToggle } from '@auronui/vue'

const items = [
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

const selected = ref(null)
const expanded = ref(['src'])
</script>

<template>
  <Tree
    :items="items"
    :get-key="(item) => item.id"
    :get-children="(item) => item.children"
    v-model="selected"
    v-model:expanded="expanded"
  >
    <template #default="{ flattenItems }">
      <TreeItem
        v-for="item in flattenItems"
        :key="item._id"
        v-bind="item.bind"
      >
        <template #default="{ isExpanded, hasChildren, toggleClass }">
          <TreeItemToggle :is-expanded="isExpanded" :has-children="hasChildren" :class="toggleClass" />
          <span>{{ item.value.label }}</span>
        </template>
      </TreeItem>
    </template>
  </Tree>
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },

  render: (args) => ({
    components: { Tree, TreeItem, TreeItemToggle },
    setup() {
      const selected = ref<FileNode | null>(null)
      const expanded = ref(['src', 'components'])
      return { args, selected, expanded, fileTree, iconSvg }
    },
    template: `
      <Tree
        v-bind="args"
        :items="fileTree"
        :get-key="(item) => item.id"
        :get-children="(item) => item.children"
        v-model="selected"
        v-model:expanded="expanded"
      >
        <template #default="{ flattenItems }">
          <TreeItem
            v-for="item in flattenItems"
            :key="item._id"
            v-bind="item.bind"
          >
            <template #default="{ isExpanded, hasChildren, toggleClass, iconClass }">
              <TreeItemToggle :is-expanded="isExpanded" :has-children="hasChildren" :class="toggleClass" />
              <span :class="iconClass" v-html="iconSvg[item.value.icon || 'file']" />
              <span>{{ item.value.label }}</span>
            </template>
          </TreeItem>
        </template>
      </Tree>
    `,
  }),
}

export const SingleSelection: Story = {
  args: { size: 'md', multiple: false },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Tree, TreeItem, TreeItemToggle } from '@auronui/vue'

const fileTree = [
  {
    id: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      { id: 'components', label: 'components', icon: 'folder', children: [
        { id: 'button.vue', label: 'Button.vue', icon: 'file' },
        { id: 'input.vue', label: 'Input.vue', icon: 'file' },
      ]},
      { id: 'main.ts', label: 'main.ts', icon: 'file' },
    ],
  },
  { id: 'package.json', label: 'package.json', icon: 'config' },
]

const selected = ref(null)
</script>

<template>
  <Tree
    size="md"
    :multiple="false"
    :items="fileTree"
    :get-key="(item) => item.id"
    :get-children="(item) => item.children"
    v-model="selected"
    :default-expanded="['src']"
  >
    <template #default="{ flattenItems }">
      <TreeItem
        v-for="item in flattenItems"
        :key="item._id"
        v-bind="item.bind"
      >
        <template #default="{ isExpanded, hasChildren, toggleClass }">
          <TreeItemToggle :is-expanded="isExpanded" :has-children="hasChildren" :class="toggleClass" />
          <span>{{ item.value.label }}</span>
        </template>
      </TreeItem>
    </template>
  </Tree>
  <p>Selected: {{ selected?.label ?? 'none' }}</p>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Tree, TreeItem, TreeItemToggle },
    setup() {
      const selected = ref<FileNode | null>(null)
      return { args, selected, fileTree, iconSvg }
    },
    template: `
      <div>
        <Tree
          v-bind="args"
          :items="fileTree"
          :get-key="(item) => item.id"
          :get-children="(item) => item.children"
          v-model="selected"
          :default-expanded="['src']"
        >
          <template #default="{ flattenItems }">
            <TreeItem
              v-for="item in flattenItems"
              :key="item._id"
              v-bind="item.bind"
            >
              <template #default="{ isExpanded, hasChildren, toggleClass, iconClass }">
                <TreeItemToggle :is-expanded="isExpanded" :has-children="hasChildren" :class="toggleClass" />
                <span :class="iconClass" v-html="iconSvg[item.value.icon || 'file']" />
                <span>{{ item.value.label }}</span>
              </template>
            </TreeItem>
          </template>
        </Tree>
        <p style="margin-top:12px;font-size:12px;color:#64748b;font-family:sans-serif;">
          Selected: {{ selected?.label ?? 'none' }}
        </p>
      </div>
    `,
  }),
}

export const MultiSelection: Story = {
  args: { size: 'md', multiple: true },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Tree, TreeItem, TreeItemToggle } from '@auronui/vue'

const fileTree = [
  {
    id: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      { id: 'components', label: 'components', icon: 'folder', children: [
        { id: 'button.vue', label: 'Button.vue', icon: 'file' },
        { id: 'input.vue', label: 'Input.vue', icon: 'file' },
      ]},
      { id: 'main.ts', label: 'main.ts', icon: 'file' },
    ],
  },
  { id: 'package.json', label: 'package.json', icon: 'config' },
]

const selected = ref([])
</script>

<template>
  <Tree
    size="md"
    :multiple="true"
    :items="fileTree"
    :get-key="(item) => item.id"
    :get-children="(item) => item.children"
    v-model="selected"
    :default-expanded="['src', 'components']"
  >
    <template #default="{ flattenItems }">
      <TreeItem
        v-for="item in flattenItems"
        :key="item._id"
        v-bind="item.bind"
      >
        <template #default="{ isExpanded, hasChildren, toggleClass }">
          <TreeItemToggle :is-expanded="isExpanded" :has-children="hasChildren" :class="toggleClass" />
          <span>{{ item.value.label }}</span>
        </template>
      </TreeItem>
    </template>
  </Tree>
  <p>Selected: {{ selected.map(i => i.label).join(', ') || 'none' }}</p>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Tree, TreeItem, TreeItemToggle },
    setup() {
      const selected = ref<FileNode[]>([])
      return { args, selected, fileTree, iconSvg }
    },
    template: `
      <div>
        <Tree
          v-bind="args"
          :items="fileTree"
          :get-key="(item) => item.id"
          :get-children="(item) => item.children"
          v-model="selected"
          :default-expanded="['src', 'components']"
        >
          <template #default="{ flattenItems }">
            <TreeItem
              v-for="item in flattenItems"
              :key="item._id"
              v-bind="item.bind"
            >
              <template #default="{ isExpanded, hasChildren, toggleClass, iconClass }">
                <TreeItemToggle :is-expanded="isExpanded" :has-children="hasChildren" :class="toggleClass" />
                <span :class="iconClass" v-html="iconSvg[item.value.icon || 'file']" />
                <span>{{ item.value.label }}</span>
              </template>
            </TreeItem>
          </template>
        </Tree>
        <p style="margin-top:12px;font-size:12px;color:#64748b;font-family:sans-serif;">
          Selected: {{ selected.map(i => i.label).join(', ') || 'none' }}
        </p>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Tree, TreeItem, TreeItemToggle } from '@auronui/vue'

const simpleTree = [
  {
    id: 'root',
    label: 'project',
    icon: 'folder',
    children: [
      { id: 'index', label: 'index.ts', icon: 'file' },
      { id: 'config', label: 'config.ts', icon: 'config' },
    ],
  },
]
</script>

<template>
  <div style="display:flex;gap:32px;align-items:flex-start;">
    <div v-for="size in ['sm', 'md', 'lg']" :key="size">
      <p style="font-size:12px;color:#64748b;margin-bottom:8px;">size="{{ size }}"</p>
      <Tree
        :size="size"
        :items="simpleTree"
        :get-key="(item) => item.id"
        :get-children="(item) => item.children"
        :default-expanded="['root']"
      >
        <template #default="{ flattenItems }">
          <TreeItem
            v-for="item in flattenItems"
            :key="item._id"
            v-bind="item.bind"
          >
            <template #default="{ isExpanded, hasChildren, toggleClass }">
              <TreeItemToggle :is-expanded="isExpanded" :has-children="hasChildren" :class="toggleClass" />
              <span>{{ item.value.label }}</span>
            </template>
          </TreeItem>
        </template>
      </Tree>
    </div>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: { Tree, TreeItem, TreeItemToggle },
    setup() {
      const simpleTree: FileNode[] = [
        {
          id: 'root',
          label: 'project',
          icon: 'folder',
          children: [
            { id: 'index', label: 'index.ts', icon: 'file' },
            { id: 'config', label: 'config.ts', icon: 'config' },
          ],
        },
      ]
      return { simpleTree, iconSvg, sizes: ['sm', 'md', 'lg'] as const }
    },
    template: `
      <div style="display:flex;gap:32px;align-items:flex-start;">
        <div v-for="size in sizes" :key="size">
          <p style="font-size:12px;color:#64748b;margin-bottom:8px;font-family:sans-serif;">size="{{ size }}"</p>
          <Tree
            :size="size"
            :items="simpleTree"
            :get-key="(item) => item.id"
            :get-children="(item) => item.children"
            :default-expanded="['root']"
          >
            <template #default="{ flattenItems }">
              <TreeItem
                v-for="item in flattenItems"
                :key="item._id"
                v-bind="item.bind"
              >
                <template #default="{ isExpanded, hasChildren, toggleClass, iconClass }">
                  <TreeItemToggle :is-expanded="isExpanded" :has-children="hasChildren" :class="toggleClass" />
                  <span :class="iconClass" v-html="iconSvg[item.value.icon || 'file']" />
                  <span>{{ item.value.label }}</span>
                </template>
              </TreeItem>
            </template>
          </Tree>
        </div>
      </div>
    `,
  }),
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Tree, TreeItem, TreeItemToggle } from '@auronui/vue'

const simpleTree = [
  {
    id: 'root',
    label: 'project',
    icon: 'folder',
    children: [
      { id: 'index', label: 'index.ts', icon: 'file' },
      { id: 'config', label: 'config.ts', icon: 'config' },
    ],
  },
]
</script>

<template>
  <Tree
    :items="simpleTree"
    :get-key="(item) => item.id"
    :get-children="(item) => item.children"
    :default-expanded="['root']"
    :class-names="{
      root: 'border-2 border-blue-500 rounded-lg p-2 bg-blue-50',
    }"
  >
    <template #default="{ flattenItems }">
      <TreeItem
        v-for="item in flattenItems"
        :key="item._id"
        v-bind="item.bind"
        :class-names="{
          item: 'hover:bg-blue-100 rounded-md transition-colors',
          itemContent: 'font-semibold text-blue-900',
        }"
      >
        <template #default="{ isExpanded, hasChildren, toggleClass }">
          <TreeItemToggle
            :is-expanded="isExpanded"
            :has-children="hasChildren"
            :class="toggleClass"
            :class-names="{ itemToggle: 'text-blue-600' }"
          />
          <span>{{ item.value.label }}</span>
        </template>
      </TreeItem>
    </template>
  </Tree>
</template>`,
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: { Tree, TreeItem, TreeItemToggle },
    setup() {
      const simpleTree: FileNode[] = [
        {
          id: 'root',
          label: 'project',
          icon: 'folder',
          children: [
            { id: 'index', label: 'index.ts', icon: 'file' },
            { id: 'config', label: 'config.ts', icon: 'config' },
          ],
        },
      ]
      return { simpleTree, iconSvg }
    },
    template: `
      <Tree
        :items="simpleTree"
        :get-key="(item) => item.id"
        :get-children="(item) => item.children"
        :default-expanded="['root']"
        :class-names="{
          root: 'border-2 border-blue-500 rounded-lg p-2 bg-blue-50',
        }"
      >
        <template #default="{ flattenItems }">
          <TreeItem
            v-for="item in flattenItems"
            :key="item._id"
            v-bind="item.bind"
            :class-names="{
              item: 'hover:bg-blue-100 rounded-md transition-colors',
              itemContent: 'font-semibold text-blue-900',
            }"
          >
            <template #default="{ isExpanded, hasChildren, toggleClass, iconClass }">
              <TreeItemToggle
                :is-expanded="isExpanded"
                :has-children="hasChildren"
                :class="toggleClass"
                :class-names="{ itemToggle: 'text-blue-600' }"
              />
              <span :class="iconClass" v-html="iconSvg[item.value.icon || 'file']" />
              <span>{{ item.value.label }}</span>
            </template>
          </TreeItem>
        </template>
      </Tree>
    `,
  }),
}
