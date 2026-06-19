<script setup lang="ts">
import { computed } from "vue";
import { badgeVariants, type BadgeVariants } from "@auronui/styles";
import { composeClassName , type ClassValue} from "../../utils/composeClassName";

const props = withDefaults(
  defineProps<{
    color?: BadgeVariants["color"];
    size?: BadgeVariants["size"];
    variant?: BadgeVariants["variant"];
    placement?: BadgeVariants["placement"];
    class?: ClassValue;
    /** Per-slot class name overrides. */
    classNames?: Partial<{
      anchor: ClassValue;
      base: ClassValue;
      label: ClassValue;
    }>;
  }>(),
  {
    color: "default",
    size: "md",
    variant: "primary",
    placement: "top-right",
  }
);

const slotFns = computed(() =>
  badgeVariants({
    color: props.color,
    size: props.size,
    variant: props.variant,
    placement: props.placement,
  })
);
</script>

<template>
  <div :class="composeClassName(slotFns.anchor(), props.classNames?.anchor)">
    <slot />
    <span :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)">
      <span :class="composeClassName(slotFns.label(), props.classNames?.label)">
        <slot name="label" />
      </span>
    </span>
  </div>
</template>
