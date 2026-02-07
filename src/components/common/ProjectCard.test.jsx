import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../tests/helpers/testUtils';
import ProjectCard from './ProjectCard';

describe('ProjectCard Component', () => {
  const mockProject = {
    id: 1,
    title: 'Test Project',
    categories: ['web', 'mobile'],
    difficulty: 4,
    description: 'A test project description',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
    techStack: ['React', 'Node.js', 'MongoDB'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/test/project',
    image: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.open
    window.open = vi.fn();
  });

  describe('Rendering', () => {
    it('should render project title', () => {
      renderWithProviders(<ProjectCard project={mockProject} />);

      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    it('should render project description', () => {
      renderWithProviders(<ProjectCard project={mockProject} />);

      expect(
        screen.getByText(/A test project description/i)
      ).toBeInTheDocument();
    });

    it('should render difficulty stars', () => {
      renderWithProviders(<ProjectCard project={mockProject} />);

      const stars = screen.getByText('⭐⭐⭐⭐');
      expect(stars).toBeInTheDocument();
    });

    it('should render tech stack badges', () => {
      renderWithProviders(<ProjectCard project={mockProject} />);

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('MongoDB')).toBeInTheDocument();
    });
  });

  describe('Quest Type Badge', () => {
    it('should show "SIDE QUEST" for difficulty <= 3', () => {
      const sideQuestProject = { ...mockProject, difficulty: 3 };
      renderWithProviders(<ProjectCard project={sideQuestProject} />);

      expect(screen.getByText('SIDE QUEST')).toBeInTheDocument();
    });

    it('should show "MAIN QUEST" for difficulty > 3', () => {
      const mainQuestProject = { ...mockProject, difficulty: 4 };
      renderWithProviders(<ProjectCard project={mainQuestProject} />);

      expect(screen.getByText('MAIN QUEST')).toBeInTheDocument();
    });

    it('should show "SIDE QUEST" for difficulty 1', () => {
      const easyProject = { ...mockProject, difficulty: 1 };
      renderWithProviders(<ProjectCard project={easyProject} />);

      expect(screen.getByText('SIDE QUEST')).toBeInTheDocument();
      expect(screen.getByText('⭐')).toBeInTheDocument();
    });

    it('should show "MAIN QUEST" for difficulty 5', () => {
      const hardProject = { ...mockProject, difficulty: 5 };
      renderWithProviders(<ProjectCard project={hardProject} />);

      expect(screen.getByText('MAIN QUEST')).toBeInTheDocument();
      expect(screen.getByText('⭐⭐⭐⭐⭐')).toBeInTheDocument();
    });
  });

  describe('Category Icon', () => {
    it('should display gaming icon for gaming category', () => {
      const gamingProject = { ...mockProject, categories: ['gaming'] };
      renderWithProviders(<ProjectCard project={gamingProject} />);

      const { container } = renderWithProviders(
        <ProjectCard project={gamingProject} />
      );
      expect(container.textContent).toContain('🎮');
    });

    it('should display web icon for web category', () => {
      const webProject = { ...mockProject, categories: ['web'] };
      const { container } = renderWithProviders(
        <ProjectCard project={webProject} />
      );

      expect(container.textContent).toContain('🌐');
    });

    it('should display mobile icon for mobile category', () => {
      const mobileProject = { ...mockProject, categories: ['mobile'] };
      const { container } = renderWithProviders(
        <ProjectCard project={mobileProject} />
      );

      expect(container.textContent).toContain('📱');
    });

    it('should display enterprise icon for enterprise category', () => {
      const enterpriseProject = { ...mockProject, categories: ['enterprise'] };
      const { container } = renderWithProviders(
        <ProjectCard project={enterpriseProject} />
      );

      expect(container.textContent).toContain('💼');
    });

    it('should display AI icon for ai category', () => {
      const aiProject = { ...mockProject, categories: ['ai'] };
      const { container } = renderWithProviders(
        <ProjectCard project={aiProject} />
      );

      expect(container.textContent).toContain('🤖');
    });

    it('should display default icon for unknown category', () => {
      const unknownProject = { ...mockProject, categories: ['unknown'] };
      const { container } = renderWithProviders(
        <ProjectCard project={unknownProject} />
      );

      expect(container.textContent).toContain('💻');
    });
  });

  describe('Features List', () => {
    it('should display features heading', () => {
      renderWithProviders(<ProjectCard project={mockProject} />);

      expect(screen.getByText('KEY FEATURES:')).toBeInTheDocument();
    });

    it('should display first 3 features', () => {
      renderWithProviders(<ProjectCard project={mockProject} />);

      expect(screen.getByText('Feature 1')).toBeInTheDocument();
      expect(screen.getByText('Feature 2')).toBeInTheDocument();
      expect(screen.getByText('Feature 3')).toBeInTheDocument();
      expect(screen.queryByText('Feature 4')).not.toBeInTheDocument();
    });

    it('should not display features section when features are empty', () => {
      const noFeaturesProject = { ...mockProject, features: [] };
      renderWithProviders(<ProjectCard project={noFeaturesProject} />);

      expect(screen.queryByText('KEY FEATURES:')).not.toBeInTheDocument();
    });

    it('should not display features section when features is null', () => {
      const nullFeaturesProject = { ...mockProject, features: null };
      renderWithProviders(<ProjectCard project={nullFeaturesProject} />);

      expect(screen.queryByText('KEY FEATURES:')).not.toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render Demo button when demoUrl is provided', () => {
      renderWithProviders(<ProjectCard project={mockProject} />);

      const demoButton = screen.getByRole('button', { name: /demo/i });
      expect(demoButton).toBeInTheDocument();
    });

    it('should render Code button when githubUrl is provided', () => {
      renderWithProviders(<ProjectCard project={mockProject} />);

      const codeButton = screen.getByRole('button', { name: /code/i });
      expect(codeButton).toBeInTheDocument();
    });

    it('should not render Demo button when demoUrl is null', () => {
      const noDemoProject = { ...mockProject, demoUrl: null };
      renderWithProviders(<ProjectCard project={noDemoProject} />);

      expect(
        screen.queryByRole('button', { name: /demo/i })
      ).not.toBeInTheDocument();
    });

    it('should not render Code button when githubUrl is null', () => {
      const noGithubProject = { ...mockProject, githubUrl: null };
      renderWithProviders(<ProjectCard project={noGithubProject} />);

      expect(
        screen.queryByRole('button', { name: /code/i })
      ).not.toBeInTheDocument();
    });

    it('should open demoUrl in new tab when Demo button clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProjectCard project={mockProject} />);

      const demoButton = screen.getByRole('button', { name: /demo/i });
      await user.click(demoButton);

      expect(window.open).toHaveBeenCalledWith(
        'https://demo.example.com',
        '_blank'
      );
    });

    it('should open githubUrl in new tab when Code button clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProjectCard project={mockProject} />);

      const codeButton = screen.getByRole('button', { name: /code/i });
      await user.click(codeButton);

      expect(window.open).toHaveBeenCalledWith(
        'https://github.com/test/project',
        '_blank'
      );
    });
  });

  describe('Image Display', () => {
    it('should display image placeholder when image is true', () => {
      const { container } = renderWithProviders(
        <ProjectCard project={mockProject} />
      );

      const imageDiv = container.querySelector('.pixel-corners');
      expect(imageDiv).toBeInTheDocument();
    });

    it('should not display image placeholder when image is false', () => {
      const noImageProject = { ...mockProject, image: false };
      const { container } = renderWithProviders(
        <ProjectCard project={noImageProject} />
      );

      const imageDiv = container.querySelector('.pixel-corners');
      expect(imageDiv).not.toBeInTheDocument();
    });
  });

  describe('Complete Project Display', () => {
    it('should render all project elements together', () => {
      renderWithProviders(<ProjectCard project={mockProject} />);

      // Check all elements are present
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.getByText('MAIN QUEST')).toBeInTheDocument();
      expect(screen.getByText('⭐⭐⭐⭐')).toBeInTheDocument();
      expect(
        screen.getByText(/A test project description/i)
      ).toBeInTheDocument();
      expect(screen.getByText('KEY FEATURES:')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /demo/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /code/i })).toBeInTheDocument();
    });

    it('should work with minimal project data', () => {
      const minimalProject = {
        id: 2,
        title: 'Minimal Project',
        categories: ['web'],
        difficulty: 2,
        description: 'Minimal description',
        features: null,
        techStack: ['JavaScript'],
        demoUrl: null,
        githubUrl: null,
        image: false,
      };

      renderWithProviders(<ProjectCard project={minimalProject} />);

      expect(screen.getByText('Minimal Project')).toBeInTheDocument();
      expect(screen.getByText('SIDE QUEST')).toBeInTheDocument();
      expect(screen.queryByText('KEY FEATURES:')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /demo/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /code/i })
      ).not.toBeInTheDocument();
    });
  });
});
