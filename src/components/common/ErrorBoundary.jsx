import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log to your error monitoring service here (e.g. Sentry)
    // console.error is acceptable in an error boundary — it's not production noise,
    // it's the only way to surface caught errors to the developer.
    console.error('ErrorBoundary caught an error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <p className="font-pixel text-2xl text-[var(--accent)] mb-4">ERROR 500</p>
            <p className="font-mono text-sm text-[var(--text-primary)] mb-2">
              Something crashed unexpectedly.
            </p>
            <p className="font-mono text-xs text-[var(--text-secondary)] mb-6">
              Try refreshing the page. If the issue persists, reach out via the contact form.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="font-pixel text-xs px-6 py-3 bg-[var(--accent)] text-white border-2 border-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors"
            >
              RELOAD PAGE
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
