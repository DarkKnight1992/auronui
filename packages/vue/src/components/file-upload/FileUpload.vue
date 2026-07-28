<!--
  FileUpload — drag-and-drop or click-to-browse file input, with a file
  list showing name/size and a remove action. Handles file *selection*
  only; upload transport (the actual XHR/fetch) is left to the consumer,
  matching the scope boundary most peer libraries draw.

  A visually-hidden native <input type="file"> is the only way to open
  the OS file picker; the styled dropzone forwards clicks to it — the
  same "hidden native control + styled proxy" pattern Input's clear-
  button/password-toggle already uses internally. Drag-and-drop uses the
  native HTML5 Drag and Drop API, no library needed.

  ─── Accessibility ──────────────────────────────────────────────────────
  Drag-and-drop is not a keyboard-accessible interaction on its own — the
  dropzone is a real `role="button"` with tabindex="0", and Enter/Space
  open the file picker exactly like a click does. This mirrors the
  keyboard-parity lesson from the Tree component's Enter/Space fix: a
  mouse-only interaction with no keyboard equivalent is an accessibility
  bug, not a missing nice-to-have.
-->
<script setup lang="ts">
import { computed, ref, useId, useTemplateRef } from 'vue'
import { fileUploadVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useFormField } from '../../composables/useFormField'
import FieldLabel from '../_shared/FieldLabel.vue'
import FormFieldHelper from '../_shared/FormFieldHelper.vue'

export interface FileRejection {
  file: File
  reason: 'accept' | 'maxSize' | 'maxFiles'
}

const props = withDefaults(
  defineProps<{
    accept?: string
    multiple?: boolean
    maxFiles?: number
    maxSizeBytes?: number
    label?: string
    description?: string
    errorMessage?: string
    isInvalid?: boolean
    isDisabled?: boolean
    isRequired?: boolean
    class?: ClassValue
    classNames?: Partial<{
      base: ClassValue
      label: ClassValue
      dropzone: ClassValue
      icon: ClassValue
      hint: ClassValue
      fileList: ClassValue
      fileItem: ClassValue
      fileName: ClassValue
      fileSize: ClassValue
      removeButton: ClassValue
      helperWrapper: ClassValue
      description: ClassValue
      errorMessage: ClassValue
    }>
  }>(),
  {
    accept: undefined,
    multiple: false,
    maxFiles: undefined,
    maxSizeBytes: undefined,
    label: undefined,
    description: undefined,
    errorMessage: undefined,
    isInvalid: false,
    isDisabled: false,
    isRequired: false,
    class: undefined,
    classNames: undefined,
  },
)

// `change` mirrors the @auronui/react contract: it fires with the FULL
// resulting file list on every mutation (both newly-accepted files being
// added AND a file being removed), not just the delta. `remove` fires
// alongside it specifically on removal, carrying just the removed File,
// for consumers that only care which single file went away.
const emit = defineEmits<{
  change: [files: File[]]
  reject: [rejections: FileRejection[]]
  remove: [file: File]
}>()

const modelValue = defineModel<File[]>({ default: () => [] })

const generatedId = useId()
const inputId = computed(() => `${generatedId}-input`)
const labelId = computed(() => `${generatedId}-label`)
const inputEl = useTemplateRef<HTMLInputElement>('inputEl')
const dropzoneEl = useTemplateRef<HTMLDivElement>('dropzoneEl')
const isDragActive = ref(false)

const {
  descriptionId,
  errorMessageId,
  showError,
  showDescription,
  hasHelper,
  ariaDescribedBy,
  hasLabel,
  rootDataAttrs,
} = useFormField({
  fieldId: () => generatedId,
  label: () => props.label,
  description: () => props.description,
  errorMessage: () => props.errorMessage,
  isInvalid: () => props.isInvalid,
  isDisabled: () => props.isDisabled,
  isReadOnly: () => false,
  isRequired: () => props.isRequired,
  labelPlacement: () => 'outside',
})

function matchesAccept(file: File, accept: string): boolean {
  const patterns = accept.split(',').map(p => p.trim()).filter(Boolean)
  if (!patterns.length) return true
  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) return file.name.toLowerCase().endsWith(pattern.toLowerCase())
    if (pattern.endsWith('/*')) return file.type.startsWith(pattern.slice(0, -1))
    return file.type === pattern
  })
}

function processFiles(fileList: FileList | File[]) {
  if (props.isDisabled) return
  const incoming = Array.from(fileList)
  const accepted: File[] = []
  const rejected: FileRejection[] = []

  const currentCount = modelValue.value.length
  const capacity = props.multiple
    ? (props.maxFiles !== undefined ? Math.max(0, props.maxFiles - currentCount) : Infinity)
    : 1

  for (const file of incoming) {
    if (props.accept && !matchesAccept(file, props.accept)) {
      rejected.push({ file, reason: 'accept' })
      continue
    }
    if (props.maxSizeBytes !== undefined && file.size > props.maxSizeBytes) {
      rejected.push({ file, reason: 'maxSize' })
      continue
    }
    if (accepted.length >= capacity) {
      rejected.push({ file, reason: 'maxFiles' })
      continue
    }
    accepted.push(file)
  }

  if (accepted.length) {
    // Compute the next list and emit that same reference directly, rather
    // than reading modelValue.value back after assignment: when a caller
    // binds both the modelValue prop and an update:modelValue listener
    // (exactly what `v-model` compiles to), defineModel's customRef does
    // not optimistically apply the local value — it waits for the prop to
    // actually flow back down from the parent — so a same-tick read of
    // modelValue.value can still observe the *previous* value.
    const next = props.multiple ? [...modelValue.value, ...accepted] : [accepted[0]!]
    modelValue.value = next
    emit('change', next)
  }
  if (rejected.length) emit('reject', rejected)
}

function openPicker() {
  if (props.isDisabled) return
  inputEl.value?.click()
}

function handleDropzoneKeydown(ev: KeyboardEvent) {
  if (ev.key !== 'Enter' && ev.key !== ' ') return
  ev.preventDefault()
  openPicker()
}

function handleInputChange(ev: Event) {
  const target = ev.target as HTMLInputElement
  if (target.files?.length) processFiles(target.files)
  target.value = ''
}

function handleDropzoneDragLeave(ev: DragEvent) {
  // dragleave fires like mouseout — including when the pointer moves off
  // the dropzone onto a child element (icon, hint text) inside it. Only
  // clear the active state once the pointer has actually left the
  // dropzone's bounds, not on every internal boundary crossing.
  const related = ev.relatedTarget as Node | null
  if (related && dropzoneEl.value?.contains(related)) return
  isDragActive.value = false
}

function handleDrop(ev: DragEvent) {
  isDragActive.value = false
  if (props.isDisabled) return
  const files = ev.dataTransfer?.files
  if (files?.length) processFiles(files)
}

function removeFile(file: File) {
  const next = modelValue.value.filter(f => f !== file)
  modelValue.value = next
  emit('change', next)
  emit('remove', file)
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const slotFns = computed(() =>
  fileUploadVariants({ isInvalid: props.isInvalid, isDisabled: props.isDisabled, isDragActive: isDragActive.value }),
)
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    data-slot="file-upload-root"
    v-bind="rootDataAttrs"
  >
    <FieldLabel
      v-if="hasLabel"
      :id="labelId"
      :for="inputId"
      :label="label"
      :is-required="isRequired"
      :class="composeClassName(slotFns.label(), props.classNames?.label)"
    />

    <div
      ref="dropzoneEl"
      :id="generatedId"
      role="button"
      :tabindex="isDisabled ? -1 : 0"
      :class="composeClassName(slotFns.dropzone(), props.classNames?.dropzone)"
      data-slot="file-upload-dropzone"
      :aria-disabled="isDisabled || undefined"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="ariaDescribedBy"
      :aria-labelledby="hasLabel ? labelId : undefined"
      :data-disabled="isDisabled || undefined"
      :data-drag-active="isDragActive || undefined"
      @click="openPicker"
      @keydown="handleDropzoneKeydown"
      @dragover.prevent="isDisabled ? undefined : (isDragActive = true)"
      @dragleave.prevent="handleDropzoneDragLeave"
      @drop.prevent="handleDrop"
    >
      <span
        :class="composeClassName(slotFns.icon(), props.classNames?.icon)"
        aria-hidden="true"
      >
        <slot name="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line
              x1="12"
              y1="3"
              x2="12"
              y2="15"
            />
          </svg>
        </slot>
      </span>
      <span :class="composeClassName(slotFns.hint(), props.classNames?.hint)">
        <slot name="hint">
          Click to browse or drag and drop{{ multiple ? ' files' : ' a file' }} here
        </slot>
      </span>
      <input
        :id="inputId"
        ref="inputEl"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="isDisabled"
        style="display: none;"
        aria-hidden="true"
        tabindex="-1"
        @change="handleInputChange"
      >
    </div>

    <ul
      v-if="modelValue.length"
      :class="composeClassName(slotFns.fileList(), props.classNames?.fileList)"
      data-slot="file-upload-file-list"
    >
      <li
        v-for="file in modelValue"
        :key="`${file.name}-${file.size}-${file.lastModified}`"
        :class="composeClassName(slotFns.fileItem(), props.classNames?.fileItem)"
        data-slot="file-upload-file-item"
      >
        <slot
          name="fileItem"
          :file="file"
        >
          <span
            :class="composeClassName(slotFns.fileName(), props.classNames?.fileName)"
            data-slot="file-upload-file-name"
          >{{ file.name }}</span>
          <span
            :class="composeClassName(slotFns.fileSize(), props.classNames?.fileSize)"
            data-slot="file-upload-file-size"
          >{{ formatSize(file.size) }}</span>
          <button
            type="button"
            :class="composeClassName(slotFns.removeButton(), props.classNames?.removeButton)"
            data-slot="file-upload-remove-button"
            :aria-label="`Remove ${file.name}`"
            :disabled="isDisabled"
            @click="removeFile(file)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />
              <line
                x1="15"
                y1="9"
                x2="9"
                y2="15"
              />
              <line
                x1="9"
                y1="9"
                x2="15"
                y2="15"
              />
            </svg>
          </button>
        </slot>
      </li>
    </ul>

    <FormFieldHelper
      :has-helper="hasHelper"
      :show-error="showError"
      :show-description="showDescription"
      :error-message="errorMessage"
      :description="description"
      :error-message-id="errorMessageId"
      :description-id="descriptionId"
      :wrapper-class="composeClassName(slotFns.helperWrapper(), props.classNames?.helperWrapper)"
      :error-class="composeClassName(slotFns.errorMessage(), props.classNames?.errorMessage)"
      :description-class="composeClassName(slotFns.description(), props.classNames?.description)"
    />
  </div>
</template>
