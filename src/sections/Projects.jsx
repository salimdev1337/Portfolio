import { useState } from 'react';
import { ProjectCard } from '../components/common';
import useScrollAnimation from '../utils/useScrollAnimation';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [headerRef, headerVisible] = useScrollAnimation();
  const [filterRef, filterVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation();

  const projects = [
    {
      id: 1,
      title: 'MultiGame Platform',
      categories: ['gaming', 'mobile'],
      difficulty: 5,
      description:
        'Flutter-based gaming platform featuring multiple mini-games with leaderboards, achievements, and social features. Built for mobile-first experience with smooth animations and offline support.',
      features: [
        'Multiple mini-games in one platform',
        'Real-time leaderboards & rankings',
        'Achievement system with rewards',
        'Offline gameplay support',
      ],
      techStack: ['Flutter', 'Dart', 'Firebase', 'Provider'],
      demoUrl: null,
      githubUrl: null,
      image: true,
    },
    {
      id: 2,
      title: 'HelpDesk Pro',
      categories: ['enterprise', 'web'],
      difficulty: 4,
      description:
        'Enterprise-grade ticketing system with Keycloak authentication, role-based access control, and real-time notifications. Handles complex workflow automation and SLA management.',
      features: [
        'Keycloak SSO integration',
        'Role-based permissions (RBAC)',
        'Real-time ticket updates',
        'SLA tracking & automation',
      ],
      techStack: ['React', 'Node.js', 'MongoDB', 'Keycloak', 'Socket.io'],
      demoUrl: null,
      githubUrl: null,
      image: true,
    },
    {
      id: 3,
      title: 'MediGuide AI',
      categories: ['ai', 'web'],
      difficulty: 4,
      description:
        'AI-powered medical assistant chatbot using Grok API for intelligent symptom analysis and health guidance. Features context-aware conversations and medical knowledge base.',
      features: [
        'AI-powered symptom analysis',
        'Context-aware conversations',
        'Medical knowledge integration',
        'Multi-language support',
      ],
      techStack: ['Python', 'Flask', 'Grok API', 'React', 'NLP'],
      demoUrl: null,
      githubUrl: null,
      image: true,
    },
    {
      id: 4,
      title: 'iTeamHub',
      categories: ['mobile'],
      difficulty: 3,
      description:
        'Social networking app for university students to connect, share resources, and collaborate on projects. Features event management and study group creation.',
      features: [
        'Student profiles & networking',
        'Resource sharing platform',
        'Event management system',
        'Study group creation',
      ],
      techStack: ['Flutter', 'Firebase', 'Node.js', 'MongoDB'],
      demoUrl: null,
      githubUrl: null,
      image: true,
    },
    {
      id: 5,
      title: 'Co-op Platform',
      categories: ['web'],
      difficulty: 2,
      description:
        'Brand collaboration platform connecting businesses with influencers and content creators. Streamlines campaign management and performance tracking.',
      features: [
        'Brand-influencer matching',
        'Campaign management',
        'Performance analytics',
        'Payment processing',
      ],
      techStack: ['React', 'Node.js', 'Express', 'MySQL'],
      demoUrl: null,
      githubUrl: null,
      image: true,
    },
  ];

  const filters = [
    { id: 'all', label: 'All Quests', icon: '⚔️' },
    { id: 'mobile', label: 'Mobile', icon: '📱' },
    { id: 'web', label: 'Web', icon: '🌐' },
    { id: 'gaming', label: 'Gaming', icon: '🎮' },
    { id: 'enterprise', label: 'Enterprise', icon: '💼' },
    { id: 'ai', label: 'AI/ML', icon: '🤖' },
  ];

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter(project => project.categories.includes(activeFilter));

  return (
    <section id="projects" className="section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 ${headerVisible ? 'scroll-visible' : 'scroll-hidden'}`}
        >
          <h2 className="font-pixel text-3xl md:text-4xl text-[var(--text-primary)] mb-4">
            {'<COMPLETED_QUESTS/>'}
          </h2>
          <p className="font-mono text-sm text-[var(--text-secondary)] max-w-2xl mx-auto">
            A collection of projects showcasing full-stack development, from
            gaming platforms to enterprise solutions
          </p>
        </div>

        {/* Filter Tabs */}
        <div
          ref={filterRef}
          className={`mb-8 overflow-x-auto pb-2 ${filterVisible ? 'scroll-visible' : 'scroll-hidden'}`}
        >
          <div className="flex gap-3 justify-center flex-wrap min-w-max px-4 md:px-0">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  font-pixel text-[10px] px-4 py-2 border-2 transition-all duration-200
                  ${
                    activeFilter === filter.id
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)] pixel-corners shadow-[2px_2px_0_var(--border)]'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                  }
                `}
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Count */}
        <div className="text-center mb-6">
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            Showing {filteredProjects.length}{' '}
            {filteredProjects.length === 1 ? 'quest' : 'quests'}
          </span>
        </div>

        {/* Projects Grid */}
        <div
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${gridVisible ? 'scroll-visible' : 'scroll-hidden'}`}
        >
          {filteredProjects.map(project => (
            <div key={project.id} className="animate-fadeIn">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="font-pixel text-sm text-[var(--text-secondary)]">
              NO QUESTS FOUND
            </p>
            <p className="font-mono text-xs text-[var(--text-secondary)] mt-2">
              Try selecting a different category
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-[var(--bg-secondary)] border-2 border-[var(--border)] px-6 py-4 pixel-corners">
            <p className="font-pixel text-[10px] text-[var(--accent)] mb-2">
              MORE QUESTS IN PROGRESS
            </p>
            <p className="font-mono text-xs text-[var(--text-secondary)]">
              Check back soon for more projects!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
