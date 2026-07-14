import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { Table } from "@auronui/react";

interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  age: number;
}

function makePeople(n: number): Person[] {
  const roles = ["Engineer", "Designer", "Manager", "PM", "QA", "Ops"];
  const names = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank", "Grace", "Henry", "Iris", "Jack"];
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

const meta: Meta<typeof Table<Person>> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary"] },
    selection: { control: "select", options: ["none", "single", "multiple"] },
  },
  args: {
    variant: "primary",
    selection: "none",
  },
};

export default meta;
type Story = StoryObj<typeof Table<Person>>;

export const Default: Story = {
  render: (args) => <Table {...args} columns={columns} data={makePeople(8)} ariaLabel="People" />,
};

export const Secondary: Story = {
  args: { variant: "secondary", selection: "none" },
  render: (args) => <Table {...args} columns={columns} data={makePeople(8)} ariaLabel="People" />,
};

export const Sortable: Story = {
  name: "Sortable columns",
  render: (args) => <Table {...args} columns={columns} data={makePeople(10)} ariaLabel="Sortable people" />,
};

export const Paginated: Story = {
  render: (args) => (
    <Table
      {...args}
      columns={columns}
      data={makePeople(47)}
      pagination={{ pageSize: 10 }}
      pageSizeOptions={[10, 20, 50]}
      ariaLabel="Paginated people"
    />
  ),
};

export const SingleSelection: Story = {
  name: "Single selection",
  render: (args) => (
    <Table {...args} columns={columns} data={makePeople(10)} selection="single" ariaLabel="Single-select people" />
  ),
};

export const MultipleSelection: Story = {
  name: "Multiple selection",
  render: (args) => (
    <Table {...args} columns={columns} data={makePeople(10)} selection="multiple" ariaLabel="Multi-select people" />
  ),
};

export const EmptyState: Story = {
  name: "Empty state",
  render: (args) => <Table {...args} columns={columns} data={[]} ariaLabel="Empty" />,
};

export const VirtualizedLarge: Story = {
  name: "Virtualized — 10,000 rows",
  render: (args) => (
    <div style={{ height: 500 }}>
      <Table
        {...args}
        columns={columns}
        data={makePeople(10000)}
        virtualRows
        estimatedRowHeight={44}
        selection="multiple"
        ariaLabel="10K people (virtualized)"
      />
    </div>
  ),
};

export const VirtualizedThreshold: Story = {
  name: "Virtualized — auto at > 50 rows",
  render: (args) => (
    <div style={{ height: 500 }}>
      <Table {...args} columns={columns} data={makePeople(100)} virtualRows={50} ariaLabel="100 people (threshold virtualization)" />
    </div>
  ),
};
