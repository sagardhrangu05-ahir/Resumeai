import { useState, useCallback, useRef, createContext, useContext } from 'react';

const ToastContext = createContext(null);

const COLORS = {
  success: { bg: '#00E676', text: '#000' },
  error:   { bg: '#FF5252', text: '#fff' },
  info:    { bg: '#448AFF', text: '#fff' }
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}

      {/* Toast container */}
      <div style={{
        position: 'fixed', bottom: 24, right: 24,
        display: 'flex', flexDirection: 'column', gap: 10,
        zIndex: 9999, maxWidth: 340
      }}>
        {toasts.map(t => {
          const c = COLORS[t.type] || COLORS.info;
          return (
            <div
              key={t.id}
              style={{
                background: c.bg, color: c.text,
                padding: '12px 18px', borderRadius: 10,
                fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 600,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                animation: 'toastIn 0.25s ease',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <span>
                {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
              </span>
              {t.message}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
