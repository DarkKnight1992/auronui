import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
