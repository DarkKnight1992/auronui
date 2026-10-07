<script setup lang="ts">
import type { ClassValue } from '../../utils/composeClassName'
import { computed } from "vue";
import { textVariants, type TextVariants } from "@auronui/styles";
import { composeClassName } from "../../utils/composeClassName";

const props = withDefaults(
  defineProps<{
    as?: string;
    size?: TextVariants["size"];
    variant?: TextVariants["variant"];
    class?: ClassValue;
  }>(),
  {
    as: "p",
    size: "base",
    variant: "default",
  },
);

const classes = computed(() =>
  composeClassName(
    textVariants({ size: props.size, variant: props.variant }),
    props.class,
  ),
);
</script>

<template>
  <component
    :is="props.as"
    :class="classes"
  >
    <slot />
  </component>
</template>
