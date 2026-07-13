import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const commandPaletteVariants = tv({
  slots: {
    content: "command-palette__content",
    search: "command-palette__search",
    list: "command-palette__list",
    item: "command-palette__item",
    itemIcon: "command-palette__item-icon",
    itemLabel: "command-palette__item-label",
    itemShortcut: "command-palette__item-shortcut",
    empty: "command-palette__empty",
  },
});

export type CommandPaletteVariants = VariantProps<typeof commandPaletteVariants>;
