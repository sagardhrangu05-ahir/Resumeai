const nodemailer = require('nodemailer');

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

async function sendPaymentReceipt({ toEmail, toName, plan, amount, paymentId, downloadsAllowed }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('Email not configured — skipping receipt');
    return;
  }

  const planLabel = plan === 'pro' ? 'Pro Plan' : 'Basic Plan';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#0D0D26;color:#fff;border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#1A1A3E,#12122A);padding:32px 36px;text-align:center;border-bottom:1px solid #2A2A5A">
        <h1 style="color:#FFD700;font-size:28px;margin:0 0 6px">ResumeJet</h1>
        <p style="color:#B0B0D0;margin:0;font-size:14px">AI Resume Builder</p>
      </div>
      <div style="padding:32px 36px">
        <h2 style="color:#00E676;font-size:20px;margin:0 0 20px">✅ Payment Successful!</h2>
        <p style="color:#B0B0D0;font-size:15px;margin:0 0 24px">
          Hi ${toName || 'there'}, your payment has been confirmed and your downloads are ready.
        </p>
        <div style="background:#1A1A3E;border:1px solid #2A2A5A;border-radius:12px;padding:20px 24px;margin-bottom:24px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="color:#6B6B8D;padding:6px 0">Plan</td><td style="color:#fff;text-align:right;font-weight:700">${planLabel}</td></tr>
            <tr><td style="color:#6B6B8D;padding:6px 0">Amount Paid</td><td style="color:#FFD700;text-align:right;font-weight:700">₹${amount}</td></tr>
            <tr><td style="color:#6B6B8D;padding:6px 0">Downloads</td><td style="color:#fff;text-align:right;font-weight:700">${downloadsAllowed} PDF${downloadsAllowed > 1 ? 's' : ''}</td></tr>
            <tr><td style="color:#6B6B8D;padding:6px 0">Payment ID</td><td style="color:#B0B0D0;text-align:right;font-size:12px">${paymentId}</td></tr>
            <tr><td style="color:#6B6B8D;padding:6px 0">Valid For</td><td style="color:#fff;text-align:right">7 days</td></tr>
          </table>
        </div>
        <p style="color:#B0B0D0;font-size:13px;margin:0 0 24px">
          Your downloads are active on the browser you used for payment. Go back to that tab to download your resume PDF.
        </p>
        <p style="color:#6B6B8D;font-size:12px;margin:0">
          Need help? Reply to this email or contact us at <a href="mailto:${process.env.CONTACT_EMAIL}" style="color:#FFD700">${process.env.CONTACT_EMAIL}</a>
        </p>
      </div>
      <div style="background:#12122A;padding:16px 36px;text-align:center;border-top:1px solid #2A2A5A">
        <p style="color:#6B6B8D;font-size:12px;margin:0">© 2026 ResumeJet · resumejet.in · Made in India</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"ResumeJet" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `✅ ResumeJet — Payment Confirmed (${planLabel}, ₹${amount})`,
    html,
  });
  console.log(`📧 Receipt sent to ${toEmail}`);
}

module.exports = { sendPaymentReceipt };
