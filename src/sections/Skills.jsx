import { useState } from 'react';
import { Card } from '../components/common';
import useScrollAnimation from '../utils/useScrollAnimation';

const Skills = () => {
  const [expandedCategory, setExpandedCategory] = useState('frontend');
  const [headerRef, headerVisible] = useScrollAnimation();
  const [desktopRef, desktopVisible] = useScrollAnimation();
  const [mobileRef, mobileVisible] = useScrollAnimation();
  const [statsRef, statsVisible] = useScrollAnimation();

  const skillCategories = [
    {
      id: 'frontend',
      name: 'FRONTEND',
      icon: '🎨',
      skills: [
        { name: 'React', level: 90, experience: '5 years' },
        { name: 'Flutter', level: 85, experience: '3 years' },
        { name: 'Tailwind CSS', level: 85, experience: '1.5 years' },
        { name: 'HTML/CSS', level: 100, experience: '8 years' },
        { name: 'JavaScript', level: 85, experience: '5 years' },
      ],
    },
    {
      id: 'backend',
      name: 'BACKEND',
      icon: '⚙️',
      skills: [
        { name: 'Node.js', level: 80, experience: '4 years' },
        { name: 'Express', level: 90, experience: '4 years' },
        { name: 'Python', level: 75, experience: '1.5 years' },
        { name: 'Flask', level: 70, experience: '1.5 years' },
        { name: 'REST APIs', level: 85, experience: '5 years' },
      ],
    },
    {
      id: 'database',
      name: 'DATABASE',
      icon: '🗄️',
      skills: [
        { name: 'MongoDB', level: 80, experience: '4 years' },
        { name: 'MySQL', level: 75, experience: '5 years' },
        { name: 'Firebase', level: 80, experience: '2 years' },
        { name: 'PostgreSQL', level: 70, experience: '1 year' },
      ],
    },
    {
      id: 'devops',
      name: 'DEVOPS & TOOLS',
      icon: '🚀',
      skills: [
        { name: 'Git', level: 85, experience: '3 years' },
        { name: 'Docker', level: 70, experience: '1 year' },
        { name: 'CI/CD', level: 70, experience: '1 year' },
        { name: 'Linux', level: 75, experience: '2 years' },
        { name: 'GitHub Actions', level: 70, experience: '1 year' },
      ],
    },
    {
      id: 'security',
      name: 'SECURITY',
      icon: '🔐',
      skills: [
        { name: 'Keycloak', level: 75, experience: '1 year' },
        { name: 'JWT', level: 80, experience: '4 years' },
        { name: 'OAuth 2.0', level: 70, experience: '3 year' },
        { name: 'RBAC', level: 75, experience: '4 year' },
      ],
    },
  ];

  const toggleCategory = categoryId => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const getSkillColor = level => {
    if (level >= 80) return 'var(--success)';
    if (level >= 70) return 'var(--accent)';
    return 'var(--text-secondary)';
  };

  return (
    <section id="skills" className="section-padding bg-[var(--bg-secondary)]">
      <div className="container-custom">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 ${headerVisible ? 'scroll-visible' : 'scroll-hidden'}`}
        >
          <h2 className="font-pixel text-3xl md:text-4xl text-[var(--text-primary)] mb-4">
            {'<SKILL_TREE/>'}
          </h2>
          <p className="font-mono text-sm text-[var(--text-secondary)] max-w-2xl mx-auto">
            Technical abilities acquired through quests and battles with bugs
          </p>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-8 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--success)]"></div>
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              Expert (80%+)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--accent)]"></div>
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              Advanced (70-79%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--text-secondary)]"></div>
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              Intermediate (60-69%)
            </span>
          </div>
        </div>

        {/* Desktop View - Skill Tree Grid */}
        <div
          ref={desktopRef}
          className={`hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto ${desktopVisible ? 'scroll-visible' : 'scroll-hidden'}`}
        >
          {skillCategories.map(category => (
            <Card
              key={category.id}
              className="hover:transform hover:scale-105 transition-transform duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="font-pixel text-xs text-[var(--accent)]">
                  {category.name}
                </h3>
              </div>

              <div className="space-y-3">
                {category.skills.map((skill, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-xs text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                        {skill.name}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[var(--bg-primary)] border border-[var(--border)] relative overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${skill.level}%`,
                          backgroundColor: getSkillColor(skill.level),
                        }}
                      >
                        {/* Pixel pattern */}
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.2) 1px, rgba(255,255,255,0.2) 2px)',
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Experience tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
                      <span className="font-mono text-[9px] text-[var(--text-secondary)]">
                        Experience: {skill.experience}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile View - Accordion */}
        <div
          ref={mobileRef}
          className={`md:hidden space-y-4 max-w-2xl mx-auto ${mobileVisible ? 'scroll-visible' : 'scroll-hidden'}`}
        >
          {skillCategories.map(category => (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className={`
                  w-full px-4 py-3 border-2 transition-all duration-200 flex items-center justify-between
                  ${
                    expandedCategory === category.id
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border)]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-pixel text-[10px]">
                    {category.name}
                  </span>
                </div>
                <span className="font-pixel text-xs">
                  {expandedCategory === category.id ? '▼' : '▶'}
                </span>
              </button>

              {expandedCategory === category.id && (
                <Card className="mt-2 animate-fadeIn">
                  <div className="space-y-3">
                    {category.skills.map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono text-xs text-[var(--text-primary)]">
                            {skill.name}
                          </span>
                          <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                            {skill.level}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-[var(--bg-primary)] border border-[var(--border)] relative overflow-hidden mb-1">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${skill.level}%`,
                              backgroundColor: getSkillColor(skill.level),
                            }}
                          ></div>
                        </div>

                        <span className="font-mono text-[9px] text-[var(--text-secondary)]">
                          Experience: {skill.experience}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div
          ref={statsRef}
          className={`mt-12 max-w-4xl mx-auto ${statsVisible ? 'scroll-visible' : 'scroll-hidden'}`}
        >
          <Card className="text-center">
            <h3 className="font-pixel text-sm text-[var(--accent)] mb-4">
              {'> OVERALL_STATS'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl mb-2">💻</div>
                <div className="font-mono text-2xl text-[var(--accent)] mb-1">
                  15+
                </div>
                <div className="font-mono text-xs text-[var(--text-secondary)]">
                  Technologies
                </div>
              </div>
              <div>
                <div className="text-3xl mb-2">🚀</div>
                <div className="font-mono text-2xl text-[var(--accent)] mb-1">
                  5
                </div>
                <div className="font-mono text-xs text-[var(--text-secondary)]">
                  Main Projects
                </div>
              </div>
              <div>
                <div className="text-3xl mb-2">⏱️</div>
                <div className="font-mono text-2xl text-[var(--accent)] mb-1">
                  6
                </div>
                <div className="font-mono text-xs text-[var(--text-secondary)]">
                  Years Coding
                </div>
              </div>
              <div>
                <div className="text-3xl mb-2">🎯</div>
                <div className="font-mono text-2xl text-[var(--accent)] mb-1">
                  ∞
                </div>
                <div className="font-mono text-xs text-[var(--text-secondary)]">
                  Bugs Squashed
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;
