<script setup lang="ts">
import { alertDialogVariants } from '@auronui/styles/components/alert-dialog'
import { composeClassName } from '../../utils/composeClassName'
import { useAlertDialogInject } from './AlertDialog.vue'

const props = withDefaults(defineProps<{
  class?: string
  status?: 'default' | 'accent' | 'danger' | 'success' | 'warning'
}>(), {})

const ctx = useAlertDialogInject({ size: 'md', variant: 'opaque', placement: 'center', status: 'danger' })
const styles = alertDialogVariants()

const resolvedStatus = () => props.status ?? ctx.status
</script>

<template>
  <span
    :class="composeClassName(styles.icon({ status: resolvedStatus() }), props.class)"
    aria-hidden="true"
  >
    <slot>
      <svg
        v-if="resolvedStatus() === 'danger'"
        data-slot="alert-dialog-default-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
        />
        <path d="m9 9 6 6" />
        <path d="m15 9-6 6" />
      </svg>
      <svg
        v-else-if="resolvedStatus() === 'warning'"
        data-slot="alert-dialog-default-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 3.5 2.8 19.5a1.2 1.2 0 0 0 1 1.8h16.4a1.2 1.2 0 0 0 1-1.8L12 3.5Z" />
        <path d="M12 10v4" />
        <path d="M12 17.5h.01" />
      </svg>
      <svg
        v-else-if="resolvedStatus() === 'success'"
        data-slot="alert-dialog-default-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
        />
        <path d="m8.5 12.5 2.5 2.5 4.5-5" />
      </svg>
      <svg
        v-else
        data-slot="alert-dialog-default-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
        />
        <path d="M12 8h.01" />
        <path d="M11 12h1v4h1" />
      </svg>
    </slot>
  </span>
</template>
