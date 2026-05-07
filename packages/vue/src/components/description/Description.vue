<script setup lang="ts">
import { computed } from "vue";
import { descriptionVariants } from "@auronui/styles";
import { composeClassName } from "../../utils/composeClassName";

const props = withDefaults(
  defineProps<{
    id?: string;
    class?: string;
  }>(),
  {},
);

const classes = computed(() => composeClassName(descriptionVariants(), props.class));
</script>

<template>
  <p
    :id="props.id"
    :class="classes"
  >
    <slot />
  </p>
</template>
