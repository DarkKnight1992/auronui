<script setup lang="ts">
import { toRef, useId } from 'vue'
import { TagsInputRoot } from 'reka-ui'
import { tagGroupVariants, type TagVariants } from '@auronui/styles'
import { useTagGroupProvide } from './TagGroup.context'
import TagGroupInput from './TagGroupInput.vue'

const props = withDefaults(defineProps<{
  modelValue?: string[]
  defaultValue?: string[]
  label?: string
  placeholder?: string
  description?: string
  errorMessage?: string
  isInvalid?: boolean
  isDisabled?: boolean
  readOnly?: boolean
  isRequired?: boolean
  allowsDuplicates?: boolean
  maxTags?: number
  delimiter?: string | RegExp
  variant?: TagVariants['variant']
  size?: TagVariants['size']
  class?: string
}>(), {
  modelValue: undefined,
  defaultValue: () => [],
  label: undefined,
  placeholder: 'Add a tag',
  description: undefined,
  errorMessage: undefined,
  isInvalid: false,
  isDisabled: false,
  readOnly: false,
  isRequired: false,
  allowsDuplicates: false,
  maxTags: undefined,
  delimiter: ',',
  variant: 'default',
  size: 'md',
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  'add': [value: string]
  'remove': [value: string]
  'invalid': [value: string]
}>()

const labelId = useId()

const slotFns = tagGroupVariants()

// Provide context to child Tag components
useTagGroupProvide({
  variant: toRef(props, 'variant'),
  size: toRef(props, 'size'),
  isDisabled: toRef(props, 'isDisabled'),
  readOnly: toRef(props, 'readOnly'),
})

function onUpdateModelValue(value: string[]) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div
    :class="slotFns.base()"
    :data-invalid="props.isInvalid || undefined"
    :data-required="props.isRequired || undefined"
    :data-disabled="props.isDisabled || undefined"
    :data-readonly="props.readOnly || undefined"
    data-slot="tag-group"
  >
    <!-- Label -->
    <label
      v-if="props.label"
      :id="labelId"
      class="text-sm font-medium text-default-foreground w-fit"
      data-slot="label"
    >
      {{ props.label }}
      <span
        v-if="props.isRequired"
        aria-hidden="true"
      > *</span>
    </label>

    <!-- TagsInput root from Reka UI -->
    <TagsInputRoot
      :model-value="props.modelValue"
      :default-value="props.defaultValue"
      :disabled="props.isDisabled"
      :max="props.maxTags ?? 0"
      :delimiter="props.delimiter"
      :duplicate="props.allowsDuplicates"
      :aria-labelledby="props.label ? labelId : undefined"
      :aria-invalid="props.isInvalid || undefined"
      :aria-required="props.isRequired || undefined"
      :class="slotFns.list()"
      @update:model-value="onUpdateModelValue"
    >
      <!-- Slotted Tag components -->
      <slot />

      <!-- Embedded input — hidden when readOnly -->
      <TagGroupInput
        v-if="!props.readOnly"
        :placeholder="props.placeholder"
      />
    </TagsInputRoot>

    <!-- Helper text area -->
    <div
      v-if="props.description || (props.isInvalid && props.errorMessage)"
      class="flex flex-col gap-0.5 px-1"
      data-slot="helper-wrapper"
    >
      <p
        v-if="props.isInvalid && props.errorMessage"
        class="text-sm text-danger"
        data-slot="error-message"
        aria-live="polite"
      >
        {{ props.errorMessage }}
      </p>
      <p
        v-else-if="props.description"
        class="text-sm text-default-400"
        data-slot="description"
      >
        {{ props.description }}
      </p>
    </div>
  </div>
</template>
