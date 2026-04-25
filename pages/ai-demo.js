import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';

function useTypingEffect(lines, active, speed = 35) {
  const [displayed, setDisplayed] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (lineIdx >= lines.length) return;
    const current = lines[lineIdx];
    if (charIdx < current.length) {
      const t = setTimeout(() => {
        setDisplayed(prev => prev + current[charIdx]);
        setCharIdx(c => c + 1);
      }, speed);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setDisplayed(prev => prev + '\n');
        setLineIdx(l => l + 1);
        setCharIdx(0);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [charIdx, lineIdx, lines, speed, active]);

  return displayed;
}

const AI_OUTPUT_LINES = [
  'Priya Sharma | priya@email.com | Bangalore',
  '',
  'PROFESSIONAL SUMMARY',
  'Results-driven Software Engineer with 3+ years building scalable',
  'web applications. Delivered 40% performance gains at TCS by',
  'optimizing React components and Node.js microservices.',
  '',
  'EXPERIENCE',
  'Software Engineer — TCS, Bangalore   2022–Present',
  '• Architected RESTful APIs serving 2M+ daily requests',
  '• Reduced page load time by 40% via code-splitting & lazy loading',
  '• Led 5-member team delivering ₹2Cr project on time',
  '',
  'SKILLS',
  'React • Node.js • Python • AWS • Docker • PostgreSQL',
];

export default function AiDemo() {
  const router = useRouter();
  const [aiStarted, setAiStarted] = useState(false);
  const demoRef = useRef(null);
  const aiText = useTypingEffect(AI_OUTPUT_LINES, aiStarted, 28);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAiStarted(true); },
      { threshold: 0.1 }
    );
    if (demoRef.current) observer.observe(demoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>Live AI Demo — ResumeJet</title>
        <meta name="description" content="See exactly how AI turns your basic details into a professional resume in seconds." />
      </Head>

      <Navbar showCTA />

      <div style={{ paddingTop: 64, minHeight: '100vh', background: '#0A0A1A' }}>
        <section ref={demoRef} style={{ padding: '80px 20px' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div style={{ display: 'inline-block', background: 'rgba(255,215,0,0.08)',
                border: '1px solid rgba(255,215,0,0.2)', borderRadius: 100,
                padding: '5px 18px', fontSize: 12, color: '#FFD700', fontWeight: 600, marginBottom: 16 }}>
                LIVE AI DEMO
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
                You Give <span style={{ color: '#8080A0' }}>Basic Info</span> →{' '}
                AI Writes <span style={{ color: '#00E676' }}>The Whole Resume</span>
              </h1>
              <p style={{ color: '#B0B0D0', fontSize: 15 }}>See exactly what AI does with your details</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24, maxWidth: 960, margin: '0 auto', alignItems: 'stretch' }}>

              <div style={{ background: '#12122A', border: '1px solid #2A2A5A', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ background: '#1A1A3E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #2A2A5A' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#8080A0', fontWeight: 600 }}>YOU TYPE THIS (basic details)</span>
                </div>
                <div style={{ padding: '24px', fontFamily: 'monospace', fontSize: 13, color: '#B0B0D0', lineHeight: 2 }}>
                  <div><span style={{ color: '#8080A0' }}>Name:</span> Priya Sharma</div>
                  <div><span style={{ color: '#8080A0' }}>Job:</span> Software Engineer at TCS</div>
                  <div><span style={{ color: '#8080A0' }}>Work:</span> 3 years, React, Node.js</div>
                  <div><span style={{ color: '#8080A0' }}>Did:</span> improved performance, led team</div>
                  <div><span style={{ color: '#8080A0' }}>Skills:</span> React, Python, AWS</div>
                  <div><span style={{ color: '#8080A0' }}>Study:</span> B.Tech CS, VIT 2021</div>
                  <div style={{ marginTop: 20, padding: '10px 14px', background: 'rgba(255,215,0,0.06)',
                    borderRadius: 10, border: '1px solid rgba(255,215,0,0.15)', fontSize: 12, color: '#FFD700' }}>
                    ↑ That&apos;s all you need to fill
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 12, padding: '20px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFD700, #FFA000)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, boxShadow: '0 0 30px rgba(255,215,0,0.3)' }}>
                  🤖
                </div>
                <div style={{ fontSize: 11, color: '#8080A0', textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                  AI processes<br />&amp; writes
                </div>
                <div style={{ fontSize: 22, color: '#FFD700' }}>↓</div>
              </div>

              <div style={{ background: '#12122A', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ background: '#1A1A3E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(0,230,118,0.2)' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00E676',
                      display: 'inline-block', boxShadow: '0 0 6px #00E676', animation: 'pulse 1.5s infinite' }} />
                    <span style={{ fontSize: 12, color: '#00E676', fontWeight: 600 }}>AI WRITES THIS (professional resume)</span>
                  </div>
                </div>
                <div style={{ padding: '20px 24px', fontFamily: 'monospace', fontSize: 12.5,
                  color: '#00E676', lineHeight: 1.9, whiteSpace: 'pre-wrap', minHeight: 260,
                  background: 'rgba(0,230,118,0.02)' }}>
                  {aiText}
                  <span style={{ display: 'inline-block', width: 2, height: 14, background: '#00E676',
                    marginLeft: 1, animation: 'blink 1s infinite', verticalAlign: 'middle' }} />
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <button className="btn-primary" style={{ fontSize: 16, padding: '14px 40px', borderRadius: 12 }}
                onClick={() => router.push('/select-type')}>
                Try It — Build My Resume with AI →
              </button>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px currentColor; }
          50% { opacity: 0.5; box-shadow: 0 0 2px currentColor; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
