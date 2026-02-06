import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import useScrollAnimation from './useScrollAnimation'

describe('useScrollAnimation Hook', () => {
  beforeEach(() => {
    // Mock is already set up in setup.js
  })

  describe('Return Values', () => {
    it('should return a ref and initial visibility state', () => {
      const { result } = renderHook(() => useScrollAnimation())

      const [ref, isVisible] = result.current

      expect(ref).toBeDefined()
      expect(ref.current).toBeNull()
      expect(typeof isVisible).toBe('boolean')
    })

    it('should return array with two elements', () => {
      const { result } = renderHook(() => useScrollAnimation())

      expect(Array.isArray(result.current)).toBe(true)
      expect(result.current).toHaveLength(2)
    })
  })

  describe('Basic Functionality', () => {
    it('should accept custom options', () => {
      // Should not throw
      const { result } = renderHook(() => useScrollAnimation({ threshold: 0.5 }))

      const [ref, isVisible] = result.current
      expect(ref).toBeDefined()
      expect(typeof isVisible).toBe('boolean')
    })

    it('should accept custom rootMargin option', () => {
      // Should not throw
      const { result } = renderHook(() => useScrollAnimation({ rootMargin: '50px' }))

      const [ref, isVisible] = result.current
      expect(ref).toBeDefined()
      expect(typeof isVisible).toBe('boolean')
    })

    it('should work with empty options', () => {
      const { result } = renderHook(() => useScrollAnimation({}))

      const [ref, isVisible] = result.current
      expect(ref).toBeDefined()
      expect(typeof isVisible).toBe('boolean')
    })
  })

  describe('Cleanup', () => {
    it('should not throw error on unmount without ref', () => {
      const { unmount } = renderHook(() => useScrollAnimation())

      // Should not throw
      expect(() => unmount()).not.toThrow()
    })

    it('should not throw error on unmount with ref', () => {
      const { result, unmount } = renderHook(() => useScrollAnimation())
      const [ref] = result.current

      // Attach ref to element
      const mockElement = document.createElement('div')
      ref.current = mockElement

      // Should not throw
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('Ref Management', () => {
    it('should provide a ref object', () => {
      const { result } = renderHook(() => useScrollAnimation())
      const [ref] = result.current

      expect(ref).toHaveProperty('current')
      expect(ref.current).toBeNull()
    })

    it('should allow setting ref.current', () => {
      const { result } = renderHook(() => useScrollAnimation())
      const [ref] = result.current

      const mockElement = document.createElement('div')
      ref.current = mockElement

      expect(ref.current).toBe(mockElement)
    })
  })

  describe('Custom Options Merging', () => {
    it('should accept custom threshold', () => {
      const { result } = renderHook(() => useScrollAnimation({ threshold: 0.75 }))

      const [ref, isVisible] = result.current
      expect(ref).toBeDefined()
      expect(typeof isVisible).toBe('boolean')
    })

    it('should accept multiple custom options', () => {
      const { result } = renderHook(() =>
        useScrollAnimation({ threshold: 0.75, rootMargin: '100px' })
      )

      const [ref, isVisible] = result.current
      expect(ref).toBeDefined()
      expect(typeof isVisible).toBe('boolean')
    })

    it('should work with default options when none provided', () => {
      const { result } = renderHook(() => useScrollAnimation())

      const [ref, isVisible] = result.current
      expect(ref).toBeDefined()
      expect(typeof isVisible).toBe('boolean')
    })
  })

  describe('Hook Stability', () => {
    it('should maintain ref reference across renders', () => {
      const { result, rerender } = renderHook(() => useScrollAnimation())

      const [refBefore] = result.current
      rerender()
      const [refAfter] = result.current

      expect(refBefore).toBe(refAfter)
    })

    it('should work with multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useScrollAnimation())
      const { result: result2 } = renderHook(() => useScrollAnimation())

      const [ref1] = result1.current
      const [ref2] = result2.current

      // Each instance should have its own ref
      expect(ref1).not.toBe(ref2)
    })
  })
})
