import { Card } from '../components/common';

const About = () => {
  const stats = [
    { name: 'FRONTEND', level: 8, skills: ['React', 'Flutter', 'Tailwind CSS'] },
    { name: 'BACKEND', level: 8, skills: ['Node.js', 'Python', 'Flask', 'Express'] },
    { name: 'MOBILE', level: 7, skills: ['Flutter', 'Dart', 'Mobile-First Design'] },
    { name: 'DEVOPS', level: 7, skills: ['Docker', 'Git', 'CI/CD', 'Linux'] }
  ];

  const specialTraits = [
    { icon: '🐛', label: 'Bug Hunter', description: 'Obsessed with clean code and squashing bugs' },
    { icon: '☕', label: '2am Coder', description: 'Peak productivity happens at 2am with espresso' },
    { icon: '🥔', label: 'Potato Tester', description: 'Tests on low-end hardware for maximum compatibility' },
    { icon: '🎮', label: 'Gaming Roots', description: 'Gaming since Windows XP, problem-solving in DNA' },
    { icon: '💻', label: 'Serial Committer', description: 'Commits more often than blinking' },
    { icon: '🚀', label: 'Full-Stack', description: 'Database to UI, nothing left behind' }
  ];

  const education = [
    {
      institution: 'ITEAM University',
      degree: 'Software Engineering',
      period: '2023 - Present',
      focus: 'Full-Stack Development, Mobile Apps'
    },
    {
      institution: 'ESEN Manouba',
      degree: 'Economics & Management',
      period: '2020 - 2023',
      focus: 'Business Analysis, Project Management'
    }
  ];

  return (
    <section id="about" className="section-padding bg-[var(--bg-secondary)]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-pixel text-3xl md:text-4xl text-[var(--text-primary)] mb-4">
            {'<ABOUT_ME/>'}
          </h2>
          <p className="font-mono text-sm text-[var(--text-secondary)] max-w-2xl mx-auto">
            Level 24 Developer | Quest Completion Rate: 94% | Experience: 3 Years
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Portrait & Bio */}
          <div className="lg:col-span-1">
            <Card className="text-center">
              {/* Pixel Portrait Placeholder */}
              <div className="mb-6 mx-auto w-48 h-48 bg-[var(--accent)] bg-opacity-20 border-4 border-[var(--border)] pixel-corners flex items-center justify-center relative overflow-hidden">
                <div className="text-8xl">👨‍💻</div>
                {/* Idle animation indicator */}
                <div className="absolute bottom-2 right-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[var(--success)] animate-pulse"></div>
                    <div className="w-2 h-2 bg-[var(--success)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-[var(--success)] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>

              <h3 className="font-pixel text-lg text-[var(--text-primary)] mb-2">SALIM MTIRI</h3>
              <p className="font-mono text-xs text-[var(--accent)] mb-4">Full-Stack Developer</p>

              <div className="text-left space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg">📍</span>
                  <div>
                    <p className="font-mono text-xs text-[var(--text-primary)]">Tunisia</p>
                    <p className="font-mono text-[10px] text-[var(--text-secondary)]">Remote Available</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-lg">🎓</span>
                  <div>
                    <p className="font-mono text-xs text-[var(--text-primary)]">ITEAM University</p>
                    <p className="font-mono text-[10px] text-[var(--text-secondary)]">Software Engineering</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-lg">💼</span>
                  <div>
                    <p className="font-mono text-xs text-[var(--text-primary)]">Seeking Internship</p>
                    <p className="font-mono text-[10px] text-[var(--text-secondary)]">6 months | Feb-Jul 2026</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Stats & Traits */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <Card>
              <h3 className="font-pixel text-sm text-[var(--accent)] mb-4">{'> PLAYER_BIO'}</h3>
              <p className="font-mono text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                Gaming since Windows XP, coding since Pascal. Started with simple scripts and never looked back.
                Now building complete applications from database architecture to pixel-perfect UIs.
              </p>
              <p className="font-mono text-sm text-[var(--text-secondary)] leading-relaxed">
                Bug hunter by nature—if it works but looks ugly, it doesn't work. Tests every project on potato laptops
                because if it runs there, it runs anywhere. Peak productivity? 2am with espresso. Commits more often than
                blinking. Currently seeking a 6-month internship to level up and ship real-world products.
              </p>
            </Card>

            {/* Core Stats */}
            <Card>
              <h3 className="font-pixel text-sm text-[var(--accent)] mb-4">{'> CORE_STATS'}</h3>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-pixel text-[10px] text-[var(--text-primary)]">
                        {stat.name}
                      </span>
                      <span className="font-mono text-xs text-[var(--accent)]">
                        {stat.level}/10
                      </span>
                    </div>
                    {/* Stat Bar */}
                    <div className="w-full h-3 bg-[var(--bg-primary)] border-2 border-[var(--border)] relative overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent)] transition-all duration-500"
                        style={{ width: `${stat.level * 10}%` }}
                      >
                        {/* Pixel pattern overlay */}
                        <div className="absolute inset-0 opacity-30" style={{
                          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
                        }}></div>
                      </div>
                    </div>
                    {/* Skills */}
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {stat.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="font-mono text-[9px] text-[var(--text-secondary)] bg-[var(--bg-primary)] px-2 py-1 border border-[var(--border)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Special Traits */}
        <div className="mb-12">
          <h3 className="font-pixel text-sm text-[var(--accent)] mb-6 text-center">{'> SPECIAL_TRAITS'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialTraits.map((trait, index) => (
              <Card key={index} className="hover:transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{trait.icon}</div>
                  <div>
                    <h4 className="font-pixel text-[10px] text-[var(--accent)] mb-1">{trait.label}</h4>
                    <p className="font-mono text-xs text-[var(--text-secondary)]">{trait.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className="font-pixel text-sm text-[var(--accent)] mb-6 text-center">{'> EDUCATION'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {education.map((edu, index) => (
              <Card key={index}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <h4 className="font-pixel text-xs text-[var(--text-primary)] mb-1">{edu.institution}</h4>
                    <p className="font-mono text-[10px] text-[var(--accent)]">{edu.period}</p>
                  </div>
                </div>
                <p className="font-mono text-xs text-[var(--text-secondary)] mb-2">{edu.degree}</p>
                <p className="font-mono text-[10px] text-[var(--text-secondary)]">Focus: {edu.focus}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
