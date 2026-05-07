<script setup lang="ts">
import { computed, ref } from 'vue'
import { AvatarRoot, AvatarImage, AvatarFallback } from 'reka-ui'
import { avatarVariants, type AvatarVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useAvatarGroupInject } from './avatar-group.context'

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  name?: string
  size?: AvatarVariants['size']
  color?: AvatarVariants['color']
  variant?: AvatarVariants['variant']
  isBordered?: boolean
  isDisabled?: boolean
  showFallback?: boolean
  class?: string
}>(), {
  isBordered: false,
  isDisabled: false,
  showFallback: false,
})

// Inject AvatarGroup context with ref-based fallbacks (mirrors Button.vue pattern)
const groupCtx = useAvatarGroupInject({
  size: ref('md'),
  isBordered: ref(false),
  isDisabled: ref(false),
  isGrid: ref(false),
  isInGroup: ref(false),
})

// Prop precedence rules (matching ButtonGroup D-13):
// - group disabled ALWAYS wins over child prop
// - other props: child prop wins over group value (child ?? group)
const finalSize = computed(() => props.size ?? groupCtx.size.value)
const finalIsBordered = computed(() => props.isBordered || groupCtx.isBordered.value)
const isDisabled = computed(() => groupCtx.isDisabled.value || props.isDisabled)
const isInGroup = computed(() => groupCtx.isInGroup.value)

// Compute initials from name: first letter of up to 2 words
const initials = computed(() => {
  if (!props.name) return ''
  const parts = props.name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

const slotFns = computed(() =>
  avatarVariants({
    size: finalSize.value,
    color: props.color,
    variant: props.variant,
  })
)

// Border class applied manually since the styles don't have isBordered variant
const borderedClass = computed(() =>
  finalIsBordered.value ? 'ring-2 ring-offset-2 ring-default' : undefined
)

// InGroup class for negative margin overlap
const inGroupClass = computed(() =>
  isInGroup.value ? '-me-2' : undefined
)
</script>

<template>
  <AvatarRoot
    :class="composeClassName(slotFns.base(), borderedClass, inGroupClass, props.class)"
    :data-disabled="isDisabled || undefined"
    :data-bordered="finalIsBordered || undefined"
  >
    <AvatarImage
      v-if="props.src && !props.showFallback"
      :src="props.src"
      :alt="props.alt ?? props.name ?? ''"
      :class="slotFns.image()"
    />
    <!--
      delayMs: only pass a value when we have a src — Reka UI treats delayMs=undefined
      as "show immediately" (canRender starts true). Passing delayMs=0 is falsy but
      not undefined, so the timeout never fires and fallback stays hidden forever.
    -->
    <AvatarFallback
      :class="slotFns.fallback()"
      v-bind="props.src && !props.showFallback ? { 'delay-ms': 600 } : {}"
    >
      <slot name="fallback">
        <span
          v-if="initials"
          :class="'avatar__name text-xs font-medium leading-none'"
        >{{ initials }}</span>
        <svg
          v-else
          class="avatar__icon size-4/5"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </slot>
    </AvatarFallback>
  </AvatarRoot>
</template>
