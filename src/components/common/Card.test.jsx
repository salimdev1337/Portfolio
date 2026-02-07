import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../tests/helpers/testUtils';
import Card from './Card';

describe('Card Component', () => {
  describe('Rendering', () => {
    it('should render card with children', () => {
      render(<Card>Test Content</Card>);

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <Card>
          <h2>Title</h2>
          <p>Description</p>
        </Card>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should render pixel corner decorations', () => {
      const { container } = render(<Card>Content</Card>);

      const corners = container.querySelectorAll(
        '.absolute.w-2.h-2.bg-\\[var\\(--border\\)\\]'
      );
      expect(corners).toHaveLength(4);
    });
  });

  describe('Base Styling', () => {
    it('should apply base card classes', () => {
      const { container } = render(<Card>Content</Card>);

      const card = container.firstChild;
      expect(card).toHaveClass('pixel-card');
      expect(card).toHaveClass('border-3');
      expect(card).toHaveClass('border-[var(--border)]');
      expect(card).toHaveClass('bg-[var(--bg-secondary)]');
      expect(card).toHaveClass('p-6');
      expect(card).toHaveClass('relative');
    });

    it('should have transition classes', () => {
      const { container } = render(<Card>Content</Card>);

      const card = container.firstChild;
      expect(card).toHaveClass('transition-all');
      expect(card).toHaveClass('duration-100');
    });
  });

  describe('Hoverable Behavior', () => {
    it('should apply hover classes by default', () => {
      const { container } = render(<Card>Content</Card>);

      const card = container.firstChild;
      expect(card).toHaveClass('hover:transform');
      expect(card).toHaveClass('hover:-translate-y-1');
    });

    it('should not apply hover classes when hoverable is false', () => {
      const { container } = render(<Card hoverable={false}>Content</Card>);

      const card = container.firstChild;
      expect(card).not.toHaveClass('hover:transform');
      expect(card).not.toHaveClass('hover:-translate-y-1');
    });
  });

  describe('Click Handling', () => {
    it('should call onClick handler when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      const { container } = render(
        <Card onClick={handleClick}>Clickable Card</Card>
      );

      const card = container.firstChild;
      await user.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply cursor-pointer when onClick provided', () => {
      const handleClick = vi.fn();
      const { container } = render(<Card onClick={handleClick}>Content</Card>);

      const card = container.firstChild;
      expect(card).toHaveClass('cursor-pointer');
    });

    it('should not apply cursor-pointer without onClick', () => {
      const { container } = render(<Card>Content</Card>);

      const card = container.firstChild;
      expect(card).not.toHaveClass('cursor-pointer');
    });

    it('should not call onClick when not provided', async () => {
      const user = userEvent.setup();
      const { container } = render(<Card>Content</Card>);

      const card = container.firstChild;

      // Should not throw error
      await expect(async () => {
        await user.click(card);
      }).not.toThrow();
    });
  });

  describe('Custom Props', () => {
    it('should apply additional className', () => {
      const { container } = render(
        <Card className="custom-class extra-style">Content</Card>
      );

      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
      expect(card).toHaveClass('extra-style');
    });

    it('should forward additional props', () => {
      render(
        <Card data-testid="custom-card" aria-label="Test Card">
          Content
        </Card>
      );

      const card = screen.getByTestId('custom-card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('aria-label', 'Test Card');
    });

    it('should handle multiple props combinations', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Card
          onClick={handleClick}
          hoverable={false}
          className="custom"
          data-id="123"
        >
          Content
        </Card>
      );

      const card = container.firstChild;
      expect(card).toHaveClass('custom');
      expect(card).toHaveClass('cursor-pointer');
      expect(card).not.toHaveClass('hover:transform');
      expect(card).toHaveAttribute('data-id', '123');
    });
  });

  describe('Content Positioning', () => {
    it('should render children after corner elements', () => {
      const { container } = render(<Card>Main Content</Card>);

      const card = container.firstChild;
      const lastChild = card.lastChild;

      // Last child should be the text content, not a corner div
      expect(lastChild.textContent).toBe('Main Content');
    });

    it('should maintain relative positioning for corners', () => {
      const { container } = render(<Card>Content</Card>);

      const card = container.firstChild;
      expect(card).toHaveClass('relative');

      const corners = container.querySelectorAll('.absolute');
      expect(corners.length).toBeGreaterThan(0);
    });
  });

  describe('Corner Decorations', () => {
    it('should position top-left corner correctly', () => {
      const { container } = render(<Card>Content</Card>);

      const topLeft = container.querySelector(
        '.top-0.left-0.-translate-x-\\[3px\\].-translate-y-\\[3px\\]'
      );
      expect(topLeft).toBeInTheDocument();
    });

    it('should position top-right corner correctly', () => {
      const { container } = render(<Card>Content</Card>);

      const topRight = container.querySelector(
        '.top-0.right-0.translate-x-\\[3px\\].-translate-y-\\[3px\\]'
      );
      expect(topRight).toBeInTheDocument();
    });

    it('should position bottom-left corner correctly', () => {
      const { container } = render(<Card>Content</Card>);

      const bottomLeft = container.querySelector(
        '.bottom-0.left-0.-translate-x-\\[3px\\].translate-y-\\[3px\\]'
      );
      expect(bottomLeft).toBeInTheDocument();
    });

    it('should position bottom-right corner correctly', () => {
      const { container } = render(<Card>Content</Card>);

      const bottomRight = container.querySelector(
        '.bottom-0.right-0.translate-x-\\[3px\\].translate-y-\\[3px\\]'
      );
      expect(bottomRight).toBeInTheDocument();
    });

    it('should style corners with correct size and color', () => {
      const { container } = render(<Card>Content</Card>);

      const corners = container.querySelectorAll('.absolute.w-2.h-2');
      corners.forEach(corner => {
        expect(corner).toHaveClass('bg-[var(--border)]');
      });
    });
  });

  describe('Integration', () => {
    it('should work with complex nested content', () => {
      render(
        <Card>
          <div>
            <h3>Heading</h3>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
            <button>Action</button>
          </div>
        </Card>
      );

      expect(screen.getByText('Heading')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Action' })
      ).toBeInTheDocument();
    });

    it('should support being used multiple times', () => {
      render(
        <div>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
          <Card>Card 3</Card>
        </div>
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
    });
  });
});
