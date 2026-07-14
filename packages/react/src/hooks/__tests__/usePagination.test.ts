import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePagination } from "../usePagination";

describe("usePagination", () => {
  it("computes totalPages and defaults", () => {
    const { result } = renderHook(() => usePagination({ totalItems: 200, pageSize: 20 }));
    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(10);
    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
  });

  it("has a minimum of 1 total page when there are no items", () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.totalPages).toBe(1);
    expect(result.current.isLast).toBe(true);
  });

  it("navigates to next/prev pages and clamps at boundaries", () => {
    const { result } = renderHook(() => usePagination({ totalItems: 30, pageSize: 10 }));

    act(() => result.current.nextPage());
    expect(result.current.page).toBe(2);

    act(() => result.current.nextPage());
    expect(result.current.page).toBe(3);
    expect(result.current.isLast).toBe(true);

    // no-op past the last page
    act(() => result.current.nextPage());
    expect(result.current.page).toBe(3);

    act(() => result.current.prevPage());
    expect(result.current.page).toBe(2);
  });

  it("goToPage clamps to the valid range", () => {
    const { result } = renderHook(() => usePagination({ totalItems: 30, pageSize: 10 }));

    act(() => result.current.goToPage(999));
    expect(result.current.page).toBe(3);

    act(() => result.current.goToPage(-5));
    expect(result.current.page).toBe(1);
  });

  it("onPageChange keeps page in sync", () => {
    const { result } = renderHook(() => usePagination({ totalItems: 30, pageSize: 10 }));

    act(() => result.current.onPageChange(2));
    expect(result.current.page).toBe(2);
  });
});
