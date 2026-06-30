import { describe, it, expect } from 'vitest'
import { useDisclosure } from '../useDisclosure'

describe('useDisclosure', () => {
  it('starts closed by default', () => {
    const { isOpen } = useDisclosure()
    expect(isOpen.value).toBe(false)
  })

  it('starts open when defaultOpen is true', () => {
    const { isOpen } = useDisclosure(true)
    expect(isOpen.value).toBe(true)
  })

  it('open() sets isOpen to true', () => {
    const { isOpen, open } = useDisclosure()
    open()
    expect(isOpen.value).toBe(true)
  })

  it('close() sets isOpen to false', () => {
    const { isOpen, close } = useDisclosure(true)
    close()
    expect(isOpen.value).toBe(false)
  })

  it('toggle() flips false to true', () => {
    const { isOpen, toggle } = useDisclosure()
    toggle()
    expect(isOpen.value).toBe(true)
  })

  it('toggle() flips true to false', () => {
    const { isOpen, toggle } = useDisclosure(true)
    toggle()
    expect(isOpen.value).toBe(false)
  })

  it('onOpenChange(true) opens', () => {
    const { isOpen, onOpenChange } = useDisclosure()
    onOpenChange(true)
    expect(isOpen.value).toBe(true)
  })

  it('onOpenChange(false) closes', () => {
    const { isOpen, onOpenChange } = useDisclosure(true)
    onOpenChange(false)
    expect(isOpen.value).toBe(false)
  })

  it('multiple toggle calls alternate state', () => {
    const { isOpen, toggle } = useDisclosure()
    toggle()
    toggle()
    toggle()
    expect(isOpen.value).toBe(true)
  })
})
