<script setup lang="ts">
import { computed } from "vue";
import { kbdVariants, type KbdVariants } from "@auronui/styles";
import { composeClassName , type ClassValue} from "../../utils/composeClassName";

const props = withDefaults(
  defineProps<{
    variant?: KbdVariants["variant"];
    class?: ClassValue;
    /** Override classes on individual slots */
    classNames?: Partial<{
      base: ClassValue;
      abbr: ClassValue;
      content: ClassValue;
    }>;
  }>(),
  {
    variant: "default",
  }
);

const slotFns = computed(() => kbdVariants({ variant: props.variant }));
</script>

<template>
  <kbd :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)">
    <abbr
      v-if="$slots.abbr"
      :class="composeClassName(slotFns.abbr(), props.classNames?.abbr)"
    >
      <slot name="abbr" />
    </abbr>
    <span :class="composeClassName(slotFns.content(), props.classNames?.content)">
      <slot />
    </span>
  </kbd>
</template>
