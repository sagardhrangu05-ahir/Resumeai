import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function WhatAiWrites() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>What AI Writes For You — Resume Summary, Bullets & Keywords | ResumeJet</title>
        <meta name="description" content="See exactly what AI generates for your resume: professional summary, achievement bullet points, ATS keywords, skills section, action verbs, and perfect grammar — automatically." />
        <link rel="canonical" href="https://resumejet.in/what-ai-writes" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://resumejet.in/what-ai-writes" />
        <meta property="og:title" content="What AI Writes For You — Resume Summary, Bullets & Keywords | ResumeJet" />
        <meta property="og:description" content="AI generates your professional summary, achievement bullets, ATS keywords, and more. You fill basic info — AI does the writing." />
        <meta property="og:image" content="https://resumejet.in/og-image.png" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="ResumeJet" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="What AI Writes For Your Resume | ResumeJet" />
        <meta name="twitter:description" content="AI writes your summary, bullets, ATS keywords, and skills — automatically from your basic details." />
        <meta name="twitter:image" content="https://resumejet.in/og-image.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "What AI Writes For You — Resume Summary, Bullets & Keywords",
          "url": "https://resumejet.in/what-ai-writes",
          "description": "See exactly what AI generates for your resume: professional summary, achievement bullet points, ATS keywords, and more.",
          "isPartOf": { "@type": "WebSite", "name": "ResumeJet", "url": "https://resumejet.in" }
        })}} />
      </Head>

      <Navbar showCTA />

      <div style={{ paddingTop: 64, minHeight: '100vh', background: '#0A0A1A' }}>
        <section style={{ padding: '80px 20px' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
                What <span style={{ color: '#00E676' }}>AI Writes</span> For You
              </h1>
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

            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <button className="btn-primary" style={{ fontSize: 16, padding: '14px 40px', borderRadius: 12 }}
                onClick={() => router.push('/select-type')}>
                Let AI Write My Resume →
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
