<script setup lang="ts">
import { computed } from "vue";
import { badgeVariants, type BadgeVariants } from "@auronui/styles";
import { composeClassName } from "../../utils/composeClassName";

const props = withDefaults(
  defineProps<{
    color?: BadgeVariants["color"];
    size?: BadgeVariants["size"];
    variant?: BadgeVariants["variant"];
    placement?: BadgeVariants["placement"];
    class?: string;
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
  <div :class="slotFns.anchor()">
    <slot />
    <span :class="composeClassName(slotFns.base(), props.class)">
      <span :class="slotFns.label()">
        <slot name="label" />
      </span>
    </span>
  </div>
</template>
