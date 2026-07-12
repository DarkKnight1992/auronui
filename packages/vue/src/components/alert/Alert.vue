<script setup lang="ts">
import { ref, computed } from 'vue'
import { alertVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { AnimatePresence, motion } from '../../utils/motion'
import CloseButton from '../button/CloseButton.vue'

export type AlertSeverity = 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger'

const props = withDefaults(defineProps<{
  /** Severity/status of the alert */
  severity?: AlertSeverity
  /** Whether the alert can be dismissed by the user */
  isClosable?: boolean
  /** Additional CSS class to merge onto the root element */
  class?: string
}>(), {
  severity: 'default',
  isClosable: false,
})

const emit = defineEmits<{
  /** Emitted when the alert is dismissed */
  (e: 'close'): void
}>()

const isVisible = ref(true)

function dismiss() {
  isVisible.value = false
  emit('close')
}

// Map public severity API to internal @auronui/styles status variant
const statusMap = {
  default: 'default',
  primary: 'primary',
  accent: 'accent',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
} as const

const styles = computed(() =>
  alertVariants({ status: statusMap[props.severity ?? 'default'] }),
)
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-if="isVisible"
      key="alert"
      :initial="{ opacity: 1, height: 'auto' }"
      :animate="{ opacity: 1, height: 'auto' }"
      :exit="{ opacity: 0, height: 0 }"
      :transition="{ duration: 0.2 }"
      style="overflow: hidden;"
    >
      <div
        role="alert"
        :class="composeClassName(styles.base(), props.class)"
      >
        <!-- Icon chip: custom via #icon slot, or a built-in default per severity -->
        <slot name="icon">
          <span
            :class="styles.indicator()"
            aria-hidden="true"
          >
            <!-- default / primary / accent: info circle -->
            <svg
              v-if="severity === 'default' || severity === 'primary' || severity === 'accent'"
              data-slot="alert-default-icon"
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
            <!-- success: check circle -->
            <svg
              v-else-if="severity === 'success'"
              data-slot="alert-default-icon"
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
            <!-- warning: alert triangle -->
            <svg
              v-else-if="severity === 'warning'"
              data-slot="alert-default-icon"
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
            <!-- danger: x circle -->
            <svg
              v-else
              data-slot="alert-default-icon"
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
          </span>
        </slot>

        <!-- Default slot: AlertTitle + AlertDescription -->
        <div :class="styles.content()">
          <slot />
        </div>

        <!-- Close button positioned at the end -->
        <CloseButton
          v-if="isClosable"
          size="sm"
          :color="statusMap[severity ?? 'default']"
          aria-label="Dismiss alert"
          data-slot="close-button"
          @click="dismiss"
        />
      </div>
    </motion.div>
  </AnimatePresence>
</template>
