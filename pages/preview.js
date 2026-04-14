import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Preview() {
  const router = useRouter();
  const [resume, setResume] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [paid, setPaid] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadToken, setDownloadToken] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [razorpayOrderId, setRazorpayOrderId] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const data  = sessionStorage.getItem('resumeData');
    const oid   = sessionStorage.getItem('orderId');
    const photo = sessionStorage.getItem('profilePhoto');
    if (!data) {
      router.push('/builder');
      return;
    }
    try {
      setResume(JSON.parse(data));
      setOrderId(oid   || '');
      setProfilePhoto(photo || null);
    } catch {
      router.push('/builder');
    }
  }, []);

  // ===== RAZORPAY PAYMENT =====
  const handlePayment = async () => {
    try {
      // Create Razorpay order
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const order = await res.json();

      if (!order.success) {
        alert('Payment setup failed. Please try again.');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'ResumeAI',
        description: 'AI Resume Builder — 1 Professional Resume',
        order_id: order.razorpayOrderId,
        handler: async function (response) {
          // Verify payment
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId
            })
          });

          const verifyResult = await verifyRes.json();
          if (verifyResult.success) {
            // Store token for secure download
            setDownloadToken(verifyResult.downloadToken);
            setPaymentId(verifyResult.paymentId);
            setRazorpayOrderId(verifyResult.razorpayOrderId);
            setPaid(true);
          } else {
            alert('Payment verification failed. Contact support.');
          }
        },
        prefill: {
          name: resume?.name || '',
          email: resume?.contact?.email || '',
          contact: resume?.contact?.phone || ''
        },
        theme: { color: '#FFD700' },
        modal: {
          ondismiss: function () {
            console.log('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment error. Please try again.');
    }
  };

  // ===== DOWNLOAD PDF =====
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, orderId, downloadToken, paymentId, razorpayOrderId, profilePhoto })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(resume?.name || 'resume').replace(/\s+/g, '_')}_Resume.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Download failed. Please try again.');
      }
    } catch (err) {
      alert('Download error. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (!resume) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <p className="loading-text">Loading preview...</p>
      </div>
    );
  }

  // ===== SUCCESS VIEW =====
  if (paid) {
    return (
      <>
        <Head>
          <title>Payment Successful — ResumeAI</title>
          <meta name="robots" content="noindex,nofollow" />
        </Head>
        <div className="success-page">
          <div>
            <div className="success-icon">🎉</div>
            <h1>Payment Successful!</h1>
            <p>તારો professional resume ready છે. Download કર!</p>

            <button className="btn-primary" onClick={handleDownload}
              disabled={downloading}
              style={{ fontSize: 18, padding: '16px 48px' }}>
              {downloading ? '⏳ Generating PDF...' : '📥 Download Resume PDF'}
            </button>

            <div style={{ marginTop: 32, padding: 20, background: '#1A1A3E', borderRadius: 12, textAlign: 'left' }}>
              <p style={{ color: '#B0B0D0', fontSize: 13, lineHeight: 1.8 }}>
                ✅ Clean PDF (no watermark) download થશે<br />
                ✅ Print-ready, ATS-optimized format<br />
                ✅ 24 hours સુધી re-download કરી શકો છો
              </p>
            </div>

            <button className="btn-secondary" onClick={() => router.push('/')}
              style={{ marginTop: 24 }}>
              ← Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  // ===== PREVIEW VIEW =====
  return (
    <>
      <Head>
        <title>Resume Preview — ResumeAI</title>
        <meta name="robots" content="noindex,nofollow" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </Head>

      <div className="preview-page" style={{ paddingBottom: 100 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ color: '#FFD700', fontSize: 20, fontWeight: 800 }}>Resume</span>
          <span style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>AI</span>
          <p style={{ color: '#B0B0D0', fontSize: 13, marginTop: 4 }}>
            ✅ Resume Preview — Pay ₹49 to download without watermark
          </p>
        </div>

        {/* Resume Preview */}
        <div className="resume-preview">
          <div className="watermark">PREVIEW • RESUMEAI</div>
          <div className="resume-content">
            {/* Name & Contact */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <h1>{resume.name || 'Your Name'}</h1>
              </div>
              {profilePhoto && (
                <img src={profilePhoto} alt="Profile"
                  style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover',
                           border: '2px solid #FFD700', flexShrink: 0 }} />
              )}
            </div>
            <div className="resume-contact">
              {[
                resume.contact?.email,
                resume.contact?.phone,
                resume.contact?.location,
                resume.contact?.linkedin
              ].filter(Boolean).join(' • ')}
            </div>

            {/* Summary */}
            {resume.summary && (
              <div className="resume-section">
                <h2>Professional Summary</h2>
                <p>{resume.summary}</p>
              </div>
            )}

            {/* Experience */}
            {resume.experience?.length > 0 && resume.experience[0]?.title && (
              <div className="resume-section">
                <h2>Work Experience</h2>
                {resume.experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div className="exp-header">
                      <h3>{exp.title} — {exp.company}</h3>
                      <span>{exp.duration}</span>
                    </div>
                    {exp.bullets && (
                      <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                        {exp.bullets.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {resume.education?.length > 0 && resume.education[0]?.degree && (
              <div className="resume-section">
                <h2>Education</h2>
                {resume.education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div className="exp-header">
                      <h3>{edu.degree}</h3>
                      <span>{edu.year}</span>
                    </div>
                    <p>{edu.institution} {edu.score ? `• ${edu.score}` : ''}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {resume.skills && (
              <div className="resume-section">
                <h2>Skills</h2>
                <ul className="skills-list">
                  {[
                    ...(resume.skills.technical || []),
                    ...(resume.skills.soft || [])
                  ].map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Projects */}
            {resume.projects?.length > 0 && resume.projects[0]?.name && (
              <div className="resume-section">
                <h2>Projects</h2>
                {resume.projects.map((proj, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <h3 style={{ fontSize: 14, color: '#1a1a1a' }}>
                      {proj.name}
                      {proj.tech_used && <span style={{ fontWeight: 400, color: '#777', fontSize: 12 }}> ({proj.tech_used})</span>}
                    </h3>
                    <p>{proj.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {resume.certifications?.length > 0 && resume.certifications[0] && (
              <div className="resume-section">
                <h2>Certifications</h2>
                <ul style={{ paddingLeft: 20 }}>
                  {resume.certifications.map((cert, i) => (
                    <li key={i}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Edit Button */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button className="btn-secondary" onClick={() => router.push('/builder')}
            style={{ fontSize: 13, padding: '10px 24px' }}>
            ← Edit & Regenerate
          </button>
        </div>
      </div>

      {/* ===== PAYMENT BAR ===== */}
      <div className="payment-bar">
        <div>
          <div className="price">
            ₹49 <small>only</small>
          </div>
          <div style={{ color: '#6B6B8D', fontSize: 11 }}>
            UPI • Card • Net Banking
          </div>
        </div>
        <button className="btn-primary" onClick={handlePayment}>
          💳 Pay ₹49 & Download
        </button>
      </div>
    </>
  );
}
