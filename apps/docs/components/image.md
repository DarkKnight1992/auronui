---
title: Image
---

<script setup>
import { Image } from '@auronui/vue';
</script>

# Image

A content `<img>` replacement with lazy-loading, a load-error fallback, and an optional
click-to-zoom lightbox. Built on Reka UI's `AvatarRoot`/`AvatarImage`/`AvatarFallback` —
despite the "Avatar" naming, these primitives are generic load-state trackers, not
identity-photo-specific — so `Image` applies its own non-circular styling on top of them.
Use `Image` for general content (product photos, article images, galleries); use `Avatar`
for identity photos with a fixed circular/square crop.

By default `src` is only assigned once the component scrolls into the viewport
(via `@vueuse/core`'s `useIntersectionObserver`), rather than relying solely on the native
`loading="lazy"` attribute. Pass `isLazy="false"` to load immediately. If the image fails to
load (or before it loads), the fallback slot content is shown; pass `fallbackSrc` to fall
back to a different image URL instead of the default icon.

## Example

<div class="docs-example">
  <div style="display:flex;flex-wrap:wrap;gap:16px">
    <Image src="https://picsum.photos/id/1015/300/200" alt="A river winding through a mountain valley" width="200" is-lazy="false" />
    <Image src="https://picsum.photos/id/1018/300/200" alt="A forest lake at sunrise" width="200" radius="full" is-lazy="false" is-zoomable />
  </div>
</div>

```vue-html
<Image src="/river.jpg" alt="A river winding through a mountain valley" width="200" />
<Image src="/lake.jpg" alt="A forest lake at sunrise" width="200" radius="full" is-zoomable />
```

## Props

<PropsTable name="Image" />

## Slots

<SlotsTable name="Image" />

## Events

<EventsTable name="Image" />

## Accessibility

- `alt` is required and is forwarded directly onto the underlying `<img>`
  (`data-slot="image-img"`) — always pass a meaningful description of the image content, or
  an empty string (`alt=""`) if the image is purely decorative.
- `Image` is built on Reka UI's `AvatarRoot`/`AvatarImage`/`AvatarFallback` primitives, which
  track load state (idle/loading/loaded/error) and swap the `<img>` for fallback content
  automatically; the swap carries no ARIA live region, so assistive tech is not proactively
  notified when a lazy or failed image finishes loading — the `alt` text on the eventual
  `<img>` is what gets announced once it's reached.
- The default fallback content (shown while loading, before the element intersects the
  viewport, or after a load error) is a decorative `<svg>` marked `aria-hidden="true"`. If
  you override it via the `#fallback` slot, ensure your replacement content is either purely
  decorative or carries its own accessible text.
- When `isZoomable` is true, a zoom-trigger `<button>` (`data-slot="image-zoom-trigger"`) is
  overlaid on the image once it has loaded, with `aria-label="Zoom in on {alt}"` so its
  purpose is announced even though it has no visible text.
- The zoom lightbox reuses the existing `Modal` component, so it inherits `Modal`'s full
  accessibility contract: focus is trapped and moved into the dialog on open, Escape and the
  close button (labeled "Close zoomed image") dismiss it, and focus is restored to the zoom
  trigger on close.
- Verified with `@chialab/vitest-axe`: zero violations in the default state and with
  `isZoomable` enabled (`Image.axe.test.ts`).

