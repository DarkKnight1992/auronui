import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ref } from "vue";
import { useDeprecatedBooleanProp } from "../useDeprecatedBooleanProp";
import { _clearWarnedCache } from "../../utils/warnDeprecated";

describe("useDeprecatedBooleanProp", () => {
  beforeEach(() => {
    vi.stubEnv("DEV", true);
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    _clearWarnedCache();
  });

  it("uses the canonical value when only the canonical prop is set", () => {
    const resolved = useDeprecatedBooleanProp(
      "Switch", "isDisabled", () => true, "disabled", () => undefined,
    );
    expect(resolved.value).toBe(true);
  });

  it("falls back to the deprecated value when the canonical prop is unset", () => {
    const resolved = useDeprecatedBooleanProp(
      "Switch", "isDisabled", () => undefined, "disabled", () => true,
    );
    expect(resolved.value).toBe(true);
  });

  it("prefers the canonical value when both are set", () => {
    const resolved = useDeprecatedBooleanProp(
      "Switch", "isDisabled", () => false, "disabled", () => true,
    );
    expect(resolved.value).toBe(false);
  });

  it("applies the fallback when neither prop is set", () => {
    const resolved = useDeprecatedBooleanProp(
      "Switch", "isDisabled", () => undefined, "disabled", () => undefined, true,
    );
    expect(resolved.value).toBe(true);
  });

  it("warns once when the deprecated prop is explicitly passed, even as false", () => {
    const resolved = useDeprecatedBooleanProp(
      "Switch", "isDisabled", () => undefined, "disabled", () => false,
    );
    expect(resolved.value).toBe(false);
    expect(console.warn).toHaveBeenCalledWith(
      '[AuronUI] Switch: prop "disabled" is deprecated, use "isDisabled" instead.'
    );
  });

  it("does not warn when the deprecated prop is left undefined", () => {
    const resolved = useDeprecatedBooleanProp(
      "Switch", "isDisabled", () => true, "disabled", () => undefined,
    );
    expect(resolved.value).toBe(true);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("stays reactive to changes in the underlying prop source", () => {
    const disabled = ref<boolean | undefined>(undefined);
    const resolved = useDeprecatedBooleanProp(
      "Switch", "isDisabled", () => undefined, "disabled", () => disabled.value,
    );
    expect(resolved.value).toBe(false);
    disabled.value = true;
    expect(resolved.value).toBe(true);
  });

  it("accepts a fallback getter and stays reactive to it", () => {
    const contextDisabled = ref(false);
    const resolved = useDeprecatedBooleanProp(
      "AutocompleteInput", "isDisabled", () => undefined, "disabled", () => undefined,
      () => contextDisabled.value,
    );
    expect(resolved.value).toBe(false);
    contextDisabled.value = true;
    expect(resolved.value).toBe(true);
  });
});
