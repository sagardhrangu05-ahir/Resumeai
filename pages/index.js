import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';

export default function Home() {
  const router = useRouter();

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>ResumeJet — AI Resume Builder India | ₹49 = 2 Downloads</title>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </Head>

      <Navbar onHowItWorksClick={scrollToHowItWorks} />

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-content">
          <div style={{
            display: 'inline-block', background: 'rgba(0,230,118,0.1)',
            border: '1px solid rgba(0,230,118,0.3)', borderRadius: 20,
            padding: '6px 16px', fontSize: 13, color: '#00E676',
            marginBottom: 20, fontWeight: 600
          }}>
            ✨ AI-Powered • ATS-Optimized • Ready in 2 Minutes
          </div>

          <h1>
            Professional Resume<br />
            <span>in 2 Minutes</span>
          </h1>

          <p style={{ color: '#B0B0D0', marginBottom: 12 }}>
            Choose your type → Pick your design → Download
          </p>

          {/* 3-step visual flow */}
          <div style={{
            display: 'flex', gap: 8, justifyContent: 'center',
            alignItems: 'center', marginBottom: 32, flexWrap: 'wrap'
          }}>
            {[
              { icon: '📋', label: 'Select Type' },
              { icon: '🎨', label: 'Pick Design' },
              { icon: '📥', label: 'Download PDF' }
            ].map((step, i) => (
              <>
                <div key={step.label} style={{
                  background: '#1A1A3E', border: '1px solid #2A2A5A',
                  borderRadius: 12, padding: '10px 16px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 13, color: '#fff'
                }}>
                  <span>{step.icon}</span>
                  <span style={{ fontWeight: 600 }}>{step.label}</span>
                </div>
                {i < 2 && (
                  <span key={`arrow-${i}`} style={{ color: '#FFD700', fontSize: 18, fontWeight: 700 }}>→</span>
                )}
              </>
            ))}
          </div>

          {/* Pricing cards */}
          <div style={{
            display: 'flex', gap: 16, justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: 28
          }}>
            {/* Basic */}
            <div style={{
              background: '#1A1A3E', border: '1px solid #2A2A5A',
              borderRadius: 16, padding: '20px 24px', minWidth: 200,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#FFD700' }}>₹49</div>
              <div style={{ color: '#B0B0D0', fontSize: 12, marginBottom: 12 }}>Basic Plan</div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 16 }}>
                {['2 Downloads', 'Any Type', 'Any Design', 'PDF'].map(f => (
                  <li key={f} style={{ color: '#B0B0D0', fontSize: 12, marginBottom: 4 }}>
                    ✓ {f}
                  </li>
                ))}
              </ul>
              <button className="btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: 13 }}
                onClick={() => router.push('/select-type')}>
                Get Started
              </button>
            </div>

            {/* Pro — highlighted */}
            <div style={{
              background: 'linear-gradient(135deg, #1A1A3E, #2A1A6E)',
              border: '2px solid #FFD700',
              borderRadius: 16, padding: '20px 24px', minWidth: 200,
              textAlign: 'center', position: 'relative'
            }}>
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #FFD700, #FFA000)',
                color: '#000', fontSize: 10, fontWeight: 700,
                padding: '3px 14px', borderRadius: 20
              }}>BEST VALUE</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#FFD700' }}>₹79</div>
              <div style={{ color: '#B0B0D0', fontSize: 12, marginBottom: 12 }}>Pro Plan</div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 16 }}>
                {['4 Downloads', 'All 4 Types', 'All 4 Designs', 'PDF', 'Priority'].map(f => (
                  <li key={f} style={{ color: '#B0B0D0', fontSize: 12, marginBottom: 4 }}>
                    ✓ {f}
                  </li>
                ))}
              </ul>
              <button className="btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: 13, justifyContent: 'center' }}
                onClick={() => router.push('/select-type')}>
                Get Pro
              </button>
            </div>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            {[
              { icon: '🚀', text: '10,000+ resumes generated' },
              { icon: '🎯', text: '95%+ ATS score' },
              { icon: '💰', text: '₹49 only' }
            ].map(item => (
              <span key={item.text} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                color: '#B0B0D0', fontSize: 13
              }}>
                <span>{item.icon}</span>{item.text}
              </span>
            ))}
          </div>

          <button className="btn-primary"
            style={{ fontSize: 17, padding: '16px 48px' }}
            onClick={() => router.push('/select-type')}>
            Start Free Preview →
          </button>
        </div>
      </section>

      {/* ===== RESUME TYPES ===== */}
      <section className="features" id="types">
        <div className="container">
          <h2>4 <span style={{ color: '#FFD700' }}>Resume Types</span> for Every Career</h2>
          <div className="features-grid">
            {[
              { icon: '🎓', title: 'Fresher Resume', desc: 'First job? Stand out from 1000+ applicants. Highlights education, projects, internships.' },
              { icon: '💻', title: 'IT / Developer Resume', desc: 'Get shortlisted at top tech companies. GitHub, tech stack, projects front and center.' },
              { icon: '📊', title: 'MBA / Management Resume', desc: 'Leadership-focused, business-driven. Achievements and team impact highlighted.' },
              { icon: '🎯', title: 'ATS-Optimized Resume', desc: 'Paste job description → AI matches your resume keywords. Beat ATS filters every time.' }
            ].map((t, i) => (
              <div className="feature-card glass-card" key={i}>
                <div className="feature-icon">{t.icon}</div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features" id="features">
        <div className="container">
          <h2>Why <span style={{ color: '#FFD700' }}>ResumeJet</span>?</h2>
          <div className="features-grid">
            {[
              { icon: '🤖', title: 'Claude AI Powered', desc: 'World-class AI converts your experience into professional language. Grammar, formatting, keywords — all automatic.' },
              { icon: '🎯', title: 'ATS-Optimized', desc: '60% of resumes fail ATS filters. Our resumes achieve 95%+ ATS score — guaranteed to be seen by HR.' },
              { icon: '⚡', title: 'Ready in 2 Minutes', desc: 'Fill in your data or upload your old resume — professional resume ready in 2 minutes.' },
              { icon: '💰', title: 'Only ₹49 for 2', desc: 'Professional resume writers charge ₹2,000–5,000. Get 2 downloads for just ₹49.' },
              { icon: '🎨', title: '4 Unique Designs', desc: 'Classic Pro, Modern Split, Creative Edge, Minimal Clean — pick what fits your style.' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your data is safe. Deleted after generation. No spam, no sharing.' }
            ].map((feature, i) => (
              <div className="feature-card glass-card" key={i}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2>How it Works?</h2>
          <div className="steps">
            {[
              { num: '1', title: 'Choose Resume Type', desc: 'Fresher, IT Developer, MBA, or ATS-Optimized — pick the one that fits your career.' },
              { num: '2', title: 'Pick Your Design', desc: '4 professional designs. Preview before choosing. Classic, Modern, Creative, or Minimal.' },
              { num: '3', title: 'Fill Your Details', desc: 'Smart form with only the fields you need. Claude AI enhances your content automatically.' },
              { num: '4', title: 'Pay & Download', desc: '₹49 = 2 clean PDFs. ₹79 = 4 PDFs with all designs. No watermarks, print-ready.' }
            ].map((step, i) => (
              <div className="step glass-card" key={i} style={{ borderRadius: 16 }}>
                <div className="step-number">{step.num}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button className="btn-primary" onClick={() => router.push('/select-type')}
              style={{ fontSize: 16, padding: '14px 40px' }}>
              🚀 Start Free Preview →
            </button>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="features" id="testimonials">
        <div className="container">
          <h2>What Users Say?</h2>
          <div className="features-grid">
            {[
              { name: 'Priya S.', role: 'Software Engineer, Bangalore', text: 'Was getting zero calls with my old resume. Got 3 interview calls in 1 week with ResumeJet!' },
              { name: 'Rahul M.', role: 'MBA Fresher, Mumbai', text: 'Best ₹49 investment ever. The Modern Split design looks so professional.' },
              { name: 'Sneha P.', role: 'Data Analyst, Pune', text: 'Used ATS-Optimized type. My ATS score went from 40% to 96%. Finally getting shortlisted!' }
            ].map((t, i) => (
              <div className="feature-card glass-card" key={i}>
                <p style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 16, color: '#B0B0D0' }}>"{t.text}"</p>
                <div>
                  <strong style={{ color: '#FFD700', fontSize: 14 }}>{t.name}</strong>
                  <p style={{ fontSize: 12, color: '#6B6B8D', margin: 0 }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 32, marginBottom: 16 }}>
            Ready for your <span style={{ color: '#FFD700' }}>dream job</span>?
          </h2>
          <p style={{ color: '#B0B0D0', marginBottom: 32, fontSize: 16 }}>
            ₹49 = 2 downloads. ₹79 = 4 downloads. 2 minutes — that's all it takes.
          </p>
          <button className="btn-primary" style={{ fontSize: 18, padding: '16px 48px' }}
            onClick={() => router.push('/select-type')}>
            🚀 Start Free Preview →
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>© 2026 ResumeJet. All rights reserved.</p>
        <p style={{ marginTop: 8 }}>Made with ❤️ in India</p>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
          <a href="/terms" style={{ color: '#B0B0D0', fontSize: 13 }}>Terms & Conditions</a>
          <a href="/privacy" style={{ color: '#B0B0D0', fontSize: 13 }}>Privacy Policy</a>
          <a href="/shipping" style={{ color: '#B0B0D0', fontSize: 13 }}>Shipping Policy</a>
          <a href="/contact" style={{ color: '#B0B0D0', fontSize: 13 }}>Contact Us</a>
          <a href="/cancellation" style={{ color: '#B0B0D0', fontSize: 13 }}>Cancellation & Refunds</a>
        </div>
      </footer>
    </>
  );
}
