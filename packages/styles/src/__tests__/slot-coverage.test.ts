import {existsSync, readFileSync, readdirSync, statSync} from "node:fs";
import {join} from "node:path";

import {describe, expect, it} from "vitest";

/**
 * Guard: every slot this package defines must actually be applied by the
 * component that owns it, in BOTH @auronui/vue and @auronui/react.
 *
 * WHY THIS EXISTS
 * ---------------
 * A component that renders an element without its slot class is not just
 * unstyled — it silently pushes the styling onto the developer, who then has
 * to hand-write `class="modal__close-trigger"` at every call site. That is
 * exactly what happened in a28028f: `ModalClose` dropped `styles.closeTrigger()`
 * inside a commit about colors, nothing failed, and 21 story call sites grew a
 * hand-pasted class to compensate. This test is the mechanical check that would
 * have caught it.
 *
 * HOW TO RESPOND TO A FAILURE
 * ---------------------------
 * A NEW entry means a component stopped applying a slot it used to apply.
 * Fix the component — do not add it to the baseline. The baseline is a record
 * of pre-existing debt, frozen so it can only shrink.
 *
 * When you legitimately implement one of the baselined slots, delete its line.
 * The test asserts the baseline contains no stale entries, so it will tell you.
 */

const STYLES_DIR = new URL("../components", import.meta.url).pathname;
const PKG_ROOT = new URL("../../..", import.meta.url).pathname;

/**
 * Slots that no component renders today. Each is either an unimplemented
 * feature (`table.columnResizer` — there is no column resizer) or an element a
 * port never built (`tabs.overflowMenu` — React's TabList has no overflow menu).
 * Neither is a styling regression, but both are real gaps: this list is the
 * inventory. It may shrink, never grow.
 */
const BASELINE: Record<"vue" | "react", ReadonlySet<string>> = {
  vue: new Set([
    "alert-dialog.closeTrigger", "alert-dialog.trigger", "calendar-year-picker.trigger",
    "calendar-year-picker.triggerHeading", "calendar-year-picker.triggerIndicator",
    "calendar.cellIndicator", "calendar.monthCellLabel", "calendar.yearCell",
    "calendar.yearCellLabel", "calendar.yearGrid", "calendar.yearGridBody",
    "calendar.yearGridRow", "card.description", "card.title", "collapsible.content",
    "collapsible.heading", "color-picker.popover", "color-picker.trigger", "context-menu.root",
    "context-menu.trigger", "date-time-picker.scrollerColumn", "date-time-picker.scrollerItem",
    "date-time-picker.scrollerWrap", "drawer.content", "drawer.handle", "drawer.trigger",
    "fieldset.actions", "fieldset.description", "fieldset.fieldGroup", "hover-card.trigger",
    "input-otp.caret", "input-otp.input", "input-otp.separator", "input-otp.slotValue",
    "modal.icon", "modal.trigger", "popover.dialog", "popover.heading", "popover.trigger",
    "progress-circle.label", "range-calendar.cellIndicator", "range-calendar.monthCellLabel",
    "range-calendar.yearCellLabel", "stepper.indicatorText", "switch.icon",
    "table.columnResizer", "table.loadMore", "table.loadMoreContent",
    "table.resizableContainer", "tabs.separator", "toast.indicator", "transfer.itemCheckbox",
  ]),
  react: new Set([
    "alert-dialog.closeTrigger", "alert-dialog.trigger", "calendar-year-picker.trigger",
    "calendar-year-picker.triggerHeading", "calendar-year-picker.triggerIndicator",
    "calendar.cellIndicator", "calendar.gridRow", "calendar.monthCell",
    "calendar.monthCellLabel", "calendar.monthGrid", "calendar.monthGridBody",
    "calendar.monthGridRow", "calendar.yearCell", "calendar.yearCellLabel",
    "calendar.yearGrid", "calendar.yearGridBody", "calendar.yearGridRow", "card.description",
    "card.title", "collapsible.content", "collapsible.heading", "color-picker.popover",
    "color-picker.trigger", "date-time-picker.scrollerColumn", "date-time-picker.scrollerItem",
    "date-time-picker.scrollerWrap", "date-time-picker.tzItem", "date-time-picker.tzList",
    "date-time-picker.tzPanel", "date-time-picker.tzSearch", "drawer.content", "drawer.handle",
    "drawer.trigger", "dropdown.trigger", "fieldset.actions", "fieldset.description",
    "fieldset.fieldGroup", "hover-card.trigger", "input-otp.caret", "input-otp.input",
    "input-otp.separator", "input-otp.slotValue", "modal.icon", "modal.portal",
    "modal.trigger", "popover.heading", "popover.trigger", "progress-circle.label",
    "range-calendar.cellIndicator", "range-calendar.gridRow", "range-calendar.monthCell",
    "range-calendar.monthCellLabel", "range-calendar.monthGrid",
    "range-calendar.monthGridBody", "range-calendar.monthGridRow", "range-calendar.yearCell",
    "range-calendar.yearCellLabel", "range-calendar.yearGrid", "range-calendar.yearGridBody",
    "range-calendar.yearGridRow", "stepper.indicatorText", "switch.icon",
    "table.columnResizer", "table.loadMore", "table.loadMoreContent",
    "table.resizableContainer", "tabs.more", "tabs.moreBtn", "tabs.overflowItem",
    "tabs.overflowMenu", "tabs.scrollWrapper", "tabs.separator", "tabs.tabListContainer",
    "toast.indicator", "transfer.itemCheckbox",
  ]),
};

const TARGETS = [
  {name: "vue" as const, dir: join(PKG_ROOT, "vue/src/components"), ext: /\.(vue|ts)$/},
  {name: "react" as const, dir: join(PKG_ROOT, "react/src/components"), ext: /\.(tsx|ts)$/},
];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);

    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }

  return out;
}

/** Slot name -> first BEM class, read out of a `tv({slots: {...}})` literal. */
function readSlots(file: string): Record<string, string> {
  const src = readFileSync(file, "utf8");
  const anchor = src.match(/slots:\s*\{/);

  if (!anchor) return {};

  const open = src.indexOf("{", anchor.index! + "slots:".length);
  let depth = 0;
  let close = open;

  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0) {
      close = i;
      break;
    }
  }

  const body = src.slice(open + 1, close);
  const pairs = [...body.matchAll(/(?:^|\n)\s*([A-Za-z_$][\w$]*)\s*:\s*"([^"]*)"/g)];

  return Object.fromEntries(pairs.map((m) => [m[1], m[2]]));
}

/** A component "applies" a slot if it calls `.slotName(...)` or writes the literal class. */
function applies(source: string, slot: string, bemClass: string): boolean {
  const call = new RegExp(`\\.${slot}\\??\\.?\\(`);

  return call.test(source) || source.includes(bemClass.split(" ")[0]);
}

describe.each(TARGETS)("$name applies every style slot it owns", ({name, dir, ext}) => {
  const baseline = BASELINE[name];
  const unapplied: string[] = [];

  for (const component of readdirSync(STYLES_DIR)) {
    const stylesFile = join(STYLES_DIR, component, `${component}.styles.ts`);

    if (!existsSync(stylesFile)) continue;

    const componentDir = join(dir, component);

    // A component family the port has not built at all is out of scope here —
    // that is a missing component, not an unapplied slot.
    if (!existsSync(componentDir)) continue;

    const source = walk(componentDir)
      .filter((f) => ext.test(f) && !f.includes("__tests__"))
      .map((f) => readFileSync(f, "utf8"))
      .join("\n");

    for (const [slot, bemClass] of Object.entries(readSlots(stylesFile))) {
      if (!applies(source, slot, bemClass)) unapplied.push(`${component}.${slot}`);
    }
  }

  it("has no slot that stopped being applied", () => {
    const regressions = unapplied.filter((s) => !baseline.has(s)).sort();

    expect(
      regressions,
      `These style slots are no longer applied by any @auronui/${name} component, so a ` +
        `developer would have to hand-write the class to get the intended rendering. ` +
        `Apply the slot in the component — do not add it to BASELINE.`,
    ).toEqual([]);
  });

  it("has no stale baseline entries", () => {
    const stale = [...baseline].filter((s) => !unapplied.includes(s)).sort();

    expect(
      stale,
      `These slots are now applied but are still listed in BASELINE. Delete them ` +
        `from the ${name} baseline so it keeps shrinking.`,
    ).toEqual([]);
  });
});
