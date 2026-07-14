/**
 * FileUpload — dropzone + file list. Handles file *selection* only; upload
 * transport (the actual XHR/fetch) is left to the consumer.
 *
 * A visually-hidden native <input type="file"> is the only way to open the
 * OS file picker; the styled dropzone forwards clicks to it.
 *
 * ─── Accessibility ──────────────────────────────────────────────────────
 * Drag-and-drop is not a keyboard-accessible interaction on its own — the
 * dropzone is a real `role="button"` with tabIndex=0, and Enter/Space open
 * the file picker exactly like a click does (ported verbatim from the Vue
 * component's keyboard-parity comment).
 */
import { useId, useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import { fileUploadVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { useFormField } from "../../hooks";
import { Description } from "../description";
import { Label } from "../label";

export interface FileRejection {
  file: File;
  reason: "accept" | "maxSize" | "maxFiles";
}

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeBytes?: number;
  label?: string;
  description?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    label: ClassValue;
    dropzone: ClassValue;
    icon: ClassValue;
    hint: ClassValue;
    fileList: ClassValue;
    fileItem: ClassValue;
    fileName: ClassValue;
    fileSize: ClassValue;
    removeButton: ClassValue;
    helperWrapper: ClassValue;
    description: ClassValue;
    errorMessage: ClassValue;
  }>;
  value?: File[];
  defaultValue?: File[];
  onChange?: (files: File[]) => void;
  onReject?: (rejections: FileRejection[]) => void;
  onRemove?: (file: File) => void;
  icon?: ReactNode;
  hint?: ReactNode;
  renderFileItem?: (file: File) => ReactNode;
}

function matchesAccept(file: File, accept: string): boolean {
  const patterns = accept
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (!patterns.length) return true;
  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) return file.name.toLowerCase().endsWith(pattern.toLowerCase());
    if (pattern.endsWith("/*")) return file.type.startsWith(pattern.slice(0, -1));
    return file.type === pattern;
  });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  accept,
  multiple = false,
  maxFiles,
  maxSizeBytes,
  label,
  description,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  className,
  classNames,
  value,
  defaultValue,
  onChange,
  onReject,
  onRemove,
  icon,
  hint,
  renderFileItem,
}: FileUploadProps) {
  const generatedId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setDragActive] = useState(false);
  const [internalFiles, setInternalFiles] = useState<File[]>(defaultValue ?? []);
  const files = value ?? internalFiles;

  const { descriptionId, errorMessageId, showError, showDescription, hasHelper, ariaDescribedBy, hasLabel, rootDataAttrs } =
    useFormField({
      fieldId: generatedId,
      label,
      description,
      errorMessage,
      isInvalid,
      isDisabled,
      isReadOnly: false,
      isRequired,
      labelPlacement: "outside",
    });

  function setFiles(next: File[]) {
    if (value === undefined) setInternalFiles(next);
    onChange?.(next);
  }

  function processFiles(incomingFiles: FileList | File[]) {
    if (isDisabled) return;
    const incoming = Array.from(incomingFiles);
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];

    const currentCount = files.length;
    const capacity = multiple ? (maxFiles !== undefined ? Math.max(0, maxFiles - currentCount) : Infinity) : 1;

    for (const file of incoming) {
      if (accept && !matchesAccept(file, accept)) {
        rejected.push({ file, reason: "accept" });
        continue;
      }
      if (maxSizeBytes !== undefined && file.size > maxSizeBytes) {
        rejected.push({ file, reason: "maxSize" });
        continue;
      }
      if (accepted.length >= capacity) {
        rejected.push({ file, reason: "maxFiles" });
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length) {
      setFiles(multiple ? [...files, ...accepted] : [accepted[0]!]);
    }
    if (rejected.length) onReject?.(rejected);
  }

  function openPicker() {
    if (isDisabled) return;
    inputRef.current?.click();
  }

  function handleDropzoneKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openPicker();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    if (target.files?.length) processFiles(target.files);
    target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    if (isDisabled) return;
    const dropped = event.dataTransfer?.files;
    if (dropped?.length) processFiles(dropped);
  }

  function removeFile(file: File) {
    setFiles(files.filter((f) => f !== file));
    onRemove?.(file);
  }

  const slots = fileUploadVariants({ isInvalid, isDisabled, isDragActive });

  return (
    <div
      className={composeClassName(slots.base(), className, classNames?.base)}
      data-slot="file-upload-root"
      {...rootDataAttrs}
    >
      {hasLabel && (
        <Label htmlFor={generatedId} isRequired={isRequired} className={composeClassName(slots.label(), classNames?.label)}>
          {label}
        </Label>
      )}

      <div
        id={generatedId}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        className={composeClassName(slots.dropzone(), classNames?.dropzone)}
        data-slot="file-upload-dropzone"
        aria-disabled={isDisabled || undefined}
        aria-invalid={isInvalid || undefined}
        aria-describedby={ariaDescribedBy}
        data-disabled={dataAttr(isDisabled)}
        data-drag-active={dataAttr(isDragActive)}
        onClick={openPicker}
        onKeyDown={handleDropzoneKeyDown}
        onDragOver={(event) => {
          event.preventDefault();
          if (!isDisabled) setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={handleDrop}
      >
        <span className={composeClassName(slots.icon(), classNames?.icon)} aria-hidden="true">
          {icon ?? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
        </span>
        <span className={composeClassName(slots.hint(), classNames?.hint)}>
          {hint ?? `Click to browse or drag and drop${multiple ? " files" : " a file"} here`}
        </span>
        {/* Hidden native <input type="file"> — the only way to open the OS file picker; a bare <input> is used deliberately, no AuronUI Input equivalent covers type="file" pickers. */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={isDisabled}
          style={{ display: "none" }}
          aria-hidden="true"
          tabIndex={-1}
          onChange={handleInputChange}
        />
      </div>

      {files.length > 0 && (
        <ul className={composeClassName(slots.fileList(), classNames?.fileList)} data-slot="file-upload-file-list">
          {files.map((file) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className={composeClassName(slots.fileItem(), classNames?.fileItem)}
              data-slot="file-upload-file-item"
            >
              {renderFileItem ? (
                renderFileItem(file)
              ) : (
                <>
                  <span className={composeClassName(slots.fileName(), classNames?.fileName)} data-slot="file-upload-file-name">
                    {file.name}
                  </span>
                  <span className={composeClassName(slots.fileSize(), classNames?.fileSize)} data-slot="file-upload-file-size">
                    {formatSize(file.size)}
                  </span>
                  <button
                    type="button"
                    className={composeClassName(slots.removeButton(), classNames?.removeButton)}
                    data-slot="file-upload-remove-button"
                    aria-label={`Remove ${file.name}`}
                    disabled={isDisabled}
                    onClick={() => removeFile(file)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {hasHelper && (
        <div className={composeClassName(slots.helperWrapper(), classNames?.helperWrapper)}>
          {showError ? (
            <Description id={errorMessageId} className={composeClassName(slots.errorMessage(), classNames?.errorMessage)}>
              {errorMessage}
            </Description>
          ) : showDescription ? (
            <Description id={descriptionId} className={composeClassName(slots.description(), classNames?.description)}>
              {description}
            </Description>
          ) : null}
        </div>
      )}
    </div>
  );
}
