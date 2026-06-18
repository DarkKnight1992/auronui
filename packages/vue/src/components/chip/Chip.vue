<script setup lang="ts">
import { computed } from "vue";
import { chipVariants, type ChipVariants } from "@auronui/styles";
import { composeClassName } from "../../utils/composeClassName";

const props = withDefaults(
  defineProps<{
    color?: ChipVariants["color"];
    size?: ChipVariants["size"];
    variant?: ChipVariants["variant"];
    /** Show a colored dot indicator before the label */
    dot?: boolean;
    /** Render a built-in close button that emits `close` */
    isClosable?: boolean;
    /** Aria-label for the close button */
    closeAriaLabel?: string;
    class?: string;
    /** Override classes for named slots */
    classNames?: Partial<{
      base: string;
      dot: string;
      startContent: string;
      label: string;
      endContent: string;
      closeButton: string;
    }>;
  }>(),
  {
    color: "default",
    variant: "solid",
    dot: false,
    isClosable: false,
    closeAriaLabel: "Remove",
  }
);

const emit = defineEmits<{
  (e: "close"): void;
}>();

const slotFns = computed(() =>
  chipVariants({
    color: props.color,
    size: props.size,
    variant: props.variant,
  })
);
</script>

<template>
  <span :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)">
    <span
      v-if="dot"
      :class="composeClassName(slotFns.dot(), props.classNames?.dot)"
      aria-hidden="true"
    />
    <span
      v-if="$slots.startContent"
      :class="composeClassName(slotFns.startContent(), props.classNames?.startContent)"
      aria-hidden="true"
    >
      <slot name="startContent" />
    </span>

    <span :class="composeClassName(slotFns.label(), props.classNames?.label)">
      <slot />
    </span>

    <span
      v-if="$slots.endContent && !isClosable"
      :class="composeClassName(slotFns.endContent(), props.classNames?.endContent)"
      aria-hidden="true"
    >
      <slot name="endContent" />
    </span>

    <button
      v-if="isClosable"
      type="button"
      :class="composeClassName(slotFns.closeButton(), props.classNames?.closeButton)"
      :aria-label="closeAriaLabel"
      @click="emit('close')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <line
          x1="18"
          y1="6"
          x2="6"
          y2="18"
        />
        <line
          x1="6"
          y1="6"
          x2="18"
          y2="18"
        />
      </svg>
    </button>
  </span>
</template>
