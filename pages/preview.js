import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { useToast } from '../components/Toast';
import Navbar from '../components/Navbar';
import { PLANS } from '../config/pricing';
import { RESUME_DESIGNS } from '../config/resumeDesigns';
import { getCredits, setCredits, useCredit, clearCredits, getSession } from '../lib/credits';

export default function Preview() {
  const router = useRouter();
  const toast  = useToast();
  const PAYMENT_RECOVERY_KEY = 'resumejet_pending_payment';

  const [resume,        setResume       ] = useState(null);
  const [orderId,       setOrderId      ] = useState('');
  const [profilePhoto,  setProfilePhoto ] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState('classic-pro');

  const [credits,       setCreditsState ] = useState(null);
  const [downloading,   setDownloading  ] = useState(false);
  const [downloadDesign, setDownloadDesign] = useState('classic-pro');

  useEffect(() => {
    let data   = sessionStorage.getItem('resumeData');
    let oid    = sessionStorage.getItem('orderId');
    let photo  = sessionStorage.getItem('profilePhoto');
    let design = sessionStorage.getItem('selectedDesign');

    if (!data) {
      const saved = getSession();
      if (saved?.resumeData) {
        data   = saved.resumeData;
        oid    = saved.orderId || '';
        photo  = saved.profilePhoto || null;
        design = saved.selectedDesign || 'classic-pro';
        sessionStorage.setItem('resumeData', data);
        if (oid) sessionStorage.setItem('orderId', oid);
        if (photo) sessionStorage.setItem('profilePhoto', photo);
        if (design) sessionStorage.setItem('selectedDesign', design);
      }
    }

    if (!data) {
      void router.push('/select-type');
      return;
    }

    try {
      setResume(JSON.parse(data));
      setOrderId(oid || '');
      setProfilePhoto(photo || null);
      setSelectedDesign(design || 'classic-pro');
      setDownloadDesign(design || 'classic-pro');
    } catch {
      router.push('/select-type');
    }

    const existing = getCredits();
    if (existing) setCreditsState(existing);
  }, [router]);

  useEffect(() => {
    const recoverPayment = async () => {
      if (typeof window === 'undefined') return;
      if (getCredits()) return;

      const raw = localStorage.getItem(PAYMENT_RECOVERY_KEY);
      if (!raw) return;

      try {
        const pending = JSON.parse(raw);
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pending)
        });
        const verifyResult = await verifyRes.json();
        if (!verifyResult.success) return;

        const credData = setCredits({
          plan:             verifyResult.plan,
          downloadToken:    verifyResult.downloadToken,
          paymentId:        verifyResult.paymentId,
          razorpayOrderId:  verifyResult.razorpayOrderId,
          downloadsAllowed: verifyResult.downloadsAllowed,
        });
        setCreditsState(credData);
        localStorage.removeItem(PAYMENT_RECOVERY_KEY);
        toast(`Payment restored. You have ${credData.creditsDisplay} downloads.`, 'success');
      } catch (err) {
        console.error('Payment recovery error:', err);
      }
    };

    recoverPayment();
  }, [toast]);

  const handlePayment = async (plan) => {
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, plan: plan.id })
      });
      const order = await res.json();
      if (!order.success) {
        toast('Payment setup failed. Please try again.', 'error');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'ResumeJet',
        description: plan.id === 'pro'
          ? 'Pro Plan — 4 Resume Downloads'
          : 'Basic Plan — 2 Resume Downloads',
        order_id: order.razorpayOrderId,
        handler: async function (response) {
          const verificationPayload = {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
            orderId,
            plan: plan.id
          };
          localStorage.setItem(PAYMENT_RECOVERY_KEY, JSON.stringify(verificationPayload));

          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(verificationPayload)
            });
            const verifyResult = await verifyRes.json();
            if (verifyResult.success) {
              const credData = setCredits({
                plan:             plan.id,
                downloadToken:    verifyResult.downloadToken,
                paymentId:        verifyResult.paymentId,
                razorpayOrderId:  verifyResult.razorpayOrderId,
                downloadsAllowed: verifyResult.downloadsAllowed,
              });
              setCreditsState(credData);
              localStorage.removeItem(PAYMENT_RECOVERY_KEY);
              toast(`Payment successful! You have ${credData.creditsDisplay} downloads.`, 'success');
            } else {
              toast(verifyResult.error || 'Payment verification failed. Refresh this page and try again.', 'error');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            toast('Payment captured, but verification failed. Refresh this page and try again.', 'error');
          }
        },
        prefill: {
          name:    resume?.name || '',
          email:   resume?.contact?.email || '',
          contact: resume?.contact?.phone || ''
        },
        theme: { color: '#FFD700' },
        modal: { ondismiss: () => {} }
      };

      if (!window.Razorpay) {
        toast('Payment is loading, please try again in a moment.', 'error');
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      toast('Payment error. Please try again.', 'error');
    }
  };

  const handleDownload = async () => {
    const current = getCredits();
    if (!current || current.creditsDisplay <= 0) {
      toast('No downloads remaining. Please purchase again.', 'error');
      return;
    }

    setDownloading(true);
    try {
      const res = await fetch('/api/download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          orderId,
          downloadToken:   current.downloadToken,
          paymentId:       current.paymentId,
          razorpayOrderId: current.razorpayOrderId,
          profilePhoto,
          design:          downloadDesign
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const updated = useCredit();
        setCreditsState(updated ? { ...updated } : null);

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(resume?.name || 'resume').replace(/\s+/g, '_')}_${downloadDesign}_Resume.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.setTimeout(() => window.URL.revokeObjectURL(url), 1500);
        toast('Resume downloaded!', 'success');
      } else {
        let errMsg = 'Download failed. Please try again.';
        try {
          const errData = await res.json();
          if (errData.error) errMsg = errData.error;
        } catch {}
        toast(errMsg, 'error');
      }
    } catch {
      toast('Download error. Please try again.', 'error');
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

  const creditsLeft = credits?.creditsDisplay ?? 0;
  const wasPaid = credits !== null;
  const isPaid = creditsLeft > 0;

  if (isPaid) {
    const designObj = RESUME_DESIGNS.find(d => d.id === downloadDesign);
    return (
      <>
        <Head>
          <title>Download Resume — ResumeJet</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Navbar showCTA={false} />
        <div className="success-page">
          <div>
            <div className="success-icon">🎉</div>
            <h1>Payment Successful!</h1>
            <p style={{ marginBottom: 24 }}>
              You have <strong style={{ color: '#FFD700' }}>{creditsLeft} download{creditsLeft !== 1 ? 's' : ''}</strong> remaining
            </p>

            {credits?.plan === 'pro' && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: '#B0B0D0', fontSize: 13, marginBottom: 12 }}>
                  Pro plan: switch design between downloads!
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {RESUME_DESIGNS.map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDownloadDesign(d.id)}
                      style={{
                        background: downloadDesign === d.id ? '#FFD700' : '#1A1A3E',
                        color: downloadDesign === d.id ? '#000' : '#B0B0D0',
                        border: downloadDesign === d.id ? '2px solid #FFD700' : '2px solid #2A2A5A',
                        borderRadius: 10,
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'Poppins, sans-serif',
                        transition: 'all 0.2s'
                      }}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
                {designObj && (
                  <p style={{ color: '#8080A0', fontSize: 11, marginTop: 8 }}>
                    Selected: {designObj.name} — {designObj.description}
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              className="btn-primary"
              onClick={handleDownload}
              disabled={downloading || creditsLeft === 0}
              style={{ fontSize: 18, padding: '16px 48px' }}
              aria-label={downloading ? 'Generating PDF' : `Download ${designObj?.name || 'Classic Pro'} PDF`}
            >
              {downloading ? '⏳ Generating PDF...' : `📥 Download — ${downloadDesign === 'classic-pro' ? 'Classic Pro' : designObj?.name}`}
            </button>

            <div style={{ marginTop: 24, padding: 20, background: '#1A1A3E', borderRadius: 12, textAlign: 'left' }}>
              <p style={{ color: '#B0B0D0', fontSize: 13, lineHeight: 1.8 }}>
                ✅ Clean PDF (no watermark) downloaded<br />
                ✅ Print-ready, ATS-optimized format<br />
                {credits?.plan === 'pro' && '✅ Pro: switch design between downloads'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="btn-secondary" aria-label="Build another resume" onClick={() => router.push('/select-type')}>
                ← Build Another Resume
              </button>
              <button type="button" className="btn-secondary" onClick={() => router.push('/')}>
                Home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (wasPaid && creditsLeft === 0) {
    return (
      <>
        <Head>
          <title>Downloads Used — ResumeJet</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Navbar showCTA={false} />
        <div className="success-page">
          <div>
            <div className="success-icon" style={{ fontSize: 48 }}>✅</div>
            <h1>All Downloads Used</h1>
            <p style={{ color: '#B0B0D0', marginBottom: 24 }}>
              You have used all your downloads from this purchase.
            </p>
            <p style={{ color: '#8080A0', fontSize: 13, marginBottom: 32 }}>
              Need more downloads? Purchase a new plan below.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="btn-secondary" aria-label="Build another resume" onClick={() => router.push('/select-type')}>
                ← Build Another Resume
              </button>
              <button type="button" className="btn-primary" onClick={() => {
                clearCredits();
                setCreditsState(null);
              }}>
                Buy More Downloads
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Resume Preview — ResumeJet</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <Navbar showCTA={false} />
      <div className="preview-page" style={{ paddingBottom: 180, paddingTop: 80 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ color: '#B0B0D0', fontSize: 13 }}>
            ✅ Resume Preview — Pay to download without watermark
          </p>
        </div>

        <div
          className="resume-preview"
          onContextMenu={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
          <div className="watermark">PREVIEW • RESUMEJET</div>
          <div className="resume-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <h1>{resume.name || 'Your Name'}</h1>
              </div>
              {profilePhoto && (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFD700', flexShrink: 0 }}
                />
              )}
            </div>
            <div className="resume-contact">
              {[
                resume.contact?.email,
                resume.contact?.phone,
                resume.contact?.location,
                resume.contact?.linkedin,
                resume.contact?.github
              ].filter(Boolean).join(' • ')}
            </div>

            {resume.summary && (
              <div className="resume-section">
                <h2>Professional Summary</h2>
                <p>{resume.summary}</p>
              </div>
            )}

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
                        {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {resume.internships?.length > 0 && resume.internships[0]?.role && (
              <div className="resume-section">
                <h2>Internships</h2>
                {resume.internships.map((intern, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div className="exp-header">
                      <h3>{intern.role} — {intern.company}</h3>
                      <span>{intern.duration}</span>
                    </div>
                    {intern.bullets && (
                      <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                        {intern.bullets.map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

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

            {resume.skills && (
              <div className="resume-section">
                <h2>Skills</h2>
                <ul className="skills-list">
                  {[
                    ...(resume.skills.technical || []),
                    ...(resume.skills.soft || [])
                  ].map((skill, i) => <li key={i}>{skill}</li>)}
                </ul>
              </div>
            )}

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

            {resume.certifications?.length > 0 && resume.certifications[0] && (
              <div className="resume-section">
                <h2>Certifications</h2>
                <ul style={{ paddingLeft: 20 }}>
                  {resume.certifications.map((cert, i) => <li key={i}>{cert}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button type="button" className="btn-secondary" aria-label="Edit and regenerate resume" onClick={() => router.back()} style={{ fontSize: 13, padding: '10px 24px' }}>
            ← Edit & Regenerate
          </button>
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(10, 10, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,215,0,0.2)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
          padding: '16px 20px',
          zIndex: 100
        }}
      >
        <div
          style={{
            maxWidth: 700,
            margin: '0 auto',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#8080A0', fontSize: 10, marginBottom: 4 }}>BASIC</div>
            <button type="button" className="btn-secondary" aria-label="Buy Basic plan — ₹49 for 2 downloads" onClick={() => handlePayment(PLANS[0])} style={{ padding: '12px 28px', fontSize: 14 }}>
              💳 ₹49 — 2 Downloads
            </button>
          </div>

          <div style={{ color: '#2A2A5A', fontSize: 20, fontWeight: 300 }}>|</div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#FFD700', fontSize: 10, marginBottom: 4, fontWeight: 700 }}>BEST VALUE</div>
            <button type="button" className="btn-primary" aria-label="Buy Pro plan — ₹79 for 4 downloads" onClick={() => handlePayment(PLANS[1])} style={{ padding: '12px 28px', fontSize: 14, justifyContent: 'center' }}>
              🚀 ₹79 — 4 Downloads + All Designs
            </button>
          </div>
        </div>
        <p style={{ textAlign: 'center', color: '#8080A0', fontSize: 11, marginTop: 8 }}>
          UPI • Card • Net Banking • Credits valid 7 days
        </p>
      </div>
    </>
  );
}
