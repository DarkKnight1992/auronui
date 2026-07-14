import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ColorSlider } from "../ColorSlider";

describe("ColorSlider", () => {
  it("renders a slider for the given channel", () => {
    render(<ColorSlider channel="hue" defaultValue="hsl(200, 50%, 50%)" />);
    const thumb = screen.getByRole("slider", { name: "hue" });
    expect(thumb).toHaveAttribute("aria-valuenow", "200");
  });

  it("increments the channel on ArrowRight", async () => {
    const onChange = vi.fn();
    render(<ColorSlider channel="hue" defaultValue="hsl(200, 50%, 50%)" onChange={onChange} />);
    const thumb = screen.getByRole("slider", { name: "hue" });
    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalled();
    const [nextColor] = onChange.mock.calls[0];
    expect(nextColor.getChannelValue("hue")).toBe(201);
  });

  it("jumps by 10 steps on PageUp", async () => {
    const onChange = vi.fn();
    render(<ColorSlider channel="hue" defaultValue="hsl(200, 50%, 50%)" onChange={onChange} />);
    const thumb = screen.getByRole("slider", { name: "hue" });
    thumb.focus();
    await userEvent.keyboard("{PageUp}");
    const [nextColor] = onChange.mock.calls[0];
    expect(nextColor.getChannelValue("hue")).toBe(210);
  });

  it("jumps by 10 steps on Shift+ArrowRight", async () => {
    const onChange = vi.fn();
    render(<ColorSlider channel="hue" defaultValue="hsl(200, 50%, 50%)" onChange={onChange} />);
    const thumb = screen.getByRole("slider", { name: "hue" });
    thumb.focus();
    await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");
    const [nextColor] = onChange.mock.calls[0];
    expect(nextColor.getChannelValue("hue")).toBe(210);
  });

  it("respects a custom step prop", async () => {
    const onChange = vi.fn();
    render(<ColorSlider channel="hue" defaultValue="hsl(200, 50%, 50%)" step={5} onChange={onChange} />);
    const thumb = screen.getByRole("slider", { name: "hue" });
    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");
    const [nextColor] = onChange.mock.calls[0];
    expect(nextColor.getChannelValue("hue")).toBe(205);
  });

  it("renders an output when showOutput is set", () => {
    render(<ColorSlider channel="red" defaultValue="rgb(128, 0, 0)" showOutput />);
    expect(screen.getByText("128")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ColorSlider channel="hue" defaultValue="hsl(200, 50%, 50%)" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
