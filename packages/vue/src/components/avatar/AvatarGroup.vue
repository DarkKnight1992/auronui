<script setup lang="ts">
import { computed, toRef, ref, h, Fragment, type VNode } from 'vue'
import { avatarVariants, type AvatarVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useAvatarGroupProvide } from './avatar-group.context'
import Avatar from './Avatar.vue'

type AvatarShorthandItem = {
  src?: string
  alt?: string
  name?: string
  color?: AvatarVariants['color']
  variant?: AvatarVariants['variant']
  isBordered?: boolean
  isDisabled?: boolean
  showFallback?: boolean
}

const props = withDefaults(defineProps<{
  size?: AvatarVariants['size']
  isBordered?: boolean
  isDisabled?: boolean
  isGrid?: boolean
  max?: number
  total?: number
  renderCount?: (count: number) => string
  class?: string
  /** Shorthand API: render avatars from an array instead of the compound slot API */
  avatars?: AvatarShorthandItem[]
  /** Class overrides forwarded to each shorthand-rendered Avatar's own classNames slots */
  classNames?: Partial<{
    base: ClassValue
    image: ClassValue
    fallback: ClassValue
    icon: ClassValue
    name: ClassValue
  }>
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

const nameSlotClass = computed(() =>
  composeClassName(avatarVariants({ size: props.size }).name(), 'text-xs font-medium leading-none')
)

const visibleAvatars = computed(() => {
  if (!props.avatars) return []
  return props.max !== undefined ? props.avatars.slice(0, props.max) : props.avatars
})
const avatarOverflowCount = computed(() => {
  if (!props.avatars || props.max === undefined) return 0
  const total = props.total ?? props.avatars.length
  return total - props.max
})
const avatarOverflowLabel = computed(() => {
  if (avatarOverflowCount.value <= 0) return ''
  return props.renderCount ? props.renderCount(avatarOverflowCount.value) : `+${avatarOverflowCount.value}`
})

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
  const counterNode = h(Avatar, { classNames: props.classNames }, {
    fallback: () => h('span', { class: nameSlotClass.value }, counterLabel),
  })

  return [...visibleNodes, counterNode]
}
</script>

<template>
  <div
    role="group"
    :class="containerClass"
  >
    <template v-if="props.avatars">
      <Avatar
        v-for="(avatar, idx) in visibleAvatars"
        :key="idx"
        v-bind="avatar"
        :class-names="props.classNames"
      />
      <Avatar
        v-if="avatarOverflowCount > 0"
        :class-names="props.classNames"
      >
        <template #fallback>
          <span :class="nameSlotClass">{{ avatarOverflowLabel }}</span>
        </template>
      </Avatar>
    </template>
    <template v-else-if="props.max !== undefined">
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
