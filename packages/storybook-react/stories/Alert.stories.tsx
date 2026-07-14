import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Alert, AlertIcon, AlertTitle, AlertDescription, Button } from "@auronui/react";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    severity: {
      control: "select",
      options: ["default", "primary", "accent", "success", "warning", "danger"],
    },
    isClosable: { control: "boolean" },
  },
  args: {
    severity: "default",
    isClosable: false,
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: (args) => <Alert {...args}>This is a default alert message.</Alert>,
};

export const AllSeverities: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Alert severity="default">
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>This is a default informational alert.</AlertDescription>
      </Alert>
      <Alert severity="primary">
        <AlertTitle>Primary</AlertTitle>
        <AlertDescription>This is a primary branded alert.</AlertDescription>
      </Alert>
      <Alert severity="accent">
        <AlertTitle>Accent</AlertTitle>
        <AlertDescription>This is an accent-toned alert.</AlertDescription>
      </Alert>
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your action was completed successfully.</AlertDescription>
      </Alert>
      <Alert severity="warning">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Please review before proceeding.</AlertDescription>
      </Alert>
      <Alert severity="danger">
        <AlertTitle>Danger</AlertTitle>
        <AlertDescription>Something went wrong. Please try again.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const Closable: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Alert severity="success" isClosable>
        <AlertTitle>Dismissible Success</AlertTitle>
        <AlertDescription>Click the X button to dismiss this alert.</AlertDescription>
      </Alert>
      <Alert severity="warning" isClosable>
        <AlertTitle>Dismissible Warning</AlertTitle>
        <AlertDescription>This alert can be closed by the user.</AlertDescription>
      </Alert>
      <Alert severity="danger" isClosable>
        <AlertTitle>Dismissible Danger</AlertTitle>
        <AlertDescription>Dismiss this error once acknowledged.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const FullStructure: Story = {
  name: "Full Structure (Icon + Title + Description)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Alert severity="success" icon={<AlertIcon>✓</AlertIcon>}>
        <AlertTitle>Upload complete</AlertTitle>
        <AlertDescription>Your file has been uploaded and is ready to use.</AlertDescription>
      </Alert>
      <Alert severity="warning" icon={<AlertIcon>⚠</AlertIcon>}>
        <AlertTitle>Session expiring</AlertTitle>
        <AlertDescription>Your session will expire in 5 minutes. Save your work.</AlertDescription>
      </Alert>
      <Alert severity="danger" icon={<AlertIcon className="text-sm">✕</AlertIcon>}>
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Your card was declined. Please update your payment method.</AlertDescription>
      </Alert>
      <Alert severity="primary" icon={<AlertIcon>ℹ</AlertIcon>}>
        <AlertTitle>New features available</AlertTitle>
        <AlertDescription>We shipped several improvements. Check the changelog.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const DismissDemo: Story = {
  name: "Dismiss Animation Demo",
  render: () => {
    function Demo() {
      const [shown, setShown] = useState(true);
      function reset() {
        setShown(false);
        setTimeout(() => setShown(true), 500);
      }
      return (
        <div>
          <Button variant="ghost" style={{ marginBottom: 16 }} onClick={reset}>
            Dismiss &amp; Reset
          </Button>
          {shown && (
            <Alert severity="warning" isClosable onClose={reset}>
              <AlertTitle>Dismiss animation</AlertTitle>
              <AlertDescription>Click X or the button above to see the dismiss behavior.</AlertDescription>
            </Alert>
          )}
        </div>
      );
    }
    return <Demo />;
  },
};
