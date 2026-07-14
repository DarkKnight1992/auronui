import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";
import { Button, ToastProvider, useToast } from "@auronui/react";

const meta: Meta<typeof ToastProvider> = {
  title: "Components/Toast",
  component: ToastProvider,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <Story />
        <ToastProvider />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

export const Default: Story = {
  render: () => {
    function Demo() {
      const { toast } = useToast();
      function showToast() {
        toast({
          title: "Notification",
          description: "This is a default toast message.",
          position: "bottom-right",
          duration: 5000,
        });
      }
      return (
        <div style={{ padding: 16 }}>
          <Button onClick={showToast}>Show Toast</Button>
        </div>
      );
    }
    return <Demo />;
  },
};

export const AllPositions: Story = {
  name: "All 6 Positions (via useToast)",
  render: () => {
    function Demo() {
      const { toast } = useToast();
      const positions = [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ] as const;

      function showAll() {
        positions.forEach((position, i) => {
          setTimeout(() => {
            toast({
              title: position,
              description: `Toast at ${position}`,
              position,
              duration: 4000,
            });
          }, i * 200);
        });
      }

      return (
        <div style={{ padding: 16 }}>
          <Button onClick={showAll}>Show All Positions</Button>
          <p style={{ marginTop: 8, fontSize: 14, color: "#666" }}>
            Click to display toasts at all 6 positions simultaneously.
          </p>
        </div>
      );
    }
    return <Demo />;
  },
};

export const ImperativeAPI: Story = {
  name: "useToast() Imperative API",
  render: () => {
    function Demo() {
      const { toast, dismiss } = useToast();
      const lastId = useRef<string | null>(null);

      function createToast() {
        lastId.current = toast({
          title: "Action completed",
          description: "Your item was saved successfully.",
          position: "bottom-right",
          variant: "default",
          duration: 5000,
        });
      }

      function dismissLast() {
        if (lastId.current) {
          dismiss(lastId.current);
          lastId.current = null;
        }
      }

      return (
        <div style={{ display: "flex", gap: 8, padding: 16 }}>
          <Button onClick={createToast}>Create Toast</Button>
          <Button variant="ghost" onClick={dismissLast}>Dismiss Last</Button>
        </div>
      );
    }
    return <Demo />;
  },
};

export const AllVariants: Story = {
  name: "All Variants",
  render: () => {
    function Demo() {
      const { toast } = useToast();
      const variants = ["default", "success", "warning", "danger", "accent"] as const;

      function showAll() {
        variants.forEach((variant, i) => {
          setTimeout(() => {
            toast({
              title: `${variant} toast`,
              description: `This is a ${variant} variant.`,
              position: "bottom-right",
              variant,
              duration: 5000,
            });
          }, i * 200);
        });
      }

      return (
        <div style={{ padding: 16 }}>
          <Button onClick={showAll}>Show All Variants</Button>
        </div>
      );
    }
    return <Demo />;
  },
};

export const WithAction: Story = {
  name: "Toast with Action Button",
  render: () => {
    function Demo() {
      const { toast } = useToast();
      function showToast() {
        toast({
          title: "Update available",
          description: "A new version is ready to install.",
          position: "bottom-right",
          duration: 5000,
          action: {
            label: "Install",
            onClick: () => alert("Action clicked!"),
          },
        });
      }
      return (
        <div style={{ padding: 16 }}>
          <Button onClick={showToast}>Show Toast</Button>
        </div>
      );
    }
    return <Demo />;
  },
};

export const MultipleStacking: Story = {
  name: "Multiple Stacking Toasts",
  render: () => {
    function Demo() {
      const { toast } = useToast();
      let count = useRef(0);

      function addToast() {
        count.current++;
        toast({
          title: `Toast #${count.current}`,
          description: "Toasts stack in order of creation.",
          position: "bottom-right",
          duration: 8000,
        });
      }

      return (
        <div style={{ padding: 16 }}>
          <Button onClick={addToast}>Add Toast</Button>
          <p style={{ marginTop: 8, fontSize: 14, color: "#666" }}>
            Click multiple times. Max 5 concurrent toasts (oldest dismissed on overflow).
          </p>
        </div>
      );
    }
    return <Demo />;
  },
};

export const CustomDuration: Story = {
  name: "Custom Auto-Dismiss Duration",
  render: () => {
    function Demo() {
      const { toast } = useToast();

      function showShort() {
        toast({
          title: "Quick toast",
          description: "Auto-dismisses in 1.5s",
          position: "top-right",
          duration: 1500,
        });
      }

      function showLong() {
        toast({
          title: "Long toast",
          description: "Auto-dismisses in 10s",
          position: "top-right",
          duration: 10000,
        });
      }

      return (
        <div style={{ display: "flex", gap: 8, padding: 16 }}>
          <Button variant="bordered" onClick={showShort}>1.5s Toast</Button>
          <Button variant="bordered" onClick={showLong}>10s Toast</Button>
        </div>
      );
    }
    return <Demo />;
  },
};
