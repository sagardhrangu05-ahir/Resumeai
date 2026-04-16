import { useRouter } from 'next/router';

export default function Navbar({ showCTA = true, onHowItWorksClick }) {
  const router = useRouter();

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: 64,
      background: 'rgba(10,10,26,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(42,42,90,0.6)'
    }}>
      {/* Logo */}
      <button
        onClick={() => router.push('/')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'Poppins, sans-serif', fontWeight: 800,
          fontSize: 20, color: '#fff', letterSpacing: -0.5,
          display: 'flex', alignItems: 'center', gap: 6
        }}
      >
        <span style={{
          background: 'linear-gradient(135deg, #FFD700, #FFA000)',
          borderRadius: 8, padding: '2px 8px', fontSize: 14,
          color: '#000', fontWeight: 900
        }}>R</span>
        ResumeJet
      </button>

      {/* Nav links (hidden on mobile) */}
      <div style={{
        display: 'flex', gap: 28, alignItems: 'center',
        '@media (max-width: 600px)': { display: 'none' }
      }}>
        {onHowItWorksClick && (
          <button
            onClick={onHowItWorksClick}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#B0B0D0', fontSize: 13, fontWeight: 500,
              fontFamily: 'Poppins, sans-serif', transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#B0B0D0'}
          >
            How it Works
          </button>
        )}
        <a
          href="/#features"
          style={{ color: '#B0B0D0', fontSize: 13, fontWeight: 500, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#B0B0D0'}
        >
          Features
        </a>
        <a
          href="/#types"
          style={{ color: '#B0B0D0', fontSize: 13, fontWeight: 500, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#B0B0D0'}
        >
          Resume Types
        </a>
      </div>

      {/* CTA */}
      {showCTA ? (
        <button
          className="btn-primary"
          style={{ fontSize: 13, padding: '10px 22px' }}
          onClick={() => router.push('/select-type')}
        >
          Build Resume →
        </button>
      ) : (
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'none', border: '1px solid #2A2A5A',
            color: '#B0B0D0', borderRadius: 8, padding: '7px 16px',
            fontSize: 12, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.color = '#FFD700'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A5A'; e.currentTarget.style.color = '#B0B0D0'; }}
        >
          ← Home
        </button>
      )}
    </nav>
  );
}
