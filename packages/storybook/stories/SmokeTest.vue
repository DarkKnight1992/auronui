<script setup lang="ts">
import { useIsHydrated, composeClassName, dataAttr } from "@auronui/vue";

const isHydrated = useIsHydrated();

// Test composeClassName (Tailwind class merging)
const className = composeClassName(
  "inline-flex items-center gap-2 rounded px-4 py-2",
  "bg-blue-500 text-white",
);
</script>

<template>
  <div class="p-8 space-y-4">
    <h2 class="text-xl font-semibold">Auron Phase 0 — Smoke Test</h2>

    <div class="space-y-2">
      <p><strong>Hydration:</strong> {{ isHydrated ? "Hydrated" : "Not hydrated (SSR)" }}</p>
      <p><strong>composeClassName:</strong> <code>{{ className }}</code></p>
      <p>
        <strong>dataAttr(true):</strong>
        <code>{{ dataAttr(true) }}</code>
      </p>
      <p>
        <strong>dataAttr(false):</strong>
        <code>{{ String(dataAttr(false)) }}</code>
      </p>
    </div>

    <button
      :class="className"
      :data-hydrated="dataAttr(isHydrated)"
      type="button"
    >
      Smoke Test Button
    </button>
  </div>
</template>
