import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Shipping() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Shipping Policy — ResumeAI</title>
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
          Shipping Policy
        </h1>
        <p style={{ color: '#6B6B8D', marginBottom: 40 }}>Last updated: April 2026</p>

        {/* Highlight Box */}
        <div style={{
          background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)',
          borderRadius: 12, padding: 20, marginBottom: 32
        }}>
          <p style={{ color: '#00E676', fontWeight: 700, fontSize: 16 }}>
            ⚡ 100% Digital Service — Instant Delivery
          </p>
          <p style={{ color: '#B0B0D0', marginTop: 8, fontSize: 14 }}>
            ResumeAI is a completely digital product. There is no physical shipping involved.
            Your resume is delivered digitally within minutes of payment.
          </p>
        </div>

        {[
          {
            title: '1. Nature of Product',
            body: 'ResumeAI provides a digital service — AI-generated professional resumes. Since our product is entirely digital, there is no physical shipping, no packaging, and no delivery charges. No physical goods are dispatched at any point.'
          },
          {
            title: '2. Delivery Method',
            body: 'Once payment is confirmed, your AI-generated resume is delivered in the following ways: (a) Displayed directly on screen for preview, (b) Available for instant PDF download from the platform, (c) Optionally sent to your registered email address. Delivery is typically instant (within 2–5 minutes of payment).'
          },
          {
            title: '3. Delivery Timeline',
            body: 'Standard delivery: Immediate to 5 minutes after successful payment. In rare cases of technical issues, delivery may take up to 30 minutes. If you have not received your resume within 1 hour of payment, please contact us immediately at sagardhrangu05@gmail.com.'
          },
          {
            title: '4. No Physical Shipping',
            body: 'ResumeAI does not ship any physical products. Therefore, there are no shipping fees, no courier charges, and no tracking numbers. Your purchase is limited to a digital document delivered electronically.'
          },
          {
            title: '5. Accessibility',
            body: 'Your resume will be available for download immediately after generation. We recommend downloading and saving your resume promptly. Access to previously generated resumes is subject to our data retention policy (30 days).'
          },
          {
            title: '6. Technical Issues',
            body: 'If you experience any technical difficulties accessing or downloading your resume after payment, contact us at sagardhrangu05@gmail.com with your payment details and we will resolve the issue within 24 hours.'
          },
          {
            title: '7. Geographic Availability',
            body: 'ResumeAI is available to users across India. Since delivery is digital, there are no geographic restrictions or additional charges for users in any part of India.'
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
