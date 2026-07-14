import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Chip } from "../Chip";
import { _clearWarnedCache } from "../../../utils/warnDeprecated";

beforeEach(() => {
  _clearWarnedCache();
});

describe("Chip", () => {
  it("renders a <span> element with default modifier classes", () => {
    render(<Chip>Tag</Chip>);
    const el = screen.getByText("Tag").closest("span.chip");
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("chip--default", "chip--solid");
  });

  it("applies 'chip--bordered' for the deprecated variant='outlined' and warns once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Chip variant={"outlined" as never}>Tag</Chip>);
    const el = screen.getByText("Tag").closest("span.chip");
    expect(el).toHaveClass("chip--bordered");
    expect(warn).toHaveBeenCalledWith(
      '[AuronUI] Chip: variant="outlined" is deprecated, use variant="bordered" instead.',
    );
    warn.mockRestore();
  });

  it("renders default content inside chip__label span", () => {
    render(<Chip>My Tag</Chip>);
    const label = screen.getByText("My Tag");
    expect(label).toHaveClass("chip__label");
  });

  it("renders a close button and fires onClose when isClosable", async () => {
    const onClose = vi.fn();
    render(
      <Chip isClosable onClose={onClose}>
        Tag
      </Chip>,
    );
    const button = screen.getByRole("button", { name: "Remove" });
    await userEvent.click(button);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Chip>Accessible Tag</Chip>);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
