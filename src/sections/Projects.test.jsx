import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../tests/helpers/testUtils';
import Projects from './Projects';

describe('Projects Section', () => {
  describe('Rendering', () => {
    it('should render section header', () => {
      renderWithProviders(<Projects />);

      expect(screen.getByText(/<COMPLETED_QUESTS\/>/i)).toBeInTheDocument();
    });

    it('should render section description', () => {
      renderWithProviders(<Projects />);

      expect(
        screen.getByText(
          /A collection of projects showcasing full-stack development/i
        )
      ).toBeInTheDocument();
    });

    it('should render all filter buttons', () => {
      renderWithProviders(<Projects />);

      expect(
        screen.getByRole('button', { name: /all quests/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /mobile/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /web/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /gaming/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /enterprise/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /ai\/ml/i })
      ).toBeInTheDocument();
    });

    it('should render project count', () => {
      renderWithProviders(<Projects />);

      expect(screen.getByText(/showing 5 quests/i)).toBeInTheDocument();
    });

    it('should render all projects by default', () => {
      renderWithProviders(<Projects />);

      expect(screen.getByText(/MultiGame Platform/i)).toBeInTheDocument();
      expect(screen.getByText(/HelpDesk Pro/i)).toBeInTheDocument();
      expect(screen.getByText(/MediGuide AI/i)).toBeInTheDocument();
      expect(screen.getByText(/iTeamHub/i)).toBeInTheDocument();
      expect(screen.getByText(/Co-op Platform/i)).toBeInTheDocument();
    });

    it('should render call to action section', () => {
      renderWithProviders(<Projects />);

      expect(screen.getByText(/MORE QUESTS IN PROGRESS/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Check back soon for more projects!/i)
      ).toBeInTheDocument();
    });
  });

  describe('Filter Functionality', () => {
    it('should highlight "All Quests" filter by default', () => {
      renderWithProviders(<Projects />);

      const allQuestsButton = screen.getByRole('button', {
        name: /all quests/i,
      });
      expect(allQuestsButton).toHaveClass('bg-[var(--accent)]');
    });

    it('should filter projects by Mobile category', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Projects />);

      const mobileButton = screen.getByRole('button', { name: /📱 mobile/i });
      await user.click(mobileButton);

      // Should show 2 projects: iTeamHub and MultiGame Platform
      expect(screen.getByText(/iTeamHub/i)).toBeInTheDocument();
      expect(screen.getByText(/MultiGame Platform/i)).toBeInTheDocument();
      expect(screen.getByText(/showing 2 quests/i)).toBeInTheDocument();

      // Should not show other projects
      expect(screen.queryByText(/HelpDesk Pro/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/MediGuide AI/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Co-op Platform/i)).not.toBeInTheDocument();
    });

    it('should filter projects by Web category', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Projects />);

      const webButton = screen.getByRole('button', { name: /🌐 web/i });
      await user.click(webButton);

      // Should show 3 projects: Co-op Platform, HelpDesk Pro, MediGuide AI
      expect(screen.getByText(/Co-op Platform/i)).toBeInTheDocument();
      expect(screen.getByText(/HelpDesk Pro/i)).toBeInTheDocument();
      expect(screen.getByText(/MediGuide AI/i)).toBeInTheDocument();
      expect(screen.getByText(/showing 3 quests/i)).toBeInTheDocument();

      // Should not show mobile-only or gaming-only projects
      expect(screen.queryByText(/iTeamHub/i)).not.toBeInTheDocument();
    });

    it('should filter projects by Gaming category', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Projects />);

      const gamingButton = screen.getByRole('button', { name: /🎮 gaming/i });
      await user.click(gamingButton);

      // Should show 1 project: MultiGame Platform
      expect(screen.getByText(/MultiGame Platform/i)).toBeInTheDocument();
      expect(screen.getByText(/showing 1 quest/i)).toBeInTheDocument();
    });

    it('should filter projects by Enterprise category', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Projects />);

      const enterpriseButton = screen.getByRole('button', {
        name: /💼 enterprise/i,
      });
      await user.click(enterpriseButton);

      // Should show 1 project: HelpDesk Pro
      expect(screen.getByText(/HelpDesk Pro/i)).toBeInTheDocument();
      expect(screen.getByText(/showing 1 quest/i)).toBeInTheDocument();
    });

    it('should filter projects by AI/ML category', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Projects />);

      const aiButton = screen.getByRole('button', { name: /🤖 ai\/ml/i });
      await user.click(aiButton);

      // Should show 1 project: MediGuide AI
      expect(screen.getByText(/MediGuide AI/i)).toBeInTheDocument();
      expect(screen.getByText(/showing 1 quest/i)).toBeInTheDocument();
    });

    it('should support multiple categories per project', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Projects />);

      // HelpDesk Pro should appear in both Enterprise and Web
      const enterpriseButton = screen.getByRole('button', {
        name: /💼 enterprise/i,
      });
      await user.click(enterpriseButton);
      expect(screen.getByText(/HelpDesk Pro/i)).toBeInTheDocument();

      const webButton = screen.getByRole('button', { name: /🌐 web/i });
      await user.click(webButton);
      expect(screen.getByText(/HelpDesk Pro/i)).toBeInTheDocument();
    });

    it('should return to all projects when "All Quests" clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Projects />);

      // Filter to mobile first
      const mobileButton = screen.getByRole('button', { name: /📱 mobile/i });
      await user.click(mobileButton);
      expect(screen.getByText(/showing 2 quests/i)).toBeInTheDocument();

      // Click "All Quests"
      const allQuestsButton = screen.getByRole('button', {
        name: /⚔️ all quests/i,
      });
      await user.click(allQuestsButton);

      // Should show all 5 projects again
      expect(screen.getByText(/showing 5 quests/i)).toBeInTheDocument();
      expect(screen.getByText(/MultiGame Platform/i)).toBeInTheDocument();
      expect(screen.getByText(/HelpDesk Pro/i)).toBeInTheDocument();
      expect(screen.getByText(/MediGuide AI/i)).toBeInTheDocument();
      expect(screen.getByText(/iTeamHub/i)).toBeInTheDocument();
      expect(screen.getByText(/Co-op Platform/i)).toBeInTheDocument();
    });

    it('should update active filter styling when filter clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Projects />);

      const allQuestsButton = screen.getByRole('button', {
        name: /⚔️ all quests/i,
      });
      const mobileButton = screen.getByRole('button', { name: /📱 mobile/i });

      // Initially "All Quests" should be active
      expect(allQuestsButton).toHaveClass('bg-[var(--accent)]');
      expect(mobileButton).toHaveClass('bg-[var(--bg-secondary)]');

      // Click Mobile
      await user.click(mobileButton);

      // Mobile should now be active
      expect(mobileButton).toHaveClass('bg-[var(--accent)]');
      expect(allQuestsButton).toHaveClass('bg-[var(--bg-secondary)]');
    });

    it('should display singular "quest" for single result', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Projects />);

      const gamingButton = screen.getByRole('button', { name: /🎮 gaming/i });
      await user.click(gamingButton);

      // Should say "quest" not "quests"
      expect(screen.getByText(/showing 1 quest/i)).toBeInTheDocument();
      expect(screen.queryByText(/showing 1 quests/i)).not.toBeInTheDocument();
    });
  });

  describe('Project Content', () => {
    it('should display project descriptions', () => {
      renderWithProviders(<Projects />);

      expect(
        screen.getByText(/Flutter-based gaming platform/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Enterprise-grade ticketing system/i)
      ).toBeInTheDocument();
    });

    it('should display tech stacks', () => {
      renderWithProviders(<Projects />);

      // Multiple elements may have these tech names, just check they exist
      expect(screen.getAllByText(/Flutter/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/React/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Firebase/i).length).toBeGreaterThan(0);
    });
  });
});
