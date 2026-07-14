import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTabs } from "../useTabs";

describe("useTabs", () => {
  it("defaults to undefined active tab", () => {
    const { result } = renderHook(() => useTabs());
    expect(result.current.activeTab).toBeUndefined();
  });

  it("respects defaultTab", () => {
    const { result } = renderHook(() => useTabs({ defaultTab: "overview" }));
    expect(result.current.activeTab).toBe("overview");
  });

  it("setTab updates the active tab", () => {
    const { result } = renderHook(() => useTabs({ defaultTab: "overview" }));
    act(() => result.current.setTab("settings"));
    expect(result.current.activeTab).toBe("settings");
  });

  it("onTabChange keeps activeTab in sync", () => {
    const { result } = renderHook(() => useTabs());
    act(() => result.current.onTabChange("settings"));
    expect(result.current.activeTab).toBe("settings");
  });
});
