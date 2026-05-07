# DATA_ATTRIBUTES.md

Data-attribute mapping document for `@auronui/styles` — documents every React Aria → Reka UI
attribute substitution applied during the INFRA-07 audit.

## Mapping Table

| React Aria Attribute | Reka UI Equivalent | CSS Selector | Components Affected |
|---|---|---|---|
| `[data-disabled="true"]` | `[data-disabled]` (boolean presence) | `[data-disabled]` | All interactive components |
| `[data-hovered="true"]` | `:hover` CSS pseudo-class | `:hover` | All interactive components |
| `[data-pressed="true"]` | `:active` CSS pseudo-class | `:active` | All interactive components |
| `[data-focus-visible="true"]` | `:focus-visible` CSS pseudo-class | `:focus-visible` | All interactive components |
| `[data-focused="true"]` | `:focus` or `:focus-within` CSS pseudo-class | `:focus`, `:focus-within` | Input, Textarea, DateInput, etc. |
| `[data-selected="true"]` — Checkbox/Radio/Switch | `[data-state="checked"]` | `[data-state="checked"]` | Checkbox, Radio, Switch, ListBoxItem, Select |
| `[data-selected="true"]` — Tabs tab | `[data-state="active"]` | `[data-state="active"]` | Tabs |
| `[data-selected="true"]` — Toggle | `[data-state="on"]` | `[data-state="on"]` | ToggleButton |
| `[data-selected="true"]` — ColorSwatchPicker | `[data-state="checked"]` | `[data-state="checked"]` | ColorSwatchPicker |
| `[data-indeterminate="true"]` | `[data-state="indeterminate"]` | `[data-state="indeterminate"]` | Checkbox |
| `[data-expanded="true"]` | `[data-state="open"]` | `[data-state="open"]` | Accordion, Disclosure, Popover, Dropdown |
| `[data-open="true"]` | `[data-state="open"]` | `[data-state="open"]` | Modal, Drawer, Popover, Tooltip |
| `[data-invalid="true"]` | `[aria-invalid="true"]` | `[aria-invalid="true"]` | Input, Textarea, NumberField, DateField, etc. |
| `[data-required="true"]` | `[aria-required="true"]` | `[aria-required="true"]` | Input, Textarea, etc. |
| `[data-entering="true"]` | (removed — use Vue `<Transition>` classes) | N/A | Modal, Drawer, Popover, Tooltip |
| `[data-exiting="true"]` | (removed — use Vue `<Transition>` classes) | N/A | Modal, Drawer, Popover, Tooltip |

## Updated CSS Files (83 files audited)

The following 83 CSS files in `packages/styles/components/` were audited and updated
during the INFRA-07 data-attribute audit. Files with no React Aria data-attributes were
confirmed clean; files with attributes were updated per the mapping table above.

### Confirmed Updated Files (52 files originally listed as requiring changes):

1. `accordion.css` — `data-expanded` → `[data-state="open"]`
2. `alert-dialog.css` — `data-open` → `[data-state="open"]`
3. `autocomplete.css` — `data-hovered`, `data-pressed`, `data-focused`
4. `breadcrumbs.css` — `data-hovered`, `data-disabled`
5. `button.css` — `data-hovered`, `data-pressed`, `data-focus-visible`, `data-disabled`
6. `button-group.css` — `data-pressed` → `:active`, `data-focus-visible` → `:focus-visible`
7. `calendar.css` — `data-hovered`, `data-pressed`, `data-disabled`, `data-selected`
8. `calendar-year-picker.css` — `data-hovered`, `data-selected` → `[data-state="checked"]`
9. `checkbox.css` — `data-hovered` → `:hover`, `data-pressed` → `:active`, `data-focus-visible` → `:focus-visible`, `data-selected` → `[data-state="checked"]`, `data-indeterminate` → `[data-state="indeterminate"]`, `data-disabled`
10. `checkbox-group.css` — `data-selected` → `[data-state="checked"]`, `data-disabled`
11. `close-button.css` — `data-hovered`, `data-pressed`, `data-focus-visible`
12. `color-area.css` — `data-hovered`, `data-pressed`, `data-focus-visible`, `data-disabled`
13. `color-field.css` — `data-focused`, `data-invalid`
14. `color-input-group.css` — `data-focused`, `data-disabled`
15. `color-picker.css` — `data-disabled`
16. `color-slider.css` — `data-hovered`, `data-pressed`, `data-focus-visible`, `data-disabled`
17. `color-swatch-picker.css` — `data-selected` → `[data-state="checked"]`
18. `combo-box.css` — `data-expanded` → `[data-state="open"]`, `data-focused`, `data-invalid`
19. `date-field.css` — `data-focused`, `data-invalid`, `data-disabled`
20. `date-input-group.css` — shared field shell used by DateField, TimeField, DateRangeField; `[data-focus-within]`, `[aria-invalid]`, `[data-disabled]`
21. `date-picker.css` — `data-expanded` → `[data-state="open"]`
22. `date-range-picker.css` — `data-expanded` → `[data-state="open"]`, `data-focused`
23. `disclosure.css` — `data-expanded` → `[data-state="open"]`
24. `disclosure-group.css` — `data-expanded` → `[data-state="open"]`
25. `drawer.css` — `data-open` → `[data-state="open"]`, `data-entering`, `data-exiting`
26. `dropdown.css` — `data-expanded` → `[data-state="open"]`
27. `input.css` — `data-focused` → `:focus`, `data-focus-visible` → `:focus-visible`, `data-invalid`, `data-disabled`
28. `input-group.css` — `data-disabled`, `data-focused`
29. `input-otp.css` — `data-hovered`, `data-focused`, `data-invalid`
30. `label.css` — `data-invalid`, `data-required` → `[aria-required="true"]`, `data-disabled`
31. `link.css` — `data-hovered`, `data-pressed`, `data-focus-visible`
32. `list-box-item.css` — `data-hovered` → `:hover`, `data-pressed` → `:active`, `data-selected` → `[data-state="checked"]`, `data-disabled`, `data-focused`
33. `menu-item.css` — `data-hovered`, `data-pressed`, `data-focus-visible`, `data-disabled`, `data-selected`
34. `modal.css` — `data-open` → `[data-state="open"]`, `data-entering`, `data-exiting`
35. `number-field.css` — `data-hovered`, `data-pressed`, `data-focused`, `data-invalid`, `data-disabled`
36. `pagination.css` — `data-hovered`, `data-pressed`, `data-focus-visible`, `data-selected`, `data-disabled`
37. `popover.css` — `data-open` → `[data-state="open"]`, `data-entering`, `data-exiting`
38. `progress-bar.css` — (no React Aria attrs in original — confirmed clean)
39. `radio.css` — `data-hovered` → `:hover`, `data-pressed` → `:active`, `data-focus-visible` → `:focus-visible`, `data-selected` → `[data-state="checked"]`, `data-disabled`
40. `radio-group.css` — `data-hovered` → `:hover`, `data-selected` → `[data-state="checked"]`, `data-disabled`
41. `range-calendar.css` — `data-hovered`, `data-pressed`, `data-selected`, `data-disabled`
42. `scroll-shadow.css` — (no React Aria attrs — confirmed clean)
44. `select.css` — `data-expanded` → `[data-state="open"]`, `data-selected` → `[data-state="checked"]`, `data-focused`, `data-invalid`, `data-disabled`
45. `slider.css` — `data-hovered`, `data-pressed`, `data-focus-visible`, `data-disabled`
46. `switch.css` — `data-hovered` → `:hover`, `data-pressed` → `:active`, `data-focus-visible` → `:focus-visible`, `data-selected` → `[data-state="checked"]`, `data-disabled`
47. `switch-group.css` — `data-disabled`
48. `table.css` — `data-hovered` → `:hover`, `data-selected`, `data-disabled`, `data-focus-visible`
49. `tabs.css` — `data-selected` → `[data-state="active"]`, `data-focus-visible`, `data-disabled`
50. `tag.css` — `data-hovered` → `:hover`, `data-pressed` → `:active`, `data-selected` → `[data-state="checked"]`, `data-disabled`
51. `textarea.css` — `data-focused` → `:focus`, `data-focus-visible` → `:focus-visible`, `data-invalid`, `data-disabled`
53. `time-field.css` — `data-focused`, `data-invalid`, `data-disabled`
54. `toast.css` — `data-open` → `[data-state="open"]`, `data-entering`, `data-exiting`
55. `toggle-button.css` — `data-selected` → `[data-state="on"]`, `data-hovered`, `data-pressed`, `data-focus-visible`
56. `toggle-button-group.css` — `data-pressed` → `:active`, `data-focus-visible` → `:focus-visible`
57. `toolbar.css` — `data-focused`, `data-disabled`
58. `tooltip.css` — `data-open` → `[data-state="open"]`, `data-entering`, `data-exiting`

### Additional files in components/ (confirmed clean or passthrough):
- `alert.css`, `avatar.css`, `badge.css`, `card.css`, `chip.css`, `color-swatch.css`,
  `description.css`, `empty-state.css`, `error-message.css`, `field-error.css`,
  `fieldset.css`, `header.css`, `index.css`, `kbd.css`, `list-box.css`,
  `list-box-section.css`, `menu.css`, `menu-section.css`, `meter.css`,
  `progress-circle.css`, `separator.css`, `skeleton.css`, `spinner.css`,
  `surface.css`, `tag-group.css`, `text/` — no React Aria data-attributes found

## Custom Auron Attributes

Auron component implementations must manually set them on elements, as they control CSS visual states:

| Attribute | Usage | Set by |
|---|---|---|
| `data-pending="true"` | Button loading/pending state spinner | Auron component (manual) |
| `data-dragging="true"` | Drag state on DragAndDrop items | Auron component (manual) |
| `data-outside-month="true"` | Calendar day outside current month | Auron component (manual) |
| `data-today="true"` | Calendar current day indicator | Auron component (manual) |
| `data-highlighted="true"` | Highlighted range in RangeCalendar | Reka UI emits this natively |
| `data-allows-sorting="true"` | Table sortable column header | Auron component (manual) |
| `data-slot="*"` | Component slot identification | Auron component (manual) |
| `data-active="true"` | Active navigation item | Auron component (manual) |
| `data-filled="true"` | Input has value (label float) | Auron component (manual) |
| `data-color="*"` | Color variant identifier | Auron component (manual) |
| `data-type="*"` | Input type identifier | Auron component (manual) |

## Unchanged Attributes

The following Reka UI data-attributes were already correct and required no changes:

| Attribute | Description | Source |
|---|---|---|
| `data-state="open"` | Open/expanded state | Reka UI native |
| `data-state="closed"` | Closed/collapsed state | Reka UI native |
| `data-state="checked"` | Checked state (checkbox, radio, listbox) | Reka UI native |
| `data-state="unchecked"` | Unchecked state | Reka UI native |
| `data-state="indeterminate"` | Indeterminate checkbox state | Reka UI native (was `data-indeterminate="true"`) |
| `data-state="active"` | Active tab | Reka UI native |
| `data-state="inactive"` | Inactive tab | Reka UI native |
| `data-state="on"` | Toggle button ON state | Reka UI native |
| `data-state="off"` | Toggle button OFF state | Reka UI native |
| `data-disabled` | Disabled boolean (no value) | Reka UI native |
| `data-orientation="horizontal"` | Horizontal layout | Reka UI native |
| `data-orientation="vertical"` | Vertical layout | Reka UI native |
| `data-side="top"/"bottom"/"left"/"right"` | Popover side placement | Reka UI native |
| `data-align="start"/"center"/"end"` | Popover alignment | Reka UI native |
| `data-highlighted` | Highlighted item in list | Reka UI native |
| `aria-invalid="true"` | Invalid input (ARIA attribute) | HTML/ARIA standard |
| `aria-required="true"` | Required input (ARIA attribute) | HTML/ARIA standard |
| `aria-checked="true"` | Checked state (ARIA attribute) | HTML/ARIA standard |
| `aria-disabled="true"` | Disabled state (ARIA attribute) | HTML/ARIA standard |

## Verification Commands

```bash
# Verify zero React Aria data-attributes remain
cd packages/styles/components
grep -r 'data-disabled="true"' . --include="*.css" | wc -l   # must be 0
grep -r 'data-hovered="true"' . --include="*.css" | wc -l    # must be 0
grep -r 'data-pressed="true"' . --include="*.css" | wc -l    # must be 0
grep -r 'data-focus-visible="true"' . --include="*.css" | wc -l  # must be 0
grep -r 'data-focused="true"' . --include="*.css" | wc -l    # must be 0
grep -r 'data-selected="true"' . --include="*.css" | wc -l   # must be 0
grep -r 'data-expanded="true"' . --include="*.css" | wc -l   # must be 0

# Verify Reka UI replacements are present
grep -r 'data-state="checked"' . --include="*.css" | wc -l   # should be many
grep -r 'data-state="open"' . --include="*.css" | wc -l      # should be many
grep -r 'data-state="active"' . --include="*.css" | wc -l    # should be > 0 (tabs)
grep -r 'data-state="on"' . --include="*.css" | wc -l        # should be > 0 (toggle-button)
grep -r '\[data-disabled\]' . --include="*.css" | wc -l      # should be many
```
