import type { Meta, StoryObj } from '@storybook/vue3'
import { Breadcrumbs, BreadcrumbItem } from '@auronui/vue'

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
}
export default meta
type Story = StoryObj<typeof Breadcrumbs>

export const Default: Story = {
  render: (args) => ({
    components: { Breadcrumbs, BreadcrumbItem },
    setup: () => ({ args }),
    template: `
      <Breadcrumbs v-bind="args">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem href="/products/shoes">Shoes</BreadcrumbItem>
        <BreadcrumbItem>Sneakers</BreadcrumbItem>
      </Breadcrumbs>
    `,
  }),
}

export const Truncated: Story = {
  render: (args) => ({
    components: { Breadcrumbs, BreadcrumbItem },
    setup: () => ({ args }),
    template: `
      <Breadcrumbs v-bind="args" :max-items="3">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/a">Category</BreadcrumbItem>
        <BreadcrumbItem href="/a/b">Subcategory</BreadcrumbItem>
        <BreadcrumbItem href="/a/b/c">Item</BreadcrumbItem>
        <BreadcrumbItem>Detail</BreadcrumbItem>
      </Breadcrumbs>
    `,
  }),
}

export const CustomSeparator: Story = {
  render: (args) => ({
    components: { Breadcrumbs, BreadcrumbItem },
    setup: () => ({ args }),
    template: `
      <Breadcrumbs v-bind="args">
        <template #separator>›</template>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
        <BreadcrumbItem>Guide</BreadcrumbItem>
      </Breadcrumbs>
    `,
  }),
}
