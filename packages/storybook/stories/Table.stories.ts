import type { Meta, StoryObj } from "@storybook/vue3-vite";
import type { ColumnDef } from "@tanstack/vue-table";
import { Table } from "@auronui/vue";

interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  age: number;
}

function makePeople(n: number): Person[] {
  const roles = ["Engineer", "Designer", "Manager", "PM", "QA", "Ops"];
  const names = [
    "Alice",
    "Bob",
    "Charlie",
    "Dave",
    "Eve",
    "Frank",
    "Grace",
    "Henry",
    "Iris",
    "Jack",
  ];
  return Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    name: `${names[i % names.length]} ${Math.floor(i / names.length) + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    age: 22 + (i % 40),
  }));
}

const columns: ColumnDef<Person, unknown>[] = [
  { id: "name", accessorKey: "name", header: "Name", enableSorting: true },
  { id: "email", accessorKey: "email", header: "Email", enableSorting: true },
  { id: "role", accessorKey: "role", header: "Role", enableSorting: true },
  { id: "age", accessorKey: "age", header: "Age", enableSorting: true },
];

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: Table as any,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary"] },
    selection: { control: "select", options: ["none", "single", "multiple"] },
    classNames: {
      control: "object",
      description:
        "Per-slot class overrides. Keys match the component anatomy slot names (base, scrollContainer).",
    },
  },
  args: {
    variant: "primary",
    selection: "none",
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: (args) => ({
    components: { Table },
    setup() {
      return { args, columns, data: makePeople(8) };
    },
    template:
      '<Table v-bind="args" :columns="columns" :data="data" ariaLabel="People" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Table } from '@auronui/vue'
import type { ColumnDef } from '@tanstack/vue-table'

interface Person {
  id: string
  name: string
  email: string
  role: string
}

const columns: ColumnDef<Person, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name', enableSorting: true },
  { id: 'email', accessorKey: 'email', header: 'Email', enableSorting: true },
  { id: 'role', accessorKey: 'role', header: 'Role', enableSorting: true },
]

const data: Person[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Engineer' },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'Designer' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'Manager' },
]
</script>

<template>
  <Table :columns="columns" :data="data" ariaLabel="People" />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
};

export const Secondary: Story = {
  args: { variant: "secondary", selection: "none" },
  render: (args) => ({
    components: { Table },
    setup() {
      return { args, columns, data: makePeople(8) };
    },
    template:
      '<Table v-bind="args" :columns="columns" :data="data" ariaLabel="People" />',
  }),
};

export const Sortable: Story = {
  name: "Sortable columns",
  render: (args) => ({
    components: { Table },
    setup() {
      return { args, columns, data: makePeople(10) };
    },
    template:
      '<Table v-bind="args" :columns="columns" :data="data" ariaLabel="Sortable people" />',
  }),
};

export const SingleSelection: Story = {
  name: "Single selection",
  render: (args) => ({
    components: { Table },
    setup() {
      return { args, columns, data: makePeople(10) };
    },
    template: `
      <Table
        v-bind="args"
        :columns="columns"
        :data="data"
        selection="single"
        ariaLabel="Single-select people"
      />
    `,
  }),
};

export const MultipleSelection: Story = {
  name: "Multiple selection",
  render: (args) => ({
    components: { Table },
    setup() {
      return { args, columns, data: makePeople(10) };
    },
    template: `
      <Table
        v-bind="args"
        :columns="columns"
        :data="data"
        selection="multiple"
        ariaLabel="Multi-select people"
      />
    `,
  }),
};

export const EmptyState: Story = {
  name: "Empty state",
  render: (args) => ({
    components: { Table },
    setup() {
      return { args, columns, data: [] };
    },
    template: '<Table v-bind="args" :columns="columns" :data="data" ariaLabel="Empty" />',
  }),
};

export const VirtualizedLarge: Story = {
  name: "Virtualized — 10,000 rows",
  render: (args) => ({
    components: { Table },
    setup() {
      return { args, columns, data: makePeople(10000) };
    },
    template: `
      <div style="height: 500px">
        <Table
          v-bind="args"
          :columns="columns"
          :data="data"
          :virtualRows="true"
          :estimatedRowHeight="44"
          selection="multiple"
          ariaLabel="10K people (virtualized)"
        />
      </div>
    `,
  }),
};

export const VirtualizedThreshold: Story = {
  name: "Virtualized — auto at > 50 rows",
  render: (args) => ({
    components: { Table },
    setup() {
      return { args, columns, data: makePeople(100) };
    },
    template: `
      <div style="height: 500px">
        <Table
          v-bind="args"
          :columns="columns"
          :data="data"
          :virtualRows="50"
          ariaLabel="100 people (threshold virtualization)"
        />
      </div>
    `,
  }),
};

export const CustomCellRendering: Story = {
  name: "Custom cell rendering",
  render: (args) => ({
    components: { Table },
    setup() {
      return { args, columns, data: makePeople(5) };
    },
    template: `
      <Table v-bind="args" :columns="columns" :data="data" ariaLabel="Custom cells">
        <template #cell="{ row, column, value }">
          <span v-if="column.id === 'email'">
            <a :href="'mailto:' + value">{{ value }}</a>
          </span>
          <span v-else-if="column.id === 'age'">
            <strong>{{ value }} yrs</strong>
          </span>
          <span v-else>{{ value }}</span>
        </template>
      </Table>
    `,
  }),
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  render: (args) => ({
    components: { Table },
    setup() {
      return {
        args,
        columns,
        data: makePeople(5),
        customClassNames: {
          base: "border-2 border-blue-500 rounded-lg shadow-lg",
          scrollContainer: "bg-blue-50",
        },
      };
    },
    template: `
      <Table
        v-bind="args"
        :columns="columns"
        :data="data"
        :class-names="customClassNames"
        ariaLabel="Custom styled table"
      />
    `,
  }),
};
