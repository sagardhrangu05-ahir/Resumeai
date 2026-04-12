import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>ResumeAI — AI Resume Builder India | ATS-Optimized Resume ₹49</title>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </Head>

      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(10,10,26,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #2A2A5A', padding: '14px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>
          <span style={{ color: '#FFD700' }}>Resume</span>
          <span style={{ color: '#fff' }}>AI</span>
        </div>
        <button className="btn-primary" onClick={() => router.push('/builder')}
          style={{ padding: '10px 24px', fontSize: 13 }}>
          Build Resume →
        </button>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-content">
          <div style={{
            display: 'inline-block', background: 'rgba(0,230,118,0.1)',
            border: '1px solid rgba(0,230,118,0.3)', borderRadius: 20,
            padding: '6px 16px', fontSize: 13, color: '#00E676',
            marginBottom: 20, fontWeight: 600
          }}>
            ✨ AI-Powered • ATS-Optimized • 2 Minutes
          </div>

          <h1>
            Professional Resume<br />
            <span>₹49 માં Ready</span>
          </h1>

          <p>
            તારો data આપ — AI best professional resume બનાવશે.<br />
            ATS-friendly format, perfect keywords, instant download.
          </p>

          <div className="price-tag">
            <span className="old-price">₹499</span>
            <span className="new-price">₹49</span>
            <span className="per">per resume</span>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => router.push('/builder')}>
              🚀 Resume બનાવો — ₹49
            </button>
            <button className="btn-secondary" onClick={() => {
              document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
            }}>
              કેવી રીતે કામ કરે?
            </button>
          </div>

          <div style={{
            display: 'flex', gap: 32, justifyContent: 'center',
            marginTop: 40, color: '#B0B0D0', fontSize: 13
          }}>
            {['🎯 ATS Score 95%+', '⚡ 2 Min માં Ready', '📄 PDF Download'].map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features">
        <div className="container">
          <h2>કેમ <span style={{ color: '#FFD700' }}>ResumeAI</span> best છે?</h2>
          <div className="features-grid">
            {[
              {
                icon: '🤖',
                title: 'Claude AI Powered',
                desc: 'World-class AI તારા experience ને professional language માં convert કરે. Grammar, formatting, keywords — બધું automatic.'
              },
              {
                icon: '🎯',
                title: 'ATS-Optimized',
                desc: '60% resumes ATS filter માં fail થાય. અમારા resumes 95%+ ATS score achieve કરે — HR ને guaranteed દેખાય.'
              },
              {
                icon: '⚡',
                title: '2 Minutes માં Ready',
                desc: 'Data ભરો અથવા old resume upload કરો — 2 minute માં professional resume ready. No waiting, no hassle.'
              },
              {
                icon: '💰',
                title: 'માત્ર ₹49',
                desc: 'Professional resume writer ₹2,000-5,000 charge કરે. અમે same quality ₹49 માં — એક chai થી ઓછું.'
              },
              {
                icon: '📄',
                title: 'Multiple Formats',
                desc: 'PDF format માં clean, professional resume download કરો. Print-ready, email-ready, job-portal ready.'
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                desc: 'તારો data safe છે. Resume generate થયા પછી data delete થાય. No spam, no sharing.'
              }
            ].map((feature, i) => (
              <div className="feature-card" key={i}>
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
          <h2>કેવી રીતે કામ કરે?</h2>
          <div className="steps">
            {[
              {
                num: '1',
                title: 'Data આપો',
                desc: 'Form ભરો (name, experience, skills) અથવા old resume PDF upload કરો. AI automatically data extract કરશે.'
              },
              {
                num: '2',
                title: 'AI Resume Generate કરે',
                desc: 'Claude AI તારા data ને professional resume માં convert કરશે — perfect formatting, strong action words, ATS keywords.'
              },
              {
                num: '3',
                title: 'Preview જુઓ',
                desc: 'Resume ની free preview જુઓ (watermark સાથે). Satisfied? Pay ₹49 via UPI/Card.'
              },
              {
                num: '4',
                title: 'Download કરો',
                desc: 'Payment successful → Clean PDF instantly download. Print કરો, email કરો, apply કરો!'
              }
            ].map((step, i) => (
              <div className="step" key={i}>
                <div className="step-number">{step.num}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button className="btn-primary" onClick={() => router.push('/builder')}>
              🚀 Start Building — ₹49 Only
            </button>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="features">
        <div className="container">
          <h2>Users શું કહે છે?</h2>
          <div className="features-grid">
            {[
              { name: 'Priya S.', role: 'Software Engineer, Bangalore', text: 'Old resume થી 0 calls આવતા. ResumeAI થી 3 interview calls 1 week માં!' },
              { name: 'Rahul M.', role: 'MBA Fresher, Mumbai', text: '₹49 best investment ever. Resume professional લાગે છે — seniors થી appreciation મળી.' },
              { name: 'Sneha P.', role: 'Data Analyst, Pune', text: 'ATS score 40% થી 96% થયો. Finally shortlist થવા લાગી!' }
            ].map((t, i) => (
              <div className="feature-card" key={i}>
                <p style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>"{t.text}"</p>
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
            ₹49 invest કરો, career change કરો. 2 minutes — that's all it takes.
          </p>
          <button className="btn-primary" style={{ fontSize: 18, padding: '16px 48px' }}
            onClick={() => router.push('/builder')}>
            🚀 Build My Resume Now
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>© 2026 ResumeAI. All rights reserved.</p>
        <p style={{ marginTop: 8 }}>Made with ❤️ in India</p>
      </footer>
    </>
  );
}
