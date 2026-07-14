import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarDate } from "@internationalized/date";
import { YearRangePicker } from "@auronui/react";

const meta: Meta<typeof YearRangePicker> = {
  title: "Components/YearRangePicker",
  component: YearRangePicker,
  tags: ["autodocs"],
  argTypes: {
    yearsPerPage: { control: "number" },
    isReadOnly: { control: "boolean" },
    isDisabled: { control: "boolean" },
    locale: { control: "text" },
    maximumYears: { control: "number" },
    fixedDate: {
      control: "select",
      options: [undefined, "start", "end"],
    },
    classNames: {
      control: "object",
      description: "Per-slot class overrides. Keys match the component anatomy slot names.",
    },
  },
  args: {
    yearsPerPage: 12,
    isReadOnly: false,
    isDisabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof YearRangePicker>;

export const Default: Story = {
  render: (args) => <YearRangePicker {...args} />,
};

export const WithSelectedRange: Story = {
  args: {
    defaultValue: {
      start: new CalendarDate(2020, 1, 1),
      end: new CalendarDate(2024, 1, 1),
    },
  },
  render: (args) => <YearRangePicker {...args} />,
};

export const MinMax: Story = {
  args: {
    defaultValue: {
      start: new CalendarDate(2020, 1, 1),
      end: new CalendarDate(2022, 1, 1),
    },
    minValue: new CalendarDate(2018, 1, 1),
    maxValue: new CalendarDate(2030, 1, 1),
  },
  render: (args) => <YearRangePicker {...args} />,
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    defaultValue: {
      start: new CalendarDate(2020, 1, 1),
      end: new CalendarDate(2024, 1, 1),
    },
  },
  render: (args) => <YearRangePicker {...args} />,
};

export const CustomYearsPerPage: Story = {
  args: {
    yearsPerPage: 9,
    defaultValue: {
      start: new CalendarDate(2020, 1, 1),
      end: new CalendarDate(2022, 1, 1),
    },
  },
  render: (args) => <YearRangePicker {...args} />,
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: {
    defaultValue: {
      start: new CalendarDate(2020, 1, 1),
      end: new CalendarDate(2022, 1, 1),
    },
    classNames: {
      base: "border-2 border-blue-500 rounded-lg p-4",
      header: "mb-4 pb-3 border-b-2 border-blue-200",
      navButton: "text-blue-600 hover:bg-blue-100 rounded-md",
      heading: "text-lg font-semibold text-blue-700",
      cell: "hover:bg-blue-50 text-blue-900",
    },
  },
  render: (args) => <YearRangePicker {...args} />,
};
