import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

const TYPE_COLORS = {
  success: '#00E676',
  error:   '#FF4444',
  info:    '#448AFF',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24,
        display: 'flex', flexDirection: 'column', gap: 8,
        zIndex: 9999, pointerEvents: 'none'
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: '#1A1A3E',
            border: `1px solid ${TYPE_COLORS[t.type] || TYPE_COLORS.info}`,
            borderRadius: 10,
            padding: '12px 20px',
            color: '#fff',
            fontSize: 14,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            maxWidth: 320,
            fontFamily: 'Poppins, sans-serif',
            lineHeight: 1.5
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
