import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useStepper } from "../useStepper";

describe("useStepper", () => {
  it("defaults to step 1", () => {
    const { result } = renderHook(() => useStepper({ totalSteps: 4 }));
    expect(result.current.step).toBe(1);
    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
  });

  it("derives totalSteps from a steps array over totalSteps option", () => {
    const { result } = renderHook(() => useStepper({ steps: ["a", "b", "c"], totalSteps: 99 }));
    expect(result.current.totalSteps).toBe(3);
  });

  it("advances and retreats, clamping at boundaries", () => {
    const { result } = renderHook(() => useStepper({ totalSteps: 3 }));

    act(() => result.current.nextStep());
    expect(result.current.step).toBe(2);

    act(() => result.current.nextStep());
    expect(result.current.step).toBe(3);
    expect(result.current.isLast).toBe(true);

    act(() => result.current.nextStep());
    expect(result.current.step).toBe(3);

    act(() => result.current.prevStep());
    expect(result.current.step).toBe(2);
  });

  it("reset returns to step 1", () => {
    const { result } = renderHook(() => useStepper({ totalSteps: 3, defaultStep: 3 }));
    act(() => result.current.reset());
    expect(result.current.step).toBe(1);
  });

  it("getStepStatus reports completed/current/pending", () => {
    const { result } = renderHook(() => useStepper({ totalSteps: 3, defaultStep: 2 }));
    expect(result.current.getStepStatus(1)).toBe("completed");
    expect(result.current.getStepStatus(2)).toBe("current");
    expect(result.current.getStepStatus(3)).toBe("pending");
  });

  it("onStepChange keeps step in sync", () => {
    const { result } = renderHook(() => useStepper({ totalSteps: 3 }));
    act(() => result.current.onStepChange(3));
    expect(result.current.step).toBe(3);
  });
});
