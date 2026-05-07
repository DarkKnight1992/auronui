<script setup lang="ts">
import { computed, inject } from 'vue'
import { TagsInputItem } from 'reka-ui'
import { tagVariants, type TagVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { tagGroupContextKey } from '../tag-group/TagGroup.context'
import TagText from './TagText.vue'
import TagDelete from './TagDelete.vue'

const props = withDefaults(defineProps<{
  value: string
  textValue?: string
  isDisabled?: boolean
  /** Override group-level read-only; when true, delete button is hidden */
  isReadOnly?: boolean
  variant?: TagVariants['variant']
  size?: TagVariants['size']
  class?: string
}>(), {
  textValue: undefined,
  isDisabled: undefined,
  isReadOnly: undefined,
  variant: undefined,
  size: undefined,
  class: undefined,
})

const emit = defineEmits<{
  remove: [value: string]
}>()

// Inject group context — graceful fallback (Tag can be used standalone)
const groupCtx = inject(tagGroupContextKey, null)

const resolvedVariant = computed(
  () => props.variant ?? groupCtx?.variant.value ?? 'default',
)
const resolvedSize = computed(
  () => props.size ?? groupCtx?.size.value ?? 'md',
)
const resolvedIsDisabled = computed(
  () => props.isDisabled ?? groupCtx?.isDisabled.value ?? false,
)
const resolvedReadOnly = computed(
  () => props.isReadOnly ?? groupCtx?.readOnly.value ?? false,
)

const slotFns = computed(() =>
  tagVariants({
    variant: resolvedVariant.value,
    size: resolvedSize.value,
  }),
)

const showDelete = computed(() => !resolvedReadOnly.value && !resolvedIsDisabled.value)

function onRemove() {
  emit('remove', props.value)
}
</script>

<template>
  <TagsInputItem
    :value="value"
    :disabled="resolvedIsDisabled || undefined"
    :class="composeClassName(slotFns.base(), props.class)"
    data-slot="tag"
  >
    <TagText>
      <slot>{{ textValue ?? value }}</slot>
    </TagText>
    <TagDelete
      v-if="showDelete"
      @remove="onRemove"
    />
  </TagsInputItem>
</template>
