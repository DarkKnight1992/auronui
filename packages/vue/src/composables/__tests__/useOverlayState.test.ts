import { describe, it, expect, vi } from "vitest";
import { useOverlayState } from "../useOverlayState";

describe("useOverlayState", () => {
  describe("uncontrolled mode (no modelValue)", () => {
    it("starts closed by default", () => {
      const { isOpen } = useOverlayState();
      expect(isOpen.value).toBe(false);
    });

    it("starts open when defaultOpen is true", () => {
      const { isOpen } = useOverlayState({ defaultOpen: true });
      expect(isOpen.value).toBe(true);
    });

    it("setOpen(true) opens the overlay", () => {
      const { isOpen, setOpen } = useOverlayState();
      setOpen(true);
      expect(isOpen.value).toBe(true);
    });

    it("setOpen(false) closes the overlay", () => {
      const { isOpen, setOpen } = useOverlayState({ defaultOpen: true });
      setOpen(false);
      expect(isOpen.value).toBe(false);
    });

    it("open() sets isOpen to true", () => {
      const { isOpen, open } = useOverlayState();
      open();
      expect(isOpen.value).toBe(true);
    });

    it("close() sets isOpen to false", () => {
      const { isOpen, close } = useOverlayState({ defaultOpen: true });
      close();
      expect(isOpen.value).toBe(false);
    });

    it("toggle() flips isOpen from false to true", () => {
      const { isOpen, toggle } = useOverlayState();
      toggle();
      expect(isOpen.value).toBe(true);
    });

    it("toggle() flips isOpen from true to false", () => {
      const { isOpen, toggle } = useOverlayState({ defaultOpen: true });
      toggle();
      expect(isOpen.value).toBe(false);
    });
  });

  describe("controlled mode (modelValue provided)", () => {
    it("isOpen reflects modelValue, not internalOpen", () => {
      const { isOpen } = useOverlayState({ modelValue: true });
      expect(isOpen.value).toBe(true);
    });

    it("isOpen reflects modelValue: false even if defaultOpen is true", () => {
      const { isOpen } = useOverlayState({ modelValue: false, defaultOpen: true });
      expect(isOpen.value).toBe(false);
    });

    it("setOpen does NOT mutate internalOpen in controlled mode", () => {
      // In controlled mode, the external state owns the value.
      // setOpen should call onOpenChange but NOT change what isOpen returns.
      const onOpenChange = vi.fn();
      const { isOpen, setOpen } = useOverlayState({
        modelValue: false,
        onOpenChange,
      });
      setOpen(true);
      // isOpen should still be false (controlled by modelValue: false)
      expect(isOpen.value).toBe(false);
      // onOpenChange should have been called
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("isOpen stays at modelValue after setOpen is called in controlled mode", () => {
      const { isOpen, setOpen } = useOverlayState({ modelValue: true });
      setOpen(false);
      // Still true because modelValue is the source of truth
      expect(isOpen.value).toBe(true);
    });
  });

  describe("onOpenChange callback", () => {
    it("is called when setOpen is called in uncontrolled mode", () => {
      const onOpenChange = vi.fn();
      const { setOpen } = useOverlayState({ onOpenChange });
      setOpen(true);
      expect(onOpenChange).toHaveBeenCalledOnce();
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("is called when setOpen is called in controlled mode", () => {
      const onOpenChange = vi.fn();
      const { setOpen } = useOverlayState({ modelValue: false, onOpenChange });
      setOpen(true);
      expect(onOpenChange).toHaveBeenCalledOnce();
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("is called with false when close() is called", () => {
      const onOpenChange = vi.fn();
      const { close } = useOverlayState({ defaultOpen: true, onOpenChange });
      close();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("is called when toggle() is called", () => {
      const onOpenChange = vi.fn();
      const { toggle } = useOverlayState({ onOpenChange });
      toggle();
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("is not required (no-op when not provided)", () => {
      const { setOpen } = useOverlayState();
      expect(() => setOpen(true)).not.toThrow();
    });
  });
});
