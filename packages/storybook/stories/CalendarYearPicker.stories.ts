import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { CalendarDate } from "@internationalized/date";
import { CalendarYearPicker } from "@auronui/vue";

const meta: Meta<typeof CalendarYearPicker> = {
  component: CalendarYearPicker,
  title: "Components/CalendarYearPicker",
  tags: ["autodocs"],
  argTypes: {
    yearsPerPage: { control: "number" },
    readonly: { control: "boolean" },
    disabled: { control: "boolean" },
    locale: { control: "text" },
  },
  args: {
    yearsPerPage: 12,
    readonly: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof CalendarYearPicker>;

export const Default: Story = {};

export const WithSelected: Story = {
  args: {
    defaultValue: new CalendarDate(2024, 1, 1),
  },
};

export const MinMax: Story = {
  args: {
    defaultValue: new CalendarDate(2024, 1, 1),
    minValue: new CalendarDate(2020, 1, 1),
    maxValue: new CalendarDate(2028, 1, 1),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: new CalendarDate(2024, 1, 1),
  },
};

export const CustomYearsPerPage: Story = {
  args: {
    yearsPerPage: 9,
    defaultValue: new CalendarDate(2024, 1, 1),
  },
};
