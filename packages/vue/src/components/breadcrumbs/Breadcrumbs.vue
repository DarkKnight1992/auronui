<script setup lang="ts">
import { computed, h, cloneVNode, type VNode } from 'vue'
import { breadcrumbsVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useBreadcrumbsProvide } from './breadcrumbs.context'
import BreadcrumbItem from './BreadcrumbItem.vue'

type BreadcrumbShorthandItem = { label: string; href?: string }

const props = withDefaults(defineProps<{
  maxItems?: number
  class?: ClassValue
  /** Override classes on any named slot. */
  classNames?: Partial<{
    base: ClassValue
    item: ClassValue
    link: ClassValue
    separator: ClassValue
  }>
  /** Shorthand API: render breadcrumb items from an array instead of the compound slot API */
  items?: BreadcrumbShorthandItem[]
}>(), {})

const slots = defineSlots<{
  default?(): VNode[];
  separator?(): VNode;
}>();

const slotFns = computed(() => breadcrumbsVariants({}))

// Flatten default slot children into an array of VNodes we can iterate.
function flattenChildren(nodes: VNode[] | undefined): VNode[] {
  if (!nodes) return []
  const out: VNode[] = []
  for (const n of nodes) {
    // Skip comment / text whitespace nodes; detect Fragment by string representation
    if (typeof n.type === 'symbol' && String(n.type) === 'Symbol(v-fgt)') {
      out.push(...flattenChildren((n.children as VNode[]) ?? []))
    } else if (n.type && typeof n.type !== 'symbol') {
      out.push(n)
    }
  }
  return out
}

const renderedChildren = computed(() => {
  const raw = slots.default?.() ?? []
  const items = flattenChildren(raw as VNode[])
  const max = props.maxItems
  let list = items
  if (max && items.length > max && max >= 2) {
    const first = items[0]
    const last = items.slice(items.length - (max - 2))
    const ellipsis = h(
      'li',
      { class: composeClassName(slotFns.value.item(), props.classNames?.item), 'aria-hidden': 'true' },
      '…'
    )
    list = [first, ellipsis, ...last]
  }
  // Clone the last BreadcrumbItem VNode with isLast prop set
  if (list.length > 0) {
    const lastIdx = list.length - 1
    list = list.map((vnode, idx) =>
      idx === lastIdx ? cloneVNode(vnode, { isLast: true }) : vnode
    )
  }
  return list
})

const total = computed(() => renderedChildren.value.length)

const renderedItems = computed((): BreadcrumbShorthandItem[] => {
  if (!props.items) return []
  const max = props.maxItems
  if (!max || props.items.length <= max || max < 2) return props.items
  const first = props.items[0]
  const tail = props.items.slice(props.items.length - (max - 2))
  return [first, { label: '…' }, ...tail]
})

useBreadcrumbsProvide({
  slotFns,
  total,
  separatorSlot: slots.separator,
})
</script>

<template>
  <nav
    aria-label="Breadcrumb"
    :class="props.class"
  >
    <ol :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)">
      <template v-if="props.items">
        <BreadcrumbItem
          v-for="(item, idx) in renderedItems"
          :key="idx"
          :href="item.href"
          :is-last="idx === renderedItems.length - 1"
          :class-names="{ item: props.classNames?.item, link: props.classNames?.link, separator: props.classNames?.separator }"
        >
          {{ item.label }}
        </BreadcrumbItem>
      </template>
      <template v-else>
        <component
          :is="child"
          v-for="(child, idx) in renderedChildren"
          :key="idx"
        />
      </template>
    </ol>
  </nav>
</template>
