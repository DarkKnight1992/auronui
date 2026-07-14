import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperContent,
  StepperSeparator,
} from "@auronui/react";

const meta: Meta<typeof Stepper> = {
  title: "Extended/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
  },
  args: {
    orientation: "horizontal",
    size: "md",
    color: "primary",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 32, maxWidth: 700 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const steps = [
  { label: "Account", description: "Create your account" },
  { label: "Profile", description: "Set up your profile" },
  { label: "Review", description: "Review your details" },
  { label: "Done", description: "You're all set!" },
];

export const Default: Story = {
  render: (args) => {
    function Demo() {
      const [currentStep, setCurrentStep] = useState(2);
      return (
        <div>
          <Stepper {...args} value={currentStep} totalSteps={steps.length}>
            {steps.map((step, index) => (
              <StepperItem key={index} step={index + 1}>
                <StepperIndicator>{index + 1}</StepperIndicator>
                {index < steps.length - 1 && <StepperSeparator />}
                <StepperContent>
                  <StepperTitle>{step.label}</StepperTitle>
                  <StepperDescription>{step.description}</StepperDescription>
                </StepperContent>
              </StepperItem>
            ))}
          </Stepper>
          <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
            <button
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              style={{ padding: "6px 12px", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep((s) => Math.min(steps.length, s + 1))}
              style={{ padding: "6px 12px", background: "#6366f1", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
            >
              Next
            </button>
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};

export const Vertical: Story = {
  args: { orientation: "vertical", size: "md", color: "primary" },
  render: (args) => (
    <Stepper {...args} value={2} totalSteps={steps.length}>
      {steps.map((step, index) => (
        <StepperItem key={index} step={index + 1}>
          <StepperIndicator>{index + 1}</StepperIndicator>
          <StepperContent>
            <StepperTitle>{step.label}</StepperTitle>
            <StepperDescription>{step.description}</StepperDescription>
          </StepperContent>
          {index < steps.length - 1 && <StepperSeparator />}
        </StepperItem>
      ))}
    </Stepper>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {(["default", "primary", "secondary", "accent", "success", "warning", "danger"] as const).map((color) => (
        <div key={color}>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontFamily: "sans-serif", textTransform: "capitalize" }}>
            {color}
          </p>
          <Stepper color={color} value={2} totalSteps={3}>
            <StepperItem step={1}>
              <StepperIndicator>1</StepperIndicator>
              <StepperSeparator />
              <StepperContent><StepperTitle>Step one</StepperTitle></StepperContent>
            </StepperItem>
            <StepperItem step={2}>
              <StepperIndicator>2</StepperIndicator>
              <StepperSeparator />
              <StepperContent><StepperTitle>Step two</StepperTitle></StepperContent>
            </StepperItem>
            <StepperItem step={3}>
              <StepperIndicator>3</StepperIndicator>
              <StepperContent><StepperTitle>Step three</StepperTitle></StepperContent>
            </StepperItem>
          </Stepper>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size}>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontFamily: "sans-serif" }}>size=&quot;{size}&quot;</p>
          <Stepper size={size} value={2} totalSteps={3}>
            <StepperItem step={1}>
              <StepperIndicator>1</StepperIndicator>
              <StepperSeparator />
              <StepperContent><StepperTitle>Account</StepperTitle></StepperContent>
            </StepperItem>
            <StepperItem step={2}>
              <StepperIndicator>2</StepperIndicator>
              <StepperSeparator />
              <StepperContent><StepperTitle>Profile</StepperTitle></StepperContent>
            </StepperItem>
            <StepperItem step={3}>
              <StepperIndicator>3</StepperIndicator>
              <StepperContent><StepperTitle>Done</StepperTitle></StepperContent>
            </StepperItem>
          </Stepper>
        </div>
      ))}
    </div>
  ),
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: { orientation: "horizontal", size: "md", color: "primary" },
  render: (args) => (
    <Stepper {...args} value={2} totalSteps={steps.length} classNames={{ base: "border-l-4 border-blue-500 pl-4" }}>
      {steps.map((step, index) => (
        <StepperItem key={index} step={index + 1} className="bg-slate-50 rounded-lg px-4 py-3">
          <StepperIndicator>{index + 1}</StepperIndicator>
          {index < steps.length - 1 && <StepperSeparator />}
          <StepperContent className="text-blue-700 font-semibold">
            <StepperTitle>{step.label}</StepperTitle>
            <StepperDescription>{step.description}</StepperDescription>
          </StepperContent>
        </StepperItem>
      ))}
    </Stepper>
  ),
};

export const ArrayAPI: Story = {
  name: "Array API (items prop)",
  render: (args) => (
    <Stepper
      {...args}
      value={2}
      items={[
        { title: "Account", description: "Create your account" },
        { title: "Profile", description: "Set up your profile" },
        { title: "Review", description: "Review your details" },
        { title: "Done", description: "You are all set!" },
      ]}
    />
  ),
};
