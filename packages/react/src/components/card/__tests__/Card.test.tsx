import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Card } from "../Card";
import { CardHeader } from "../CardHeader";
import { CardBody } from "../CardBody";
import { CardFooter } from "../CardFooter";

describe("Card", () => {
  it("renders header, body, and footer content", () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("fires onPress when isPressable and clicked", async () => {
    const onPress = vi.fn();
    render(
      <Card isPressable onPress={onPress}>
        <CardBody>Body</CardBody>
      </Card>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledOnce();
  });

  it("does not fire onPress when disabled", async () => {
    const onPress = vi.fn();
    render(
      <Card isPressable isDisabled onPress={onPress}>
        <CardBody>Body</CardBody>
      </Card>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
