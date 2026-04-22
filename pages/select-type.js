import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { RESUME_TYPES } from '../config/resumeTypes';

export default function SelectType() {
  const router = useRouter();

  const handleSelect = (slug) => {
    router.push(`/select-design?type=${slug}`);
  };

  return (
    <>
      <Head>
        <title>Choose Resume Type — ResumeJet</title>
        <meta name="description" content="Choose between Fresher or Experienced resume type. ResumeJet tailors AI content and templates to your career stage for maximum ATS compatibility." />
        <link rel="canonical" href="https://resumejet.in/select-type" />
      </Head>
      <Navbar showCTA={false} />

      <div style={{ paddingTop: 90, paddingBottom: 60, minHeight: '100vh' }}>
        {/* Progress */}
        <div className="progress-stepper">
          <div className="step-item active">
            <div className="step-dot">1</div>
            <span>Resume Type</span>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            <div className="step-dot">2</div>
            <span>Design</span>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            <div className="step-dot">3</div>
            <span>Your Info</span>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            <div className="step-dot">4</div>
            <span>Download</span>
          </div>
        </div>

        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
              What type of resume do you need?
            </h1>
            <p style={{ color: '#B0B0D0', fontSize: 15 }}>
              Each type is tailored with the right sections and AI prompts
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 20
          }}>
            {RESUME_TYPES.map((type) => (
              <button
                key={type.slug}
                onClick={() => handleSelect(type.slug)}
                style={{
                  background: '#1A1A3E',
                  border: '2px solid #2A2A5A',
                  borderRadius: 16,
                  padding: '28px 24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  fontFamily: 'Poppins, sans-serif',
                  color: '#fff',
                  width: '100%'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = '2px solid #FFD700';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,215,0,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = '2px solid #2A2A5A';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>{type.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{type.title}</h3>
                <p style={{ color: '#B0B0D0', fontSize: 13, lineHeight: 1.6 }}>{type.tagline}</p>
                <div style={{
                  marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6
                }}>
                  {type.fields.slice(0, 4).map(f => (
                    <span key={f} style={{
                      background: '#0A0A1A', border: '1px solid #2A2A5A',
                      borderRadius: 20, padding: '2px 10px',
                      fontSize: 11, color: '#6B6B8D', textTransform: 'capitalize'
                    }}>{f}</span>
                  ))}
                  {type.fields.length > 4 && (
                    <span style={{
                      background: '#0A0A1A', border: '1px solid #2A2A5A',
                      borderRadius: 20, padding: '2px 10px',
                      fontSize: 11, color: '#6B6B8D'
                    }}>+{type.fields.length - 4} more</span>
                  )}
                </div>
                <div style={{
                  marginTop: 20, display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: '#FFD700', fontSize: 13, fontWeight: 600 }}>
                    Select →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
