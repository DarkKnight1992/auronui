import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import {
  Button,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrev,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
} from "@auronui/vue";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  title: "Components/Pagination",
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    type: { control: "select", options: ["numeric", "cursor"] },
    page: { control: "number" },
    itemsPerPage: { control: "number" },
    totalItems: { control: "number" },
    siblingCount: { control: "number" },
    showEdges: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    size: "md",
    type: "numeric",
    page: 1,
    itemsPerPage: 10,
    totalItems: 50,
    siblingCount: 2,
    showEdges: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// Shared pagination template for numeric mode with all 8 parts
const numericTemplate = `
  <Pagination v-bind="args">
    <PaginationContent v-slot="{ items }">
      <PaginationFirst v-if="args.showEdges" />
      <PaginationPrev />
      <template v-for="item in items" :key="item.type === 'page' ? item.value : ('e-' + item.value)">
        <PaginationItem v-if="item.type === 'page'" :value="item.value" />
        <PaginationEllipsis v-else />
      </template>
      <PaginationNext />
      <PaginationLast v-if="args.showEdges" />
    </PaginationContent>
  </Pagination>
`;

/** Story 1: Numeric — Small (5 pages, size=sm) */
export const NumericSmall: Story = {
  name: "Numeric — Small",
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrev,
  PaginationNext,
  PaginationEllipsis,
} from '@auronui/vue'
</script>

<template>
  <Pagination size="sm" :total-items="50" :items-per-page="10" :page="1">
    <PaginationContent v-slot="{ items }">
      <PaginationPrev />
      <template v-for="item in items" :key="item.type === 'page' ? item.value : ('e-' + item.value)">
        <PaginationItem v-if="item.type === 'page'" :value="item.value" />
        <PaginationEllipsis v-else />
      </template>
      <PaginationNext />
    </PaginationContent>
  </Pagination>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationItem,
      PaginationPrev,
      PaginationNext,
      PaginationFirst,
      PaginationLast,
      PaginationEllipsis,
    },
    setup: () => ({ args: { ...args, size: "sm", totalItems: 50, itemsPerPage: 10 } }),
    template: numericTemplate,
  }),
  args: { size: "sm", totalItems: 50, page: 1 },
};

/** Story 2: Numeric — Default (10 pages, shows ellipsis, showEdges) */
export const NumericDefault: Story = {
  name: "Numeric — Default (with Ellipsis)",
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrev,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
} from '@auronui/vue'
</script>

<template>
  <Pagination size="md" :total-items="100" :items-per-page="10" :page="5" :show-edges="true" :sibling-count="2">
    <PaginationContent v-slot="{ items }">
      <PaginationFirst />
      <PaginationPrev />
      <template v-for="item in items" :key="item.type === 'page' ? item.value : ('e-' + item.value)">
        <PaginationItem v-if="item.type === 'page'" :value="item.value" />
        <PaginationEllipsis v-else />
      </template>
      <PaginationNext />
      <PaginationLast />
    </PaginationContent>
  </Pagination>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationItem,
      PaginationPrev,
      PaginationNext,
      PaginationFirst,
      PaginationLast,
      PaginationEllipsis,
    },
    setup: () => ({ args: { ...args, totalItems: 100, itemsPerPage: 10, showEdges: true, siblingCount: 2 } }),
    template: numericTemplate,
  }),
  args: { size: "md", totalItems: 100, page: 5, showEdges: true, siblingCount: 2 },
};

/** Story 3: Numeric — Large (50 pages, size=lg, showEdges) */
export const NumericLarge: Story = {
  name: "Numeric — Large (50 pages)",
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrev,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
} from '@auronui/vue'
</script>

<template>
  <Pagination size="lg" :total-items="500" :items-per-page="10" :page="25" :show-edges="true" :sibling-count="1">
    <PaginationContent v-slot="{ items }">
      <PaginationFirst />
      <PaginationPrev />
      <template v-for="item in items" :key="item.type === 'page' ? item.value : ('e-' + item.value)">
        <PaginationItem v-if="item.type === 'page'" :value="item.value" />
        <PaginationEllipsis v-else />
      </template>
      <PaginationNext />
      <PaginationLast />
    </PaginationContent>
  </Pagination>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationItem,
      PaginationPrev,
      PaginationNext,
      PaginationFirst,
      PaginationLast,
      PaginationEllipsis,
    },
    setup: () => ({ args: { ...args, size: "lg", totalItems: 500, itemsPerPage: 10, showEdges: true, siblingCount: 1, page: 25 } }),
    template: numericTemplate,
  }),
  args: { size: "lg", totalItems: 500, page: 25, showEdges: true, siblingCount: 1 },
};

/** Story 4: Numeric — Disabled (Prev on page 1, Next on last page) */
export const NumericDisabledBoundaries: Story = {
  name: "Numeric — Disabled Boundaries",
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrev,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
} from '@auronui/vue'
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <p class="mb-2 text-xs text-gray-500">Page 1 — Prev/First disabled:</p>
      <Pagination :page="1" :items-per-page="10" :total-items="50" :show-edges="true">
        <PaginationContent v-slot="{ items }">
          <PaginationFirst />
          <PaginationPrev />
          <template v-for="item in items" :key="item.type === 'page' ? item.value : 'ellipsis'">
            <PaginationItem v-if="item.type === 'page'" :value="item.value" />
            <PaginationEllipsis v-else />
          </template>
          <PaginationNext />
          <PaginationLast />
        </PaginationContent>
      </Pagination>
    </div>
    <div>
      <p class="mb-2 text-xs text-gray-500">Page 5 — Next/Last disabled:</p>
      <Pagination :page="5" :items-per-page="10" :total-items="50" :show-edges="true">
        <PaginationContent v-slot="{ items }">
          <PaginationFirst />
          <PaginationPrev />
          <template v-for="item in items" :key="item.type === 'page' ? item.value : 'ellipsis'">
            <PaginationItem v-if="item.type === 'page'" :value="item.value" />
            <PaginationEllipsis v-else />
          </template>
          <PaginationNext />
          <PaginationLast />
        </PaginationContent>
      </Pagination>
    </div>
    <div>
      <p class="mb-2 text-xs text-gray-500">Globally disabled:</p>
      <Pagination :page="3" :items-per-page="10" :total-items="50" :disabled="true">
        <PaginationContent v-slot="{ items }">
          <PaginationPrev />
          <template v-for="item in items" :key="item.type === 'page' ? item.value : 'ellipsis'">
            <PaginationItem v-if="item.type === 'page'" :value="item.value" />
          </template>
          <PaginationNext />
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationItem,
      PaginationPrev,
      PaginationNext,
      PaginationFirst,
      PaginationLast,
      PaginationEllipsis,
    },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <p style="margin-bottom: 8px; font-size: 13px; color: #666;">Page 1 — Prev/First disabled:</p>
          <Pagination v-bind="args" :page="1" :items-per-page="10" :total-items="50" :show-edges="true">
            <PaginationContent v-slot="{ items }">
              <PaginationFirst />
              <PaginationPrev />
              <template v-for="item in items" :key="item.type === 'page' ? item.value : 'ellipsis'">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" />
                <PaginationEllipsis v-else />
              </template>
              <PaginationNext />
              <PaginationLast />
            </PaginationContent>
          </Pagination>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 13px; color: #666;">Page 5 — Next/Last disabled:</p>
          <Pagination v-bind="args" :page="5" :items-per-page="10" :total-items="50" :show-edges="true">
            <PaginationContent v-slot="{ items }">
              <PaginationFirst />
              <PaginationPrev />
              <template v-for="item in items" :key="item.type === 'page' ? item.value : 'ellipsis'">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" />
                <PaginationEllipsis v-else />
              </template>
              <PaginationNext />
              <PaginationLast />
            </PaginationContent>
          </Pagination>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 13px; color: #666;">Globally disabled:</p>
          <Pagination v-bind="args" :page="3" :items-per-page="10" :total-items="50" :disabled="true">
            <PaginationContent v-slot="{ items }">
              <PaginationPrev />
              <template v-for="item in items" :key="item.type === 'page' ? item.value : 'ellipsis'">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" />
              </template>
              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    `,
  }),
};

/** Story 5: Cursor mode */
export const CursorMode: Story = {
  name: "Cursor Mode",
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Pagination, PaginationContent } from '@auronui/vue'

const beforeCursor = ref<string | null>(null)
const afterCursor = ref<string | null>('cursor_page2')
const pageInfo = ref('Page 1')

function onCursorChange(before: string | null, after: string | null) {
  beforeCursor.value = before
  afterCursor.value = after
  pageInfo.value = before ? 'Page 2+' : 'Page 1'
}
</script>

<template>
  <Pagination
    type="cursor"
    :page="1"
    :items-per-page="10"
    :total-items="100"
    :before-cursor="beforeCursor"
    :after-cursor="afterCursor"
    @update:cursor="onCursorChange"
  >
    <PaginationContent>
      <template #page-info>{{ pageInfo }}</template>
    </PaginationContent>
  </Pagination>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Pagination, PaginationContent },
    setup() {
      const beforeCursor = ref<string | null>(null);
      const afterCursor = ref<string | null>("cursor_page2");
      const pageInfo = ref("Page 1");

      function onCursorChange(before: string | null, after: string | null) {
        beforeCursor.value = before;
        afterCursor.value = after;
        pageInfo.value = before ? "Page 2+" : "Page 1";
      }

      return { args, beforeCursor, afterCursor, pageInfo, onCursorChange };
    },
    template: `
      <div>
        <p style="margin-bottom: 12px; font-size: 13px; color: #666;">
          Cursor mode — relay-style pagination (before/after cursors).
          Before: {{ beforeCursor ?? 'null' }}, After: {{ afterCursor ?? 'null' }}
        </p>
        <Pagination
          v-bind="args"
          type="cursor"
          :page="1"
          :items-per-page="10"
          :total-items="100"
          :before-cursor="beforeCursor"
          :after-cursor="afterCursor"
          @update:cursor="onCursorChange"
        >
          <PaginationContent>
            <template #page-info>{{ pageInfo }}</template>
          </PaginationContent>
        </Pagination>
      </div>
    `,
  }),
};

/** Story 6: Interactive — v-model:page with controls */
export const Interactive: Story = {
  name: "Interactive — v-model:page",
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import {
  Button,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrev,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
} from '@auronui/vue'

const page = ref(1)
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-gray-500">Current page: <strong>{{ page }}</strong></p>
    <Pagination
      v-model:page="page"
      :items-per-page="10"
      :total-items="100"
      :show-edges="true"
      :sibling-count="2"
    >
      <PaginationContent v-slot="{ items }">
        <PaginationFirst />
        <PaginationPrev />
        <template v-for="item in items" :key="item.type === 'page' ? item.value : ('e-' + item.value)">
          <PaginationItem v-if="item.type === 'page'" :value="item.value" />
          <PaginationEllipsis v-else />
        </template>
        <PaginationNext />
        <PaginationLast />
      </PaginationContent>
    </Pagination>
    <div class="flex flex-wrap gap-2">
      <Button
        v-for="p in [1, 3, 5, 7, 10]"
        :key="p"
        variant="flat"
        size="sm"
        @click="page = p"
      >
        Jump to {{ p }}
      </Button>
    </div>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: {
      Button,
      Pagination,
      PaginationContent,
      PaginationItem,
      PaginationPrev,
      PaginationNext,
      PaginationFirst,
      PaginationLast,
      PaginationEllipsis,
    },
    setup() {
      const page = ref(1);
      return { args, page };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="font-size: 13px; color: #666;">Current page: <strong>{{ page }}</strong></p>
        <Pagination
          v-bind="args"
          v-model:page="page"
          :items-per-page="10"
          :total-items="100"
          :show-edges="true"
          :sibling-count="2"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationFirst />
            <PaginationPrev />
            <template v-for="item in items" :key="item.type === 'page' ? item.value : ('e-' + item.value)">
              <PaginationItem v-if="item.type === 'page'" :value="item.value" />
              <PaginationEllipsis v-else />
            </template>
            <PaginationNext />
            <PaginationLast />
          </PaginationContent>
        </Pagination>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <Button
            v-for="p in [1, 3, 5, 7, 10]"
            :key="p"
            variant="flat"
            size="sm"
            @click="page = p"
          >
            Jump to {{ p }}
          </Button>
        </div>
      </div>
    `,
  }),
};

/** Story 7: All Sizes comparison */
export const AllSizes: Story = {
  name: "All Sizes",
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrev,
  PaginationNext,
} from '@auronui/vue'
</script>

<template>
  <div class="flex flex-col gap-6">
    <div v-for="size in ['sm', 'md', 'lg']" :key="size">
      <p class="mb-2 text-xs font-semibold uppercase text-gray-500">{{ size }}</p>
      <Pagination :page="3" :items-per-page="10" :total-items="50" :size="size">
        <PaginationContent v-slot="{ items }">
          <PaginationPrev />
          <template v-for="item in items" :key="item.type === 'page' ? item.value : 'ellipsis'">
            <PaginationItem v-if="item.type === 'page'" :value="item.value" />
          </template>
          <PaginationNext />
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationItem,
      PaginationPrev,
      PaginationNext,
    },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div v-for="size in ['sm', 'md', 'lg']" :key="size">
          <p style="margin-bottom: 8px; font-size: 13px; color: #666; text-transform: uppercase; font-weight: 600;">{{ size }}</p>
          <Pagination v-bind="args" :page="3" :items-per-page="10" :total-items="50" :size="size">
            <PaginationContent v-slot="{ items }">
              <PaginationPrev />
              <template v-for="item in items" :key="item.type === 'page' ? item.value : 'ellipsis'">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" />
              </template>
              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    `,
  }),
};
