import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Form, FormField, Input, Button } from "@auronui/react";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  tags: ["autodocs"],
  argTypes: {
    validationMode: {
      control: "select",
      options: ["on-submit", "on-blur", "on-change"],
    },
    isDisabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

export const OnSubmit: Story = {
  name: "On Submit (default)",
  render: () => {
    function OnSubmitDemo() {
      const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null);
      return (
        <div style={{ maxWidth: 360, display: "flex", flexDirection: "column", gap: 24 }}>
          <Form
            validationMode="on-submit"
            onSubmit={({ values, setErrors }) => {
              if (values.email === "taken@example.com") {
                setErrors({ email: "This email is already registered" });
                return;
              }
              setSubmitted(values);
            }}
            onInvalid={() => setSubmitted(null)}
            className="flex flex-col gap-4"
          >
            <FormField name="email" rules={{ required: true, email: true }}>
              {({ fieldProps }) => (
                <Input
                  label="Email"
                  type="email"
                  value={(fieldProps.value as string) ?? ""}
                  onChange={(e) => fieldProps.onChange(e.target.value)}
                  onBlur={fieldProps.onBlur}
                  isInvalid={fieldProps.isInvalid}
                  errorMessage={fieldProps.errorMessage}
                />
              )}
            </FormField>

            <FormField name="password" rules={{ required: true, minLength: 8 }}>
              {({ fieldProps }) => (
                <Input
                  label="Password"
                  type="password"
                  showPasswordToggle
                  value={(fieldProps.value as string) ?? ""}
                  onChange={(e) => fieldProps.onChange(e.target.value)}
                  onBlur={fieldProps.onBlur}
                  isInvalid={fieldProps.isInvalid}
                  errorMessage={fieldProps.errorMessage}
                />
              )}
            </FormField>

            <Button type="submit" color="primary">
              Sign up
            </Button>
          </Form>

          {submitted && (
            <div style={{ padding: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 13 }}>
              <strong>Submitted:</strong> {JSON.stringify(submitted)}
            </div>
          )}
          <p style={{ fontSize: 12, color: "#71717a" }}>
            Try submitting empty, then try <code>taken@example.com</code> to see server errors.
          </p>
        </div>
      );
    }
    return <OnSubmitDemo />;
  },
};

export const OnChange: Story = {
  name: "On Change",
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Form validationMode="on-change" className="flex flex-col gap-4">
        <FormField name="username" rules={{ required: true, minLength: 3, maxLength: 20 }}>
          {({ fieldProps }) => (
            <Input
              label="Username"
              placeholder="3–20 characters"
              value={(fieldProps.value as string) ?? ""}
              onChange={(e) => fieldProps.onChange(e.target.value)}
              onBlur={fieldProps.onBlur}
              isInvalid={fieldProps.isInvalid}
              errorMessage={fieldProps.errorMessage}
            />
          )}
        </FormField>
        <FormField name="email" rules={{ required: true, email: true }}>
          {({ fieldProps }) => (
            <Input
              label="Email"
              type="email"
              value={(fieldProps.value as string) ?? ""}
              onChange={(e) => fieldProps.onChange(e.target.value)}
              onBlur={fieldProps.onBlur}
              isInvalid={fieldProps.isInvalid}
              errorMessage={fieldProps.errorMessage}
            />
          )}
        </FormField>
      </Form>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Form isDisabled className="flex flex-col gap-4">
        <FormField name="email">
          {({ fieldProps }) => (
            <Input
              label="Email"
              value={(fieldProps.value as string) ?? ""}
              onChange={(e) => fieldProps.onChange(e.target.value)}
              isDisabled={fieldProps.isDisabled}
            />
          )}
        </FormField>
        <Button type="submit" isDisabled color="primary">
          Submit
        </Button>
      </Form>
    </div>
  ),
};
