<script setup lang="ts">
import { useIsHydrated, useIsMounted, dataAttr } from "@auronui/vue";

const isHydrated = useIsHydrated();
const isMounted = useIsMounted();
</script>

<template>
  <div data-testid="smoke-test" :data-hydrated="dataAttr(isHydrated)">
    <p data-testid="hydration-state">
      {{ isHydrated ? "Client: hydrated" : "Server: not yet hydrated" }}
    </p>
    <p data-testid="mount-state">
      {{ isMounted ? "Mounted" : "Not mounted" }}
    </p>
  </div>
</template>
