<script setup lang="ts">
import type { ClassValue } from '../../utils/composeClassName'
import { computed } from "vue";
import { labelVariants } from "@auronui/styles";
import { composeClassName } from "../../utils/composeClassName";

const props = withDefaults(
  defineProps<{
    for?: string;
    isDisabled?: boolean;
    isInvalid?: boolean;
    isRequired?: boolean;
    class?: ClassValue;
  }>(),
  {
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
  },
);

const classes = computed(() =>
  composeClassName(
    labelVariants({
      isDisabled: props.isDisabled,
      isInvalid: props.isInvalid,
      isRequired: props.isRequired,
    }),
    props.class,
  ),
);
</script>

<template>
  <label
    :class="classes"
    :for="props.for"
  >
    <slot />
  </label>
</template>
