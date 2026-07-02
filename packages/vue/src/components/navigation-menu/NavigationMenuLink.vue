<script setup lang="ts">
import { linkVariants, type LinkVariants } from '@auronui/styles'
import { NavigationMenuLink } from 'reka-ui'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  href?: string
  target?: string
  rel?: string
  /** Identifies this link as the currently active page. */
  active?: boolean
  color?: LinkVariants['color']
  underline?: LinkVariants['underline']
  class?: ClassValue
  /** Render as a different element or component. @default 'a' */
  as?: string | object
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>(), {
  href: undefined,
  target: undefined,
  rel: undefined,
  active: undefined,
  color: undefined,
  underline: undefined,
  class: undefined,
  as: 'a',
  asChild: undefined,
})

const emit = defineEmits<{
  select: [payload: CustomEvent<{ originalEvent: Event }>]
}>()

const slotFns = linkVariants({
  color: props.color,
  underline: props.underline,
})
</script>

<template>
  <NavigationMenuLink
    :href="props.href"
    :target="props.target"
    :rel="props.rel"
    :active="props.active"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.base(), props.class)"
    @select="emit('select', $event)"
  >
    <slot />
  </NavigationMenuLink>
</template>
