import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { RESUME_DESIGN_GROUPS } from '../config/resumeDesigns';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>ResumeJet — AI Resume Builder India | ₹49</title>
        <meta name="description" content="Just fill your basic details — AI writes your entire resume. Professional, ATS-optimized PDF in 2 minutes. Starting at ₹49." />
        <link rel="canonical" href="https://resumejet.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://resumejet.in/" />
        <meta property="og:title" content="ResumeJet — AI Resume Builder India | ₹49" />
        <meta property="og:description" content="Just fill your basic details — AI writes your entire resume. Professional, ATS-optimized PDF in 2 minutes. Starting at ₹49." />
        <meta property="og:image" content="https://resumejet.in/og-image.png" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="ResumeJet" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ResumeJet — AI Resume Builder India | ₹49" />
        <meta name="twitter:description" content="Just fill your basic details — AI writes your entire resume. Professional, ATS-optimized PDF in 2 minutes. Starting at ₹49." />
        <meta name="twitter:image" content="https://resumejet.in/og-image.png" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "SoftwareApplication", "name": "ResumeJet", "url": "https://resumejet.in",
              "description": "AI-powered resume builder. Fill basic details, AI writes the entire resume.",
              "applicationCategory": "BusinessApplication", "operatingSystem": "Web",
              "offers": { "@type": "Offer", "price": "49", "priceCurrency": "INR" }
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

          <p style={{ color: '#8080A0', fontSize: 14, marginBottom: 36 }}>
            Starting at just <strong style={{ color: '#FFD700', fontSize: 16 }}>₹49</strong> — one-time, no subscription
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary"
              style={{ fontSize: 17, padding: '16px 44px', borderRadius: 14 }}
              aria-label="Let AI build my resume"
              onClick={() => router.push('/select-type')}
            >
              🤖 Let AI Build My Resume →
            </button>
            <button
              className="btn-ghost"
              type="button"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
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
                <div style={{ fontSize: 12, color: '#8080A0', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── AI DEMO: BEFORE / AFTER ───── */}
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
              <div style={{ fontSize: 13, color: '#8080A0', marginBottom: 24 }}>one-time payment</div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
                {['AI Writes Full Resume', '2 PDF Downloads', 'All Resume Types', 'All 16 Templates', 'ATS Optimized'].map(f => (
                  <li key={f} style={{ fontSize: 14, color: '#B0B0D0', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#00E676', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button type="button" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}
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
              <div style={{ fontSize: 13, color: '#8080A0', marginBottom: 24 }}>one-time payment</div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
                {['AI Writes Full Resume', '4 PDF Downloads', 'All Resume Types', 'All 16 Templates', 'ATS Optimized', 'Priority AI Processing'].map(f => (
                  <li key={f} style={{ fontSize: 14, color: '#B0B0D0', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#FFD700', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button type="button" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                aria-label="Get Pro plan"
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
                  <div style={{ fontSize: 12, color: '#8080A0', marginTop: 2 }}>{t.role}</div>
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
          <p style={{ color: '#8080A0', fontSize: 13, marginBottom: 36 }}>
            No writing skills needed · No experience needed · AI handles everything
          </p>
          <button type="button" className="btn-primary"
            style={{ fontSize: 18, padding: '18px 52px', borderRadius: 14 }}
            aria-label="Let AI build my resume"
            onClick={() => router.push('/select-type')}>
            🤖 Let AI Build My Resume →
          </button>
          <p style={{ color: '#8080A0', fontSize: 13, marginTop: 16 }}>₹49 only · 2 minute build · No signup needed</p>
        </div>
      </section>

      {/* ───── TEMPLATE GALLERY ───── */}
      <section style={{ padding: '80px 20px', background: '#0A0A1A' }} id="templates">
        <div className="container" style={{ maxWidth: 1100 }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-block', background: '#FFD70022', border: '1px solid #FFD70044', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: '#FFD700', marginBottom: 14 }}>
              20 TEMPLATES
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
              Choose Your <span style={{ color: '#FFD700' }}>Perfect Design</span>
            </h2>
            <p style={{ color: '#B0B0D0', fontSize: 15 }}>
              5 layout styles · 4 color variants each · All ATS-optimized
            </p>
          </div>

          {/* Groups */}
          {RESUME_DESIGN_GROUPS.map(group => (
            <div key={group.style} style={{ marginBottom: 52 }}>

              {/* Group divider header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{group.label}</h3>
                <span style={{ fontSize: 12, color: '#B0B0D0', whiteSpace: 'nowrap' }}>{group.description}</span>
                <div style={{ flex: 1, height: 1, background: '#2A2A5A' }} />
              </div>

              {/* 4 variant cards */}
              <div className="template-grid">
                {group.variants.map(variant => (
                  <div
                    key={variant.id}
                    onClick={() => router.push('/select-type')}
                    style={{
                      background: '#1A1A3E',
                      border: '1px solid #2A2A5A',
                      borderRadius: 14,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.border = '1px solid #FFD70088'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,215,0,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.border = '1px solid #2A2A5A'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Real resume preview via iframe */}
                    <div style={{ height: 220, overflow: 'hidden', position: 'relative', background: variant.colors.bg || '#fff' }}>
                      <iframe
                        src={`/api/template-preview?design=${variant.id}`}
                        style={{
                          width: '794px',
                          height: '1123px',
                          transform: 'scale(0.28)',
                          transformOrigin: 'top left',
                          border: 'none',
                          pointerEvents: 'none',
                        }}
                        loading="lazy"
                        title={variant.name}
                      />
                    </div>

                    {/* Name + tag */}
                    <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1A1A3E' }}>
                      <span style={{ fontWeight: 700, fontSize: 12, color: '#fff' }}>{variant.name}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                        background: variant.tagColor + '22', color: variant.tagColor,
                        border: `1px solid ${variant.tagColor}44`,
                      }}>{variant.tag}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button
              type="button"
              className="btn-primary"
              style={{ fontSize: 16, padding: '14px 44px', borderRadius: 12 }}
              aria-label="Build my resume"
              onClick={() => router.push('/select-type')}
            >
              Build My Resume →
            </button>
          </div>

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
        .template-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .template-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .template-grid { grid-template-columns: repeat(1, 1fr); }
        }
      `}</style>
    </>
  );
}
