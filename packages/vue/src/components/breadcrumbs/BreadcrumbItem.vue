<script setup lang="ts">
import { computed, h } from 'vue'
import { useBreadcrumbsInject } from './breadcrumbs.context'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  href?: string
  isLast?: boolean
  class?: string
  /**
   * Per-slot class overrides. Each key maps to a named slot in the component;
   * the value is merged with the generated variant classes via `composeClassName`.
   */
  classNames?: Partial<{
    item: string
    link: string
    separator: string
  }>
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
    :class="composeClassName(ctx.slotFns.value.item(), props.class, props.classNames?.item)"
    :aria-current="props.isLast ? 'page' : undefined"
  >
    <a
      v-if="props.href && !props.isLast"
      :href="props.href"
      :class="composeClassName(ctx.slotFns.value.link(), props.classNames?.link)"
    >
      <slot />
    </a>
    <span
      v-else
      :class="composeClassName(ctx.slotFns.value.link(), props.classNames?.link)"
    >
      <slot />
    </span>
    <span
      v-if="!props.isLast"
      :class="composeClassName(ctx.slotFns.value.separator(), props.classNames?.separator)"
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
