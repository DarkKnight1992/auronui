import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const drawerVariants = tv({
  defaultVariants: {
    placement: "bottom",
    variant: "opaque",
  },
  slots: {
    backdrop: "drawer__backdrop",
    body: "drawer__body",
    closeTrigger: "drawer__close-trigger",
    content: "drawer__content",
    dialog: "drawer__dialog",
    footer: "drawer__footer",
    handle: "drawer__handle",
    header: "drawer__header",
    heading: "drawer__heading",
    trigger: "drawer__trigger",
    dockContainer: "drawer__dock-container",
    main: "drawer__main",
  },
  variants: {
    inline: {
      true: {
        dialog: "drawer__dialog--inline",
      },
    },
    dock: {
      true: {
        dialog: "drawer__dialog--dock",
      },
    },
    placement: {
      bottom: {
        content: "drawer__content--bottom",
        dialog: "drawer__dialog--bottom",
        dockContainer: "drawer__dock-container--bottom",
      },
      left: {
        content: "drawer__content--left",
        dialog: "drawer__dialog--left",
        dockContainer: "drawer__dock-container--left",
      },
      right: {
        content: "drawer__content--right",
        dialog: "drawer__dialog--right",
        dockContainer: "drawer__dock-container--right",
      },
      top: {
        content: "drawer__content--top",
        dialog: "drawer__dialog--top",
        dockContainer: "drawer__dock-container--top",
      },
    },
    variant: {
      blur: {
        backdrop: "drawer__backdrop--blur",
      },
      opaque: {
        backdrop: "drawer__backdrop--opaque",
      },
      transparent: {
        backdrop: "drawer__backdrop--transparent",
      },
    },
  },
});

export type DrawerVariants = VariantProps<typeof drawerVariants>;
