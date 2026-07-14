import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Popover, PopoverArrow, PopoverClose, PopoverContent, PopoverTrigger, type PopoverProps } from "../index";

function renderPopover(props: Partial<PopoverProps> = {}) {
  return render(
    <Popover {...props}>
      <PopoverTrigger>
        <button type="button">Open Popover</button>
      </PopoverTrigger>
      <PopoverContent aria-label="Popover">
        <PopoverArrow />
        <p>Popover content goes here.</p>
        <PopoverClose>
          <button type="button">Close</button>
        </PopoverClose>
      </PopoverContent>
    </Popover>,
  );
}

describe("Popover", () => {
  it("does not render content in the DOM when closed by default", () => {
    renderPopover();
    expect(screen.queryByText("Popover content goes here.")).not.toBeInTheDocument();
  });

  it("opens when the trigger is clicked", async () => {
    renderPopover();
    await userEvent.click(screen.getByRole("button", { name: "Open Popover" }));
    expect(await screen.findByText("Popover content goes here.")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    renderPopover();
    await userEvent.click(screen.getByRole("button", { name: "Open Popover" }));
    await screen.findByText("Popover content goes here.");
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByText("Popover content goes here.")).not.toBeInTheDocument(),
    );
  });

  it("closes when PopoverClose is clicked", async () => {
    renderPopover();
    await userEvent.click(screen.getByRole("button", { name: "Open Popover" }));
    await screen.findByText("Popover content goes here.");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() =>
      expect(screen.queryByText("Popover content goes here.")).not.toBeInTheDocument(),
    );
  });

  it("closes when clicking outside the popover", async () => {
    render(
      <div>
        <Popover>
          <PopoverTrigger>
            <button type="button">Open Popover</button>
          </PopoverTrigger>
          <PopoverContent>
            <p>Popover content goes here.</p>
          </PopoverContent>
        </Popover>
        <button type="button">Outside</button>
      </div>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Open Popover" }));
    await screen.findByText("Popover content goes here.");

    await userEvent.click(screen.getByRole("button", { name: "Outside" }));

    await waitFor(() =>
      expect(screen.queryByText("Popover content goes here.")).not.toBeInTheDocument(),
    );
  });

  it("supports controlled open state", async () => {
    const { rerender } = render(
      <Popover open={false}>
        <PopoverTrigger>
          <button type="button">Open Popover</button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Popover content goes here.</p>
        </PopoverContent>
      </Popover>,
    );
    expect(screen.queryByText("Popover content goes here.")).not.toBeInTheDocument();

    rerender(
      <Popover open>
        <PopoverTrigger>
          <button type="button">Open Popover</button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Popover content goes here.</p>
        </PopoverContent>
      </Popover>,
    );

    expect(await screen.findByText("Popover content goes here.")).toBeInTheDocument();
  });

  it("has no accessibility violations when closed", async () => {
    renderPopover();
    const results = await axe.run(document.body);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when open", async () => {
    renderPopover();
    await userEvent.click(screen.getByRole("button", { name: "Open Popover" }));
    await screen.findByText("Popover content goes here.");
    const results = await axe.run(document.body);
    expect(results).toHaveNoViolations();
  });
});
