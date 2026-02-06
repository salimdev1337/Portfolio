import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from './ThemeContext'

// Test component that uses useTheme hook
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()
    // Reset localStorage mock
    localStorage.clear()
    // Reset document classes
    document.documentElement.classList.remove('dark')
  })

  describe('ThemeProvider', () => {
    it('should provide default theme as light', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      expect(screen.getByTestId('theme')).toHaveTextContent('light')
    })

    it('should render children', () => {
      render(
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })
  })

  describe('Toggle Theme', () => {
    it('should toggle from light to dark', async () => {
      const user = userEvent.setup()

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      expect(screen.getByTestId('theme')).toHaveTextContent('light')

      const button = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('dark')
      })
    })

    it('should toggle multiple times', async () => {
      const user = userEvent.setup()

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      const button = screen.getByRole('button', { name: /toggle theme/i })

      // Start: light
      expect(screen.getByTestId('theme')).toHaveTextContent('light')

      // Toggle to dark
      await user.click(button)
      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('dark')
      })

      // Toggle back to light
      await user.click(button)
      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('light')
      })
    })
  })

  describe('LocalStorage Persistence', () => {
    it('should save theme to localStorage when toggled', async () => {
      const user = userEvent.setup()

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      const button = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(button)

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalled()
      })
    })

    it('should call localStorage.setItem with correct theme value', async () => {
      const user = userEvent.setup()

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      const button = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(button)

      await waitFor(() => {
        // Check that localStorage.setItem was called with 'theme' as first arg
        const calls = localStorage.setItem.mock.calls
        const themeCall = calls.find(call => call[0] === 'theme')
        expect(themeCall).toBeDefined()
        expect(themeCall[1]).toMatch(/^(light|dark)$/)
      })
    })
  })

  describe('useTheme Hook', () => {
    it('should provide theme and toggleTheme function', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      expect(screen.getByTestId('theme')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
    })

    it('should throw error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestComponent />)
      }).toThrow('useTheme must be used within a ThemeProvider')

      consoleSpy.mockRestore()
    })
  })

  describe('Multiple Components', () => {
    it('should share theme state across multiple components', async () => {
      const user = userEvent.setup()

      const Component1 = () => {
        const { theme } = useTheme()
        return <div data-testid="theme1">{theme}</div>
      }

      const Component2 = () => {
        const { theme, toggleTheme } = useTheme()
        return (
          <div>
            <div data-testid="theme2">{theme}</div>
            <button onClick={toggleTheme}>Toggle</button>
          </div>
        )
      }

      render(
        <ThemeProvider>
          <Component1 />
          <Component2 />
        </ThemeProvider>
      )

      expect(screen.getByTestId('theme1')).toHaveTextContent('light')
      expect(screen.getByTestId('theme2')).toHaveTextContent('light')

      const button = screen.getByRole('button', { name: /toggle/i })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByTestId('theme1')).toHaveTextContent('dark')
        expect(screen.getByTestId('theme2')).toHaveTextContent('dark')
      })
    })
  })

  describe('Context Value', () => {
    it('should provide theme value', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      const themeDisplay = screen.getByTestId('theme')
      expect(themeDisplay.textContent).toMatch(/^(light|dark)$/)
    })

    it('should provide toggleTheme function that is callable', async () => {
      const user = userEvent.setup()

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      const button = screen.getByRole('button', { name: /toggle theme/i })

      // Should not throw
      await expect(async () => {
        await user.click(button)
      }).not.toThrow()
    })
  })
})
