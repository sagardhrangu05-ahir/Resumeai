import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { RESUME_DESIGNS } from '../config/resumeDesigns';

// Mini CSS preview of each design
function DesignMiniPreview({ design }) {
  const styles = {
    'classic-pro': (
      <div style={{ fontFamily: 'Georgia, serif', padding: 12, background: '#fff', height: '100%', color: '#1a1a1a' }}>
        <div style={{ borderBottom: '2px solid #1a1a1a', paddingBottom: 6, marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 10 }}>JOHN DOE</div>
          <div style={{ fontSize: 7, color: '#555' }}>john@email.com • +91 98765 43210</div>
        </div>
        {['EXPERIENCE', 'EDUCATION', 'SKILLS'].map(s => (
          <div key={s} style={{ marginBottom: 6 }}>
            <div style={{ background: '#1a1a1a', color: '#fff', fontSize: 6, padding: '1px 4px', marginBottom: 3, letterSpacing: 1 }}>{s}</div>
            <div style={{ fontSize: 6, color: '#333', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 600 }}>Title at Company</div>
              <div style={{ color: '#555' }}>• Achieved result with 40% improvement</div>
            </div>
          </div>
        ))}
      </div>
    ),
    'modern-split': (
      <div style={{ display: 'flex', height: '100%', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ width: '35%', background: '#1e3a5f', padding: 10, color: '#fff' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2196F3', margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>J</div>
          <div style={{ fontSize: 6, marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 6 }}>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>CONTACT</div>
            <div style={{ color: '#aaa', lineHeight: 1.6 }}>email@co.com<br />+91 98765<br />Mumbai</div>
          </div>
          <div style={{ fontSize: 6 }}>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>SKILLS</div>
            {['React', 'Node.js', 'Python'].map(s => (
              <div key={s} style={{ background: '#2196F3', borderRadius: 8, padding: '1px 4px', marginBottom: 2, fontSize: 5 }}>{s}</div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, padding: 10, background: '#f8f9fa', color: '#1e3a5f' }}>
          <div style={{ fontSize: 9, fontWeight: 700, marginBottom: 2 }}>JOHN DOE</div>
          <div style={{ fontSize: 6, color: '#2196F3', marginBottom: 6 }}>Software Engineer</div>
          {['EXPERIENCE', 'EDUCATION'].map(s => (
            <div key={s} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 6, fontWeight: 700, color: '#1e3a5f', borderBottom: '1px solid #2196F3', marginBottom: 3 }}>{s}</div>
              <div style={{ fontSize: 5, color: '#444', lineHeight: 1.5 }}>Developer at TCS<br />• Built REST APIs</div>
            </div>
          ))}
        </div>
      </div>
    ),
    'creative-edge': (
      <div style={{ fontFamily: 'Poppins, sans-serif', height: '100%', background: '#fff' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a237e, #7c4dff)', padding: '14px 12px', color: '#fff' }}>
          <div style={{ fontSize: 10, fontWeight: 700 }}>JOHN DOE</div>
          <div style={{ fontSize: 6, opacity: 0.8 }}>Software Engineer</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            {['email', 'phone', 'github'].map(i => (
              <span key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '1px 5px', fontSize: 5 }}>{i}</span>
            ))}
          </div>
        </div>
        <div style={{ padding: 10 }}>
          {['EXPERIENCE', 'SKILLS'].map(s => (
            <div key={s} style={{ marginBottom: 7 }}>
              <div style={{ fontSize: 7, fontWeight: 700, color: '#7c4dff', marginBottom: 3 }}>{s}</div>
              <div style={{ fontSize: 5, color: '#333', lineHeight: 1.6 }}>
                {s === 'SKILLS'
                  ? <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {['React', 'Node', 'SQL'].map(sk => (
                        <span key={sk} style={{ background: '#ede7f6', color: '#7c4dff', borderRadius: 8, padding: '1px 5px', fontSize: 5 }}>{sk}</span>
                      ))}
                    </div>
                  : <div>Developer at Company<br />• Key achievement +30%</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    'minimal-clean': (
      <div style={{ fontFamily: 'DM Sans, sans-serif', padding: 12, background: '#fafafa', height: '100%', color: '#212121' }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: -0.5 }}>John Doe</div>
          <div style={{ fontSize: 6, color: '#757575', marginTop: 1 }}>john@email.com  •  Mumbai</div>
          <hr style={{ margin: '6px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
        </div>
        {['Experience', 'Education', 'Skills'].map(s => (
          <div key={s} style={{ marginBottom: 7 }}>
            <div style={{ fontSize: 6, fontWeight: 700, color: '#212121', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>{s}</div>
            <div style={{ fontSize: 5, color: '#555', lineHeight: 1.6 }}>
              {s === 'Skills'
                ? 'Python • React • SQL • Leadership'
                : <div>Position at Company<br /><span style={{ color: '#757575' }}>Jan 2022 – Present</span></div>}
            </div>
          </div>
        ))}
      </div>
    )
  };

  return styles[design.id] || null;
}

export default function SelectDesign() {
  const router = useRouter();
  const { type } = router.query;
  const [selected, setSelected] = useState(null);
  const [modalDesign, setModalDesign] = useState(null);

  const handleContinue = () => {
    if (!selected) return;
    router.push(`/builder?type=${type}&design=${selected}`);
  };

  return (
    <>
      <Head>
        <title>Choose Design — ResumeJet</title>
      </Head>
      <Navbar showCTA={false} />

      <div style={{ paddingTop: 90, paddingBottom: 100, minHeight: '100vh' }}>
        {/* Progress */}
        <div className="progress-stepper">
          <div className="step-item completed">
            <div className="step-dot" style={{ background: '#00E676', border: 'none' }}>✓</div>
            <span>Resume Type</span>
          </div>
          <div className="step-line" style={{ background: '#00E676' }}></div>
          <div className="step-item active">
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

        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Pick your design</h1>
            <p style={{ color: '#B0B0D0', fontSize: 15 }}>
              Click "Preview" to see a sample. You can change design between downloads (Pro plan).
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: 20,
            marginBottom: 32
          }}>
            {RESUME_DESIGNS.map((design) => (
              <div
                key={design.id}
                onClick={() => setSelected(design.id)}
                style={{
                  background: '#1A1A3E',
                  border: selected === design.id ? '2px solid #FFD700' : '2px solid #2A2A5A',
                  borderRadius: 14,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: selected === design.id ? '0 0 20px rgba(255,215,0,0.2)' : 'none'
                }}
              >
                {/* Mini preview */}
                <div style={{
                  height: 160,
                  overflow: 'hidden',
                  background: design.colors.bg,
                  position: 'relative'
                }}>
                  <DesignMiniPreview design={design} />
                  {selected === design.id && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      background: '#FFD700', borderRadius: '50%',
                      width: 22, height: 22, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: '#000'
                    }}>✓</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{design.name}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 600, padding: '2px 7px',
                      borderRadius: 10, background: design.tagColor + '22',
                      color: design.tagColor, border: `1px solid ${design.tagColor}44`
                    }}>{design.tag}</span>
                  </div>
                  <p style={{ color: '#B0B0D0', fontSize: 11, marginBottom: 10 }}>{design.description}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setModalDesign(design); }}
                    style={{
                      background: 'transparent', border: '1px solid #2A2A5A',
                      color: '#B0B0D0', borderRadius: 8, padding: '5px 12px',
                      fontSize: 11, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                      width: '100%', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.color = '#FFD700'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A5A'; e.currentTarget.style.color = '#B0B0D0'; }}
                  >
                    Preview This Design
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Continue button */}
          <div style={{ textAlign: 'center' }}>
            <button
              className="btn-primary"
              onClick={handleContinue}
              disabled={!selected}
              style={{ fontSize: 16, padding: '14px 48px' }}
            >
              Continue →
            </button>
            {!selected && (
              <p style={{ color: '#6B6B8D', fontSize: 12, marginTop: 8 }}>Select a design to continue</p>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {modalDesign && (
        <div
          onClick={() => setModalDesign(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 20
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1A1A3E', borderRadius: 16, padding: 24,
              maxWidth: 500, width: '100%', maxHeight: '85vh', overflow: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{modalDesign.name}</h3>
                <p style={{ color: '#B0B0D0', fontSize: 13 }}>{modalDesign.description}</p>
              </div>
              <button
                onClick={() => setModalDesign(null)}
                style={{
                  background: 'transparent', border: '1px solid #2A2A5A',
                  color: '#B0B0D0', borderRadius: 8, padding: '6px 12px',
                  cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: 13
                }}
              >✕</button>
            </div>

            {/* Large preview */}
            <div style={{
              height: 400, background: modalDesign.colors.bg,
              borderRadius: 10, overflow: 'hidden',
              border: '1px solid #2A2A5A'
            }}>
              <div style={{ transform: 'scale(2.2)', transformOrigin: 'top left', width: '45%', height: '45%' }}>
                <DesignMiniPreview design={modalDesign} />
              </div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <button
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => { setSelected(modalDesign.id); setModalDesign(null); }}
              >
                Select This Design
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '12px 20px' }}
                onClick={() => setModalDesign(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
