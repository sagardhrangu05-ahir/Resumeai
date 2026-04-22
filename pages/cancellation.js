import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Cancellation() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Cancellation & Refunds — ResumeJet</title>
        <meta name="description" content="ResumeJet cancellation and refund policy. Technical failure guarantee — if your resume fails to generate, you get a full refund. Learn more about our policy." />
        <link rel="canonical" href="https://resumejet.in/cancellation" />
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
          Cancellation & Refunds
        </h1>
        <p style={{ color: '#6B6B8D', marginBottom: 40 }}>Last updated: April 2026</p>

        {/* Summary Box */}
        <div style={{
          background: 'rgba(68,138,255,0.1)', border: '1px solid rgba(68,138,255,0.3)',
          borderRadius: 12, padding: 20, marginBottom: 32
        }}>
          <p style={{ color: '#448AFF', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
            📋 Quick Summary
          </p>
          <p style={{ color: '#B0B0D0', fontSize: 14, lineHeight: 1.7 }}>
            ResumeJet offers a ₹49 digital service. Since the resume is generated and delivered instantly upon payment,
            we generally follow a no-refund policy. However, we do process refunds in genuine cases
            such as payment failures or technical non-delivery. Read below for full details.
          </p>
        </div>

        {[
          {
            title: '1. Cancellation Policy',
            body: 'Since ResumeJet is a digital service that begins processing immediately upon payment confirmation, cancellation is not possible once the order is placed and payment is received. We encourage users to review the service details carefully before making a payment.'
          },
          {
            title: '2. Refund Eligibility',
            body: 'Refunds are considered in the following cases only: (a) Payment was deducted but resume was not generated or delivered due to a technical error on our platform. (b) Duplicate payment was made for the same order. (c) Payment failed at gateway but amount was debited from your bank. Refunds are NOT issued for: dissatisfaction with resume content, change of mind after payment, or errors in information provided by the user.'
          },
          {
            title: '3. How to Request a Refund',
            body: 'To request a refund, email us at sagardhrangu05@gmail.com within 7 days of the transaction. Include: (a) Your full name, (b) Payment transaction ID / Razorpay payment ID, (c) Date and amount of payment, (d) Reason for refund request, (e) Screenshot of payment confirmation. Requests without complete details will not be processed.'
          },
          {
            title: '4. Refund Processing Time',
            body: 'Once your refund request is approved, the amount will be credited back to your original payment method within 5–7 business days. Razorpay processes refunds to your bank account, UPI, or card depending on your original payment method. We will notify you via email once the refund is initiated.'
          },
          {
            title: '5. Technical Failure Guarantee',
            body: 'If you paid ₹49 and did not receive your resume due to any error on our platform, you are guaranteed either: (a) A full refund of ₹49, OR (b) A fresh resume generation at no extra cost. Contact us within 24 hours of the issue at sagardhrangu05@gmail.com.'
          },
          {
            title: '6. No Refund Scenarios',
            body: 'Refunds will not be issued in the following cases: User provided incorrect or incomplete information. User is unsatisfied with AI-generated content (this is subjective and not within our control). Resume was successfully generated and downloaded. User changed their mind after payment. Claim made after 7 days of transaction.'
          },
          {
            title: '7. Dispute Resolution',
            body: 'If you have raised a refund request and are not satisfied with our response, you may raise a dispute directly with Razorpay or your bank. We are committed to fair resolution of all genuine complaints.'
          },
          {
            title: '8. Contact for Refunds',
            body: 'Email: sagardhrangu05@gmail.com | Subject Line: "Refund Request - [Your Name] - [Transaction ID]" | We aim to respond to all refund requests within 24 business hours.'
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
