import { describe, it, expect } from 'vitest'
import { usePagination } from '../usePagination'

describe('usePagination', () => {
  it('defaults to page 1, pageSize 10', () => {
    const { page, pageSize } = usePagination()
    expect(page.value).toBe(1)
    expect(pageSize.value).toBe(10)
  })

  it('respects defaultPage option', () => {
    const { page } = usePagination({ defaultPage: 3, totalItems: 100 })
    expect(page.value).toBe(3)
  })

  it('computes totalPages correctly', () => {
    const { totalPages } = usePagination({ totalItems: 95, pageSize: 10 })
    expect(totalPages.value).toBe(10)
  })

  it('totalPages is at least 1 when totalItems is 0', () => {
    const { totalPages } = usePagination({ totalItems: 0 })
    expect(totalPages.value).toBe(1)
  })

  it('isFirst is true on page 1', () => {
    const { isFirst } = usePagination()
    expect(isFirst.value).toBe(true)
  })

  it('isLast is true when on last page', () => {
    const { isLast } = usePagination({ totalItems: 20, pageSize: 10, defaultPage: 2 })
    expect(isLast.value).toBe(true)
  })

  it('nextPage increments page', () => {
    const { page, nextPage } = usePagination({ totalItems: 30, pageSize: 10 })
    nextPage()
    expect(page.value).toBe(2)
  })

  it('nextPage is a no-op on last page', () => {
    const { page, nextPage } = usePagination({ totalItems: 10, pageSize: 10 })
    nextPage()
    expect(page.value).toBe(1)
  })

  it('prevPage decrements page', () => {
    const { page, prevPage } = usePagination({ totalItems: 30, pageSize: 10, defaultPage: 3 })
    prevPage()
    expect(page.value).toBe(2)
  })

  it('prevPage is a no-op on first page', () => {
    const { page, prevPage } = usePagination({ totalItems: 30, pageSize: 10 })
    prevPage()
    expect(page.value).toBe(1)
  })

  it('goToPage clamps to valid range', () => {
    const { page, goToPage } = usePagination({ totalItems: 30, pageSize: 10 })
    goToPage(99)
    expect(page.value).toBe(3)
    goToPage(-5)
    expect(page.value).toBe(1)
  })

  it('onPageChange updates page', () => {
    const { page, onPageChange } = usePagination({ totalItems: 30, pageSize: 10 })
    onPageChange(2)
    expect(page.value).toBe(2)
  })

  it('isFirst and isLast update reactively', () => {
    const { isFirst, isLast, nextPage } = usePagination({ totalItems: 20, pageSize: 10 })
    expect(isFirst.value).toBe(true)
    expect(isLast.value).toBe(false)
    nextPage()
    expect(isFirst.value).toBe(false)
    expect(isLast.value).toBe(true)
  })
})
