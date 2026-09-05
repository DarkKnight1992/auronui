<!--
  Image — content <img> replacement with lazy-loading, load-error
  fallback, and optional click-to-zoom lightbox. Distinct from Avatar
  (identity-photo-specific, fixed circular/square crop) — Image is for
  general content (product photos, article images, galleries).

  Built on reka-ui's AvatarRoot/AvatarImage/AvatarFallback — despite the
  "Avatar" naming, these primitives are generic load-state trackers (a
  plain <img> under the hood); the circular shape lives entirely in
  Avatar's own CSS class, not the primitive. Image applies its own,
  non-circular styling to the same primitives.

  Lazy-loading uses @vueuse/core's useIntersectionObserver rather than
  relying solely on the native `loading="lazy"` attribute, which browsers
  may ignore for above-the-fold heuristics — `src` is only set on
  AvatarImage once the root enters the viewport.

  Click-to-zoom reuses the existing Modal component for the enlarged view
  — no new overlay/focus-trap logic needed.
-->
<script setup lang="ts">
import { computed, ref, useAttrs, useTemplateRef } from 'vue'
import { AvatarRoot, AvatarImage, AvatarFallback } from 'reka-ui'
import { useIntersectionObserver } from '@vueuse/core'
import { imageVariants, type ImageVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import Modal from '../modal/Modal.vue'
import ModalContent from '../modal/ModalContent.vue'
import ModalClose from '../modal/ModalClose.vue'
import CloseButton from '../button/CloseButton.vue'

// The template has two top-level roots (AvatarRoot + Modal, the latter
// needed for the zoom lightbox) — Vue can't auto-inherit fallthrough
// attrs (e.g. a consumer's `style`/`width`) onto a specific one when
// there's more than one root node, so it's disabled and bound manually
// onto AvatarRoot, the element consumers actually mean to size/style.
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    fallbackSrc?: string
    isLazy?: boolean
    isZoomable?: boolean
    fit?: ImageVariants['fit']
    radius?: ImageVariants['radius']
    class?: ClassValue
    classNames?: Partial<{
      base: ClassValue
      img: ClassValue
      fallback: ClassValue
      zoomTrigger: ClassValue
    }>
  }>(),
  {
    fallbackSrc: undefined,
    isLazy: true,
    isZoomable: false,
    fit: 'cover',
    radius: 'md',
    class: undefined,
    classNames: undefined,
  },
)

const emit = defineEmits<{
  load: []
  error: []
}>()

const attrs = useAttrs()

const rootEl = useTemplateRef<InstanceType<typeof AvatarRoot>>('rootEl')
const isVisible = ref(!props.isLazy)
const hasErrored = ref(false)
const isZoomOpen = ref(false)

const { stop } = useIntersectionObserver(
  rootEl,
  ([entry]) => {
    if (entry?.isIntersecting) {
      isVisible.value = true
      stop()
    }
  },
  { immediate: props.isLazy },
)

const activeSrc = computed(() => (hasErrored.value ? props.fallbackSrc : props.src))
const showImage = computed(() => isVisible.value && !!activeSrc.value)

function handleLoadingStatusChange(status: string) {
  if (status === 'loaded') emit('load')
  if (status === 'error') {
    hasErrored.value = true
    emit('error')
  }
}

const slotFns = computed(() => imageVariants({ fit: props.fit, radius: props.radius }))
</script>

<template>
  <AvatarRoot
    ref="rootEl"
    v-bind="attrs"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    data-slot="image"
  >
    <AvatarImage
      v-if="showImage"
      :src="activeSrc!"
      :alt="alt"
      :class="composeClassName(slotFns.img(), props.classNames?.img)"
      data-slot="image-img"
      @loading-status-change="handleLoadingStatusChange"
    />
    <AvatarFallback
      :class="composeClassName(slotFns.fallback(), props.classNames?.fallback)"
      data-slot="image-fallback"
    >
      <slot name="fallback">
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
          <rect
            width="18"
            height="18"
            x="3"
            y="3"
            rx="2"
          />
          <circle
            cx="9"
            cy="9"
            r="2"
          />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </slot>
    </AvatarFallback>
    <button
      v-if="isZoomable && showImage"
      type="button"
      :class="composeClassName(slotFns.zoomTrigger(), props.classNames?.zoomTrigger)"
      data-slot="image-zoom-trigger"
      :aria-label="`Zoom in on ${alt}`"
      @click="isZoomOpen = true"
    />
  </AvatarRoot>

  <Modal
    v-if="isZoomable"
    :open="isZoomOpen"
    size="lg"
    variant="blur"
    @update:open="isZoomOpen = $event"
  >
    <ModalContent>
      <ModalClose as-child>
        <CloseButton aria-label="Close zoomed image" />
      </ModalClose>
      <img
        v-if="activeSrc"
        :src="activeSrc"
        :alt="alt"
        style="display: block; max-width: 100%; max-height: 80vh; margin: 0 auto; object-fit: contain;"
      >
    </ModalContent>
  </Modal>
</template>
