import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';

// Typing animation hook
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

export default function Home() {
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
        <title>ResumeJet — AI Resume Builder India | ₹49</title>
        <meta name="description" content="Just fill your basic details — AI writes your entire resume. Professional, ATS-optimized PDF in 2 minutes. Starting at ₹49." />
        <link rel="canonical" href="https://resumejet.in" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "SoftwareApplication", "name": "ResumeJet", "url": "https://resumejet.in",
              "description": "AI-powered resume builder. Fill basic details, AI writes the entire resume.",
              "applicationCategory": "BusinessApplication", "operatingSystem": "Web",
              "offers": { "@type": "Offer", "price": "49", "priceCurrency": "INR" },
              "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "500" }
            },
            { "@type": "Organization", "name": "ResumeJet", "url": "https://resumejet.in",
              "logo": "https://resumejet.in/og-image.png" }
          ]
        })}} />
      </Head>

      <Navbar />

      {/* ───── HERO ───── */}
      <section className="hero">
        <div className="hero-content">

          {/* AI badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.3)',
            borderRadius: 100, padding: '7px 20px', fontSize: 13,
            color: '#00E676', marginBottom: 32, fontWeight: 600
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00E676',
              display: 'inline-block', boxShadow: '0 0 8px #00E676', animation: 'pulse 2s infinite' }} />
            AI Writes Your Entire Resume — You Just Fill Basic Info
          </div>

          <h1>
            Tell AI About Yourself.<br />
            <span>It Writes Everything.</span>
          </h1>

          <p style={{ color: '#B0B0D0', fontSize: 17, lineHeight: 1.8, maxWidth: 560, margin: '0 auto 16px' }}>
            No writing skills needed. AI reads your basic details and generates
            professional bullet points, summary, keywords — the complete resume.
            <strong style={{ color: '#fff' }}> You just review and download.</strong>
          </p>

          <p style={{ color: '#6B6B8D', fontSize: 14, marginBottom: 36 }}>
            Starting at just <strong style={{ color: '#FFD700', fontSize: 16 }}>₹49</strong> — one-time, no subscription
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{ fontSize: 17, padding: '16px 44px', borderRadius: 14 }}
              onClick={() => router.push('/select-type')}
            >
              🤖 Let AI Build My Resume →
            </button>
            <button
              style={{ background: 'transparent', border: '1px solid #2A2A5A', color: '#B0B0D0',
                padding: '16px 28px', borderRadius: 14, fontSize: 15, cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif', transition: 'all 0.3s' }}
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#FFD700'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2A5A'}
            >
              See How It Works
            </button>
          </div>

          {/* Trust stats */}
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap', marginTop: 52 }}>
            {[
              { num: '10,000+', label: 'Resumes Built by AI' },
              { num: '95%+', label: 'ATS Pass Rate' },
              { num: '2 min', label: 'AI Generation Time' },
              { num: '₹49', label: 'Starting Price' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#FFD700' }}>{s.num}</div>
                <div style={{ fontSize: 12, color: '#6B6B8D', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── AI DEMO: BEFORE / AFTER ───── */}
      <section ref={demoRef} style={{ padding: '80px 20px', background: '#0A0A1A' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,215,0,0.08)',
              border: '1px solid rgba(255,215,0,0.2)', borderRadius: 100,
              padding: '5px 18px', fontSize: 12, color: '#FFD700', fontWeight: 600, marginBottom: 16 }}>
              LIVE AI DEMO
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
              You Give <span style={{ color: '#6B6B8D' }}>Basic Info</span> →
              AI Writes <span style={{ color: '#00E676' }}>The Whole Resume</span>
            </h2>
            <p style={{ color: '#B0B0D0', fontSize: 15 }}>See exactly what AI does with your details</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24, maxWidth: 960, margin: '0 auto', alignItems: 'stretch' }}>

            {/* LEFT: User input */}
            <div style={{ background: '#12122A', border: '1px solid #2A2A5A', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ background: '#1A1A3E', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #2A2A5A' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
                </div>
                <span style={{ fontSize: 12, color: '#6B6B8D', fontWeight: 600 }}>YOU TYPE THIS (basic details)</span>
              </div>
              <div style={{ padding: '24px 24px', fontFamily: 'monospace', fontSize: 13, color: '#B0B0D0', lineHeight: 2 }}>
                <div><span style={{ color: '#6B6B8D' }}>Name:</span> Priya Sharma</div>
                <div><span style={{ color: '#6B6B8D' }}>Job:</span> Software Engineer at TCS</div>
                <div><span style={{ color: '#6B6B8D' }}>Work:</span> 3 years, React, Node.js</div>
                <div><span style={{ color: '#6B6B8D' }}>Did:</span> improved performance, led team</div>
                <div><span style={{ color: '#6B6B8D' }}>Skills:</span> React, Python, AWS</div>
                <div><span style={{ color: '#6B6B8D' }}>Study:</span> B.Tech CS, VIT 2021</div>
                <div style={{ marginTop: 20, padding: '10px 14px', background: 'rgba(255,215,0,0.06)',
                  borderRadius: 10, border: '1px solid rgba(255,215,0,0.15)', fontSize: 12, color: '#FFD700' }}>
                  ↑ That&apos;s all you need to fill
                </div>
              </div>
            </div>

            {/* ARROW */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 12, padding: '20px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFD700, #FFA000)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, boxShadow: '0 0 30px rgba(255,215,0,0.3)' }}>
                🤖
              </div>
              <div style={{ fontSize: 11, color: '#6B6B8D', textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                AI processes<br />& writes
              </div>
              <div style={{ fontSize: 22, color: '#FFD700' }}>↓</div>
            </div>

            {/* RIGHT: AI output */}
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

      {/* ───── HOW IT WORKS ───── */}
      <section style={{ padding: '80px 20px', background: '#12122A' }} id="how-it-works">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
              AI Does <span style={{ color: '#FFD700' }}>90% of the Work</span>
            </h2>
            <p style={{ color: '#B0B0D0', fontSize: 15 }}>You spend 2 minutes. AI does the rest.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20, maxWidth: 900, margin: '0 auto' }}>
            {[
              { num: '1', icon: '🎯', title: 'You Pick Type', desc: 'Fresher or Experienced. One click, 5 seconds.', you: true },
              { num: '2', icon: '🎨', title: 'You Pick Design', desc: '16 templates. Click your favourite. Done.', you: true },
              { num: '3', icon: '🤖', title: 'AI Writes Resume', desc: 'AI generates your summary, bullets, keywords, and formats everything — automatically.', ai: true },
              { num: '4', icon: '📥', title: 'You Download PDF', desc: '₹49 for 2 PDFs. Watermark-free, print-ready.', you: true },
            ].map((step) => (
              <div key={step.num} style={{
                background: step.ai ? 'linear-gradient(135deg, #0d1f0d, #1a3a1a)' : '#1A1A3E',
                border: step.ai ? '1px solid rgba(0,230,118,0.4)' : '1px solid #2A2A5A',
                borderRadius: 18, padding: '28px 22px', position: 'relative', transition: 'all 0.3s',
                boxShadow: step.ai ? '0 0 30px rgba(0,230,118,0.08)' : 'none'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{
                  position: 'absolute', top: -14, left: 22,
                  background: step.ai ? 'linear-gradient(135deg, #00E676, #00BFA5)' : 'linear-gradient(135deg, #FFD700, #FFA000)',
                  color: '#000', fontWeight: 800, fontSize: 12,
                  padding: '3px 12px', borderRadius: 20,
                }}>
                  {step.ai ? '🤖 AI MAGIC' : `Step ${step.num}`}
                </div>
                <div style={{ fontSize: 34, marginBottom: 14, marginTop: 12 }}>{step.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8,
                  color: step.ai ? '#00E676' : '#fff' }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#B0B0D0', lineHeight: 1.75 }}>{step.desc}</p>
                {step.ai && (
                  <div style={{ marginTop: 14, fontSize: 11, color: '#00E676', fontWeight: 600,
                    background: 'rgba(0,230,118,0.08)', borderRadius: 8, padding: '6px 10px' }}>
                    ✦ Summary · Bullets · Keywords · Formatting — all AI written
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── WHAT AI DOES FOR YOU ───── */}
      <section style={{ padding: '80px 20px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
              What <span style={{ color: '#00E676' }}>AI Writes</span> For You
            </h2>
            <p style={{ color: '#B0B0D0', fontSize: 15 }}>You don&apos;t write a single professional sentence — AI does it all</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16, maxWidth: 1000, margin: '0 auto' }}>
            {[
              { icon: '✦', title: 'Professional Summary', desc: 'AI reads your experience and writes a powerful 3-4 line summary that grabs HR attention.' },
              { icon: '✦', title: 'Bullet Point Achievements', desc: 'AI converts "I improved performance" → "Reduced page load time by 40%, boosting conversions 22%".' },
              { icon: '✦', title: 'ATS Keywords', desc: 'AI scans the job description and weaves exact keywords throughout your resume automatically.' },
              { icon: '✦', title: 'Skills Section', desc: 'AI categorises Technical vs Soft skills and lists them in the exact format ATS systems prefer.' },
              { icon: '✦', title: 'Action Verbs', desc: 'AI replaces weak phrases with power verbs — Led, Architected, Delivered, Increased, Optimized.' },
              { icon: '✦', title: 'Perfect Grammar', desc: 'Zero spelling or grammar errors. AI proofreads everything automatically before you see it.' },
            ].map(f => (
              <div key={f.title} style={{
                background: '#1A1A3E', border: '1px solid #2A2A5A',
                borderRadius: 16, padding: '22px 20px', transition: 'all 0.3s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#00E676'; e.currentTarget.style.background = '#1a2a1a'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A5A'; e.currentTarget.style.background = '#1A1A3E'; }}
              >
                <div style={{ fontSize: 18, color: '#00E676', marginBottom: 10, fontWeight: 700 }}>{f.icon} {f.title}</div>
                <p style={{ fontSize: 13, color: '#B0B0D0', lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── RESUME TYPES ───── */}
      <section style={{ padding: '80px 20px', background: '#12122A' }} id="types">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
              AI Trained For <span style={{ color: '#FFD700' }}>Your Career Stage</span>
            </h2>
            <p style={{ color: '#B0B0D0', fontSize: 15 }}>Different AI prompts and content style for each type</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24, maxWidth: 740, margin: '0 auto' }}>
            {[
              {
                icon: '🎓', title: 'Fresher Resume', color: '#00E676',
                tags: ['Education', 'Projects', 'Internships', 'Skills'],
                desc: 'AI highlights your education, academic projects and potential — even with zero work experience.',
                ai: 'AI emphasises learning ability, project impact & technical skills'
              },
              {
                icon: '💼', title: 'Experienced Resume', color: '#FFD700',
                tags: ['Experience', 'Achievements', 'Leadership', 'Skills'],
                desc: 'AI showcases career growth, quantifies your achievements and highlights leadership impact.',
                ai: 'AI adds metrics, promotions & measurable business outcomes'
              }
            ].map(t => (
              <div key={t.title}
                onClick={() => router.push('/select-type')}
                style={{ background: '#1A1A3E', border: `1px solid ${t.color}33`,
                  borderRadius: 20, padding: '32px 28px', cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${t.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${t.color}33`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: 40, marginBottom: 16 }}>{t.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: t.color, marginBottom: 10 }}>{t.title}</h3>
                <p style={{ fontSize: 14, color: '#B0B0D0', lineHeight: 1.7, marginBottom: 16 }}>{t.desc}</p>
                <div style={{ fontSize: 12, color: t.color, background: `${t.color}10`,
                  border: `1px solid ${t.color}25`, borderRadius: 10, padding: '8px 12px', marginBottom: 16 }}>
                  🤖 {t.ai}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {t.tags.map(tag => (
                    <span key={tag} style={{ background: `${t.color}15`, border: `1px solid ${t.color}30`,
                      color: t.color, borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 600 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section style={{ padding: '80px 20px' }} id="features">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
              Why <span style={{ color: '#FFD700' }}>ResumeJet AI?</span>
            </h2>
            <p style={{ color: '#B0B0D0', fontSize: 15 }}>Built specifically for the Indian job market</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20, maxWidth: 1000, margin: '0 auto' }}>
            {[
              { icon: '🤖', title: 'AI Writes Everything', desc: 'You fill basic info. AI generates your entire resume — summary, bullets, skills, formatting. No writing needed.', highlight: true },
              { icon: '🎯', title: '95%+ ATS Score', desc: 'AI optimises every section for Applicant Tracking Systems. Your resume gets read by real HR, not rejected by bots.' },
              { icon: '🎨', title: '16 Pro Templates', desc: '4 styles × 4 colours. Classic, Modern, Creative, Minimal. AI fills any template instantly.' },
              { icon: '⚡', title: 'Ready in 2 Minutes', desc: 'Fill 10 basic fields, AI generates a full resume in under 60 seconds. Download in 2 minutes total.' },
              { icon: '💰', title: 'Only ₹49', desc: 'Professional resume writers charge ₹2000–5000. Get full AI-written resume for just ₹49.' },
              { icon: '🔒', title: 'Private & Secure', desc: 'Your data is used only for generation and deleted immediately after. No spam, no storage, no sharing.' },
            ].map(f => (
              <div key={f.title} style={{
                background: f.highlight ? 'linear-gradient(135deg, #0d1f0d, #1a3a1a)' : '#1A1A3E',
                border: f.highlight ? '1px solid rgba(0,230,118,0.4)' : '1px solid #2A2A5A',
                borderRadius: 16, padding: '24px', transition: 'all 0.3s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = f.highlight ? '#00E676' : '#FFD700'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = f.highlight ? 'rgba(0,230,118,0.4)' : '#2A2A5A'; }}
              >
                <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: f.highlight ? '#00E676' : '#FFD700', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#B0B0D0', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section style={{ padding: '80px 20px', background: '#12122A' }} id="pricing">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
              Simple <span style={{ color: '#FFD700' }}>Pricing</span>
            </h2>
            <p style={{ color: '#B0B0D0', fontSize: 15 }}>One-time payment. No subscription. No hidden fees.</p>
          </div>

          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 680, margin: '0 auto' }}>
            <div style={{ background: '#1A1A3E', border: '1px solid #2A2A5A',
              borderRadius: 20, padding: '36px 32px', flex: '1 1 260px', maxWidth: 300 }}>
              <div style={{ fontSize: 13, color: '#B0B0D0', marginBottom: 8, fontWeight: 600 }}>BASIC</div>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#FFD700', marginBottom: 4 }}>₹49</div>
              <div style={{ fontSize: 13, color: '#6B6B8D', marginBottom: 24 }}>one-time payment</div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
                {['AI Writes Full Resume', '2 PDF Downloads', 'All Resume Types', 'All 16 Templates', 'ATS Optimized'].map(f => (
                  <li key={f} style={{ fontSize: 14, color: '#B0B0D0', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#00E676', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => router.push('/select-type')}>Get Started</button>
            </div>

            <div style={{ background: 'linear-gradient(160deg, #1A1A3E 0%, #2A1060 100%)',
              border: '2px solid #FFD700', borderRadius: 20, padding: '36px 32px',
              flex: '1 1 260px', maxWidth: 300, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #FFD700, #FFA000)',
                color: '#000', fontSize: 11, fontWeight: 800,
                padding: '4px 16px', borderRadius: 100, whiteSpace: 'nowrap' }}>BEST VALUE</div>
              <div style={{ fontSize: 13, color: '#FFD700', marginBottom: 8, fontWeight: 600 }}>PRO</div>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#FFD700', marginBottom: 4 }}>₹79</div>
              <div style={{ fontSize: 13, color: '#6B6B8D', marginBottom: 24 }}>one-time payment</div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
                {['AI Writes Full Resume', '4 PDF Downloads', 'All Resume Types', 'All 16 Templates', 'ATS Optimized', 'Priority AI Processing'].map(f => (
                  <li key={f} style={{ fontSize: 14, color: '#B0B0D0', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#FFD700', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => router.push('/select-type')}>Get Pro →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section style={{ padding: '80px 20px' }} id="testimonials">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
              AI Got Them <span style={{ color: '#FFD700' }}>Hired</span>
            </h2>
            <p style={{ color: '#B0B0D0', fontSize: 14 }}>Real results from real users</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20, maxWidth: 900, margin: '0 auto' }}>
            {[
              { name: 'Priya S.', role: 'Software Engineer, Bangalore', text: 'I just filled my job titles and company names. AI wrote everything else — got 3 interview calls in 1 week. My old manually-written resume was getting zero response.' },
              { name: 'Rahul M.', role: 'MBA Fresher, Mumbai', text: 'I didn\'t know how to write bullet points. AI turned my "did marketing" into "Drove 35% growth in social media engagement through data-led campaigns." Got placed in 3 weeks.' },
              { name: 'Sneha P.', role: 'Data Analyst, Pune', text: 'AI automatically added the exact keywords from job descriptions I shared. ATS score went from 40% to 96%. Finally getting shortlisted.' },
            ].map(t => (
              <div key={t.name} style={{ background: '#1A1A3E', border: '1px solid #2A2A5A', borderRadius: 16, padding: '24px 22px' }}>
                <div style={{ fontSize: 24, color: '#FFD700', marginBottom: 12, fontWeight: 900, lineHeight: 1 }}>"</div>
                <p style={{ fontSize: 14, color: '#B0B0D0', lineHeight: 1.8, marginBottom: 20 }}>{t.text}</p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#6B6B8D', marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section style={{ padding: '80px 20px', background: '#12122A', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 620 }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🤖</div>
          <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 16, lineHeight: 1.3 }}>
            Stop Struggling to Write.<br />
            <span style={{ color: '#FFD700' }}>Let AI Do It For You.</span>
          </h2>
          <p style={{ color: '#B0B0D0', fontSize: 16, marginBottom: 12, lineHeight: 1.7 }}>
            10,000+ professionals already let AI write their resume.
            Takes 2 minutes. Costs ₹49. Gets you interviews.
          </p>
          <p style={{ color: '#6B6B8D', fontSize: 13, marginBottom: 36 }}>
            No writing skills needed · No experience needed · AI handles everything
          </p>
          <button className="btn-primary"
            style={{ fontSize: 18, padding: '18px 52px', borderRadius: 14 }}
            onClick={() => router.push('/select-type')}>
            🤖 Let AI Build My Resume →
          </button>
          <p style={{ color: '#6B6B8D', fontSize: 13, marginTop: 16 }}>₹49 only · 2 minute build · No signup needed</p>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="footer">
        <p style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>ResumeJet</p>
        <p style={{ marginBottom: 16 }}>Made with ❤️ in India</p>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          <a href="/terms" style={{ color: '#B0B0D0', fontSize: 13 }}>Terms</a>
          <a href="/privacy" style={{ color: '#B0B0D0', fontSize: 13 }}>Privacy</a>
          <a href="/shipping" style={{ color: '#B0B0D0', fontSize: 13 }}>Shipping</a>
          <a href="/contact" style={{ color: '#B0B0D0', fontSize: 13 }}>Contact</a>
          <a href="/cancellation" style={{ color: '#B0B0D0', fontSize: 13 }}>Cancellations</a>
        </div>
        <p>© 2026 ResumeJet. All rights reserved.</p>
      </footer>

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
