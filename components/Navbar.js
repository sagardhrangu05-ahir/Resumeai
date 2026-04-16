import { useRouter } from 'next/router';

export default function Navbar({ showCTA = true, onHowItWorksClick }) {
  const router = useRouter();

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(10,10,26,0.9)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #2A2A5A', padding: '14px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div
        style={{ fontSize: 20, fontWeight: 800, cursor: 'pointer' }}
        onClick={() => router.push('/')}
      >
        <span style={{ color: '#FFD700' }}>Resume</span>
        <span style={{ color: '#fff' }}>Jet</span>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {onHowItWorksClick && (
          <button
            onClick={onHowItWorksClick}
            style={{
              background: 'transparent', border: 'none', color: '#B0B0D0',
              fontSize: 13, cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
            }}
          >
            How it Works
          </button>
        )}
        {showCTA && (
          <button
            className="btn-primary"
            onClick={() => router.push('/select-type')}
            style={{ padding: '10px 24px', fontSize: 13 }}
          >
            Build Resume →
          </button>
        )}
      </div>
    </nav>
  );
}
