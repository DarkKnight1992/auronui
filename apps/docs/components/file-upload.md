---
title: FileUpload
---

<script setup>
import { ref } from 'vue';
import { FileUpload } from '@auronui/vue';

const files = ref([]);
</script>

# FileUpload

Drag-and-drop or click-to-browse file input, with a file list showing name/size and a remove action per file. FileUpload handles file *selection* only — it validates files against `accept`, `maxSizeBytes`, and `maxFiles` and keeps them in `v-model`, but the actual upload transport (XHR/fetch) is left to the consumer.

A visually-hidden native `<input type="file">` opens the OS file picker; the styled dropzone forwards clicks to it, the same "hidden native control + styled proxy" pattern `Input`'s clear-button/password-toggle uses internally. Drag-and-drop is implemented with the native HTML5 Drag and Drop API and is always an addition to, never a replacement for, the click/keyboard path.

## Example

<div class="docs-example">
  <FileUpload
    v-model="files"
    label="Attachments"
    description="PDF or image files up to 5 MB."
    accept="image/*,.pdf"
    multiple
    :max-size-bytes="5 * 1024 * 1024"
  />
</div>

## Props

<PropsTable name="FileUpload" />

## Slots

<SlotsTable name="FileUpload" />

## Events

<EventsTable name="FileUpload" />

## Accessibility

- The dropzone renders as a real `role="button"` with `tabindex="0"` (or `-1` when `isDisabled`). Clicking it, or pressing **Enter** or **Space** while it's focused, opens the native file picker — drag-and-drop is a supplementary interaction only, never the sole way to select a file.
- The hidden native `<input type="file">` is `aria-hidden` and untabbable (`tabindex="-1"`); it exists purely so the browser can host the OS file picker, and the dropzone is the actual keyboard/focus target.
- When `label` is set, `FieldLabel` is associated with the dropzone via matching `for`/`id`.
- `description` and `errorMessage` are wired to the dropzone through `aria-describedby`, and `errorMessage` only participates when `isInvalid` is true (via `useFormField`), matching the field-contract pattern shared with `Input`/`InputGroup`.
- `isDisabled` sets `aria-disabled="true"` and `data-disabled` on the dropzone, drops its `tabindex` to `-1`, and disables the native input and each file's remove button.
- Each selected file's remove button carries an `aria-label` of `Remove <file name>` so it's identifiable out of context in a screen reader's control list.
- Verified with `@chialab/vitest-axe`: zero violations with a label, with a populated file list, when `isInvalid` with an `errorMessage`, and when `isDisabled`.
