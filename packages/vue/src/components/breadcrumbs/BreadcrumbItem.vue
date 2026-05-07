<script setup lang="ts">
import { computed, h } from 'vue'
import { useBreadcrumbsInject } from './breadcrumbs.context'

const props = withDefaults(defineProps<{
  href?: string
  isLast?: boolean
  class?: string
}>(), {
  isLast: false,
})

const ctx = useBreadcrumbsInject()

// Wrap the separator slot in a functional component so arbitrary VNodes
// (including text nodes) render correctly inside a <template> block.
const SeparatorRenderer = computed(() =>
  ctx.separatorSlot
    ? () => h(() => (ctx.separatorSlot as () => ReturnType<typeof h>[])())
    : null
)
</script>

<template>
  <li
    :class="[ctx.slotFns.value.item(), props.class]"
    :aria-current="props.isLast ? 'page' : undefined"
  >
    <a
      v-if="props.href && !props.isLast"
      :href="props.href"
      :class="ctx.slotFns.value.link()"
    >
      <slot />
    </a>
    <span
      v-else
      :class="ctx.slotFns.value.link()"
    >
      <slot />
    </span>
    <span
      v-if="!props.isLast"
      :class="ctx.slotFns.value.separator()"
      aria-hidden="true"
    >
      <component
        :is="SeparatorRenderer"
        v-if="SeparatorRenderer"
      />
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        focusable="false"
      >
        <polyline points="9 6 15 12 9 18" />
      </svg>
    </span>
  </li>
</template>
