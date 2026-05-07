<script setup lang="ts">
import { computed } from "vue";
import { kbdVariants, type KbdVariants } from "@auronui/styles";
import { composeClassName } from "../../utils/composeClassName";

const props = withDefaults(
  defineProps<{
    variant?: KbdVariants["variant"];
    class?: string;
  }>(),
  {
    variant: "default",
  }
);

const slotFns = computed(() => kbdVariants({ variant: props.variant }));
</script>

<template>
  <kbd :class="composeClassName(slotFns.base(), props.class)">
    <abbr
      v-if="$slots.abbr"
      :class="slotFns.abbr()"
    >
      <slot name="abbr" />
    </abbr>
    <span :class="slotFns.content()">
      <slot />
    </span>
  </kbd>
</template>
