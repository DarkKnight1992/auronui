<script setup lang="ts">
import { computed } from 'vue'
import { SelectTrigger, SelectIcon, injectSelectRootContext } from 'reka-ui'
import { useSelectInject } from './Select.context'

withDefaults(defineProps<{
  class?: string
}>(), {
  class: undefined,
})

const ctx = useSelectInject()
const rootContext = injectSelectRootContext()

const isFilled = computed(() => {
  const v = rootContext?.modelValue?.value
  if (v == null) return false
  if (Array.isArray(v)) return v.length > 0
  return v !== ''
})

const showInsideLabel = computed(
  () => ctx.hasLabel.value && ctx.labelPlacement.value === 'inside',
)
</script>

<template>
  <SelectTrigger
    :id="ctx.triggerId.value"
    :class="ctx.slots.value.trigger()"
    :data-filled="isFilled || undefined"
    :data-invalid="ctx.isInvalid.value || undefined"
    :data-readonly="ctx.isReadonly.value || undefined"
    :aria-invalid="ctx.isInvalid.value || undefined"
    :aria-describedby="ctx.ariaDescribedBy.value"
    data-slot="trigger"
  >
    <label
      v-if="showInsideLabel"
      :for="ctx.triggerId.value"
      :class="ctx.slots.value.label()"
    >{{ ctx.label.value }}<span
      v-if="ctx.isRequired.value"
      aria-hidden="true"
    > *</span></label>
    <span
      v-if="$slots.startContent"
      :class="ctx.slots.value.startContent()"
      data-slot="start-content"
    >
      <slot name="startContent" />
    </span>
    <slot />
    <SelectIcon
      :class="ctx.slots.value.indicator()"
      data-slot="select-default-indicator"
    >
      <slot name="selectorIcon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </slot>
    </SelectIcon>
  </SelectTrigger>
</template>
