<script setup lang="ts">
import { computed } from "vue";
import { headerVariants } from "@auronui/styles";
import { composeClassName } from "../../utils/composeClassName";

const props = withDefaults(
  defineProps<{
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    class?: string;
  }>(),
  {
    as: "h2",
  },
);

const classes = computed(() => composeClassName(headerVariants(), props.class));
</script>

<template>
  <component
    :is="props.as"
    :class="classes"
  >
    <slot />
  </component>
</template>
