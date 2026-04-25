import React from 'react';
import { useRouter } from 'next/router';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ onReset }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0A0A1A', color: '#fff', textAlign: 'center', padding: 24
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Something went wrong</h1>
      <p style={{ color: '#B0B0D0', fontSize: 14, marginBottom: 28 }}>
        An unexpected error occurred. Your resume data is still saved.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onReset}
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA000)',
            color: '#000', border: 'none', borderRadius: 12,
            padding: '12px 28px', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif', fontSize: 14
          }}
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/select-type'}
          style={{
            background: 'transparent', color: '#FFD700',
            border: '2px solid #FFD700', borderRadius: 12,
            padding: '12px 28px', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif', fontSize: 14
          }}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
