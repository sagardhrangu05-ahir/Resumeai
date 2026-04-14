import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Terms() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Terms & Conditions — ResumeAI</title>
      </Head>

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
          Terms & Conditions
        </h1>
        <p style={{ color: '#6B6B8D', marginBottom: 40 }}>Last updated: April 2026</p>

        {[
          {
            title: '1. Acceptance of Terms',
            body: 'By accessing and using ResumeAI (resumejet.in), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our service.'
          },
          {
            title: '2. Service Description',
            body: 'ResumeAI is a digital service that uses artificial intelligence to generate professional, ATS-optimized resumes. Users provide their personal and professional details, and our AI creates a formatted resume document in exchange for a one-time payment of ₹49.'
          },
          {
            title: '3. User Responsibilities',
            body: 'You are responsible for providing accurate, truthful, and complete information. ResumeAI is not responsible for resumes generated based on incorrect or misleading information provided by users. You must be at least 18 years of age to use this service.'
          },
          {
            title: '4. Intellectual Property',
            body: 'The resume generated for you is your personal document and you own its content. However, the ResumeAI platform, its AI models, templates, and underlying technology are the intellectual property of ResumeAI and are protected by copyright laws.'
          },
          {
            title: '5. Payment Terms',
            body: 'All payments are processed securely through Razorpay. The service fee is ₹49 per resume. Payment must be completed before the resume is delivered. We accept UPI, Credit/Debit cards, Net Banking, and Wallets.'
          },
          {
            title: '6. Prohibited Use',
            body: 'You may not use ResumeAI to create fake identities, fraudulent resumes, or for any illegal purpose. Misuse of the platform may result in permanent account suspension without refund.'
          },
          {
            title: '7. Limitation of Liability',
            body: 'ResumeAI provides the service "as is" without warranty. We are not responsible for any job rejection, hiring decisions, or outcomes related to using our generated resumes. Our maximum liability is limited to the amount paid for the service (₹49).'
          },
          {
            title: '8. Changes to Terms',
            body: 'We reserve the right to update these Terms at any time. Continued use of the service after changes constitutes acceptance of the new Terms.'
          },
          {
            title: '9. Governing Law',
            body: 'These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Surat, Gujarat, India.'
          },
          {
            title: '10. Contact',
            body: 'For any queries regarding these Terms, contact us at: sagardhrangu05@gmail.com'
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
