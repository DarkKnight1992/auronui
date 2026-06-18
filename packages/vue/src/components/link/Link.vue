<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { linkVariants, type LinkVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string | object
  href?: string
  target?: string
  rel?: string
  isExternal?: boolean
  disabled?: boolean
  color?: LinkVariants['color']
  underline?: LinkVariants['underline']
  class?: string
  /** Override classes for individual slots */
  classNames?: Partial<{
    base: string
    icon: string
  }>
}>(), {
  as: 'a',
  isExternal: false,
  disabled: false,
})

const slotFns = computed(() => linkVariants({
  color: props.color,
  underline: props.underline,
}))

// isExternal auto-applies target + rel (D-19, T-02-EXT)
// Consumer can override by passing explicit target/rel props
const resolvedTarget = computed(() => {
  if (props.target) return props.target
  if (props.isExternal) return '_blank'
  return undefined
})

const resolvedRel = computed(() => {
  if (props.rel) return props.rel
  if (props.isExternal) return 'noopener noreferrer'
  return undefined
})
</script>

<template>
  <Primitive
    :as="props.as"
    :href="props.href"
    :target="resolvedTarget"
    :rel="resolvedRel"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    :aria-disabled="props.disabled || undefined"
    v-bind="$attrs"
  >
    <slot />
    <!-- External link indicator (D-19): inline SVG glyph, 12x12, aria-hidden -->
    <span
      v-if="props.isExternal"
      :class="composeClassName(slotFns.icon(), props.classNames?.icon)"
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line
          x1="10"
          y1="14"
          x2="21"
          y2="3"
        />
      </svg>
    </span>
  </Primitive>
</template>
