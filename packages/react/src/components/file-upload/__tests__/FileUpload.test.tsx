import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { FileUpload } from "../FileUpload";

function makeFile(name: string, size: number, type = "text/plain"): File {
  return new File(["x".repeat(size)], name, { type });
}

describe("FileUpload", () => {
  it("renders a dropzone with role=button and a hidden native file input", () => {
    render(<FileUpload />);
    const dropzone = document.querySelector('[data-slot="file-upload-dropzone"]');
    expect(dropzone?.getAttribute("role")).toBe("button");
    expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  it("selecting a file via the native input adds it to the list and fires onChange", async () => {
    const onChange = vi.fn();
    render(<FileUpload onChange={onChange} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile("resume.pdf", 100, "application/pdf");
    await userEvent.upload(input, file);

    expect(onChange).toHaveBeenCalledWith([file]);
    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
  });

  it("dropping a file on the dropzone adds it (native Drag and Drop API, not click-only)", () => {
    const onChange = vi.fn();
    render(<FileUpload onChange={onChange} />);
    const dropzone = document.querySelector('[data-slot="file-upload-dropzone"]') as HTMLElement;
    const file = makeFile("dropped.txt", 10);

    const dropEvent = new Event("drop", { bubbles: true, cancelable: true }) as unknown as DragEvent;
    Object.defineProperty(dropEvent, "dataTransfer", { value: { files: [file] } });
    dropzone.dispatchEvent(dropEvent);

    expect(onChange).toHaveBeenCalledWith([file]);
  });

  it("Enter key on the focused dropzone opens the native file picker (keyboard parity with click)", async () => {
    render(<FileUpload />);
    const dropzone = document.querySelector('[data-slot="file-upload-dropzone"]') as HTMLElement;
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");

    dropzone.focus();
    await userEvent.keyboard("{Enter}");

    expect(clickSpy).toHaveBeenCalled();
  });

  it("rejects a file exceeding maxSizeBytes with reason maxSize", async () => {
    const onChange = vi.fn();
    const onReject = vi.fn();
    render(<FileUpload maxSizeBytes={50} onChange={onChange} onReject={onReject} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, makeFile("huge.bin", 1000));

    expect(onChange).not.toHaveBeenCalled();
    expect(onReject).toHaveBeenCalledWith([expect.objectContaining({ reason: "maxSize" })]);
  });

  it("label pairs with the hidden native file input via htmlFor/id (a div[role=button] is not labelable)", () => {
    render(<FileUpload label="Attachments" />);
    const label = screen.getByText("Attachments");
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const dropzone = document.querySelector('[data-slot="file-upload-dropzone"]') as HTMLElement;

    expect(label.getAttribute("for")).toBe(input.id);
    expect(label.getAttribute("for")).not.toBe(dropzone.id);
  });

  it("the dropzone carries aria-labelledby pointing at the label so its accessible name still reflects the label text", () => {
    render(<FileUpload label="Attachments" />);
    const label = screen.getByText("Attachments");
    const dropzone = document.querySelector('[data-slot="file-upload-dropzone"]') as HTMLElement;

    expect(dropzone.getAttribute("aria-labelledby")).toBeTruthy();
    expect(dropzone.getAttribute("aria-labelledby")).toBe(label.id);
  });

  it("without a label, the dropzone has no aria-labelledby", () => {
    render(<FileUpload />);
    const dropzone = document.querySelector('[data-slot="file-upload-dropzone"]') as HTMLElement;
    expect(dropzone.hasAttribute("aria-labelledby")).toBe(false);
  });

  // jsdom does not implement a DragEvent constructor, so
  // @testing-library's fireEvent.dragLeave() (which asks jsdom's `window`
  // for one) silently falls back to a bare Event that never carries a
  // `relatedTarget`. Build the event by hand instead, defining
  // `relatedTarget` directly — that's all the component's handler reads —
  // and dispatch it through `fireEvent(element, event)` so the resulting
  // state update is still act()-wrapped.
  function dragLeaveEvent(relatedTarget: EventTarget | null) {
    const event = new Event("dragleave", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "relatedTarget", { value: relatedTarget, configurable: true });
    return event as unknown as DragEvent;
  }

  it("dragleave onto a child element inside the dropzone does not clear drag-active state (no flicker)", () => {
    render(<FileUpload />);
    const dropzone = document.querySelector('[data-slot="file-upload-dropzone"]') as HTMLElement;
    const child = dropzone.querySelector("span") as HTMLElement;

    fireEvent.dragOver(dropzone);
    expect(dropzone.getAttribute("data-drag-active")).toBe("true");

    fireEvent(dropzone, dragLeaveEvent(child));
    expect(dropzone.getAttribute("data-drag-active")).toBe("true");
  });

  it("dragleave to outside the dropzone clears drag-active state", () => {
    render(<FileUpload />);
    const dropzone = document.querySelector('[data-slot="file-upload-dropzone"]') as HTMLElement;

    fireEvent.dragOver(dropzone);
    expect(dropzone.getAttribute("data-drag-active")).toBe("true");

    fireEvent(dropzone, dragLeaveEvent(document.body));
    expect(dropzone.hasAttribute("data-drag-active")).toBe(false);
  });

  it("onChange emits the FULL resulting file list on remove, not just the removed file", async () => {
    const onChange = vi.fn();
    const onRemove = vi.fn();
    const file = makeFile("a.txt", 10);
    const other = makeFile("b.txt", 10);
    render(<FileUpload defaultValue={[file, other]} onChange={onChange} onRemove={onRemove} />);

    const [removeFirst] = screen.getAllByRole("button", { name: /remove/i });
    await userEvent.click(removeFirst!);

    expect(onChange).toHaveBeenCalledWith([other]);
    expect(onRemove).toHaveBeenCalledWith(file);
  });

  it("errorMessage is referenced by aria-describedby when isInvalid", () => {
    render(<FileUpload isInvalid errorMessage="A file is required" />);
    const dropzone = document.querySelector('[data-slot="file-upload-dropzone"]') as HTMLElement;
    const describedBy = dropzone.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)?.textContent).toBe("A file is required");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<FileUpload label="Attachments" description="PDF or PNG only" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
