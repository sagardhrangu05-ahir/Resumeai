import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Contact() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Contact Us — ResumeJet</title>
        <meta name="description" content="Get in touch with ResumeJet support. We typically respond within 24 hours. Reach us for billing, technical issues, or resume help." />
        <link rel="canonical" href="https://resumejet.in/contact" />
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
          Contact Us
        </h1>
        <p style={{ color: '#B0B0D0', marginBottom: 48, fontSize: 16 }}>
          કોઈ પ્રશ્ન છે? અમે મદદ કરવા તૈયાર છીએ. નીચે આપેલ ઓળખ પર અમારો સંપર્ક કરો.
        </p>

        {/* Contact Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
          {[
            { icon: '📧', label: 'Email', value: 'sagardhrangu05@gmail.com', link: 'mailto:sagardhrangu05@gmail.com' },
            { icon: '📍', label: 'Location', value: 'Surat, Gujarat, India', link: null },
            { icon: '⏰', label: 'Support Hours', value: 'Mon–Sat, 10am–7pm IST', link: null },
            { icon: '⚡', label: 'Response Time', value: 'Within 24 hours', link: null }
          ].map((item, i) => (
            <div key={i} style={{
              background: '#1A1A3E', border: '1px solid #2A2A5A',
              borderRadius: 16, padding: 24, textAlign: 'center'
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
              <p style={{ color: '#6B6B8D', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                {item.label}
              </p>
              {item.link ? (
                <a href={item.link} style={{ color: '#FFD700', fontWeight: 600, fontSize: 14, wordBreak: 'break-word' }}>
                  {item.value}
                </a>
              ) : (
                <p style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{item.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Business Details */}
        <div style={{
          background: '#1A1A3E', border: '1px solid #2A2A5A',
          borderRadius: 16, padding: 32, marginBottom: 24
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#FFD700', marginBottom: 20 }}>
            Business Details
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            {[
              ['Business Name', 'ResumeJet'],
              ['Owner', 'Sagar Ahir'],
              ['Email', 'sagardhrangu05@gmail.com'],
              ['City', 'Surat'],
              ['State', 'Gujarat'],
              ['Country', 'India'],
              ['Service Type', 'Digital Product — AI Resume Generation'],
              ['Platform', 'resumejet.in']
            ].map(([key, val], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #2A2A5A' }}>
                <td style={{ padding: '12px 0', color: '#6B6B8D', fontSize: 14, width: '40%', fontWeight: 600 }}>{key}</td>
                <td style={{ padding: '12px 0', color: '#fff', fontSize: 14 }}>{val}</td>
              </tr>
            ))}
          </table>
        </div>

        {/* Common Queries */}
        <div style={{
          background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)',
          borderRadius: 16, padding: 24
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFD700', marginBottom: 16 }}>
            Common Queries
          </h2>
          {[
            { q: 'Payment deducted but resume not received?', a: 'Email us with your payment screenshot at sagardhrangu05@gmail.com — we will resolve within 2 hours.' },
            { q: 'Need a refund?', a: 'See our Cancellation & Refunds policy. Genuine cases are handled within 5–7 business days.' },
            { q: 'Want to report a technical issue?', a: 'Email us with your issue description and device/browser details.' }
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>❓ {item.q}</p>
              <p style={{ color: '#B0B0D0', fontSize: 13, lineHeight: 1.7 }}>→ {item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 ResumeJet. All rights reserved.</p>
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
