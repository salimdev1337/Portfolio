import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../tests/helpers/testUtils';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollY = 0;
    document.documentElement.classList.remove('dark');
  });

  describe('Rendering', () => {
    it('should render logo', () => {
      renderWithProviders(<Navbar />);

      expect(screen.getByText('<SM/>')).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
      renderWithProviders(<Navbar />);

      expect(screen.getAllByText('ABOUT')[0]).toBeInTheDocument();
      expect(screen.getAllByText('PROJECTS')[0]).toBeInTheDocument();
      expect(screen.getAllByText('SKILLS')[0]).toBeInTheDocument();
      expect(screen.getAllByText('CONTACT')[0]).toBeInTheDocument();
    });

    it('should render theme toggle button', () => {
      renderWithProviders(<Navbar />);

      const themeButtons = screen.getAllByLabelText(/toggle dark mode/i);
      expect(themeButtons.length).toBeGreaterThan(0);
    });

    it('should render hamburger menu button on mobile', () => {
      renderWithProviders(<Navbar />);

      const hamburgerButton = screen.getByLabelText(/open navigation menu/i);
      expect(hamburgerButton).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href attributes', () => {
      const { container } = renderWithProviders(<Navbar />);

      const aboutLink = container.querySelector('a[href="#about"]');
      const projectsLink = container.querySelector('a[href="#projects"]');
      const skillsLink = container.querySelector('a[href="#skills"]');
      const contactLink = container.querySelector('a[href="#contact"]');

      expect(aboutLink).toBeInTheDocument();
      expect(projectsLink).toBeInTheDocument();
      expect(skillsLink).toBeInTheDocument();
      expect(contactLink).toBeInTheDocument();
    });

    it('should have logo link to home', () => {
      const { container } = renderWithProviders(<Navbar />);

      const logoLink = container.querySelector('a[href="#"]');
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveTextContent('<SM/>');
    });
  });

  describe('Scroll Behavior', () => {
    it('should not have border initially', () => {
      const { container } = renderWithProviders(<Navbar />);

      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('bg-transparent');
      expect(nav).not.toHaveClass('border-b-3');
    });

    it('should add styles when scrolled past 20px', async () => {
      const { container } = renderWithProviders(<Navbar />);

      const nav = container.querySelector('nav');

      // Simulate scroll
      window.scrollY = 50;
      window.dispatchEvent(new Event('scroll'));

      await waitFor(() => {
        expect(nav).toHaveClass('bg-[var(--bg-primary)]');
        expect(nav).toHaveClass('border-b-3');
      });
    });

    it('should remove styles when scrolled back to top', async () => {
      const { container } = renderWithProviders(<Navbar />);

      const nav = container.querySelector('nav');

      // Scroll down
      window.scrollY = 50;
      window.dispatchEvent(new Event('scroll'));

      await waitFor(() => {
        expect(nav).toHaveClass('bg-[var(--bg-primary)]');
      });

      // Scroll back up
      window.scrollY = 0;
      window.dispatchEvent(new Event('scroll'));

      await waitFor(() => {
        expect(nav).toHaveClass('bg-transparent');
      });
    });

    it('should set scrolled state at exactly 20px', async () => {
      const { container } = renderWithProviders(<Navbar />);

      const nav = container.querySelector('nav');

      // At 20px, should not be scrolled
      window.scrollY = 20;
      window.dispatchEvent(new Event('scroll'));

      await waitFor(() => {
        expect(nav).toHaveClass('bg-transparent');
      });

      // At 21px, should be scrolled
      window.scrollY = 21;
      window.dispatchEvent(new Event('scroll'));

      await waitFor(() => {
        expect(nav).toHaveClass('bg-[var(--bg-primary)]');
      });
    });
  });

  describe('Mobile Menu', () => {
    it('should toggle mobile menu when hamburger clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(<Navbar />);

      const hamburgerButton = screen.getByLabelText(/open navigation menu/i);
      const drawer = container.querySelector('[role="dialog"]');

      // Initially closed
      expect(drawer).toHaveClass('translate-x-full');

      // Open menu
      await user.click(hamburgerButton);

      await waitFor(() => {
        expect(drawer).toHaveClass('translate-x-0');
      });
    });

    it('should close mobile menu when hamburger clicked twice', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(<Navbar />);

      const hamburgerButton = screen.getByLabelText(/open navigation menu/i);
      const drawer = container.querySelector('[role="dialog"]');

      // Open menu
      await user.click(hamburgerButton);
      await waitFor(() => {
        expect(drawer).toHaveClass('translate-x-0');
      });

      // Close menu
      await user.click(hamburgerButton);
      await waitFor(() => {
        expect(drawer).toHaveClass('translate-x-full');
      });
    });

    it('should close mobile menu when a link is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(<Navbar />);

      const hamburgerButton = screen.getByLabelText(/open navigation menu/i);
      const drawer = container.querySelector('[role="dialog"]');

      // Open menu
      await user.click(hamburgerButton);
      await waitFor(() => {
        expect(drawer).toHaveClass('translate-x-0');
      });

      // Click a mobile menu link
      const aboutDrawerLink = container.querySelector('[role="dialog"] a[href="#about"]');
      await user.click(aboutDrawerLink);

      await waitFor(() => {
        expect(drawer).toHaveClass('translate-x-full');
      });
    });

    it('should display mobile links with arrow prefix', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(<Navbar />);

      const hamburgerButton = screen.getByLabelText(/open navigation menu/i);
      await user.click(hamburgerButton);

      await waitFor(() => {
        const drawerLinks = container.querySelectorAll('[role="dialog"] nav a');
        expect(drawerLinks).toHaveLength(4);
        Array.from(drawerLinks).forEach(link => {
          expect(link.querySelector('span')).toHaveTextContent('>');
        });
        expect(drawerLinks[0]).toHaveTextContent('ABOUT');
        expect(drawerLinks[1]).toHaveTextContent('PROJECTS');
        expect(drawerLinks[2]).toHaveTextContent('SKILLS');
        expect(drawerLinks[3]).toHaveTextContent('CONTACT');
      });
    });
  });

  describe('Theme Toggle', () => {
    it('should toggle theme when button clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Navbar />);

      const themeButtons = screen.getAllByLabelText(/toggle dark mode/i);
      const desktopThemeButton = themeButtons[0];

      // Click toggle
      await user.click(desktopThemeButton);

      // Theme should change (verified by checking if dark class was added)
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });

    it('should have theme toggle in both desktop and mobile views', () => {
      renderWithProviders(<Navbar />);

      const themeButtons = screen.getAllByLabelText(/toggle dark mode/i);
      // Should have at least 2 (desktop and mobile)
      expect(themeButtons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Responsive Design', () => {
    it('should have desktop navigation hidden on mobile', () => {
      const { container } = renderWithProviders(<Navbar />);

      const desktopNav = container.querySelector('.hidden.md\\:flex');
      expect(desktopNav).toBeInTheDocument();
    });

    it('should have mobile menu button visible', () => {
      renderWithProviders(<Navbar />);

      const hamburgerButton = screen.getByLabelText(/open navigation menu/i);
      expect(hamburgerButton).toBeInTheDocument();
    });
  });

  describe('Fixed Positioning', () => {
    it('should have fixed positioning', () => {
      const { container } = renderWithProviders(<Navbar />);

      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('fixed');
      expect(nav).toHaveClass('top-0');
      expect(nav).toHaveClass('z-50');
    });

    it('should span full width', () => {
      const { container } = renderWithProviders(<Navbar />);

      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('left-0');
      expect(nav).toHaveClass('right-0');
    });
  });

  describe('Keyboard Interaction', () => {
    it('should close drawer when Escape key is pressed', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(<Navbar />);

      const hamburgerButton = screen.getByLabelText(/open navigation menu/i);
      const drawer = container.querySelector('[role="dialog"]');

      await user.click(hamburgerButton);
      await waitFor(() => expect(drawer).toHaveClass('translate-x-0'));

      await user.keyboard('{Escape}');
      await waitFor(() => expect(drawer).toHaveClass('translate-x-full'));
    });
  });

  describe('Drawer Touch Interaction', () => {
    it('should close drawer when swiped left more than 60px', async () => {
      const { container } = renderWithProviders(<Navbar />);

      const hamburgerButton = screen.getByLabelText(/open navigation menu/i);
      const drawer = container.querySelector('[role="dialog"]');

      fireEvent.click(hamburgerButton);
      await waitFor(() => expect(drawer).toHaveClass('translate-x-0'));

      fireEvent.touchStart(drawer, { touches: [{ clientX: 200 }] });
      fireEvent.touchEnd(drawer, { changedTouches: [{ clientX: 130 }] });

      await waitFor(() => expect(drawer).toHaveClass('translate-x-full'));
    });

    it('should not close drawer when swiped left less than 60px', async () => {
      const { container } = renderWithProviders(<Navbar />);

      const hamburgerButton = screen.getByLabelText(/open navigation menu/i);
      const drawer = container.querySelector('[role="dialog"]');

      fireEvent.click(hamburgerButton);
      await waitFor(() => expect(drawer).toHaveClass('translate-x-0'));

      fireEvent.touchStart(drawer, { touches: [{ clientX: 200 }] });
      fireEvent.touchEnd(drawer, { changedTouches: [{ clientX: 160 }] });

      await waitFor(() => expect(drawer).toHaveClass('translate-x-0'));
    });
  });

  describe('Cleanup', () => {
    it('should cleanup scroll event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderWithProviders(<Navbar />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});
