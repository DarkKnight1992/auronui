<script setup lang="ts">
import data from '../data/components.json';

const props = defineProps<{ name: string }>();
const doc = (data as Record<string, any>)[props.name];
const items = doc?.events ?? [];
</script>

<template>
  <div v-if="!items.length" class="events-table-empty">No events documented for {{ name }}.</div>
  <table v-else class="events-table">
    <thead>
      <tr>
        <th>Event</th>
        <th>Payload Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="e in items" :key="e.name">
        <td><code>{{ e.name }}</code></td>
        <td><code>{{ e.type?.names?.join(' | ') ?? 'unknown' }}</code></td>
        <td>{{ e.description ?? '' }}</td>
      </tr>
    </tbody>
  </table>
</template>
