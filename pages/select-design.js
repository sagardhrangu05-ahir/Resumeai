import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { RESUME_DESIGN_GROUPS } from '../config/resumeDesigns';
import DesignMiniPreview from '../components/DesignMiniPreview';

export default function SelectDesign() {
  const router = useRouter();
  const { type } = router.query;
  const [selected, setSelected] = useState(null);
  const [modalDesign, setModalDesign] = useState(null);

  const handleSelect = (id) => {
    setSelected(id);
    router.push(`/builder?type=${type}&design=${id}`);
  };

  return (
    <>
      <Head>
        <title>Choose Resume Design — ResumeJet</title>
        <meta name="robots" content="noindex, nofollow" />
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

        <div className="container" style={{ maxWidth: 1000 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Pick your design</h1>
            <p style={{ color: '#B0B0D0', fontSize: 15 }}>
              16 templates across 4 styles — click any design to continue
            </p>
          </div>

          {/* Grouped by style */}
          {RESUME_DESIGN_GROUPS.map((group) => (
            <div key={group.style} style={{ marginBottom: 40 }}>
              {/* Group header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{group.label}</h2>
                <span style={{ fontSize: 12, color: '#B0B0D0' }}>{group.description}</span>
                <div style={{ flex: 1, height: 1, background: '#2A2A5A' }} />
              </div>

              {/* 4 variant cards */}
              <div className="design-grid">
                {group.variants.map((variant) => (
                  <div
                    key={variant.id}
                    onClick={() => handleSelect(variant.id)}
                    style={{
                      background: '#1A1A3E',
                      border: selected === variant.id ? '2px solid #FFD700' : '2px solid #2A2A5A',
                      borderRadius: 14,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: selected === variant.id ? '0 0 20px rgba(255,215,0,0.2)' : 'none'
                    }}
                    onMouseEnter={e => {
                      if (selected !== variant.id) e.currentTarget.style.border = '2px solid #4A4A7A';
                    }}
                    onMouseLeave={e => {
                      if (selected !== variant.id) e.currentTarget.style.border = '2px solid #2A2A5A';
                    }}
                  >
                    {/* Mini preview */}
                    <div style={{
                      height: 140,
                      overflow: 'hidden',
                      background: variant.colors.bg || '#fff',
                      position: 'relative'
                    }}>
                      <DesignMiniPreview id={variant.id} colors={variant.colors} />
                      {selected === variant.id && (
                        <div style={{
                          position: 'absolute', top: 6, right: 6,
                          background: '#FFD700', borderRadius: '50%',
                          width: 20, height: 20, display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, color: '#000'
                        }}>✓</div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 12 }}>{variant.name}</span>
                        <span style={{
                          fontSize: 8, fontWeight: 600, padding: '2px 6px',
                          borderRadius: 10, background: variant.tagColor + '22',
                          color: variant.tagColor, border: `1px solid ${variant.tagColor}44`
                        }}>{variant.tag}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setModalDesign(variant); }}
                        style={{
                          background: 'transparent', border: '1px solid #2A2A5A',
                          color: '#B0B0D0', borderRadius: 8, padding: '4px 10px',
                          fontSize: 10, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                          width: '100%', transition: 'all 0.2s', marginTop: 4
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.color = '#FFD700'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A5A'; e.currentTarget.style.color = '#B0B0D0'; }}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

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
              maxWidth: 460, width: '100%', maxHeight: '85vh', overflow: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{modalDesign.name}</h3>
                <p style={{ color: '#B0B0D0', fontSize: 13 }}>{modalDesign.description}</p>
              </div>
              <button
                type="button"
                aria-label="Close preview"
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
              height: 360, background: modalDesign.colors.bg || '#fff',
              borderRadius: 10, overflow: 'hidden',
              border: '1px solid #2A2A5A'
            }}>
              <div style={{ transform: 'scale(2.2)', transformOrigin: 'top left', width: '45%', height: '45%' }}>
                <DesignMiniPreview id={modalDesign.id} colors={modalDesign.colors} />
              </div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                aria-label="Select this design and continue"
                onClick={() => { setModalDesign(null); handleSelect(modalDesign.id); }}
              >
                Select & Continue →
              </button>
              <button
                type="button"
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
