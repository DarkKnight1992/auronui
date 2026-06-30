import { describe, it, expect } from 'vitest'
import { useTabs } from '../useTabs'

describe('useTabs', () => {
  it('starts with undefined activeTab by default', () => {
    const { activeTab } = useTabs()
    expect(activeTab.value).toBeUndefined()
  })

  it('respects defaultTab option', () => {
    const { activeTab } = useTabs({ defaultTab: 'overview' })
    expect(activeTab.value).toBe('overview')
  })

  it('setTab updates activeTab', () => {
    const { activeTab, setTab } = useTabs({ defaultTab: 'overview' })
    setTab('settings')
    expect(activeTab.value).toBe('settings')
  })

  it('onTabChange updates activeTab', () => {
    const { activeTab, onTabChange } = useTabs()
    onTabChange('details')
    expect(activeTab.value).toBe('details')
  })

  it('switching tabs updates activeTab correctly', () => {
    const { activeTab, setTab } = useTabs({ defaultTab: 'a' })
    setTab('b')
    setTab('c')
    expect(activeTab.value).toBe('c')
  })
})
