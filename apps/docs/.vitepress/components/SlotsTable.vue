<script setup lang="ts">
import data from '../data/components.json';

const props = defineProps<{ name: string }>();
const doc = (data as Record<string, any>)[props.name];
const items = doc?.slots ?? [];
</script>

<template>
  <div v-if="!items.length" class="slots-table-empty">No slots documented for {{ name }}.</div>
  <table v-else class="slots-table">
    <thead>
      <tr>
        <th>Slot</th>
        <th>Scoped</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="s in items" :key="s.name">
        <td><code>{{ s.name }}</code></td>
        <td>{{ s.scoped ? 'yes' : 'no' }}</td>
        <td>{{ s.description ?? '' }}</td>
      </tr>
    </tbody>
  </table>
</template>
