import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const fileUploadVariants = tv({
  slots: {
    base: "file-upload-root",
    label: "file-upload__label",
    dropzone: "file-upload__dropzone",
    icon: "file-upload__icon",
    hint: "file-upload__hint",
    fileList: "file-upload__file-list",
    fileItem: "file-upload__file-item",
    fileName: "file-upload__file-name",
    fileSize: "file-upload__file-size",
    removeButton: "file-upload__remove-button",
    helperWrapper: "file-upload__helper-wrapper",
    description: "file-upload__description",
    errorMessage: "file-upload__error-message",
  },
  variants: {
    isInvalid: {
      true: {
        dropzone: "file-upload__dropzone--invalid",
      },
      false: {},
    },
    isDisabled: {
      true: {
        dropzone: "file-upload__dropzone--disabled",
      },
      false: {},
    },
    isDragActive: {
      true: {
        dropzone: "file-upload__dropzone--drag-active",
      },
      false: {},
    },
  },
  defaultVariants: {
    isInvalid: false,
    isDisabled: false,
    isDragActive: false,
  },
});

export type FileUploadVariants = VariantProps<typeof fileUploadVariants>;
