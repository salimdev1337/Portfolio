import { render } from '@testing-library/react'
import { ThemeProvider } from '../../contexts/ThemeContext'

/**
 * Custom render function that wraps components with necessary providers
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Additional render options
 * @returns {Object} - Render result from Testing Library
 */
export function renderWithProviders(ui, options = {}) {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>,
    options
  )
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
