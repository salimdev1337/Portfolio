import { useState, lazy, Suspense } from 'react';
import { Navbar, Footer } from './components/layout';
import { LoadingScreen } from './sections';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy-load sections — reduces initial JS parse time and improves LCP/TTI
const Hero = lazy(() => import('./sections/Hero'));
const About = lazy(() => import('./sections/About'));
const Projects = lazy(() => import('./sections/Projects'));
const Skills = lazy(() => import('./sections/Skills'));
const Contact = lazy(() => import('./sections/Contact'));
const Chatbot = lazy(() => import('./components/chatbot'));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
        {/* Loading Screen */}
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

        {/* Main App Content */}
        {!isLoading && (
          <Suspense fallback={null}>
            <Navbar />

            <main>
              <Hero />
              <About />
              <Projects />
              <Skills />
              <Contact />
            </main>

            <Footer />

            {/* Chatbot — floats above all content, bottom-right */}
            <Chatbot />
          </Suspense>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
