---
title: Editable
---

<script setup>
import {
  Editable, EditableArea, EditablePreview, EditableInput,
  EditableEditTrigger, EditableSubmitTrigger, EditableCancelTrigger,
} from '@auronui/vue';
</script>

# Editable

`Editable` is a click/double-click-to-edit inline text field, wrapping Reka UI's `Editable`
primitive family. It renders both a read-only preview and an editable input simultaneously —
Reka toggles which one is visible based on edit state, so `EditableArea` must always contain
both `EditablePreview` and `EditableInput` as children.

## Default

Clicking (focusing) the text enters edit mode. Blurring submits the value.

<div class="docs-example">
  <Editable default-value="Click to edit">
    <EditableArea>
      <EditablePreview />
      <EditableInput />
    </EditableArea>
  </Editable>
</div>

```vue-html
<Editable default-value="Click to edit">
  <EditableArea>
    <EditablePreview />
    <EditableInput />
  </EditableArea>
</Editable>
```

## With triggers

`EditableEditTrigger` (pencil), `EditableSubmitTrigger` (checkmark), and
`EditableCancelTrigger` (×) give users explicit affordances. Reka automatically shows/hides
each based on edit state — no manual `v-if` needed. Pair with `activation-mode="none"` to make
the pencil button the only way to enter edit mode.

<div class="docs-example">
  <Editable default-value="Click the pencil to edit" activation-mode="none">
    <EditableArea>
      <EditablePreview />
      <EditableInput />
    </EditableArea>
    <EditableEditTrigger />
    <EditableSubmitTrigger />
    <EditableCancelTrigger />
  </Editable>
</div>

```vue-html
<Editable default-value="Click the pencil to edit" activation-mode="none">
  <EditableArea>
    <EditablePreview />
    <EditableInput />
  </EditableArea>
  <EditableEditTrigger />
  <EditableSubmitTrigger />
  <EditableCancelTrigger />
</Editable>
```

## Double-click to edit

<div class="docs-example">
  <Editable default-value="Double-click to edit" activation-mode="dblclick">
    <EditableArea>
      <EditablePreview />
      <EditableInput />
    </EditableArea>
  </Editable>
</div>

```vue-html
<Editable default-value="Double-click to edit" activation-mode="dblclick">
  <EditableArea>
    <EditablePreview />
    <EditableInput />
  </EditableArea>
</Editable>
```

## Disabled

<div class="docs-example">
  <Editable default-value="Cannot edit this" :disabled="true">
    <EditableArea>
      <EditablePreview />
      <EditableInput />
    </EditableArea>
  </Editable>
</div>

```vue-html
<Editable default-value="Cannot edit this" :disabled="true">
  <EditableArea>
    <EditablePreview />
    <EditableInput />
  </EditableArea>
</Editable>
```

## Props

<PropsTable name="Editable" />

## Slots

<SlotsTable name="Editable" />

## Events

<EventsTable name="Editable" />

## Accessibility

`Editable` is built on Reka UI's `Editable` primitive family.

- **Role.** The preview element is a focusable `<span>` (`tabindex="0"`); the input is a real
  `<input>` element, inheriting native form-field semantics.
- **Keyboard.** With the default `activation-mode="focus"`, `Tab`-ing to the preview and typing
  enters edit mode. With `submit-mode="enter"` or `"both"`, pressing `Enter` submits the value.
  `Escape` cancels an in-progress edit and reverts to the last submitted value.
- **Triggers.** `EditableEditTrigger`/`EditableSubmitTrigger`/`EditableCancelTrigger` are real
  `<button>` elements with `aria-label`s, automatically shown/hidden by Reka based on edit
  state — screen reader users are never presented with a hidden, inert control.
- **Disabled/readonly.** `disabled` removes the field from interaction entirely; `readonly`
  keeps it focusable but prevents edits.
