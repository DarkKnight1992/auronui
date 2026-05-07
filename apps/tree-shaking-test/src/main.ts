// Tree-shaking test: import only dataAttr.
// The built bundle must NOT include useListData, useOverlayState,
// useIsMounted, composeClassName, etc.
import { dataAttr } from "@auronui/vue";

// Use it (so the bundler doesn't dead-code-eliminate the import)
const el = document.createElement("div");
el.dataset.disabled = dataAttr(true) ?? "";
document.body.appendChild(el);
