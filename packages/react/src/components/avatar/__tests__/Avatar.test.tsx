import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { Avatar } from "../Avatar";
import { AvatarGroup } from "../AvatarGroup";

describe("Avatar", () => {
  it("renders initials from name when no src is provided", () => {
    render(<Avatar name="Jane Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders a fallback icon when there is no name or src", () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom fallback content", () => {
    render(<Avatar fallback={<span>Custom</span>} />);
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Avatar name="Jane Doe" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});

describe("AvatarGroup", () => {
  it("renders all avatars from the shorthand API", () => {
    render(
      <AvatarGroup
        avatars={[{ name: "Ann Apple" }, { name: "Bob Baker" }, { name: "Cat Carter" }]}
      />,
    );
    expect(screen.getByText("AA")).toBeInTheDocument();
    expect(screen.getByText("BB")).toBeInTheDocument();
    expect(screen.getByText("CC")).toBeInTheDocument();
  });

  it("renders an overflow counter avatar when max is exceeded", () => {
    render(
      <AvatarGroup
        max={2}
        avatars={[{ name: "Ann Apple" }, { name: "Bob Baker" }, { name: "Cat Carter" }]}
      />,
    );
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <AvatarGroup avatars={[{ name: "Ann Apple" }, { name: "Bob Baker" }]} />,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
