import { Navbar, Footer } from './components/layout';
import { Button, Card } from './components/common';

function App() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section - Demo */}
        <section id="home" className="section-padding min-h-screen flex items-center justify-center">
          <div className="container-custom text-center">
            <h1 className="font-pixel text-3xl md:text-5xl text-[var(--accent)] mb-6 glitch">
              {'<SALIM MTIRI/>'}
            </h1>
            <p className="font-mono text-lg md:text-xl text-[var(--text-secondary)] mb-4">
              Full-Stack Developer | Pixel-Perfect Problem Solver
            </p>
            <p className="font-mono text-sm text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              Gaming since Windows XP, coding since Pascal. Building complete applications from database to UI.
              Bug hunter addict. Tests on potato laptops. Peak productivity at 2am with espresso.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg">
                View Projects
              </Button>
              <Button variant="secondary" size="lg">
                Contact Me
              </Button>
            </div>
          </div>
        </section>

        {/* About Section - Demo */}
        <section id="about" className="section-padding bg-[var(--bg-secondary)]">
          <div className="container-custom">
            <h2 className="font-pixel text-2xl md:text-3xl text-[var(--text-primary)] mb-8 text-center">
              ABOUT ME
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="text-center">
                  <div className="text-4xl mb-4">🎮</div>
                  <h3 className="font-pixel text-[10px] text-[var(--accent)] mb-2">GAMING ROOTS</h3>
                  <p className="font-mono text-sm text-[var(--text-secondary)]">
                    Started gaming on Windows XP. Every game taught me problem-solving.
                  </p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-4xl mb-4">🐛</div>
                  <h3 className="font-pixel text-[10px] text-[var(--accent)] mb-2">BUG HUNTER</h3>
                  <p className="font-mono text-sm text-[var(--text-secondary)]">
                    Obsessed with clean code. If it works but looks ugly, it doesn't work.
                  </p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-4xl mb-4">☕</div>
                  <h3 className="font-pixel text-[10px] text-[var(--accent)] mb-2">2AM CODER</h3>
                  <p className="font-mono text-sm text-[var(--text-secondary)]">
                    Peak productivity happens at 2am with espresso. Don't ask why.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Projects Section - Demo */}
        <section id="projects" className="section-padding">
          <div className="container-custom">
            <h2 className="font-pixel text-2xl md:text-3xl text-[var(--text-primary)] mb-8 text-center">
              PROJECTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="mb-4">
                  <span className="font-pixel text-[8px] text-[var(--accent)] bg-[var(--accent)] bg-opacity-20 px-2 py-1 inline-block mb-2">
                    MAIN QUEST
                  </span>
                  <h3 className="font-pixel text-sm text-[var(--text-primary)] mb-2">MultiGame Platform</h3>
                  <p className="font-mono text-xs text-[var(--text-secondary)] mb-4">
                    Flutter-based gaming platform with multiple mini-games. Built for mobile-first experience.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="font-mono text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--text-secondary)]">Flutter</span>
                    <span className="font-mono text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--text-secondary)]">Dart</span>
                    <span className="font-mono text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--text-secondary)]">Mobile</span>
                  </div>
                </div>
                <Button size="sm">View Project</Button>
              </Card>

              <Card>
                <div className="mb-4">
                  <span className="font-pixel text-[8px] text-[var(--accent)] bg-[var(--accent)] bg-opacity-20 px-2 py-1 inline-block mb-2">
                    MAIN QUEST
                  </span>
                  <h3 className="font-pixel text-sm text-[var(--text-primary)] mb-2">HelpDesk Pro</h3>
                  <p className="font-mono text-xs text-[var(--text-secondary)] mb-4">
                    Enterprise ticketing system with Keycloak authentication and role-based access control.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="font-mono text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--text-secondary)]">React</span>
                    <span className="font-mono text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--text-secondary)]">Node.js</span>
                    <span className="font-mono text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--text-secondary)]">Keycloak</span>
                  </div>
                </div>
                <Button size="sm">View Project</Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Skills Section - Demo */}
        <section id="skills" className="section-padding bg-[var(--bg-secondary)]">
          <div className="container-custom">
            <h2 className="font-pixel text-2xl md:text-3xl text-[var(--text-primary)] mb-8 text-center">
              SKILL TREE
            </h2>
            <div className="max-w-3xl mx-auto">
              <Card className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-pixel text-[10px] text-[var(--text-primary)]">FRONTEND</span>
                  <span className="font-mono text-xs text-[var(--accent)]">8/10</span>
                </div>
                <div className="w-full h-3 bg-[var(--bg-primary)] border-2 border-[var(--border)]">
                  <div className="h-full bg-[var(--accent)]" style={{ width: '80%' }}></div>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="font-mono text-[9px] text-[var(--text-secondary)]">React</span>
                  <span className="font-mono text-[9px] text-[var(--text-secondary)]">Flutter</span>
                  <span className="font-mono text-[9px] text-[var(--text-secondary)]">Tailwind</span>
                </div>
              </Card>

              <Card className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-pixel text-[10px] text-[var(--text-primary)]">BACKEND</span>
                  <span className="font-mono text-xs text-[var(--accent)]">8/10</span>
                </div>
                <div className="w-full h-3 bg-[var(--bg-primary)] border-2 border-[var(--border)]">
                  <div className="h-full bg-[var(--accent)]" style={{ width: '80%' }}></div>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="font-mono text-[9px] text-[var(--text-secondary)]">Node.js</span>
                  <span className="font-mono text-[9px] text-[var(--text-secondary)]">Python</span>
                  <span className="font-mono text-[9px] text-[var(--text-secondary)]">Flask</span>
                </div>
              </Card>

              <Card>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-pixel text-[10px] text-[var(--text-primary)]">DEVOPS</span>
                  <span className="font-mono text-xs text-[var(--accent)]">7/10</span>
                </div>
                <div className="w-full h-3 bg-[var(--bg-primary)] border-2 border-[var(--border)]">
                  <div className="h-full bg-[var(--accent)]" style={{ width: '70%' }}></div>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="font-mono text-[9px] text-[var(--text-secondary)]">Docker</span>
                  <span className="font-mono text-[9px] text-[var(--text-secondary)]">Git</span>
                  <span className="font-mono text-[9px] text-[var(--text-secondary)]">CI/CD</span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section - Demo */}
        <section id="contact" className="section-padding">
          <div className="container-custom">
            <h2 className="font-pixel text-2xl md:text-3xl text-[var(--text-primary)] mb-8 text-center">
              CONTACT
            </h2>
            <Card className="max-w-2xl mx-auto text-center">
              <p className="font-mono text-lg text-[var(--text-secondary)] mb-6">
                Let's build something awesome together!
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button>
                  📧 Email Me
                </Button>
                <Button variant="secondary">
                  💼 LinkedIn
                </Button>
                <Button variant="secondary">
                  💻 GitHub
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
