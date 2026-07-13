<!--
  InputGroup — generic bordered box that visually merges arbitrary content
  (icons, buttons, an InputGroupInput) into a single field-styled unit.

  Unlike Input (which owns a single native <input> plus label/clear/
  password-toggle machinery), InputGroup is agnostic about its children —
  it just provides the shared box + size/invalid/disabled context that
  InputGroupAddon and InputGroupInput read from.

  ─── Usage ──────────────────────────────────────────────────────────────
    <InputGroup>
      <InputGroupAddon><Icon icon="lucide:search" /></InputGroupAddon>
      <InputGroupInput v-model="query" placeholder="Search…" />
      <InputGroupAddon><Button size="sm">Go</Button></InputGroupAddon>
    </InputGroup>
-->
<script setup lang="ts">
import { computed } from 'vue'
import { inputGroupVariants, type InputGroupVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useInputGroupProvide } from './input-group.context'

const props = withDefaults(
  defineProps<{
    /** Field height. @default 'md' */
    size?: InputGroupVariants['size']
    /** Marks the group as invalid. Triggers danger styling. @default false */
    isInvalid?: boolean
    /** Disables the group and everything inside it. @default false */
    isDisabled?: boolean
    /** Stretches the group to 100% width. @default false */
    fullWidth?: boolean
    /** Extra classes merged onto the root box. */
    class?: ClassValue
    /** Per-slot class overrides. */
    classNames?: Partial<{
      base: ClassValue
    }>
  }>(),
  {
    size: 'md',
    isInvalid: false,
    isDisabled: false,
    fullWidth: false,
    class: undefined,
    classNames: undefined,
  },
)

useInputGroupProvide({
  size: computed(() => props.size),
  isInvalid: computed(() => props.isInvalid),
  isDisabled: computed(() => props.isDisabled),
})

const slotFns = computed(() => inputGroupVariants({ size: props.size, fullWidth: props.fullWidth }))
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    data-slot="input-group"
    :data-invalid="isInvalid || undefined"
    :data-disabled="isDisabled || undefined"
  >
    <slot />
  </div>
</template>
