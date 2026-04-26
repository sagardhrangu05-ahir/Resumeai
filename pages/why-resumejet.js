import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function WhyResumeJet() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Why ResumeJet? AI Resume Builder with 95%+ ATS Score | India ₹49</title>
        <meta name="description" content="95%+ ATS score, 16 professional templates, AI writes your entire resume — built for the Indian job market. One-time payment of ₹49, no subscription." />
        <link rel="canonical" href="https://resumejet.in/why-resumejet" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://resumejet.in/why-resumejet" />
        <meta property="og:title" content="Why ResumeJet? AI Resume Builder with 95%+ ATS Score | India ₹49" />
        <meta property="og:description" content="95%+ ATS score, 16 professional templates, AI writes your entire resume — built for the Indian job market. One-time payment of ₹49." />
        <meta property="og:image" content="https://resumejet.in/og-image.png" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="ResumeJet" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Why ResumeJet? AI Resume Builder India | ₹49" />
        <meta name="twitter:description" content="95%+ ATS score, AI writes everything, 16 templates — built for India. ₹49 one-time." />
        <meta name="twitter:image" content="https://resumejet.in/og-image.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Why ResumeJet? AI Resume Builder with 95%+ ATS Score",
          "url": "https://resumejet.in/why-resumejet",
          "description": "95%+ ATS score, 16 professional templates, AI writes your entire resume — built for the Indian job market at ₹49.",
          "isPartOf": { "@type": "WebSite", "name": "ResumeJet", "url": "https://resumejet.in" }
        })}} />
      </Head>

      <Navbar showCTA />

      <div style={{ paddingTop: 64, minHeight: '100vh', background: '#0A0A1A' }}>
        <section style={{ padding: '80px 20px' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
                Why <span style={{ color: '#FFD700' }}>ResumeJet AI?</span>
              </h1>
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

            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <button className="btn-primary" style={{ fontSize: 16, padding: '14px 40px', borderRadius: 12 }}
                onClick={() => router.push('/select-type')}>
                Start Free Preview →
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
