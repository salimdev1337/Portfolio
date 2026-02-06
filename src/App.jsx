import { useState } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Button, Card, Input, Textarea } from './components/common';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-4xl font-pixel text-[var(--text-primary)]">
            🎮 PIXEL PORTFOLIO
          </h1>
          <Button onClick={toggleTheme} variant="secondary">
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
        </div>

        {/* Welcome Card */}
        <Card className="mb-8">
          <h2 className="text-xl font-pixel mb-4 text-[var(--accent)]">
            PHASE 1 COMPLETE! ✅
          </h2>
          <p className="font-mono text-[var(--text-secondary)] mb-4">
            Foundation setup is working! Here&apos;s what we have:
          </p>
          <ul className="font-mono text-sm text-[var(--text-secondary)] space-y-2">
            <li>✅ React + Vite configured</li>
            <li>✅ Tailwind CSS installed</li>
            <li>✅ Design system with CSS variables</li>
            <li>✅ Fonts: Press Start 2P + Roboto Mono</li>
            <li>✅ ESLint + Prettier configured</li>
            <li>✅ Reusable pixel components (Button, Card, Input, Textarea)</li>
            <li>✅ Theme context for dark mode</li>
            <li>✅ Proper folder structure</li>
          </ul>
        </Card>

        {/* Component Showcase */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Buttons Card */}
          <Card hover>
            <h3 className="text-lg font-pixel mb-4 text-[var(--text-primary)]">
              BUTTONS
            </h3>
            <div className="space-y-4">
              <Button variant="primary" onClick={() => alert('Primary clicked!')}>
                PRIMARY BUTTON
              </Button>
              <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
                SECONDARY
              </Button>
              <Button variant="success" onClick={() => alert('Success!')}>
                SUCCESS
              </Button>
              <Button disabled>DISABLED</Button>
            </div>
          </Card>

          {/* Inputs Card */}
          <Card hover>
            <h3 className="text-lg font-pixel mb-4 text-[var(--text-primary)]">
              INPUTS
            </h3>
            <div className="space-y-4">
              <Input
                placeholder="Enter your name..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
              <Input
                type="email"
                placeholder="email@example.com"
                error={inputValue === 'error' ? 'This is an error!' : ''}
              />
              <Textarea
                placeholder="Type a message..."
                value={textareaValue}
                onChange={e => setTextareaValue(e.target.value)}
                rows={3}
              />
            </div>
          </Card>
        </div>

        {/* Stats Card */}
        <Card className="mt-8">
          <h3 className="text-lg font-pixel mb-4 text-[var(--text-primary)]">
            PROJECT STATS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-sm">
            <div>
              <div className="text-[var(--accent)] font-bold">TASKS DONE</div>
              <div className="text-[var(--text-primary)] text-2xl">5/35</div>
            </div>
            <div>
              <div className="text-[var(--accent)] font-bold">PHASE</div>
              <div className="text-[var(--text-primary)] text-2xl">1/8</div>
            </div>
            <div>
              <div className="text-[var(--accent)] font-bold">PROGRESS</div>
              <div className="text-[var(--text-primary)] text-2xl">14%</div>
            </div>
            <div>
              <div className="text-[var(--accent)] font-bold">THEME</div>
              <div className="text-[var(--text-primary)] text-2xl uppercase">
                {theme}
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps Card */}
        <Card className="mt-8 bg-[var(--success)] border-[var(--success)]">
          <h3 className="text-lg font-pixel mb-4 text-white">NEXT: PHASE 2</h3>
          <p className="font-mono text-white text-sm">
            Ready to build the Navbar and Footer components! 🚀
          </p>
        </Card>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
