import type { Meta, StoryObj } from "@storybook/vue3-vite";
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxContent,
  ComboBoxItem,
  ComboBoxEmpty,
} from "@auronui/vue";

const meta: Meta<typeof ComboBox> = {
  component: ComboBox,
  title: "Components/ComboBox",
  tags: ["autodocs"],
  argTypes: {
    fullWidth: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
  },
  args: {
    fullWidth: false,
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
  },
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
  { value: "kiwi", label: "Kiwi" },
  { value: "lemon", label: "Lemon" },
];

const animals = [
  { value: "cat", label: "Cat" },
  { value: "dog", label: "Dog" },
  { value: "elephant", label: "Elephant" },
  { value: "fox", label: "Fox" },
  { value: "giraffe", label: "Giraffe" },
];

const disabledFruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana", isDisabled: true },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date", isDisabled: true },
  { value: "elderberry", label: "Elderberry" },
];

export const Default: Story = {
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox v-bind="args" :items="items" label="Favorite Fruit" aria-label="Favorite fruit picker">
        <ComboBoxInput placeholder="Search a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            
          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
};

export const WithDescription: Story = {
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox
        v-bind="args"
        :items="items"
        label="Favorite Fruit"
        description="Choose your favorite fruit from the list."
        aria-label="Favorite fruit picker"
      >
        <ComboBoxInput placeholder="Search a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            
          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
};

export const WithErrorMessage: Story = {
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox
        v-bind="args"
        :items="items"
        label="Favorite Fruit"
        error-message="Please select a valid fruit."
        :is-invalid="true"
        aria-label="Favorite fruit picker"
      >
        <ComboBoxInput placeholder="Search a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            
          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
};

export const WithDisabledItems: Story = {
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: disabledFruits }),
    template: `
      <ComboBox v-bind="args" :items="items" label="Favorite Fruit" aria-label="Favorite fruit picker">
        <ComboBoxInput placeholder="Search a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            
            :is-disabled="item.isDisabled"
          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox v-bind="args" :items="items" label="Favorite Fruit" :is-disabled="true" aria-label="Favorite fruit picker">
        <ComboBoxInput placeholder="Search a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            
          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
  args: { isDisabled: true },
};

export const Required: Story = {
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox v-bind="args" :items="items" label="Favorite Fruit" :is-required="true" aria-label="Favorite fruit picker">
        <ComboBoxInput placeholder="Search a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            
          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
  args: { isRequired: true },
};

export const AllowsCustomValue: Story = {
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox v-bind="args" :items="items" label="Favorite Fruit" :allows-custom-value="true" aria-label="Favorite fruit picker">
        <ComboBoxInput placeholder="Type anything..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            
          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No match — your input will be used as-is</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
  args: { allowsCustomValue: true },
};

export const FullWidth: Story = {
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox v-bind="args" :items="items" label="Favorite Fruit" :full-width="true" aria-label="Favorite fruit picker">
        <ComboBoxInput placeholder="Search a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            
          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
  args: { fullWidth: true },
};

export const MultipleCategories: Story = {
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, fruits, animals }),
    template: `
      <div style="display: flex; gap: 24px; flex-wrap: wrap;">
        <ComboBox v-bind="args" :items="fruits" label="Fruits" aria-label="Fruit picker">
          <ComboBoxInput placeholder="Search fruits..." />
          <ComboBoxContent>
            <ComboBoxItem
              v-for="item in fruits"
              :key="item.value"
              :value="item.value"
              
            >
              {{ item.label }}
            </ComboBoxItem>
            <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
          </ComboBoxContent>
        </ComboBox>
        <ComboBox v-bind="args" :items="animals" label="Animals" aria-label="Animal picker">
          <ComboBoxInput placeholder="Search animals..." />
          <ComboBoxContent>
            <ComboBoxItem
              v-for="item in animals"
              :key="item.value"
              :value="item.value"
              
            >
              {{ item.label }}
            </ComboBoxItem>
            <ComboBoxEmpty>No animals found</ComboBoxEmpty>
          </ComboBoxContent>
        </ComboBox>
      </div>
    `,
  }),
};

export const Controlled: Story = {
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup() {
      const { ref } = window.Vue ?? { ref: () => ({ value: "" }) }
      const selected = ref("")
      return { args, items: fruits, selected }
    },
    template: `
      <div>
        <ComboBox
          v-bind="args"
          :items="items"
          :model-value="selected"
          @update:model-value="selected = $event"
          label="Favorite Fruit"
          aria-label="Controlled fruit picker"
        >
          <ComboBoxInput placeholder="Search a fruit..." />
          <ComboBoxContent>
            <ComboBoxItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              
            >
              {{ item.label }}
            </ComboBoxItem>
            <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
          </ComboBoxContent>
        </ComboBox>
        <p style="margin-top: 12px; font-size: 14px; color: #64748b;">
          Selected: <strong>{{ selected || '(none)' }}</strong>
        </p>
      </div>
    `,
  }),
};
