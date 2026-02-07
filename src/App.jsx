import { useState } from 'react';
import { Navbar, Footer } from './components/layout';
import {
  LoadingScreen,
  Hero,
  About,
  Projects,
  Skills,
  Contact,
} from './sections';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Main App Content */}
      {!isLoading && (
        <>
          {/* Navigation */}
          <Navbar />

          {/* Main Content */}
          <main>
            {/* Hero Section */}
            <Hero />

            {/* About Section */}
            <About />

            {/* Projects Section */}
            <Projects />

            {/* Skills Section */}
            <Skills />

            {/* Contact Section */}
            <Contact />
          </main>

          {/* Footer */}
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
