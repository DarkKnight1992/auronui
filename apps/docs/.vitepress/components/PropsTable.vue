<script setup lang="ts">
import data from '../data/components.json';

const props = defineProps<{ name: string }>();
const doc = (data as Record<string, any>)[props.name];
const items = doc?.props ?? [];
</script>

<template>
  <div v-if="!items.length" class="props-table-empty">No props documented for {{ name }}.</div>
  <table v-else class="props-table">
    <thead>
      <tr>
        <th>Prop</th>
        <th>Type</th>
        <th>Default</th>
        <th>Required</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in items" :key="p.name">
        <td><code>{{ p.name }}</code></td>
        <td><code>{{ p.type?.name ?? 'unknown' }}</code></td>
        <td><code>{{ p.defaultValue?.value ?? '—' }}</code></td>
        <td>{{ p.required ? 'yes' : 'no' }}</td>
        <td>{{ p.description ?? '' }}</td>
      </tr>
    </tbody>
  </table>
</template>
