import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../tests/helpers/testUtils'
import Input, { Textarea } from './Input'

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />)

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text" />)

      expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(<Input label="Username" />)

      expect(screen.getByText(/username/i)).toBeInTheDocument()
    })

    it('should render with value', () => {
      render(<Input value="Test value" onChange={() => {}} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('Test value')
    })

    it('should show required indicator when required', () => {
      render(<Input label="Email" required />)

      const asterisk = screen.getByText('*')
      expect(asterisk).toBeInTheDocument()
      expect(asterisk).toHaveClass('text-red-500')
    })

    it('should render without label when not provided', () => {
      const { container } = render(<Input />)

      const label = container.querySelector('label')
      expect(label).not.toBeInTheDocument()
    })
  })

  describe('Input Types', () => {
    it('should render as text input by default', () => {
      render(<Input />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('should render as email input', () => {
      render(<Input type="email" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('should render as password input', () => {
      const { container } = render(<Input type="password" label="Password" />)

      const input = container.querySelector('input[type="password"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'password')
    })

    it('should render as number input', () => {
      const { container } = render(<Input type="number" label="Age" />)

      const input = container.querySelector('input[type="number"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'number')
    })
  })

  describe('User Interaction', () => {
    it('should call onChange when user types', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()

      render(<Input onChange={handleChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello')

      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledTimes(5) // Once per character
    })

    it('should call onChange with event data', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()

      render(<Input onChange={handleChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'A')

      expect(handleChange).toHaveBeenCalled()
      expect(handleChange.mock.calls[0][0]).toHaveProperty('target')
    })

    it('should allow clearing input', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()

      render(<Input value="Initial" onChange={handleChange} />)

      const input = screen.getByRole('textbox')
      await user.clear(input)

      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should display error message when provided', () => {
      render(<Input error="This field is required" />)

      expect(screen.getByText(/this field is required/i)).toBeInTheDocument()
    })

    it('should apply error styles when error exists', () => {
      render(<Input error="Error message" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('border-red-500')
    })

    it('should not display error when not provided', () => {
      const { container } = render(<Input />)

      const errorText = container.querySelector('.text-red-500.text-xs')
      expect(errorText).not.toBeInTheDocument()
    })
  })

  describe('Custom Props', () => {
    it('should apply additional className', () => {
      render(<Input className="custom-class" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-class')
    })

    it('should forward additional props', () => {
      render(<Input data-testid="custom-input" maxLength={10} />)

      const input = screen.getByTestId('custom-input')
      expect(input).toHaveAttribute('maxLength', '10')
    })

    it('should set required attribute', () => {
      render(<Input required />)

      const input = screen.getByRole('textbox')
      expect(input).toBeRequired()
    })
  })
})

describe('Textarea Component', () => {
  describe('Rendering', () => {
    it('should render textarea element', () => {
      render(<Textarea />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
      expect(textarea.tagName).toBe('TEXTAREA')
    })

    it('should render with placeholder', () => {
      render(<Textarea placeholder="Enter your message" />)

      expect(screen.getByPlaceholderText(/enter your message/i)).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(<Textarea label="Message" />)

      expect(screen.getByText(/message/i)).toBeInTheDocument()
    })

    it('should render with value', () => {
      render(<Textarea value="Test message" onChange={() => {}} />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveValue('Test message')
    })

    it('should show required indicator when required', () => {
      render(<Textarea label="Comments" required />)

      const asterisk = screen.getByText('*')
      expect(asterisk).toBeInTheDocument()
      expect(asterisk).toHaveClass('text-red-500')
    })

    it('should set rows attribute', () => {
      render(<Textarea rows={6} label="Bio" />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '6')
    })

    it('should use default 4 rows', () => {
      render(<Textarea label="Description" />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '4')
    })
  })

  describe('User Interaction', () => {
    it('should call onChange when user types', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()

      render(<Textarea onChange={handleChange} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Test message')

      expect(handleChange).toHaveBeenCalled()
    })

    it('should allow multiline input', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()

      render(<Textarea onChange={handleChange} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'First line{Enter}Second line')

      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should display error message when provided', () => {
      render(<Textarea error="Message is too short" />)

      expect(screen.getByText(/message is too short/i)).toBeInTheDocument()
    })

    it('should apply error styles when error exists', () => {
      render(<Textarea error="Error message" />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('border-red-500')
    })

    it('should not display error when not provided', () => {
      const { container } = render(<Textarea />)

      const errorText = container.querySelector('.text-red-500.text-xs')
      expect(errorText).not.toBeInTheDocument()
    })
  })

  describe('Custom Props', () => {
    it('should apply additional className', () => {
      render(<Textarea className="custom-textarea" />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('custom-textarea')
    })

    it('should forward additional props', () => {
      render(<Textarea data-testid="custom-textarea" maxLength={500} />)

      const textarea = screen.getByTestId('custom-textarea')
      expect(textarea).toHaveAttribute('maxLength', '500')
    })

    it('should set required attribute', () => {
      render(<Textarea required />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeRequired()
    })

    it('should have resize-vertical class', () => {
      render(<Textarea />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('resize-vertical')
    })
  })
})
