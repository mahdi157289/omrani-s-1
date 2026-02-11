import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border border-amber-100">
            <div className="text-6xl mb-6">🍪</div>
            <h1 className="font-serif text-3xl font-bold text-amber-900 mb-4">Oops! Something went wrong.</h1>
            <p className="text-stone-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="text-left bg-stone-100 p-4 rounded-lg mb-6 overflow-auto max-h-40 text-xs font-mono text-red-600">
                <summary className="cursor-pointer font-bold mb-2">Error Details</summary>
                {this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-600 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
