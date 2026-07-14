import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Alert, AlertTitle, AlertDescription, AlertIcon } from "../index";

describe("Alert", () => {
  it('renders role="alert"', () => {
    render(<Alert>Alert content</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("applies default severity class", () => {
    render(<Alert>Content</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("alert--default");
  });

  it("applies each severity class", () => {
    const severities = ["primary", "accent", "success", "warning", "danger"] as const;
    for (const severity of severities) {
      const { unmount } = render(<Alert severity={severity}>Content</Alert>);
      expect(screen.getByRole("alert")).toHaveClass(`alert--${severity}`);
      unmount();
    }
  });

  it("does NOT render a close button by default", () => {
    render(<Alert>Content</Alert>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a close button when isClosable", () => {
    render(<Alert isClosable>Content</Alert>);
    expect(screen.getByRole("button", { name: "Dismiss alert" })).toBeInTheDocument();
  });

  it("close button color matches the alert severity", () => {
    render(
      <Alert isClosable severity="danger">
        Content
      </Alert>,
    );
    expect(screen.getByRole("button", { name: "Dismiss alert" })).toHaveClass("button--color-danger");
  });

  it("fires onClose and hides the alert when the close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <Alert isClosable onClose={onClose}>
        Content
      </Alert>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Dismiss alert" }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders AlertTitle and AlertDescription content", () => {
    render(
      <Alert severity="success">
        <AlertIcon>✓</AlertIcon>
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your action was completed.</AlertDescription>
      </Alert>,
    );
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Your action was completed.")).toBeInTheDocument();
  });

  it("merges custom className onto root element", () => {
    render(<Alert className="my-custom-class">Content</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("my-custom-class");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Alert severity="warning" isClosable>
        Content
      </Alert>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
