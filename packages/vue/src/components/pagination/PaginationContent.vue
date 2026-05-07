<script setup lang="ts">
import { computed } from 'vue'
import { PaginationList } from 'reka-ui'
import { paginationVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { usePaginationInject, paginationContextDefaults } from './pagination.context'

const props = defineProps<{
  class?: string
}>()

const ctx = usePaginationInject(paginationContextDefaults)

const styles = computed(() => paginationVariants({ size: ctx.size.value }))

const hasPreviousPage = computed(() => ctx.beforeCursor.value !== null)
const hasNextPage = computed(() => ctx.afterCursor.value !== null)
</script>

<template>
  <!-- Numeric mode: delegate to Reka UI PaginationList which computes the range -->
  <PaginationList
    v-if="ctx.type.value === 'numeric'"
    v-slot="{ items }"
    :class="composeClassName(styles.content(), props.class)"
  >
    <slot :items="items" />
  </PaginationList>

  <!-- Cursor mode: render Before / page info / After layout -->
  <div
    v-else
    :class="composeClassName(styles.content(), props.class)"
    role="group"
    aria-label="Cursor pagination"
  >
    <button
      type="button"
      :class="composeClassName(styles.link(), 'pagination__link--nav')"
      :disabled="!hasPreviousPage || ctx.disabled.value"
      :data-disabled="(!hasPreviousPage || ctx.disabled.value) || undefined"
      aria-label="Before page"
      @click="ctx.onCursorChange(ctx.beforeCursor.value, null)"
    >
      <slot name="before">
        Before
      </slot>
    </button>

    <span :class="styles.summary?.()">
      <slot name="page-info">Page {{ ctx.page.value }}</slot>
    </span>

    <button
      type="button"
      :class="composeClassName(styles.link(), 'pagination__link--nav')"
      :disabled="!hasNextPage || ctx.disabled.value"
      :data-disabled="(!hasNextPage || ctx.disabled.value) || undefined"
      aria-label="After page"
      @click="ctx.onCursorChange(null, ctx.afterCursor.value)"
    >
      <slot name="after">
        After
      </slot>
    </button>
  </div>
</template>
