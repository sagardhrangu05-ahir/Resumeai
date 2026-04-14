import { useRouter } from 'next/router';
import Seo from '../lib/Seo';

export default function Privacy() {
  const router = useRouter();

  return (
    <>
      <Seo
        title="Privacy Policy"
        description="Read the ResumeAI Privacy Policy. We respect your data — resume data is deleted after generation and never shared with third parties."
        canonical="/privacy"
      />

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(10,10,26,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #2A2A5A', padding: '14px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <span style={{ color: '#FFD700' }}>Resume</span>
          <span style={{ color: '#fff' }}>AI</span>
        </div>
        <button className="btn-primary" onClick={() => router.push('/builder')}
          style={{ padding: '10px 24px', fontSize: 13 }}>
          Build Resume →
        </button>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 80px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#FFD700', marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ color: '#6B6B8D', marginBottom: 40 }}>Last updated: April 2026</p>

        {[
          {
            title: '1. Information We Collect',
            body: 'We collect personal information that you voluntarily provide when using ResumeAI, including: full name, email address, phone number, work experience, educational qualifications, skills, and other details needed to generate your resume. We also collect payment information processed securely through Razorpay (we do not store card details).'
          },
          {
            title: '2. How We Use Your Information',
            body: 'Your information is used solely to: (a) generate your AI-powered resume, (b) deliver the final document to you, (c) process your payment, (d) provide customer support. We do not use your data for advertising or sell it to third parties.'
          },
          {
            title: '3. Data Storage & Security',
            body: 'Your data is stored on secure servers. We implement industry-standard encryption and security measures to protect your personal information. Resume data may be retained for up to 30 days after generation for support purposes, after which it is deleted.'
          },
          {
            title: '4. Third-Party Services',
            body: 'We use Razorpay for payment processing. Razorpay operates under its own Privacy Policy. We use AI APIs (such as OpenAI) to generate resume content — your data is shared with these services only for processing and is not stored by them for training purposes.'
          },
          {
            title: '5. Cookies',
            body: 'ResumeAI uses minimal cookies for session management and analytics. We do not use tracking cookies for advertising. You can disable cookies in your browser settings, though this may affect functionality.'
          },
          {
            title: '6. Your Rights',
            body: 'You have the right to: access the personal data we hold about you, request correction of inaccurate data, request deletion of your data, and withdraw consent at any time. To exercise these rights, contact us at sagardhrangu05@gmail.com.'
          },
          {
            title: '7. Data Sharing',
            body: 'We do not sell, trade, or rent your personal information to third parties. Data may be disclosed only if required by law or to protect our legal rights.'
          },
          {
            title: '8. Children\'s Privacy',
            body: 'ResumeAI is not intended for users under 18 years of age. We do not knowingly collect personal information from minors.'
          },
          {
            title: '9. Changes to This Policy',
            body: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the service after changes constitutes acceptance.'
          },
          {
            title: '10. Contact Us',
            body: 'For privacy-related queries, contact: sagardhrangu05@gmail.com | ResumeAI, Surat, Gujarat, India.'
          }
        ].map((section, i) => (
          <div key={i} style={{
            background: '#1A1A3E', border: '1px solid #2A2A5A',
            borderRadius: 12, padding: 24, marginBottom: 16
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFD700', marginBottom: 10 }}>
              {section.title}
            </h2>
            <p style={{ color: '#B0B0D0', lineHeight: 1.8, fontSize: 15 }}>{section.body}</p>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 ResumeAI. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
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
