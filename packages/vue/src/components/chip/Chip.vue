<script setup lang="ts">
import { computed } from "vue";
import { chipVariants, type ChipVariants } from "@auronui/styles";
import { composeClassName , type ClassValue} from "../../utils/composeClassName";
import { warnDeprecatedVariant } from '../../utils/warnDeprecated';

const props = withDefaults(
  defineProps<{
    color?: ChipVariants["color"];
    size?: ChipVariants["size"];
    /**
     * Visual style of the chip. The value `'outlined'` is deprecated — use
     * `'bordered'` instead. Kept as prose rather than a JSDoc deprecation
     * tag, which would mark the whole prop deprecated instead of one value.
     */
    variant?: ChipVariants["variant"] | 'outlined';
    /** Show a colored dot indicator before the label */
    dot?: boolean;
    /** Render a built-in close button that emits `close` */
    isClosable?: boolean;
    /** Aria-label for the close button */
    closeAriaLabel?: string;
    class?: ClassValue;
    /** Override classes for named slots */
    classNames?: Partial<{
      base: ClassValue;
      dot: ClassValue;
      startContent: ClassValue;
      label: ClassValue;
      endContent: ClassValue;
      closeButton: ClassValue;
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

const resolvedVariant = computed(() => {
  if (props.variant === 'outlined') {
    warnDeprecatedVariant('Chip', 'outlined', 'bordered')
    return 'bordered' as ChipVariants['variant']
  }
  return props.variant
})

const slotFns = computed(() =>
  chipVariants({
    color: props.color,
    size: props.size,
    variant: resolvedVariant.value,
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

    <!-- Raw <button> (not <CloseButton>): the close affordance is styled via the chipVariants
         'closeButton' slot; <CloseButton> is a full ghost Button with its own sizing that would
         break the chip's visual parity. -->
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
