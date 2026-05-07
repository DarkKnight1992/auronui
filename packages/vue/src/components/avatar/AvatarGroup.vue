<script setup lang="ts">
import { computed, toRef, ref, h, Fragment, type VNode } from 'vue'
import { composeClassName } from '../../utils/composeClassName'
import { useAvatarGroupProvide } from './avatar-group.context'
import Avatar from './Avatar.vue'


const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  isBordered?: boolean
  isDisabled?: boolean
  isGrid?: boolean
  max?: number
  total?: number
  renderCount?: (count: number) => string
  class?: string
}>(), {
  size: 'md',
  isBordered: false,
  isDisabled: false,
  isGrid: false,
})

const slots = defineSlots<{
  default?(): VNode[];
}>()

// Provide context using toRef() for reactivity (canonical pattern from ButtonGroup)
useAvatarGroupProvide({
  size: toRef(props, 'size'),
  isBordered: toRef(props, 'isBordered'),
  isDisabled: toRef(props, 'isDisabled'),
  isGrid: toRef(props, 'isGrid'),
  isInGroup: ref(true),
})

const containerClass = computed(() =>
  composeClassName('flex items-center flex-row', props.class)
)

// Flatten slot vnodes (handles Fragments from v-for etc.)
function flattenVNodes(vnodes: VNode[]): VNode[] {
  const result: VNode[] = []
  for (const vnode of vnodes) {
    if (vnode.type === Fragment && Array.isArray(vnode.children)) {
      result.push(...flattenVNodes(vnode.children as VNode[]))
    } else {
      result.push(vnode)
    }
  }
  return result
}

// Determine which vnodes to render when max is set
function getSlicedNodes(): VNode[] {
  const defaultSlot = slots.default?.()
  if (!defaultSlot) return []

  const allNodes = flattenVNodes(defaultSlot)

  if (props.max === undefined) {
    return allNodes
  }

  const visibleNodes = allNodes.slice(0, props.max)
  const totalCount = props.total ?? allNodes.length
  const overflowCount = totalCount - props.max

  if (overflowCount <= 0) {
    return visibleNodes
  }

  const counterLabel = props.renderCount
    ? props.renderCount(overflowCount)
    : `+${overflowCount}`

  // Render counter avatar with a fallback slot so the full label string is shown
  const counterNode = h(Avatar, {}, {
    fallback: () => h('span', { class: 'avatar__name text-xs font-medium leading-none' }, counterLabel),
  })

  return [...visibleNodes, counterNode]
}
</script>

<template>
  <div
    role="group"
    :class="containerClass"
  >
    <template v-if="props.max !== undefined">
      <!-- Use render function output for sliced vnodes -->
      <template
        v-for="(node, _i) in getSlicedNodes()"
        :key="_i"
      >
        <component :is="node" />
      </template>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>
